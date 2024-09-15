import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SpendingType } from "@/types";
import Colors from "@/constants/Colors";
import { WalletCardIcon } from "@/constants/icons";
import { fetchTransactions } from '@/stripe/transaction';
import io from 'socket.io-client';
import { db, auth } from '@/firebaseConfig';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

// Define the Transaction type
interface Transaction {
  id: string;
  amount: number;
  created: number;
  description: string;
  status: string;
}

// Function to calculate total donations
export const calculateTotalDonations = (transactions: Transaction[]): number => {
  return transactions.reduce((acc, transaction) => acc + transaction.amount, 0) / 100;
};

const SpendingBlock = ({ spendingList }: { spendingList: SpendingType[] }) => {
  let icon = <WalletCardIcon width={22} height={22} color={Colors.white} />;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalDonations, setTotalDonations] = useState(0);

  async function addUniqueTransactions(newTransactions: Transaction[]) {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const userTransactionsRef = collection(db, currentUser.uid, 'transactions');

    for (const transaction of newTransactions) {
      const transactionDocRef = doc(userTransactionsRef, transaction.created.toString());
      const docSnap = await getDoc(transactionDocRef);

      if (!docSnap.exists()) {
        await setDoc(transactionDocRef, transaction);
      }
    }
  }

  useEffect(() => {
    // Fetch transactions and calculate total donations
    fetchTransactions().then((data) => {
      const succeededTransactions = data.filter(
        (transaction: Transaction) => transaction.status.toLowerCase() === "succeeded"
      );
      addUniqueTransactions(succeededTransactions);
      setTransactions(succeededTransactions);

      const total = calculateTotalDonations(succeededTransactions);
      setTotalDonations(total);
    });

    const socket = io("http://localhost:3000");

    socket.on("new_transaction", (newTransaction: Transaction) => {
      if (newTransaction.status.toLowerCase() === "succeeded") {
        addUniqueTransactions([newTransaction]);
        setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);

        setTotalDonations((prevTotal) => prevTotal + newTransaction.amount / 100);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [transactions]);

  useEffect(() => {
    const total = calculateTotalDonations(transactions);
    setTotalDonations(total);
  }, [transactions]);

  const formatDate = (unix: number) => {
    const date = new Date(unix * 1000);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.spendingSectionWrapper}>
      <Text style={styles.sectionTitle}>
        September <Text style={{ fontWeight: "700" }}>Spending</Text>
      </Text>
    

      {transactions.map((item) => (
        <View style={styles.spendingWrapper} key={item.id}>
          <View style={styles.iconWrapper}>{icon}</View>
          <View style={styles.textWrapper}>
            <View style={{ gap: 5 }}>
              <Text style={styles.itemName}>{item.description}</Text>
              <Text style={{ color: Colors.white }}>{formatDate(item.created)}</Text>
            </View>
            <Text style={styles.itemName}>${(item.amount / 100).toFixed(2)}</Text>
          </View>
        </View>
      ))}
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
});
