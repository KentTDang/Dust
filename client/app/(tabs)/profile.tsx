import { View, Text, StyleSheet, Button, Image } from "react-native";
import React from "react";
import { WalletCardIcon } from "@/constants/icons";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Page = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.userInfoWrapper}>
            <Image
              source={{
                uri:
                  auth.currentUser?.photoURL ||
                  "https://avatars.githubusercontent.com/u/10240250?v=4",
              }}
              style={styles.userImage}
            />
            <View style={styles.userTextWrapper}>
              <Text style={[styles.userText, { fontSize: 16 }]}>
                {auth.currentUser?.email}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleSignOut} style={styles.btnWrapper}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="logout" size={16} color={Colors.white} />
              <Text style={styles.btnText}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            gap: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          
          <Text style={{ color: Colors.white, fontSize: 36, fontWeight: 700 }}>
            $1475.<Text style={{ fontSize: 22, fontWeight: 400 }}>00</Text>
          </Text>
          <Text style={{ color: Colors.white, fontSize: 16 }}>
            Total in Donations
          </Text>
        </View>
        <View>

        </View>

        <View style={{ gap: 20, paddingHorizontal: 20, paddingVertical: 100 }}>
          <Text style={{ color: Colors.white, fontSize: 20, fontWeight: 700 }}>What's to come?</Text>
          <View style={{ gap: 20 }}>
            <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 400 }}>Deductible Tax Summary</Text>
            <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 400 }}>News Update on Your charities</Text>

          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
    paddingHorizontal: 20,
  },
  userInfoWrapper: { flexDirection: "row", alignItems: "center" },
  userImage: { height: 50, width: 50, borderRadius: 30 },
  btnWrapper: {
    borderColor: "#666",
    borderRadius: 10,
    borderWidth: 1,
    padding: 8,
  },
  btnText: { color: Colors.white, marginLeft: 6 },
  userText: { color: Colors.white },
  userTextWrapper: { marginLeft: 10 },
  boldText: { fontWeight: "bold" },
});