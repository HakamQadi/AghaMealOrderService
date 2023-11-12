import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

const InputField = () => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Input Outline"
        placeholderTextColor="hsla(0, 0%, 100%, 0.6)"
      />
      <View style={[styles.outline, styles.bottom]} />
      <View style={[styles.outline, styles.right]} />
      <View style={[styles.outline, styles.top]} />
      <View style={[styles.outline, styles.left]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  input: {
    width: 6.5 * 16, // Assuming 1em = 16 pixels
    color: "white",
    fontSize: 16,
    // fontFamily: "inherit",
    backgroundColor: "hsl(236, 32%, 26%)",
    paddingVertical: 0.35 * 16, // 0.35em
    paddingHorizontal: 0.45 * 16, // 0.45em
    borderWidth: 1,
    borderColor: "transparent",
    transition: "background-color 0.3s ease-in-out",
    outline: "none",
  },
  outline: {
    position: "absolute",
    backgroundColor: "#3cefff",
    transition: "transform 0.5s ease",
  },
  bottom: {
    height: 1,
    left: 0,
    right: 0,
    transform: [{ scaleX: 0 }],
    transformOrigin: "bottom right",
    bottom: 0,
  },
  right: {
    width: 1,
    top: 0,
    bottom: 0,
    transform: [{ scaleY: 0 }],
    transformOrigin: "top right",
    right: 0,
  },
  top: {
    height: 1,
    left: 0,
    right: 0,
    transform: [{ scaleX: 0 }],
    transformOrigin: "top left",
    top: 0,
  },
  left: {
    width: 1,
    top: 0,
    bottom: 0,
    transform: [{ scaleY: 0 }],
    transformOrigin: "bottom left",
    left: 0,
  },
  inputFocused: {
    borderColor: "hsl(236, 32%, 26%)", // Adjust the color accordingly
  },
});

export default InputField;
