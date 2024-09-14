import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome, SimpleLineIcons, AntDesign } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const Layout = () => {
  return(
  <Tabs screenOptions={{
    tabBarStyle: {
      backgroundColor: Colors.grey,
      position: 'absolute',
      // bottom: 40,
      justifyContent: 'center',
      alignSelf: 'center',
      height: 63,
      // marginHorizontal: 120,
      // paddingHorizontal: 10,
      paddingBottom: 0,
    },
    tabBarShowLabel: false,
    tabBarInactiveTintColor: '#999',
    tabBarActiveTintColor: Colors.white,
  }}>
    <Tabs.Screen
      name="index"
      options={{
        tabBarIcon: ({ color, size, focused }) => (
          <View
            style={{
              padding: 12,
              borderRadius: 30,
              backgroundColor: focused ? Colors.tintColor : Colors.grey,
            }}
          >
            <SimpleLineIcons name="pie-chart" size={18} color={color} />
          </View>
        ),
      }}
    />
    <Tabs.Screen
      name="transactions"
      options={{
        tabBarIcon: ({ color, size, focused }) => (
          <View
            style={{
              padding: 12,
              borderRadius: 30,
              backgroundColor: focused ? Colors.tintColor : Colors.grey,
            }}
          >
            <AntDesign name="swap" size={18} color={color} />
          </View>
        ),
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        tabBarIcon: ({ color, size, focused }) => (
          <View
            style={{
              padding: 12,
              borderRadius: 30,
              backgroundColor: focused ? Colors.tintColor : Colors.grey,
            }}
          >
            <FontAwesome name="user" size={18} color={color} />
          </View>
        ),
      }}
    />
    
  </Tabs>
  )
};

export default Layout;
