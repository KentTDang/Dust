import { View, Text, StatusBar } from "react-native";
import React, {useEffect} from "react";
import { Tabs, useRouter } from "expo-router";
import { FontAwesome, SimpleLineIcons, AntDesign } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";

const Layout = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if(!currentUser) {
        router.replace("/App");
      }
    });

    return unsubscribe;
  },[]);
  
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: Colors.grey,
            position: "absolute",
            bottom: 0,
            justifyContent: "center",
            alignSelf: "center",
            height: 100,
            // marginHorizontal: 120,
            // paddingHorizontal: 10,
            paddingBottom: 20,
            borderWidth: 1,
            borderTopWidth: 1,
            borderColor: "#333",
            borderTopColor: "#333",
          },
          tabBarShowLabel: false,
          tabBarInactiveTintColor: "#999",
          tabBarActiveTintColor: Colors.white,
        }}
      >
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
      <StatusBar barStyle="light-content" />
    </>
  );
};

export default Layout;
