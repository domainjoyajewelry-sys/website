import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

def create_guide_pdf(filename="Google_and_Facebook_API_Keys_Setup_Guide.pdf"):
    pdf_path = os.path.join(os.getcwd(), filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom Luxury Styles
    primary_color = colors.HexColor("#0f172a") # Dark Slate
    gold_color = colors.HexColor("#d97706")    # Luxury Amber/Gold
    bg_light = colors.HexColor("#f8fafc")      # Soft slate light
    border_color = colors.HexColor("#e2e8f0")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_color,
        alignment=TA_LEFT
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=gold_color,
        alignment=TA_LEFT
    )

    h2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=primary_color,
        spaceBefore=12,
        spaceAfter=6
    )

    step_title_style = ParagraphStyle(
        'StepTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=primary_color
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155")
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#b45309")
    )

    story = []

    # Header Section
    story.append(Paragraph("JOYA LUXURY JEWELRY — CLIENT SETUP GUIDE", subtitle_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("How to Get Google & Facebook API Keys for Social Login", title_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Follow these step-by-step instructions to create your developer credentials and send them to your web developer.", body_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1, color=gold_color, spaceBefore=4, spaceAfter=14))

    # SECTION 1: GOOGLE CLOUD CONSOLE
    story.append(Paragraph("PART 1: Google OAuth Login (Google Client ID & Secret)", h2_style))
    story.append(Paragraph("Google login allows customers to sign in instantly using their Gmail / Google accounts.", body_style))
    story.append(Spacer(1, 8))

    google_steps = [
        [
            Paragraph("<b>Step 1: Open Google Cloud Console</b>", step_title_style),
            Paragraph("Go to <font color='#2563eb'><u>https://console.cloud.google.com</u></font> and sign in with your business Google / Gmail account.", body_style)
        ],
        [
            Paragraph("<b>Step 2: Create a New Project</b>", step_title_style),
            Paragraph("Click the project dropdown in the top bar -> Click <b>New Project</b> -> Enter Project Name: <i>JOYA Jewelry Store</i> -> Click <b>Create</b>.", body_style)
        ],
        [
            Paragraph("<b>Step 3: Configure OAuth Consent Screen</b>", step_title_style),
            Paragraph("From the left menu, go to <b>APIs & Services</b> -> <b>OAuth consent screen</b>.<br/>• Select User Type: <b>External</b> -> Click Create.<br/>• Enter App Name: <i>JOYA Jewelry</i>, User Support Email, and Developer Email.<br/>• Click <b>Save and Continue</b> through all steps.", body_style)
        ],
        [
            Paragraph("<b>Step 4: Create OAuth Client ID</b>", step_title_style),
            Paragraph("Go to <b>Credentials</b> -> Click <b>+ CREATE CREDENTIALS</b> -> Select <b>OAuth client ID</b>.<br/>• Application type: <b>Web application</b><br/>• Name: <i>JOYA Web Store</i><br/>• Authorized JavaScript origins: Add <code>https://your-domain.com</code><br/>• Authorized redirect URIs: Add <code>https://your-domain.com/login</code><br/>• Click <b>Create</b>.", body_style)
        ],
        [
            Paragraph("<b>Step 5: Copy Your Google Keys</b>", step_title_style),
            Paragraph("A popup will display your credentials. Copy these two values:<br/>1. <font color='#b45309'><b>Client ID</b></font> (e.g., <i>123456789-xyz.apps.googleusercontent.com</i>)<br/>2. <font color='#b45309'><b>Client Secret</b></font>", body_style)
        ]
    ]

    t1 = Table(google_steps, colWidths=[160, 380])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t1)

    story.append(Spacer(1, 16))

    # SECTION 2: META / FACEBOOK LOGIN
    story.append(Paragraph("PART 2: Facebook Login (Meta App ID & Secret)", h2_style))
    story.append(Paragraph("Facebook login allows customers to sign in with 1-click using their Facebook profile.", body_style))
    story.append(Spacer(1, 8))

    fb_steps = [
        [
            Paragraph("<b>Step 1: Open Meta Developers</b>", step_title_style),
            Paragraph("Go to <font color='#2563eb'><u>https://developers.facebook.com</u></font> and log in with your Facebook account.", body_style)
        ],
        [
            Paragraph("<b>Step 2: Create a Meta App</b>", step_title_style),
            Paragraph("Click <b>My Apps</b> (top right) -> Click <b>Create App</b>.<br/>• Select use case: <i>Authenticate and request data from users with Facebook Login</i> -> Click Next.<br/>• App Type: <i>Web</i>.<br/>• App Name: <i>JOYA Jewelry</i> -> Click <b>Create App</b>.", body_style)
        ],
        [
            Paragraph("<b>Step 3: Get App ID & App Secret</b>", step_title_style),
            Paragraph("In your App Dashboard, go to <b>App Settings</b> -> <b>Basic</b>.<br/>• Copy <b>App ID</b> (e.g., <i>987654321012345</i>)<br/>• Click Show and Copy <b>App Secret</b>.<br/>• Add your Privacy Policy URL and Terms URL.", body_style)
        ],
        [
            Paragraph("<b>Step 4: Configure Facebook Login</b>", step_title_style),
            Paragraph("Under Products, select <b>Facebook Login</b> -> <b>Settings</b>.<br/>• Valid OAuth Redirect URIs: Add <code>https://your-domain.com/login</code><br/>• Toggle App Mode at top bar from <i>Development</i> to <b>Live</b>.", body_style)
        ]
    ]

    t2 = Table(fb_steps, colWidths=[160, 380])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t2)

    story.append(Spacer(1, 18))

    # SUMMARY CHECKLIST BOX FOR CLIENT TO SEND BACK
    summary_content = [
        [Paragraph("<b>SEND THIS COMPLETED CHECKLIST TO YOUR DEVELOPER:</b>", ParagraphStyle('SumTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=colors.HexColor("#78350f")))],
        [Paragraph("Copy and paste your keys below and email/message them to your developer:", body_style)],
        [Paragraph("""
<b>1. GOOGLE CLIENT ID:</b> __________________________________________________<br/>
<b>2. GOOGLE CLIENT SECRET:</b> __________________________________________________<br/>
<b>3. FACEBOOK APP ID:</b> __________________________________________________<br/>
<b>4. FACEBOOK APP SECRET:</b> __________________________________________________
        """, ParagraphStyle('SumBox', parent=styles['Normal'], fontName='Courier', fontSize=9, leading=16, textColor=primary_color))]
    ]

    t_summary = Table(summary_content, colWidths=[540])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#fef3c7")),
        ('BOX', (0,0), (-1,-1), 1.5, gold_color),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))

    story.append(KeepTogether(t_summary))

    doc.build(story)
    print(f"PDF successfully generated at: {pdf_path}")

if __name__ == '__main__':
    create_guide_pdf()
