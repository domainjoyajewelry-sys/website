const nodemailer = require('nodemailer');

// Configure Transporter with environment variables or fallback to simulation log
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return null;
};

/**
 * Send Email Confirmation after Purchase
 */
const sendOrderConfirmationEmail = async (order, customerEmail) => {
  const recipient = customerEmail || order.shippingAddress?.email || (order.user && order.user.email);
  if (!recipient) {
    console.log('[EMAIL SERVICE] No recipient email address available for order confirmation.');
    return;
  }

  const itemsListHtml = (order.orderItems || [])
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <img src="${item.image || 'https://joya.co.il/logo.png'}" alt="${item.name}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; font-family: sans-serif;">
        <strong>${item.name}</strong><br/>
        <span style="color: #666; font-size: 12px;">כמות: ${item.qty || 1}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: left; font-family: monospace; font-size: 14px;">
        ₪${((item.price || 0) * (item.qty || 1)).toLocaleString()}
      </td>
    </tr>`
    )
    .join('');

  const htmlContent = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; padding: 24px;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #000;">
        <h1 style="font-family: Georgia, serif; font-size: 32px; letter-spacing: 4px; margin: 0; color: #000;">JOYA</h1>
        <p style="text-transform: uppercase; font-size: 11px; letter-spacing: 2px; color: #666; margin-top: 4px;">LUXURY JEWELRY HOUSE</p>
      </div>

      <div style="padding: 24px 0;">
        <h2 style="color: #111; font-size: 20px; margin-bottom: 8px;">תודה על הזמנתך, ${order.shippingAddress?.fullName || 'לקוח יקר'}! 🎉</h2>
        <p style="color: #555; font-size: 14px; line-height: 1.6;">הזמנתך התקבלה בהצלחה במערכת. אנו מכינים את תכשיט היוקרה שלך למשלוח.</p>
        
        <div style="background-color: #f9f9f9; padding: 16px; margin: 20px 0; border-right: 4px solid #d4af37;">
          <p style="margin: 0; font-size: 13px; color: #333;"><strong>מספר הזמנה:</strong> #${order._id ? order._id.toString().slice(-6).toUpperCase() : 'JOYA-ORDER'}</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #333;"><strong>שיטת תשלום:</strong> אשראי מאובטח Cardcom</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #333;"><strong>כתובת למשלוח:</strong> ${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <thead>
            <tr style="background-color: #000; color: #fff; text-align: right; font-size: 12px; text-transform: uppercase;">
              <th style="padding: 10px;">תמונה</th>
              <th style="padding: 10px;">פריט</th>
              <th style="padding: 10px; text-align: left;">סה"כ</th>
            </tr>
          </thead>
          <tbody>
            ${itemsListHtml}
          </tbody>
        </table>

        <div style="text-align: left; padding: 20px 0; border-top: 2px solid #eee; margin-top: 16px;">
          <p style="font-size: 18px; font-weight: bold; color: #000; margin: 0;">סה"כ לתשלום: ₪${(order.totalPrice || 0).toLocaleString()}</p>
        </div>

        <div style="text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
          <p>נשמח לעמוד לשירותך בכל עת | טלפון: 058-507-7575 | קריון ביאליק, דרך עכו 192</p>
          <p>© ${new Date().getFullYear()} JOYA JEWELRY. כל הזכויות שמורות.</p>
        </div>
      </div>
    </div>
  `;

  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.SMTP_FROM || '"JOYA Jewelry" <no-reply@joya.co.il>',
    to: recipient,
    subject: `אישור הזמנה מ-JOYA #${order._id ? order._id.toString().slice(-6).toUpperCase() : 'RECEIPT'} ✨`,
    html: htmlContent,
  };

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL SENT] Order confirmation email sent to ${recipient}`);
    } catch (err) {
      console.error('[EMAIL ERROR] Failed to send order email:', err.message);
    }
  } else {
    console.log(`[EMAIL SIMULATION] Order Confirmation Email ready for ${recipient}:`);
    console.log(`Subject: ${mailOptions.subject}`);
  }
};

/**
 * Send Welcome Email on User Registration
 */
const sendRegistrationWelcomeEmail = async (userEmail, userName) => {
  if (!userEmail) return;

  const htmlContent = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; padding: 24px;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #000;">
        <h1 style="font-family: Georgia, serif; font-size: 32px; letter-spacing: 4px; margin: 0; color: #000;">JOYA</h1>
        <p style="text-transform: uppercase; font-size: 11px; letter-spacing: 2px; color: #666; margin-top: 4px;">LUXURY JEWELRY HOUSE</p>
      </div>

      <div style="padding: 24px 0;">
        <h2 style="color: #111; font-size: 20px;">ברוך/ה הבא/ה למשפחת JOYA, ${userName || 'חבר/ה יקר/ה'}! ✨</h2>
        <p style="color: #555; font-size: 14px; line-height: 1.6;">אנו נרגשים להזמין אותך לחוות את קולקציות התכשיטים והיהלומים היוקרתיות שלנו.</p>
        
        <div style="background-color: #fafafa; padding: 20px; border: 1px solid #eee; text-align: center; margin: 24px 0;">
          <h3 style="margin-0; font-family: Georgia, serif; color: #d4af37;">מתנת הצטרפות מיוחדת</h3>
          <p style="font-size: 13px; color: #666;">השתמש/י בגלגל המזל באתר לקבלת הטבות בלעדיות ומבצעים מיוחדים לחברים בלבד.</p>
        </div>

        <div style="text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
          <p>© ${new Date().getFullYear()} JOYA JEWELRY. כל הזכויות שמורות.</p>
        </div>
      </div>
    </div>
  `;

  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.SMTP_FROM || '"JOYA Jewelry" <no-reply@joya.co.il>',
    to: userEmail,
    subject: `ברוך/ה הבא/ה ל-JOYA LUXURY JEWELRY ✨`,
    html: htmlContent,
  };

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL SENT] Welcome email sent to ${userEmail}`);
    } catch (err) {
      console.error('[EMAIL ERROR] Failed to send welcome email:', err.message);
    }
  } else {
    console.log(`[EMAIL SIMULATION] Welcome Email ready for ${userEmail}`);
  }
};

/**
 * Send Prize Coupon Email
 */
const sendPrizeCouponEmail = async (recipientEmail, prizeLabel, couponCode) => {
  if (!recipientEmail) return;

  const htmlContent = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; padding: 24px;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #000;">
        <h1 style="font-family: Georgia, serif; font-size: 32px; letter-spacing: 4px; margin: 0; color: #000;">JOYA</h1>
        <p style="text-transform: uppercase; font-size: 11px; letter-spacing: 2px; color: #666; margin-top: 4px;">WHEEL OF FORTUNE PRIZE</p>
      </div>

      <div style="padding: 24px 0; text-align: center;">
        <h2 style="color: #111; font-size: 22px;">מזל טוב! זכית בפרס: ${prizeLabel} 🎁</h2>
        <p style="color: #555; font-size: 14px;">להלן קוד הקופון האישי שלך למימוש בקופה:</p>
        
        <div style="background-color: #000; color: #fff; font-family: monospace; font-size: 24px; font-weight: bold; letter-spacing: 4px; padding: 16px 24px; display: inline-block; margin: 20px 0;">
          ${couponCode}
        </div>

        <p style="font-size: 12px; color: #888;">הקופון בתוקף לרכישות באתר ובחנות הדגל בקריון.</p>
      </div>
    </div>
  `;

  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.SMTP_FROM || '"JOYA Jewelry" <no-reply@joya.co.il>',
    to: recipientEmail,
    subject: `מזל טוב! זכית בפרס מ-JOYA ✨`,
    html: htmlContent,
  };

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL SENT] Prize coupon email sent to ${recipientEmail}`);
    } catch (err) {
      console.error('[EMAIL ERROR] Failed to send prize email:', err.message);
    }
  } else {
    console.log(`[EMAIL SIMULATION] Prize Coupon Email ready for ${recipientEmail}: ${couponCode}`);
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendRegistrationWelcomeEmail,
  sendPrizeCouponEmail,
};
