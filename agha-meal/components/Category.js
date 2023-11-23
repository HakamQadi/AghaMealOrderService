// rnfe to create the React Native Functional component

import { View, Text } from "react-native";
import React, { useEffect } from "react";
import axios from "axios";


const Category = () => {
  const fetchCategory = async () => {
    try {
        const res = await axios.get(`${}/admin/meals/category`);

      console.log(res.data.categories);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <View>
      <Text>Category</Text>
    </View>
  );
};

export default Category;
