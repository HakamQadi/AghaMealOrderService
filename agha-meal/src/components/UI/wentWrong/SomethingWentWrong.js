import { View, Text } from "react-native";
import React from "react";
import Style from "./style";

export default function SomethingWentWrong({ message, style }) {
  return (
    <View style={Style.container}>
      <Text style={[Style.messageText, style]}>{message}</Text>
    </View>
  );
}
