const express = require('express');
const router = express.Router();
const { createCardcomSession, handleCardcomIndicator } = require('../controllers/paymentController');

router.post('/cardcom/create-session', createCardcomSession);
router.all('/cardcom/indicator', handleCardcomIndicator);

module.exports = router;
