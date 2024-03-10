import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Style from "./style.js";

export default function Button({ onPress, style, isDisabled, text }) {
  return (
    <View style={[Style.continueBtnContainer, style]}>
      <TouchableOpacity
        disabled={isDisabled}
        style={isDisabled ? Style.disabledButton : Style.continueBtn}
        onPress={onPress}
      >
        <Text style={Style.continueBtnText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}
