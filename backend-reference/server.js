const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create subscription endpoint
app.post('/create-subscription', async (req, res) => {
  try {
    const { email, payment_method_id, price_id } = req.body;

    // Create or retrieve customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: email,
        payment_method: payment_method_id,
        invoice_settings: {
          default_payment_method: payment_method_id,
        },
      });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(payment_method_id, {
      customer: customer.id,
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price_id }],
      default_payment_method: payment_method_id,
      expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice;
    const payment_intent = invoice.payment_intent;

    res.json({
      subscription_id: subscription.id,
      client_secret: payment_intent.client_secret,
      status: subscription.status,
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(400).json({ 
      error: error.message 
    });
  }
});

// Webhook endpoint for Stripe events
app.post('/webhooks/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
      console.log('Subscription created:', event.data.object);
      // Update your database - user is now premium
      break;
    
    case 'customer.subscription.updated':
      console.log('Subscription updated:', event.data.object);
      // Handle subscription changes
      break;
    
    case 'customer.subscription.deleted':
      console.log('Subscription cancelled:', event.data.object);
      // Update your database - user is no longer premium
      break;
    
    case 'invoice.payment_succeeded':
      console.log('Payment succeeded:', event.data.object);
      // Subscription payment successful
      break;
    
    case 'invoice.payment_failed':
      console.log('Payment failed:', event.data.object);
      // Handle failed payment
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});