import React, { useState } from "react";
import { View, TextInput, StyleSheet, Animated } from "react-native";

const InputField = () => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const outlineScaleX = new Animated.Value(0);
  const outlineScaleY = new Animated.Value(0);

  const animateOutline = (valueX, valueY) => {
    Animated.timing(outlineScaleX, {
      toValue: valueX,
      duration: 300,
      useNativeDriver: false,
    }).start();
    Animated.timing(outlineScaleY, {
      toValue: valueY,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  React.useEffect(() => {
    animateOutline(isFocused ? 1 : 0, isFocused ? 1 : 0);
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        placeholder="Enter Name"
        placeholderTextColor="#838584"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Animated.View
        style={[
          styles.outline,
          styles.bottom,
          { transform: [{ scaleX: outlineScaleX }] },
        ]}
      />
      <Animated.View
        style={[
          styles.outline,
          styles.right,
          { transform: [{ scaleY: outlineScaleY }] },
        ]}
      />
      <Animated.View
        style={[
          styles.outline,
          styles.top,
          { transform: [{ scaleX: outlineScaleX }] },
        ]}
      />
      <Animated.View
        style={[
          styles.outline,
          styles.left,
          { transform: [{ scaleY: outlineScaleY }] },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginBottom: 5,
  },
  input: {
    width: 20 * 16,
    color: "black",
    fontSize: 16,
    // backgroundColor: "hsl(236, 32%, 26%)",
    backgroundColor: "#D6D6D6",
    paddingVertical: 0.35 * 16,
    paddingHorizontal: 0.45 * 16,
    borderWidth: 1,
    borderColor: "#D6D6D6",
  },
  inputFocused: {
    // borderColor: "hsl(236, 32%, 26%)",
    // borderColor: "#EEA734",
  },
  outline: {
    position: "absolute",
    backgroundColor: "#EEA734",
  },
  bottom: {
    height: 1,
    left: 0,
    right: 0,
    bottom: 0,
  },
  right: {
    width: 1,
    top: 0,
    bottom: 0,
    right: 0,
  },
  top: {
    height: 1,
    left: 0,
    right: 0,
    top: 0,
  },
  left: {
    width: 1,
    top: 0,
    bottom: 0,
    left: 0,
  },
});

export default InputField;
