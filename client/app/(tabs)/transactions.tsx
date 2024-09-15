import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Colors from '@/constants/Colors'
import CharityBlock from '@/app/components/CharityBlock'
const Page = () => {
  return (
    <>
    <Stack.Screen options={{headerShown: false}}/>
    <View style={styles.container}>
      <Text style={styles.text}>transactions</Text>
    <CharityBlock />

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