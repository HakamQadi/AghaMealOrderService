import { useState, useCallback } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useOrder } from "../context/OrderContext"
import { getOrderHistory } from "../services/api"
import { useFocusEffect } from "@react-navigation/native"
import { useAuth } from "../context/AuthContext"

const OrderHistoryScreen = ({ navigation }) => {
  const { orders, setOrders } = useOrder()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) {
        setIsLoggedIn(false)
        return
      }
      loadOrderHistory()
    }, [user]),
  )

  const loadOrderHistory = async () => {
    try {
      setLoading(true)
      setIsLoggedIn(true)

      const response = await getOrderHistory(user?.id)

      if (response?.count > 0) {
        const mappedOrders = response?.orders?.map((order) => ({
          ...order, // Keep all original fields
          displayId: order._id.slice(-5), // Short ID for display
          formattedDate: new Date(order.createdAt).toLocaleDateString(),
          status: order.isDelivered ? "Delivered" : "Preparing",
          itemCount: order.cartItems.length,
          orderType: order.type, // delivery or pickup
        }))
        setOrders(mappedOrders)
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error("Error loading order history:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "#4CAF50"
      case "preparing":
        return "#FF9800"
      case "on the way":
        return "#2196F3"
      case "cancelled":
        return "#F44336"
      default:
        return "#666"
    }
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "checkmark-circle"
      case "preparing":
        return "restaurant"
      case "on the way":
        return "car"
      case "cancelled":
        return "close-circle"
      default:
        return "time"
    }
  }

  const getOrderTypeIcon = (type) => {
    return type === "delivery" ? "bicycle" : "bag"
  }

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderItem} onPress={() => navigation.navigate("OrderDetails", { order: item })}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <View style={styles.orderTitleRow}>
            <Text style={styles.orderNumber}>Order #{item.displayId}</Text>
            <View style={styles.orderTypeContainer}>
              <Ionicons name={getOrderTypeIcon(item.orderType)} size={14} color="#666" />
              <Text style={styles.orderTypeText}>{item.orderType === "delivery" ? "Delivery" : "Pickup"}</Text>
            </View>
          </View>
          <Text style={styles.orderDate}>{item.formattedDate}</Text>
          <Text style={styles.customerName}>Customer: {item.name}</Text>
        </View>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons name={getStatusIcon(item.status)} size={16} color="#fff" />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.orderContent}>
        <View style={styles.itemsInfo}>
          <Text style={styles.itemCount}>{item.itemCount} items</Text>
          {item.discountAmount > 0 && (
            <Text style={styles.discountText}>Discount: ${item?.discountAmount?.toFixed(2)}</Text>
          )}
        </View>
        <Text style={styles.orderTotal}>${item?.totalPrice?.toFixed(2)}</Text>
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.contactInfo}>Contact: {item.contact}</Text>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  )

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="person-circle-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Sign in to view orders</Text>
          <Text style={styles.emptySubtitle}>Your past orders are just a tap away.</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() =>
              navigation.navigate("Auth", {
                screen: "Login",
                params: { redirectTo: "Orders" },
              })
            }
          >
            <Text style={styles.browseButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  if (orders.length === 0 && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>Your order history will appear here</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("Menu")}>
            <Text style={styles.browseButtonText}>Start Ordering</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Order History</Text>
        <Text style={styles.orderCount}>
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

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
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  orderCount: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  ordersList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  orderItem: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
    marginRight: 12,
  },
  orderTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  orderTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  orderTypeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  orderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
  },
  itemsInfo: {
    flex: 1,
  },
  itemCount: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  discountText: {
    fontSize: 13,
    color: "#4CAF50",
    fontWeight: "600",
    marginTop: 2,
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactInfo: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
})

export default OrderHistoryScreen

