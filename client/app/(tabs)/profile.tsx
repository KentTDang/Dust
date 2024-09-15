import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'
import { WalletCardIcon } from '@/constants/icons'
import Colors from '@/constants/Colors'
import { Stack } from 'expo-router'
import { auth } from '@/firebaseConfig';
import { signOut } from 'firebase/auth';



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
    <View style={styles.container}>
      <Text style={styles.text}>profile</Text>
      <WalletCardIcon width={24} height={24}/>
      <Button 
        title="Logout" 
        onPress={handleSignOut} 
        color="#e74c3c" 
      />
    </View>
    </>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  text: {
    color: Colors.white,
  }
})