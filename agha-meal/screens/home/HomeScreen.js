// HomeScreen.js
import React from "react";
import { View, Text, Button } from "react-native";

const HomeScreen = ({ navigation,route }) => {
  const { names } = route.params;
  return (
    <View>
      <Text>{names}</Text>
    </View>
  );
};

export default HomeScreen;
