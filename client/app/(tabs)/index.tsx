import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect, ReactNode } from "react";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import Header from "@/app/components/Header";
import { PieChart, LineChart } from "react-native-gifted-charts";
import ExpenseBlock from "@/app/components/ExpenseBlock";
// import IncomeBlock from "@/app/components/IncomeBlock";
import SpendingBlock from "@/app/components/SpendingBlock";
import ExpenseList from "@/app/data/expenses.json";
import spendingList from "@/app/data/spending.json";
import { Line } from "react-native-svg";
import { db, auth } from "../../firebaseConfig.mjs";
import { doc, getDocs, collection, query, orderBy } from "firebase/firestore";

interface Donation {
  value: number;
  customDataPoint: () => ReactNode;
}

const Page = () => {

  const [donations, setDonations] = useState<Donation[]>([]);
  const [totalDonations, setTotalDonations] = useState(0);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("created", "desc"));
        const querySnapshot = await getDocs(q);
        const donationData = querySnapshot.docs.map(doc => ({
          value: doc.data().amount, // Convert cents to dollars
          customDataPoint: dPoint,
        }));
        setDonations(donationData);
        const total = donationData.reduce((sum, donation) => sum + donation.value, 0);
        console.log("Total donations:", total);
        console.log("Donations:", donations);
        setTotalDonations(total);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, []);
  
  const dPoint = () => {
    return (
      <View
        style={{
          width: 14,
          height: 14,
          backgroundColor: "white",
          borderWidth: 3,
          borderRadius: 7,
          borderColor: "#07BAD1",
        }}
      />
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header />,
        }}
      />
      <View style={[styles.container, { paddingTop: 40 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ gap: 10 }}>
              <Text style={{ color: Colors.white, fontSize: 16 }}>
                My <Text style={{ fontWeight: 700 }}>Donations</Text>
              </Text>
              <Text
                style={{ color: Colors.white, fontSize: 36, fontWeight: 700 }}
              >
                $86.<Text style={{ fontSize: 22, fontWeight: 400 }}>06</Text>
                ${totalDonations}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginVertical: 0,
              paddingVertical: 50,
              backgroundColor: Colors.black,
            }}
          >
            <LineChart
              isAnimated
              thickness={3}
              color="#07BAD1"
              maxValue={9000}
              noOfSections={3}
              animateOnDataChange
              animationDuration={1000}
              onDataChangeAnimationDuration={300}
              areaChart
              yAxisTextStyle={{ color: "lightgray" }}
              data={donations}
              hideDataPoints
              startFillColor={"rgb(84,219,234)"}
              endFillColor={"rgb(84,219,234)"}
              startOpacity={0.4}
              endOpacity={0.1}
              spacing={22}
              backgroundColor={Colors.black}
              rulesColor="gray"
              rulesType="solid"
              initialSpacing={10}
              yAxisColor="lightgray"
              xAxisColor="lightgray"
            />
          </View>
          <ExpenseBlock expenseList={ExpenseList} customerId="cus_Qqz1iRvKc0cOXp" />
          {/* <IncomeBlock incomeList={incomeList} /> */}
          <SpendingBlock spendingList={spendingList} />
        </ScrollView>
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
  },
});
