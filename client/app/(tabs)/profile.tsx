import { View, Text, StyleSheet, Button, Image } from 'react-native'
import React from 'react'
import { WalletCardIcon } from '@/constants/icons'
import Colors from '@/constants/Colors'
import { Stack } from 'expo-router'
import { auth } from '@/firebaseConfig';
import { signOut } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Page = () => {

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully!');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <>
    <Stack.Screen options={{headerShown: false}}/>
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.userInfoWrapper}>
          <Image
            source={{
              uri: "https://avatars.githubusercontent.com/u/10240250?v=4",
            }}
            style={styles.userImage}
          />
          <View style={styles.userTextWrapper}>
            <Text style={[ styles.userText, {fontSize: 16} ]}>{auth.currentUser?.email}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.btnWrapper}
        >
          <View style={{flexDirection: "row", alignItems: "center"}}>
          <MaterialIcons name="logout" size={16} color={Colors.white} />
          <Text style={styles.btnText}>Sign Out</Text>
          </View>
          
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </>
  )
}

export default Page


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