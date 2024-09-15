// backend/transaction.js

import axios from 'axios';

// Replace with your Stripe secret key from the .env file
const stripeSecretKey = "sk_test_51PyoUe16KA2Cu9gBQxK8oCLfew0uxcB6QSSAnBpEA97F8UiE9X2s7SSzconksGLMemekgz9ehqmoU4gxE51At7T000KTt1PJmM";

// Function to fetch transactions
export async function fetchTransactions() {
  try {
    const response = await axios.get('https://api.stripe.com/v1/charges', {
      headers: {
        Authorization: `Bearer sk_test_51PyoUe16KA2Cu9gBQxK8oCLfew0uxcB6QSSAnBpEA97F8UiE9X2s7SSzconksGLMemekgz9ehqmoU4gxE51At7T000KTt1PJmM`
    },
    });

    // Log the list of transactions
    return response.data.data;
  } catch (error) {
    console.error('Error fetching transactions:', error.response ? error.response.data : error.message);
  }
}

