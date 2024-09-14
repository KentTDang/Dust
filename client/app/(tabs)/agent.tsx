import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';

const Agent = () => {
  const [userMessage, setUserMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const charities = require('../../data/charities.json');

  async function sendMessage(message: string) {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
        <ScrollView style={{ height: 200, width: '100%', backgroundColor: 'red' }}>
          {charities.charities.map((charity: string, index: number) => (
            <View key={index}>
              <Button title={charity + '\n'} onPress={() => sendMessage(charity)} />
            </View>
          ))}
        </ScrollView>
        
      <Text>AI Response:</Text>
      {loading ? (
        <View style={{ height: 400, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <ScrollView style={{ height: 400, width: '100%' }}>
          <Markdown>{aiResponse}</Markdown>
        </ScrollView>
      )}
    </View>
    </>

  );
};

export default Agent;