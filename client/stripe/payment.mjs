import { db, auth, app } from "../firebaseConfig.mjs";
import {addDoc, collection} from 'firebase/firestore';
dotenv.config();  
import stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();  

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Use the latest API version or the one you prefer
});

console.log('Stripe initialized:', !!stripeInstance, 'Secret key:', process.env.STRIPE_SECRET_KEY?.slice(0, 5) + '...');

console.log('Stripe initialized:', !!stripe, 'Secret key:', process.env.STRIPE_SECRET_KEY?.slice(0, 5) + '...');
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
  const currentUser = auth.currentUser;
  
  console.log("Current user:", currentUser);
  console.log("Stripe instance methods:", Object.keys(stripeInstance));

  try {
    // Validate input data
    if (!amount || !customerId || !paymentMethodId) {
      throw new Error('Amount, Customer ID, and Payment Method ID are required.');
    }

    // Create a Payment Intent using the Stripe API
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true,
      description: description || 'Payment created behind the scenes',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    await addDoc(collection(db, "users"), {
      id: paymentIntent.id,
      customerId: paymentIntent.customer,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      created: paymentIntent.created,
      description: paymentIntent.description
    }).then(() => {
      createCharityPayment(paymentIntent);      
    });


    console.log(`PaymentIntent created successfully: ${paymentIntent.id}`);
    return { success: true, paymentIntent };
  } catch (error) {
    console.error('Detailed error:', error);
    return { error: `Failed to create payment intent: ${error.message}` };
  }
}
createPaymentIntent({amount: 1738, currency: "usd", customerId: "cus_Qqug4rZ7LOD9ty", paymentMethodId: "pm_card_visa", description: "Uniqlo"})
  .then(result => console.log(result))
  .catch(error => console.error(error));


  async function createCharityPayment(paymentIntent) {

    const price = Math.round(paymentIntent.amount / 100) * 100;
    let sendAmount = price - paymentIntent.amount;
    if(sendAmount < 50) {
      sendAmount = 50;
    }

    const paymentIntent2 = await stripeInstance.paymentIntents.create({
      amount: sendAmount,
      currency: "usd",
      customer: "cus_QqugEjDfE89QnK",
      payment_method: "pm_card_visa",
      confirm: true,
      description: "Red Cross Donation" || 'Payment created behind the scenes',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });
      
       addDoc(collection(db, "charities"), {
        id: paymentIntent.id,
        customerId: "cus_QqugEjDfE89QnK",
        currency: price - paymentIntent.currency,
        status: paymentIntent.status,
        created: paymentIntent.created,
        description: "Red Cross Donation"
      });
  }