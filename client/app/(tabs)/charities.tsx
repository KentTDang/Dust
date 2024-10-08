import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Stack } from 'expo-router';
import { default as Colors } from '../../constants/Colors';
import charitiesData from '../data/charities.json';
import { AntDesign } from '@expo/vector-icons';

const Charities = () => {
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [charities, setCharities] = useState<string[]>([]);

  // Use a ref to keep track of the current AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Load charities from the imported JSON file
    setCharities(charitiesData.charities);
  }, []);

  async function sendMessage(message: string) {
    // Abort the previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setAiResponse(''); // Clear previous response
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage: message }),
        signal: controller.signal, // Attach the signal to the fetch request
      });
      const data = await response.json();
      setAiResponse(data.message);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Error:', error);
        setAiResponse('An error occurred while fetching the response.');
      }
    } finally {
      setLoading(false);
    }
  }

  // Function to handle button press and toggle dropdown
  const handlePress = (index: number, charity: string) => {
    setAiResponse('');
    setExpandedIndex(expandedIndex === index ? null : index);
    sendMessage(charity);
  };

  // Filter charities based on search query
  const filteredCharities = charities.filter((charity: string) =>
    charity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <View style={[styles.input, {display: 'flex', flexDirection: 'row', alignItems: 'center', borderRadius: 17, height:50, width: '95%'}]}>
        <AntDesign name="search1" size={20} color={Colors.white} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search Charities"
          placeholderTextColor={Colors.white}
          style={{paddingLeft: 6, fontSize: 20}}
        />
        </View>
        

        <ScrollView style={styles.scrollView}>
          {filteredCharities.map((charity: string, index: number) => (
            <View key={index} style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => handlePress(index, charity)}>
                <Text style={styles.buttonText}>{charity}</Text>
              </TouchableOpacity>
              {expandedIndex === index && (
                <View style={styles.dropdown}>
                  {loading ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <Markdown style={markDownStyles}>{aiResponse}</Markdown>
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    backgroundColor: Colors.black,
  },
  input: {
    color: Colors.white,
    borderColor: Colors.grey,
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    width: '90%',
    height: 60,
    fontSize: 18,
    
  },
  scrollView: {
    height: 800,
    width: '100%',
    backgroundColor: Colors.black,
  },
  buttonContainer: {
    marginBottom: 8,
  },
  button: {
    backgroundColor: Colors.grey,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 4,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',

  },
  dropdown: {
    backgroundColor: 'bebebe',
    padding: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: -4,
  },
  dropdownText: {
    color: 'white',
    fontSize: 14,
  },
  responseText: {
    color: Colors.white,
    marginTop: 20,
  },
  responseScrollView: {
    height: 400,
    width: '100%',
  },
});

const markDownStyles = StyleSheet.create({
  body: {
    color: 'white',
    fontSize: 18,
  },
});

export default Charities;
