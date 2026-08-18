const axios = require('axios');

// Cardcom Payment Integration Controller
exports.createCardcomSession = async (req, res) => {
  try {
    const { amount, orderId, customerName, email, phone, items } = req.body;
    
    const terminalNumber = process.env.CARDCOM_TERMINAL_NUMBER;
    const apiName = process.env.CARDCOM_API_NAME;

    // Check if Cardcom is fully configured in .env
    if (!terminalNumber || !apiName) {
      return res.json({
        success: true,
        mode: 'sandbox',
        message: 'Cardcom API keys pending in .env. Running in simulated Cardcom checkout mode.',
        paymentUrl: null
      });
    }

    const origin = req.get('origin') || req.get('referer')?.replace(/\/$/, '') || `${req.protocol}://${req.get('host')}`;
    const cleanOrderId = orderId || 'JOYA-' + Math.floor(100000 + Math.random() * 900000);

    // Cardcom LowProfile Create API Request
    const cardcomUrl = 'https://secure.cardcom.solutions/Interface/LowProfile.aspx';
    const params = new URLSearchParams({
      TerminalNumber: terminalNumber,
      UserName: apiName,
      APIKey: process.env.CARDCOM_API_PASSWORD || '',
      Codepage: '65001',
      Operation: '1', // Direct Charge
      SumToBill: amount.toString(),
      CoinID: '1', // 1 = NIS (₪)
      Language: 'he',
      ProductName: `JOYA Order #${cleanOrderId}`,
      ReturnValue: cleanOrderId,
      SuccessRedirectUrl: `${origin}/checkout?status=success&orderId=${cleanOrderId}`,
      ErrorRedirectUrl: `${origin}/checkout?status=error`,
      IndicatorUrl: `${origin}/api/payments/cardcom/indicator`
    });

    const response = await axios.post(cardcomUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    // Parse Cardcom response queryString (e.g. ResponseCode=0&url=...)
    const responseParams = new URLSearchParams(response.data);
    const responseCode = responseParams.get('ResponseCode');
    const url = responseParams.get('url');

    if (responseCode === '0' && url) {
      return res.json({
        success: true,
        mode: 'live',
        paymentUrl: url
      });
    } else {
      return res.status(400).json({
        success: false,
        message: responseParams.get('Description') || 'Cardcom initialization failed',
        raw: response.data
      });
    }
  } catch (error) {
    console.error('Cardcom Session Error:', error);
    res.status(500).json({ message: error.message || 'Payment processing error' });
  }
};

const Order = require('../models/orderModel');

// Webhook Indicator for Cardcom payment confirmation
exports.handleCardcomIndicator = async (req, res) => {
  try {
    const { ResponseCode, ReturnValue, TransactionId } = req.body || req.query;
    console.log('Cardcom Webhook Notification received:', { ResponseCode, ReturnValue, TransactionId });

    if (ResponseCode === '0' && ReturnValue) {
      // Find order in MongoDB by ReturnValue (orderId)
      const order = await Order.findById(ReturnValue).catch(() => null);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: TransactionId || 'CARDCOM-' + Date.now(),
          status: 'success',
          update_time: new Date().toISOString(),
        };
        await order.save();
        console.log(`[CARDCOM SUCCESS] Order #${order._id} marked as Paid in MongoDB`);
      }
      return res.send('OK');
    }
    res.send('FAILED');
  } catch (error) {
    console.error('Cardcom Indicator Error:', error);
    res.status(500).send('ERROR');
  }
};
