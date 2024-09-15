// backend/payment.js
const dotenv = require('dotenv');
dotenv.config();  
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Ensure your secret key is correctly set and secure
// import { db, auth } from "../../firebaseConfig.js"
// const currentUser = auth.currentUser
// const data = db.collection(currentUser.uid).doc("transactions");
/**
 * Function to create a Payment Intent with Stripe
 * @param {Object} paymentData - The payment details required to create a payment intent
 * @param {number} paymentData.amount - The amount in cents (e.g., 2038 for $20.38)
 * @param {string} paymentData.currency - The currency code (default is 'usd')
 * @param {string} paymentData.customerId - The Stripe customer ID
 * @param {string} paymentData.paymentMethodId - The Payment Method ID saved with the customer
 * @param {string} paymentData.description - Optional description of the payment
 * @returns {Promise<Object>} - The created Payment Intent details or an error message
 */
async function createPaymentIntent({ amount, currency = 'usd', customerId, paymentMethodId, description }) {
  try {
    // Validate input data to ensure required fields are present
    if (!amount || !customerId || !paymentMethodId) {
      throw new Error('Amount, Customer ID, and Payment Method ID are required.');
    }

    // Create a Payment Intent using the Stripe API
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency, // Currency code (default is 'usd')
      customer: customerId, // The ID of the Stripe customer
      payment_method: paymentMethodId, // Use the Payment Method saved with the customer
      confirm: true, // Automatically confirm the payment intent
      description: description || 'Payment created behind the scenes', // Optional description
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Disable redirect-based payment methods
      },
    });

    console.log(`PaymentIntent created successfully: ${paymentIntent.id}`);
    return { success: true, paymentIntent };
  } catch (error) {
    console.error('Error creating payment intent:', error.message);
    return { error: `Failed to create payment intent: ${error.message}` };
  }
}
createPaymentIntent({amount: 2024, currency: "usd", customerId: "cus_Qqug4rZ7LOD9ty", paymentMethodId: "pm_card_visa", description:  "Amazon.com"})
module.exports = createPaymentIntent;
