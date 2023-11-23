// rnfe to create the React Native Functional component

import { View, Text } from "react-native";
import React, { useEffect } from "react";
import axios from "axios";

const Category = () => {
  useEffect(async () => {
    // await axios.get()
  }, []);

  return (
    <View>
      <Text>Category</Text>
    </View>
  );
};

export default Category;
