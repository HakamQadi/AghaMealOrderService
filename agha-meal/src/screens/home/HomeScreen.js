// TODO future apdate : add more than one resturant

import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Category from "../../components/category/Category";
import Button from "../../components/button/Button";
import Style from "./style";
import { OrderContext } from "../../context/OrderContext";

const HomeScreen = ({ navigation, route }) => {
  const { state } = useContext(OrderContext);

  console.log("HOME STATE ::: ", state);

  const { names } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNextName = () => {
    if (names.length == currentIndex + 1) {
      console.log("*****************LAST ONE*****************");
      // navigate to ALl orders screen
      navigation.navigate("Orders");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={Style.headerContainer}>
        <Text style={Style.nameText}>{names[currentIndex]}'s Order</Text>
        <Text style={Style.subText}>Choose Category</Text>
      </View>

      <Category navigation={navigation} name={names[currentIndex]} />

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
