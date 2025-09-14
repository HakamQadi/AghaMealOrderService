"use client";

import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const ReorderModal = ({
  visible,
  onClose,
  order,
  onReorderConfirm, // will call reorder API
  loading,
}) => {
  const [orderType, setOrderType] = useState(order?.type || "");

  const handleConfirm = () => {
    onReorderConfirm({
      type: orderType,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.name.en}</Text>
        <Text style={styles.itemSub}>{item.quantity} × ${item.price}</Text>
      </View>
      <Text style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Reorder</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Items list */}
          <FlatList
            data={order?.cartItems || []}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            style={{ maxHeight: 250 }}
          />

          {/* Order type */}
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                orderType === "pickup" && styles.typeButtonActive,
              ]}
              onPress={() => setOrderType("pickup")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  orderType === "pickup" && styles.typeButtonTextActive,
                ]}
              >
                Pickup
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                orderType === "delivery" && styles.typeButtonActive,
              ]}
              onPress={() => setOrderType("delivery")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  orderType === "delivery" && styles.typeButtonTextActive,
                ]}
              >
                Delivery
              </Text>
            </TouchableOpacity>
          </View>

          {/* Total */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${order?.totalPrice?.toFixed(2)}</Text>
          </View>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, loading && { opacity: 0.7 }]}
              onPress={handleConfirm}
              activeOpacity={0.8}
              disabled={loading}
            >
              <View style={styles.confirmButtonContent}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  closeButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingHorizontal: 20,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  itemSub: {
    fontSize: 14,
    color: "#777",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF6B6B",
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  typeButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  typeButtonActive: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF6B6B",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  confirmButton: {
    flex: 2,
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
  },
  confirmButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginRight: 8,
  },
});

export default ReorderModal;
