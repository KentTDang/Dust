import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';

const Agent = () => {
  const [userMessage, setUserMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const charities = require('../../data/charities.json');

  async function sendMessage(message: string) {
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage: message }),
      });
      const data = await response.json();
      setAiResponse(data.message);
    } catch (error) {
      console.error('Error:', error);
      setAiResponse('An error occurred while fetching the response.');
    }
  }

  return (
    <>
    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 80 }}>
      <TextInput
        value={userMessage}
        onChangeText={setUserMessage}
        placeholder="Enter your message"
      />
      <Button title="Send" onPress={() => sendMessage(userMessage)} />
        <ScrollView>
          {charities.charities.map((charity: string, index: number) => (
            <View key={index}>
              <Button title={charity + '\n'} onPress={() => sendMessage(charity)} />
            </View>
          ))}
        </ScrollView>
        
      <Text>AI Response:</Text>
      <ScrollView >
        <Text>{aiResponse}</Text>
      </ScrollView>
    </View>

    <View>
    <Text>AI Response:</Text>
      <ScrollView >
        <Text>{aiResponse}</Text>
      </ScrollView>
    </View>
      
    </>

  );
};

export default Agent;