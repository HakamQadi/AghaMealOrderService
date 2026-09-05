import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { reorder, cancelOwnOrder } from "../services/api";
import ReviewModal from "../components/modal/ReviewModal";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_ICONS,
  statusOf,
  canCancel,
} from "../utils/orderStatus";
import ReorderModal from "../components/modal/ReorderModal";
import { useState } from "react";
import InfoDialog from "../components/dialog/infoDialog";

const OrderDetailsScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const { format } = useSettings();

  const [order, setOrder] = useState(route.params.order);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const currentStatus = statusOf(order);


  const [showReorderModal, setShowReorderModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [infoDialogData, setInfoDialogData] = useState({
    title: "",
    message: "",
    type: "info",
    onClose: null,
  });

  const showInfo = (title, message, type = "info", onClose = null) => {
    setInfoDialogData({
      title,
      message,
      type,
      onClose: onClose || (() => setShowInfoDialog(false)),
    });
    setShowInfoDialog(true);
  };

  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      const response = await cancelOwnOrder(order._id);
      setOrder(response.order ?? { ...order, status: "cancelled" });
      showInfo("Order cancelled", "Your order has been cancelled.", "success");
    } catch (error) {
      showInfo(
        "Could not cancel",
        error.response?.data?.message ||
          "This order can no longer be cancelled. Please call the restaurant.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => STATUS_COLORS[status] ?? "#666";
  const getStatusIcon = (status) => STATUS_ICONS[status] ?? "time";

  const getOrderTypeIcon = (type) => {
    return type === "delivery" ? "bicycle" : "bag";
  };

  const handleReorderConfirm = async ({ type }) => {
    setLoading(true);
    try {
      const orderId = order?._id;
      const userId = user?.id;

      await reorder({ orderId, userId, type });
      setShowReorderModal(false);

      showInfo("Success", `Reorder created successfully`, "success", () => {
        setShowInfoDialog(false);
        navigation.goBack();
      });
    } catch (err) {
      console.error("Failed to reorder:", err);
      showInfo("Failed to reorder", `Please try again later`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = () => {
    // Navigate to order tracking screen
    console.log("Track order:", order._id);
  };

  // The fee used to be a hardcoded 1 keyed off `order.orderType` — a field
  // that does not exist on an order (it is `type`) — so it was always 0 and
  // never matched what the server stored. Both now come from the order.
  const deliveryFee = order.deliveryFee ?? 0;
  const subtotal = order.subtotal ?? order.totalPrice;
  const finalTotal = order.totalPrice;

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
              { backgroundColor: getStatusColor(currentStatus) },
            ]}
          >
            <Ionicons
              name={getStatusIcon(currentStatus)}
              size={24}
              color="#fff"
            />
            <Text style={styles.statusText}>{STATUS_LABELS[currentStatus]}</Text>
          </View>
          <Text style={styles.orderNumber}>
            Order #{order.displayId.toUpperCase()}
          </Text>
          <Text style={styles.orderDate}>Placed on {order.formattedDate}</Text>

          <View style={styles.orderTypeIndicator}>
            <Ionicons
              name={getOrderTypeIcon(order.type)}
              size={20}
              color="#FF6B6B"
            />
            <Text style={styles.orderTypeText}>
              {order.type === "delivery"
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
                <Text style={styles.itemPrice}>{format(item.price)}</Text>
                <Text style={styles.itemTotal}>
                  {format(item.price * item.quantity)}
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
              {format(subtotal)}
            </Text>
          </View>

          {order.discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.discountLabel]}>
                Discount
              </Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -{format(order.discountAmount)}
              </Text>
            </View>
          )}

          {order.type === "delivery" && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>{format(deliveryFee)}</Text>
            </View>
          )}

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{format(finalTotal)}</Text>
          </View>
        </View>

        {order.type === "delivery" && order.location?.address && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressBox}>
              <Ionicons name="location-outline" size={18} color="#FF6B6B" />
              <View style={styles.addressTextWrap}>
                <Text style={styles.addressText}>{order.location.address}</Text>
                {!!order.location.note && (
                  <Text style={styles.addressNote}>{order.location.note}</Text>
                )}
              </View>
            </View>
          </View>
        )}

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
                {order.type === "delivery" ? "Delivery" : "Pickup"}
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
          {canCancel(currentStatus) && (
            <TouchableOpacity
              style={styles.cancelOrderButton}
              onPress={handleCancelOrder}
              disabled={loading}
            >
              <Ionicons name="close-circle-outline" size={20} color="#fff" />
              <Text style={styles.trackButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          )}

          {currentStatus === "completed" && !hasReviewed && (
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => setShowReviewModal(true)}
            >
              <Ionicons name="star-outline" size={20} color="#fff" />
              <Text style={styles.trackButtonText}>Rate this order</Text>
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
      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        order={order}
        onSubmitted={() => setHasReviewed(true)}
      />

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
      <InfoDialog
        visible={showInfoDialog}
        title={infoDialogData.title}
        message={infoDialogData.message}
        type={infoDialogData.type}
        onClose={infoDialogData.onClose}
      />
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
  addressBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#fff5f5",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ffe0e0",
  },
  addressTextWrap: { flex: 1 },
  addressText: { fontSize: 14, color: "#1a1a1a", lineHeight: 20 },
  addressNote: { fontSize: 12, color: "#8E8E93", marginTop: 4, fontStyle: "italic" },
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
  reviewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFB300",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  cancelOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F44336",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
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
