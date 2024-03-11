import { View, Text } from "react-native";
import React from "react";
import Style from "./style";

export default function CheckoutItem({ id, name, count, price }) {
  return (
    <View>
      <View style={Style.itemContainer}>
        <View style={Style.itemDetailsContainer}>
          <View style={Style.countContainer}>
            <Text style={Style.textColorYellow}>{count}</Text>
          </View>
          <Text>{name}</Text>
        </View>
        <Text style={Style.textColorYellow}>{price} JOD</Text>
      </View>
      <View style={Style.divider}></View>
    </View>
  );
}
