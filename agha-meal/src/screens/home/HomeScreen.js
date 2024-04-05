// TODO future apdate : add more than one resturant

import React, { useContext, useState, useEffect } from "react";
import { View, Text } from "react-native";
import Category from "../../components/category/Category";
import Button from "../../components/button/Button";
import Style from "./style";
import { OrderContext } from "../../context/OrderContext";
import { API_URL } from "@env";
import axios from "axios";

const HomeScreen = ({ navigation, route }) => {
  const { state } = useContext(OrderContext);

  console.log("HOME STATE ::: ", state);

  const { names } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState([]);

  const handleNextName = () => {
    if (names.length == currentIndex + 1) {
      // navigate to ALl orders screen
      navigation.navigate("Orders");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/categories`);
        setCategories(response.data.categories); // Update state with fetched categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <View style={Style.headerContainer}>
        <Text style={Style.nameText}>{names[currentIndex]}'s Order</Text>
        <Text style={Style.subText}>Choose Category</Text>
      </View>

      <Category
        navigation={navigation}
        name={names[currentIndex]}
        categories={categories}
      />

      <Button
        text={names.length == currentIndex + 1 ? "Finish" : "Continue"}
        onPress={handleNextName}
        style={{
          alignSelf: "center",
        }}
      />
    </View>
  );
};

export default HomeScreen;
