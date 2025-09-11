import { TouchableOpacity, Text, StyleSheet } from "react-native";
import styles from "./style";

const Button = ({ text, onPress, style, textStyle, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.buttonText,
          disabled && styles.buttonTextDisabled,
          textStyle,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
