const express = require('express');
const crypto = require('crypto');
const { Payment, Order, Client } = require('../models'); // Assuming models are in ../models
const { authenticateToken, checkTenant } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// Initialize Paystack payment
router.post('/paystack/initialize', checkTenant, async (req, res) => {
  try {
    const { email, amount, currency = 'KES', orderId, clientId } = req.body;

    if (!email || !amount || !orderId) {
      return res.status(400).json({ error: 'Email, amount, and orderId are required' });
    }

    const reference = `devboma_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;

    // In production, make actual Paystack API call
    // For demo, we simulate the response
    const paystackResponse = {
      status: true,
      message: 'Authorization URL created',
      data: {
        authorization_url: `https://checkout.paystack.com/demo?reference=${reference}`,
        access_code: `demo_access_${reference}`,
        reference: reference,
      },
    };

    // Store payment record
    await Payment.create({
      client: clientId,
      order: orderId,
      reference: reference,
      amount: amount,
      currency: currency,
      status: 'pending',
      provider: 'paystack',
    });

    res.json({ success: true, data: paystackResponse.data });

  } catch (error) {
    console.error('Paystack initialization error:', error);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

// Verify Paystack payment
router.post('/paystack/verify', async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference) {
      return res.status(400).json({ error: 'Payment reference is required' });
    }

    // In production, verify with Paystack API. Here, we simulate success.
    const verificationData = {
      status: 'success',
      gateway_response: 'Successful',
      paid_at: new Date(),
    };

    const payment = await Payment.findOneAndUpdate(
      { reference: reference },
      {
        $set: {
          status: 'completed',
          verifiedAt: new Date(),
          verificationData: verificationData,
          providerReference: verificationData.reference, // or some other ID from Paystack
        },
      },
      { new: true }
    ).populate('order');

    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    // Update the corresponding order status
    await Order.findByIdAndUpdate(payment.order._id, { status: 'processing' });

    res.json({ success: true, message: 'Payment verified successfully', data: payment });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Paystack webhook handler
router.post('/paystack/webhook', async (req, res) => {
  try {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || 'demo-secret')
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const { reference } = event.data;
      
      const payment = await Payment.findOneAndUpdate(
        { reference: reference },
        {
          $set: {
            status: 'completed',
            verifiedAt: new Date(),
            verificationData: event.data,
            providerReference: event.data.id
          }
        },
        { new: true }
      );

      if (payment) {
        await Order.findByIdAndUpdate(payment.order, { status: 'processing' });
        console.log(`Webhook: Payment for reference ${reference} successful.`);
      }
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});


// M-Pesa STK Push
router.post('/mpesa/stk-push', checkTenant, async (req, res) => {
  try {
    const { phone, amount, orderId, clientId } = req.body;

    if (!phone || !amount || !orderId) {
      return res.status(400).json({ error: 'Phone, amount, and orderId are required' });
    }

    const reference = `devboma_mpesa_${Date.now()}`;

    // In production, you would integrate with Safaricom M-Pesa API here
    const stkResponse = {
      MerchantRequestID: `demo_merchant_${Date.now()}`,
      CheckoutRequestID: `demo_checkout_${Date.now()}`,
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
    };

    await Payment.create({
      client: clientId,
      order: orderId,
      reference: reference,
      providerReference: stkResponse.CheckoutRequestID, // M-Pesa checkout ID
      amount: amount,
      currency: 'KES',
      status: 'pending',
      provider: 'mpesa',
    });

    res.json({ success: true, data: stkResponse });

  } catch (error) {
    console.error('M-Pesa STK Push error:', error);
    res.status(500).json({ error: 'M-Pesa payment failed' });
  }
});


module.exports = router;
