"use client";

import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

const CheckoutSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name cannot be empty"),
  phone: Yup.string()
    .trim()
    .required("Phone cannot be empty")
    .length(10, "Phone must be exactly 10 digits"),
});

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
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isPhoneEditable, setIsPhoneEditable] = useState(false);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* <View style={styles.modalOverlay}> */}
        <View
          style={[
            styles.modalOverlay,
            keyboardVisible && styles.modalOverlayKeyboard,
          ]}
        >
          {/* <View style={styles.modalContainer}> */}
          <View
            style={[
              styles.modalContainer,
              keyboardVisible && {
                maxHeight: "80%",
                marginBottom: keyboardHeight * 0.1,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Checkout</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Formik
                enableReinitialize
                initialValues={{
                  name: user?.name || "",
                  phone: user?.phone || "",
                }}
                validationSchema={CheckoutSchema}
                onSubmit={(values) => {
                  onConfirm(values);
                }}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
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
                          value={values.name}
                          onChangeText={handleChange("name")}
                          onBlur={handleBlur("name")}
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
                      {errors.name && touched.name && (
                        <Text style={styles.formikErrorText}>
                          {errors.name}
                        </Text>
                      )}
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
                          value={values.phone}
                          onChangeText={handleChange("phone")}
                          onBlur={handleBlur("phone")}
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
                      {errors.phone && touched.phone && (
                        <Text style={styles.formikErrorText}>
                          {errors.phone}
                        </Text>
                      )}
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
                              orderType === "pickup" &&
                                styles.typeButtonTextActive,
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
                              orderType === "delivery" &&
                                styles.typeButtonTextActive,
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
                      <Text style={styles.totalAmount}>
                        ${cartTotal.toFixed(2)}
                      </Text>
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
                        style={[
                          styles.confirmButton,
                          loading && { opacity: 0.7 },
                        ]}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                        disabled={loading}
                      >
                        <View style={styles.confirmButtonContent}>
                          {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <>
                              <Text style={styles.confirmButtonText}>
                                Place Order
                              </Text>
                              <Ionicons
                                name="checkmark"
                                size={20}
                                color="#fff"
                              />
                            </>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Formik>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalOverlayKeyboard: {
    justifyContent: "flex-start",
    paddingTop: 50,
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
  formikErrorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default CheckoutModal;
