import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const OrderDetailsScreen = ({ route, navigation }) => {
  const { order } = route.params;

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

  const handleReorder = () => {
    // Add all items from this order to cart
    navigation.navigate("Menu");
  };

  const handleTrackOrder = () => {
    // Navigate to order tracking screen
    console.log("Track order:", order.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
          <Text style={styles.orderNumber}>Order #{order.id}</Text>
          <Text style={styles.orderDate}>Placed on {order.date}</Text>
        </View>

        {/* Restaurant Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurant</Text>
          <View style={styles.restaurantInfo}>
            <Ionicons name="restaurant" size={20} color="#FF6B6B" />
            <Text style={styles.restaurantName}>{order.restaurant}</Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                {/* ${(item.price * item.quantity).toFixed(2)} */}
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              </Text>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${order.total.toFixed(2)}</Text>
          </View>
          {/* TODO show it only if order type is delivery and get the amount from the backend */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>$2.99</Text>
          </View>
          {/* <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${(order.total * 0.08).toFixed(2)}</Text>
          </View> */}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ${order.total.toFixed(2)}
              {/* ${(order.total + 2.99 + order.total * 0.08).toFixed(2)} */}
            </Text>
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
            onPress={handleReorder}
          >
            <Ionicons name="refresh" size={20} color="#FF6B6B" />
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  statusSection: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#f8f9fa",
    marginBottom: 20,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  restaurantInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  restaurantName: {
    fontSize: 16,
    color: "#1a1a1a",
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
  },
  itemPrice: {
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
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
