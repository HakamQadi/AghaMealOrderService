import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const MealCard = ({ meal, onPress, width = 180 }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { width }]}
      onPress={() => onPress(meal)}
    >
      <Image source={{ uri: meal?.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardName} numberOfLines={2}>
          {meal?.name?.en}
        </Text>
        <Text style={styles.cardPrice}>{meal?.price}JD</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
    lineHeight: 20,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
});

export default MealCard;
