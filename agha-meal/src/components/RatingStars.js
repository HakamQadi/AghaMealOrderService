import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * Five-star rating. Read-only when no `onChange` is given, so the same
 * component renders both the input and the displayed score.
 */
const RatingStars = ({ value = 0, onChange, size = 28, style }) => (
  <View style={[styles.row, style]}>
    {[1, 2, 3, 4, 5].map((star) => {
      const filled = star <= Math.round(value);
      const Wrapper = onChange ? TouchableOpacity : View;
      return (
        <Wrapper
          key={star}
          onPress={onChange ? () => onChange(star) : undefined}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        >
          <Ionicons
            name={filled ? "star" : "star-outline"}
            size={size}
            color={filled ? "#FFB300" : "#C7C7CC"}
          />
        </Wrapper>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 4, alignItems: "center" },
});

export default RatingStars;
