import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
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
import expenseList from "@/app/data/expenses.json";

const Page = () => {

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

  const latestData = [
    {
      value: 100,
      // labelComponent: () => ('22 Nov'),
      customDataPoint: dPoint,
    },
    {
      value: 120,
      hideDataPoint: true,
    },
    {
      value: 210,
      customDataPoint: dPoint,
    },
    {
      value: 250,
      hideDataPoint: true,
    },
    {
      value: 320,
      // labelComponent: () => lcomp('24 Nov'),
      customDataPoint: dPoint,
    },
    {
      value: 310,
      hideDataPoint: true,
    },
    {
      value: 270,
      customDataPoint: dPoint,
    },
    {
      value: 240,
      hideDataPoint: true,
    },
    {
      value: 130,
      // labelComponent: () => lcomp('26 Nov'),
      customDataPoint: dPoint,
    },
    {
      value: 120,
      hideDataPoint: true,
    },
    {
      value: 100,
      customDataPoint: dPoint,
    },
    {
      value: 210,
      hideDataPoint: true,
    },
    {
      value: 270,
      // labelComponent: () => lcomp('28 Nov'),
      customDataPoint: dPoint,
    },
    {
      value: 240,
      hideDataPoint: true,
    },
    {
      value: 120,
      hideDataPoint: true,
    },
    {
      value: 100,
      customDataPoint: dPoint,
    },
    {
      value: 210,
      // labelComponent: () => lcomp('28 Nov'),
      customDataPoint: dPoint,
    },
    {
      value: 20,
      hideDataPoint: true,
    },
    {
      value: 100,
      customDataPoint: dPoint,
    },
  ];
  const [currentData, setCurrentData] = useState(latestData);

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
                My <Text style={{ fontWeight: 700 }}>Expenses</Text>
              </Text>
              <Text
                style={{ color: Colors.white, fontSize: 36, fontWeight: 700 }}
              >
                $1475.<Text style={{ fontSize: 22, fontWeight: 400 }}>00</Text>
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
              maxValue={600}
              noOfSections={3}
              animateOnDataChange
              animationDuration={1000}
              onDataChangeAnimationDuration={300}
              areaChart
              yAxisTextStyle={{ color: "lightgray" }}
              data={latestData}
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
          <ExpenseBlock expenseList={ExpenseList} />
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
