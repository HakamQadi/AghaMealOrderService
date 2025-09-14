import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { reorder } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ReorderModal from "../components/modal/ReorderModal";
import { useState } from "react";

const OrderDetailsScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const { user } = useAuth();

  const [showReorderModal, setShowReorderModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "#4CAF50";
      case "preparing":
        return "#FF9800";
      case "on the way":
        return "#2196F3";
      case "cancelled":
        return "#F44336";
      default:
        return "#666";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "checkmark-circle";
      case "preparing":
        return "restaurant";
      case "on the way":
        return "car";
      case "cancelled":
        return "close-circle";
      default:
        return "time";
    }
  };

  const getOrderTypeIcon = (type) => {
    return type === "delivery" ? "bicycle" : "bag";
  };

  const handleReorderConfirm = async ({ type }) => {
    setLoading(true);
    try {
      const orderId = order?._id;
      const userId = user?.id;

      const response = await reorder({ orderId, userId, type });
      alert("Reorder created successfully!");

      setShowReorderModal(false);
      navigation.goBack();
    } catch (err) {
      console.error("Failed to reorder:", err);
      alert("Failed to reorder. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = () => {
    // Navigate to order tracking screen
    console.log("Track order:", order._id);
  };

  const deliveryFee = order.orderType === "delivery" ? 1 : 0;
  const finalTotal = order.totalPrice + deliveryFee;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.screenTitle}>Order History</Text>
          </View>

          <View style={styles.clearButton}></View>
        </View>

        {/* Order Status */}
        <View style={styles.statusSection}>
          <View
            style={[
              styles.statusContainer,
              { backgroundColor: getStatusColor(order.status) },
            ]}
          >
            <Ionicons
              name={getStatusIcon(order.status)}
              size={24}
              color="#fff"
            />
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
          <Text style={styles.orderNumber}>
            Order #{order.displayId.toUpperCase()}
          </Text>
          <Text style={styles.orderDate}>Placed on {order.formattedDate}</Text>

          <View style={styles.orderTypeIndicator}>
            <Ionicons
              name={getOrderTypeIcon(order.orderType)}
              size={20}
              color="#FF6B6B"
            />
            <Text style={styles.orderTypeText}>
              {order.orderType === "delivery"
                ? "Delivery Order"
                : "Pickup Order"}
            </Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.customerInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={20} color="#FF6B6B" />
              <Text style={styles.infoText}>{order.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={20} color="#FF6B6B" />
              <Text style={styles.infoText}>{order.contact}</Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.cartItems.map((item, index) => (
            <View key={item._id || index} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name.en}</Text>
                {/* <Text style={styles.itemNameArabic}>{item.name.ar}</Text> */}
                <Text style={styles.itemQuantity}>
                  Quantity: {item.quantity}
                </Text>
              </View>
              <View style={styles.itemPricing}>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                <Text style={styles.itemTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ${order.totalPrice.toFixed(2)}
            </Text>
          </View>

          {order.discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.discountLabel]}>
                Discount
              </Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -${order.discountAmount.toFixed(2)}
              </Text>
            </View>
          )}

          {order.orderType === "delivery" && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
          )}

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.metadataContainer}>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Order ID:</Text>
              <Text style={styles.metadataValue}>
                {order._id.slice(-5).toUpperCase()}
              </Text>
            </View>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Order Type:</Text>
              <Text style={styles.metadataValue}>
                {order.orderType === "delivery" ? "Delivery" : "Pickup"}
              </Text>
            </View>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Created:</Text>
              <Text style={styles.metadataValue}>
                {new Date(order.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {order.status.toLowerCase() !== "delivered" &&
            order.status.toLowerCase() !== "cancelled" && (
              <TouchableOpacity
                style={styles.trackButton}
                onPress={handleTrackOrder}
              >
                <Ionicons name="location" size={20} color="#fff" />
                <Text style={styles.trackButtonText}>Track Order</Text>
              </TouchableOpacity>
            )}

          <TouchableOpacity
            style={styles.reorderButton}
            onPress={() => setShowReorderModal(true)}
          >
            <Ionicons name="refresh" size={20} color="#FF6B6B" />
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Reorder Modal */}
      {showReorderModal && (
        <ReorderModal
          visible={showReorderModal}
          onClose={() => setShowReorderModal(false)}
          order={order}
          loading={loading}
          onReorderConfirm={handleReorderConfirm}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 8,
  },
  clearButton: {
    padding: 20,
    borderRadius: 12,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusSection: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#fff",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  orderNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  orderTypeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  orderTypeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B6B",
  },
  section: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  customerInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  itemNameArabic: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    fontStyle: "italic",
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  itemPricing: {
    alignItems: "flex-end",
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B6B",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  discountLabel: {
    color: "#4CAF50",
  },
  discountValue: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 16,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  metadataContainer: {
    gap: 12,
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metadataLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  metadataValue: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  trackButton: {
    backgroundColor: "#FF6B6B",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  reorderButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FF6B6B",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  reorderButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B6B",
  },
});

export default OrderDetailsScreen;
