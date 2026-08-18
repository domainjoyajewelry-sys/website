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
      ProductName: `JOYA Order #${orderId || 'NEW'}`,
      ReturnValue: orderId || 'temp_order',
      SuccessRedirectUrl: `${req.protocol}://${req.get('host')}/checkout?status=success&orderId=${orderId}`,
      ErrorRedirectUrl: `${req.protocol}://${req.get('host')}/checkout?status=error`,
      IndicatorUrl: `${req.protocol}://${req.get('host')}/api/payments/cardcom/indicator`
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

// Webhook Indicator for Cardcom payment confirmation
exports.handleCardcomIndicator = async (req, res) => {
  try {
    const { ResponseCode, ReturnValue, TransactionId } = req.body || req.query;
    console.log('Cardcom Webhook Notification received:', { ResponseCode, ReturnValue, TransactionId });

    if (ResponseCode === '0') {
      // Payment Successful
      // Update order status if orderId exists
      return res.send('OK');
    }
    res.send('FAILED');
  } catch (error) {
    console.error('Cardcom Indicator Error:', error);
    res.status(500).send('ERROR');
  }
};
