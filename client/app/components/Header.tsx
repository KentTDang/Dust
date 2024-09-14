import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";

const Header = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.userInfoWrapper}>
          <Image
            source={{
              uri: "https://avatars.githubusercontent.com/u/10240250?v=4",
            }}
            style={styles.userImage}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={[ styles.userText, {fontSize: 12} ]}>Hey, Kent</Text>
            <Text style={[ styles.userText, {fontSize: 16} ]}>
              Your <Text style={{ fontWeight: "700" }}>Donations</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {}}
          style={styles.btnWrapper}
        >
          <Text style={styles.btnText}>My Transactions</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;

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
  btnText: { color: Colors.white },
  userText: { color: Colors.white },
});