import React from "react";
import { View, Text } from "react-native";
import Style from "./style";

export default function OrderItem({ item, count, totalItemPrice }) {
  return (
    <View style={Style.itemContainer}>
      <View style={Style.itemNameContainer}>
        <Text>{item.name}</Text>
        <Text> X {count}</Text>
      </View>
      <View style={Style.itemDetailsContainer}>
        <Text style={Style.detailsText}>Price {item.price}</Text>
        <Text style={Style.detailsText}>Total Price: {totalItemPrice}</Text>
      </View>
    </View>
  );
}
