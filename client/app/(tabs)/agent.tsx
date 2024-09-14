import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const Agent = () => {
  const [userMessage, setUserMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  async function sendMessage(message: string) {
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        value={userMessage}
        onChangeText={setUserMessage}
        placeholder="Enter your message"
      />
      <Button title="Send" onPress={() => sendMessage(userMessage)} />
      <Text>AI Response:</Text>
      <Text>{aiResponse}</Text>
    </View>
  );
};

export default Agent;