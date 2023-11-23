// HomeScreen.js
import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import Category from "../../components/Category";

const HomeScreen = ({ navigation, route }) => {
  const { names } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextName = () => {
    setCurrentIndex(currentIndex + 1);
  };
  return (
    <View>
      <Text>{names[currentIndex]}'s Order</Text>
      <Text>Choose Category</Text>
      <Category />
      <TouchableOpacity
        style={{ borderWidth: 1, margin: 20, alignItems: "center" }}
        onPress={handleNextName}
      >
        <Text>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
