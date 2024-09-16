import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SpendingType } from "@/types";
import Colors from "@/constants/Colors";
import { WalletCardIcon } from "@/constants/icons";
import { fetchTransactions } from "@/stripe/transaction";
import io from "socket.io-client";
import CharityBlock from "../components/CharityBlock"; // Ensure this component exists and is correctly imported
import { db, auth } from "@/firebaseConfig";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import createPaymentIntent from "@/stripe/payment.js";

interface Transaction {
  id: string;
  amount: number;
  created: number;
  description: string;
  status: string;
}

const SpendingBlock = () => {
  let icon = <WalletCardIcon width={22} height={22} color={Colors.white} />;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [processedTimestamps] = useState(new Set<number>());

  async function addUniqueTransactions(newTransactions: Transaction[]) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      // console.error('No user is currently signed in');
      return;
    }
    const userTransactionsRef = collection(db, "users");

    for (const transaction of newTransactions) {
      const transactionDocRef = doc(
        userTransactionsRef,
        transaction.created.toString()
      );
      const docSnap = await getDoc(transactionDocRef);

      if (!docSnap.exists()) {
        await setDoc(transactionDocRef, transaction);
      }
    }
  }

  let changeAmount = 0;
  let paymentDetails = {
    amount: changeAmount,
    currency: "usd",
    customerId: "cus_QqugEjDfE89QnK",
    paymentMethodId: "pm_card_visa",
    description: "Red Cross Donation",
  };
  

  useEffect(() => {
    fetchTransactions().then((data) => {
      const succeededTransactions = data.filter(
        (transaction: Transaction) =>
          transaction.status.toLowerCase() === "succeeded"
      );
      addUniqueTransactions(succeededTransactions);
      setTransactions(succeededTransactions);

      // Loop through transactions
      succeededTransactions.map((transaction: Transaction) => {
        let roundedAmount = Math.round(transaction.amount / 100);
        roundedAmount = roundedAmount * 100;
        let changeAmount = roundedAmount - transaction.amount;
        if (transactions.find((trans) => trans.amount !== changeAmount)) {
        }
      });
    });

    const socket = io("http://localhost:3000");

    socket.on("new_transaction", (newTransaction: Transaction) => {
      if (newTransaction.status.toLowerCase() === "succeeded") {
        addUniqueTransactions([newTransaction]);
        setTransactions((prevTransactions) => [
          newTransaction,
          ...prevTransactions,
        ]);

        // Loop through transactions
        [newTransaction].map((transaction) => {
          console.log(transaction);
          // ... other operations ...
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [transactions]);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <Text style={styles.transactionItem}>Amount: ${item.amount / 100}</Text>
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
                <Text style={{ color: Colors.white }}>
                  {formatDate(item.created)}
                </Text>
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
