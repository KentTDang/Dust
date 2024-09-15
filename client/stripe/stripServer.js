// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS to handle requests from different origins

// Load environment variables from .env file
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Correct initialization of Stripe with the secret key


const app = express();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Webhook secret for validating events from Stripe

// Use CORS to handle cross-origin requests from your frontend
app.use(cors());

// Use JSON body parser for all incoming requests
app.use(bodyParser.json());

// Webhook route: Set up raw body parser specifically for Stripe webhooks
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify and construct the event
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle relevant event types
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log(`PaymentIntent was successful: ${paymentIntent.id}`);

    // Emit event to clients via WebSocket
    io.emit('new_transaction', paymentIntent); // Correctly emit the new transaction event
  }

  res.status(200).send('Received');
});

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins, adjust as needed for security
  },
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Correctly import the payment routes
const paymentRoutes = require('./payment.js'); // Ensure this path points to the correct location of payment.js
app.use('/api', paymentRoutes); // Integrate payment routes under /api path

server.listen(3000, () => {
  console.log('Server and WebSocket running on port 3000');
});
