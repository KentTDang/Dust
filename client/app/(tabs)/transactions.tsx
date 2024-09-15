// frontend/src/pages/Page.js

import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { fetchTransactions } from '@/stripe/transaction';
import io from 'socket.io-client';
import CharityBlock from '../components/CharityBlock'; // Make sure CharityBlock exists and is correctly imported

interface Transaction {
  // Define properties of a transaction
  id: string;
  amount: number;
  // Add other relevant fields
}

const Page = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Fetch initial transactions
    fetchTransactions().then(setTransactions);

    // Set up WebSocket connection
    const socket = io("http://localhost:3000"); // Use the backend URL from .env

    // Listen for new transaction events
    socket.on('new_transaction', (newTransaction: Transaction) => {
      setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [transactions]);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <Text style={styles.transactionItem}>
       Amount: ${item.amount/100}
    </Text>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>Transactions</Text>

        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 20,
  },
  list: {
    width: '100%',
    paddingHorizontal: 20,
  },
  transactionItem: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 10,
  },
});
