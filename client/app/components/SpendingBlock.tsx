import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SpendingType } from "@/types";
import Colors from "@/constants/Colors";
import { WalletCardIcon } from "@/constants/icons";
import { fetchTransactions } from '@/stripe/transaction';
import io from 'socket.io-client';
import CharityBlock from '../components/CharityBlock'; // Ensure this component exists and is correctly imported

interface Transaction {
  id: string;
  amount: number;
  created: number;
  description: string;
  status: string; // Ensure status field exists
  // Add other relevant fields if needed
}

const SpendingBlock = ({ spendingList }: { spendingList: SpendingType[] }) => {
  let icon = <WalletCardIcon width={22} height={22} color={Colors.white} />;

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Fetch initial transactions
    fetchTransactions().then((data) => {
      console.log("Fetched Transactions:", data); // Log all transactions to inspect statuses
      const succeededTransactions = data.filter((transaction: Transaction) => {
        console.log("Transaction Status:", transaction.status); // Check each status
        return transaction.status.toLowerCase() === "succeeded"; // Case-insensitive check
      });
      setTransactions(succeededTransactions);
    });

    // Set up WebSocket connection
    const socket = io("http://localhost:3000"); // Use the backend URL from .env

    // Listen for new transaction events
    socket.on('new_transaction', (newTransaction: Transaction) => {
      console.log("New Transaction Received:", newTransaction.status); // Log new transaction status
      // Only add the transaction if it succeeded
      if (newTransaction.status.toLowerCase() === "succeeded") {
        setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
      }
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <Text style={styles.transactionItem}>
      Amount: ${item.amount / 100}
    </Text>
  );

  const formatDate = (unix: number) => {
    const date = new Date(unix * 1000);
    const formattedDate = date.toLocaleDateString();
    return formattedDate;
  };

  return (
    <View style={styles.spendingSectionWrapper}>
      <Text style={styles.sectionTitle}>
        September <Text style={{ fontWeight: "700" }}>Spending</Text>
      </Text>

      {transactions.map((item) => {
        return (
          <View style={styles.spendingWrapper} key={item.id}>
            <View style={styles.iconWrapper}>{icon}</View>
            <View style={styles.textWrapper}>
              <View style={{ gap: 5 }}>
                <Text style={styles.itemName}>{item.description}</Text>
                <Text style={{ color: Colors.white }}>{formatDate(item.created)}</Text>
              </View>
              <Text style={styles.itemName}>${item.amount / 100}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default SpendingBlock;

const styles = StyleSheet.create({
  spendingSectionWrapper: {
    marginVertical: 20,
    alignItems: "flex-start",
    paddingBottom: 100,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 20,
  },
  spendingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  iconWrapper: {
    backgroundColor: Colors.grey,
    padding: 15,
    borderRadius: 50,
    marginRight: 10,
  },
  textWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  transactionItem: {
    color: Colors.white,
    fontSize: 14,
    marginVertical: 5,
  },
});
