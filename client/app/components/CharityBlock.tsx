// CharityBlock.js
import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig"; // Ensure the correct path
import { collection, getDocs } from "firebase/firestore";

const CharityBlock = () => {
  const [data, setData] = useState<{ id: string; [key: string]: any }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch documents from the 'test' collection
        const querySnapshot = await getDocs(collection(db, "users"));

        // Map the documents to extract data
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>CharityBlock</Text>
      {data.map((item) => (
        <View key={item.id}>
          <Text>{item.name}</Text>
        </View>
      ))}
    </View>
  );
};

export default CharityBlock;
