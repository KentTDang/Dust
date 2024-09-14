import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { WalletCardIcon } from '@/constants/icons'
import Colors from '@/constants/Colors'
import { Stack } from 'expo-router'

const Page = () => {
  return (
    <>
    <Stack.Screen options={{headerShown: false}}/>
    <View style={styles.container}>
      <Text style={styles.text}>profile</Text>
      <WalletCardIcon width={24} height={24}/>
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