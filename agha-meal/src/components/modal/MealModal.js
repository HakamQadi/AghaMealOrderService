import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOrder } from "../../context/OrderContext";

const MealModal = ({ visible, onClose, meal }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useOrder();

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    quantity > 1 && setQuantity((prev) => prev - 1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(meal);
    Alert.alert(
      "Added to Cart",
      `${quantity} x ${meal.name.en} has been added to your cart!`
    );
    onClose();
    setQuantity(1);
  };

  if (!meal) return null;

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <TouchableOpacity
        onPress={onClose}
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
      />
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#1a1a1a" />
          </TouchableOpacity>

          <Image source={{ uri: meal.image }} style={styles.modalImage} />
          <Text style={styles.modalItemName}>{meal.name.en}</Text>

          <View style={styles.modalBottomSection}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decreaseQuantity}
              >
                <Ionicons name="remove" size={20} color="#FF6B6B" />
              </TouchableOpacity>

              <Text style={styles.quantityText}>{quantity}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={increaseQuantity}
              >
                <Ionicons name="add" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
            >
              <Text style={styles.addToCartText}>
                Add to Cart {(meal.price * quantity).toFixed(2)}JD
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalContent: {
    backgroundColor: "#fff",
    // backgroundColor: "red",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    // paddingBottom: Platform.OS == "ios" ? 50 : 25,
    paddingBottom: 50,
    minHeight: 400,
  },
  closeButton: { alignSelf: "flex-end", padding: 8, marginBottom: 10 },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalItemName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  modalBottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 25,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginHorizontal: 20,
  },
  addToCartButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    flex: 1,
    marginLeft: 20,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MealModal;
