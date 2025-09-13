"use client";

import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const CheckoutModal = ({
  visible,
  onClose,
  onConfirm,
  user,
  orderType,
  setOrderType,
  cartTotal,
  loading,
}) => {
  const [editableName, setEditableName] = useState(user?.name || "");
  const [editablePhone, setEditablePhone] = useState(user?.phone || "");
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isPhoneEditable, setIsPhoneEditable] = useState(false);

  const handleConfirm = () => {
    const trimmedName = editableName.trim();
    const trimmedPhone = editablePhone.trim();

    if (!trimmedName) {
      alert("Name cannot be empty");
      return;
    }

    if (!trimmedPhone) {
      alert("Phone cannot be empty");
      return;
    }

    if (trimmedPhone.length !== 10) {
      alert("Phone must be 10 characters long");
      return;
    }

    onConfirm({
      name: editableName,
      phone: editablePhone,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Checkout</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[
                    styles.input,
                    !isNameEditable && styles.inputDisabled,
                  ]}
                  value={editableName}
                  onChangeText={setEditableName}
                  editable={isNameEditable}
                  placeholder="Enter your name"
                />
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsNameEditable(!isNameEditable)}
                >
                  <Ionicons
                    name={isNameEditable ? "checkmark" : "pencil"}
                    size={18}
                    color="#FF6B6B"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[
                    styles.input,
                    !isPhoneEditable && styles.inputDisabled,
                  ]}
                  value={editablePhone}
                  onChangeText={setEditablePhone}
                  editable={isPhoneEditable}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsPhoneEditable(!isPhoneEditable)}
                >
                  <Ionicons
                    name={isPhoneEditable ? "checkmark" : "pencil"}
                    size={18}
                    color="#FF6B6B"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Order Type */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Order Type</Text>
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
            </View>

            {/* Total */}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>${cartTotal.toFixed(2)}</Text>
            </View>
          </View>

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
                    <Text style={styles.confirmButtonText}>Place Order</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#666",
  },
  editButton: {
    marginLeft: 12,
    padding: 12,
    backgroundColor: "#fff5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffe0e0",
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
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
    color: "#FFFFFF",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FF6B6B",
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
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
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginRight: 8,
  },
});

export default CheckoutModal;
