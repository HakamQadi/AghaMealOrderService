import { View, Text } from "react-native";
import React from "react";
import Style from "./style";

export default function CheckoutItem({ order }) {
  return (
    <View>
      {order.map((item, index) => (
        <View key={index}>
          <View style={Style.itemContainer}>
            <View style={Style.itemDetailsContainer}>
              <View style={Style.countContainer}>
                <Text style={Style.textColorYellow}>{item.count}</Text>
              </View>
              <Text>{item.item.meal}</Text>
            </View>
            <Text style={Style.textColorYellow}>
              {item.count * item.item.price} JOD
            </Text>
          </View>
          <View style={Style.divider}></View>
        </View>
      ))}
    </View>
  );
}
