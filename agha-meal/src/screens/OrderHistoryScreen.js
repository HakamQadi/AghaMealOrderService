"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useOrder } from "../context/OrderContext"
import { fetchOrderHistory } from "../services/api"

const OrderHistoryScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const { orders, setOrders } = useOrder()

  useEffect(() => {
    loadOrderHistory()
  }, [])

  const loadOrderHistory = async () => {
    try {
      setLoading(true)
      const orderHistory = await fetchOrderHistory()
      setOrders(orderHistory)
    } catch (error) {
      console.error("Error loading order history:", error)
      // Fallback to mock data
      setOrders(mockOrders)
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

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderItem} onPress={() => navigation.navigate("OrderDetails", { order: item })}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>Order #{item.id}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons name={getStatusIcon(item.status)} size={16} color="#fff" />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.orderContent}>
        <Text style={styles.itemCount}>{item.items.length} items</Text>
        <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.restaurantName}>{item.restaurant}</Text>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No orders yet</Text>
      <Text style={styles.emptySubtitle}>Your order history will appear here</Text>
      <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("Menu")}>
        <Text style={styles.browseButtonText}>Start Ordering</Text>
      </TouchableOpacity>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    )
  }

  if (orders.length === 0) {
    return <SafeAreaView style={styles.container}>{renderEmptyState()}</SafeAreaView>
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

// Mock data for fallback
const mockOrders = [
  {
    id: 1001,
    date: "2024-01-15",
    status: "Delivered",
    total: 28.97,
    restaurant: "Agha Meal Kitchen",
    items: [
      { name: "Grilled Chicken", quantity: 1, price: 15.99 },
      { name: "Caesar Salad", quantity: 1, price: 9.99 },
      { name: "Chocolate Cake", quantity: 1, price: 6.99 },
    ],
  },
  {
    id: 1002,
    date: "2024-01-12",
    status: "Delivered",
    total: 12.99,
    restaurant: "Agha Meal Kitchen",
    items: [{ name: "Beef Burger", quantity: 1, price: 12.99 }],
  },
  {
    id: 1003,
    date: "2024-01-10",
    status: "Cancelled",
    total: 25.98,
    restaurant: "Agha Meal Kitchen",
    items: [{ name: "Grilled Chicken", quantity: 2, price: 15.99 }],
  },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  orderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemCount: {
    fontSize: 14,
    color: "#666",
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  restaurantName: {
    fontSize: 14,
    color: "#666",
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
