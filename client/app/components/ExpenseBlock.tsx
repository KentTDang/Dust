import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ExpenseType } from "@/types";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { fetchTransactions } from '@/stripe/transaction'; // Ensure this fetches transactions correctly


// Define the Transaction type
interface Transaction {
  id: string;
  amount: number;
  created: number;
  description: string;
  status: string;
  customer: string; // Ensure customer ID is part of the transaction
}

const ExpenseBlock = ({ expenseList, customerId }: { expenseList: ExpenseType[], customerId: string }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCustomerAmount, setTotalCustomerAmount] = useState(0);

  useEffect(() => {
    // Fetch transactions and filter by customer ID
    fetchTransactions().then((data) => {
      const succeededTransactions = data.filter(
        (transaction: Transaction) => 
          transaction.customer === "cus_Qqz1iRvKc0cOXp"
      );
      setTransactions(succeededTransactions);

      // Calculate the total amount spent by the specific customer
      let totalAmountSpent = 0;

      for (let i = 0; i < transactions.length; i++) {
        if(transactions[i].amount < 100) {
          totalAmountSpent += transactions[i].amount;
        }
        console.log(transactions[i].amount)
      }
      console.log(`Total Amount Spent by Customer: $${(totalAmountSpent / 100).toFixed(2)}`);
      setTotalCustomerAmount(totalAmountSpent / 100); // Pass a number instead of a string
    }).catch((error) => {
      console.error('Error fetching charges:', error);
    });
  }, [customerId]);

  const renderItem: ListRenderItem<Partial<ExpenseType>> = ({
    item,
    index,
  }) => {
    if (index === 0) {
      return (
        <TouchableOpacity onPress={() => {}}>
          {/* <View
            style={styles.addItemBtn}
          >
            <Feather name="plus" size={22} color={"#ccc"} />
          </View> */}
        </TouchableOpacity>
      );
    }
    

    let amount = item.amount?.split(".") ?? ["0", "00"];
    let test = totalCustomerAmount.toString()
    let test2 = test.split(".") ?? ["0", "00"];
    return (
      <View
        style={[
          styles.expenseBlock,
          {
            backgroundColor:
              item.name === "Feeding America"
                ? Colors.blue
                : item.name === "American Red Cross"
                ? Colors.white
                : Colors.tintColor,
          },
        ]}
      >
        <Text
          style={[
            styles.expenseBlockTxt1,
            {
              color:
                item.name === "Feeding America"
                  ? Colors.black
                  : item.name === "American Red Cross"
                  ? Colors.black
                  : Colors.white,
            },
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.expenseBlockTxt2,
            {
              color:
                item.name === "Feeding America"
                  ? Colors.black
                  : item.name === "American Red Cross"
                  ? Colors.black
                  : Colors.white,
            },
          ]}
        >
          ${test2[0]}.
          <Text style={styles.expenseBlockTxt2Span}>{test2[1]}</Text>
        </Text>
        <View style={styles.expenseBlock3View}>
          <Text
            style={[
              styles.expenseBlockTxt1,
              {
                color:
                  item.name === "Feeding America"
                    ? Colors.black
                    : item.name === "American Red Cross"
                    ? Colors.black
                    : Colors.white,
              },
            ]}
          >
            {item.percentage}%
          </Text>
        </View>
      </View>
    );
  };

  const staticItem = [{ name: "Add Item" }];

  return (
    <View style={{ paddingVertical: 20 }}>
      {/* Display total amount spent by the specific customer */}
      <Text style={styles.totalText}>
        Total Amount Spent by Customer: ${totalCustomerAmount.toFixed(2)}
      </Text>

      <FlatList
        data={staticItem.concat(expenseList)}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default ExpenseBlock;

const styles = StyleSheet.create({
  expenseBlock: {
    backgroundColor: Colors.tintColor,
    width: 100,
    padding: 15,
    borderRadius: 15,
    marginRight: 20,
    gap: 8,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  expenseBlockTxt1: {
    color: Colors.white,
    fontSize: 14,
  },
  expenseBlockTxt2: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  expenseBlockTxt2Span: {
    fontSize: 12,
    fontWeight: "400",
  },
  expenseBlock3View: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 10,
  },
  totalText: {
    color: Colors.black,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 15,
  },
});
