import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useOrder } from "../context/OrderContext"

const CartScreen = ({ navigation }) => {
  const { cart, removeFromCart, clearCart, getCartTotal, addToCart } = useOrder()

  const handleRemoveItem = (itemId, itemName) => {
    Alert.alert("Remove Item", `Are you sure you want to remove ${itemName} from your cart?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeFromCart(itemId) },
    ])
  }

  const handleClearCart = () => {
    Alert.alert("Clear Cart", "Are you sure you want to remove all items from your cart?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", style: "destructive", onPress: clearCart },
    ])
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart before checkout.")
      return
    }

    Alert.alert("Checkout", `Total: $${getCartTotal().toFixed(2)}\n\nProceed to checkout?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Checkout",
        onPress: () => {
          // Here you would typically navigate to a checkout screen
          // or process the order
          Alert.alert("Success", "Order placed successfully!")
          clearCart()
          navigation.navigate("Home")
        },
      },
    ])
  }

  const updateQuantity = (item, change) => {
    if (change > 0) {
      addToCart(item)
    } else if (item.quantity > 1) {
      // Decrease quantity logic would go here
      // For now, we'll just remove the item if quantity becomes 0
    } else {
      removeFromCart(item.id)
    }
  }

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
      <View style={styles.cartItemContent}>
        <View style={styles.cartItemHeader}>
          <Text style={styles.cartItemName}>{item.name.en}</Text>
          <TouchableOpacity onPress={() => handleRemoveItem(item.id, item.name)} style={styles.removeButton}>
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
        <Text style={styles.cartItemPrice}>${item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item, -1)}>
            <Ionicons name="remove" size={20} color="#666" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item, 1)}>
            <Ionicons name="add" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.cartItemTotal}>
        <Text style={styles.cartItemTotalText}>${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
    </View>
  )

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bag-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>Add some delicious meals to get started</Text>
      <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("Menu")}>
        <Text style={styles.browseButtonText}>Browse Menu</Text>
      </TouchableOpacity>
    </View>
  )

  if (cart.length === 0) {
    return <SafeAreaView style={styles.container}>{renderEmptyCart()}</SafeAreaView>
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart ({cart.length} items)</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart}
        renderItem={renderCartItem}
        // keyExtractor={(item) => item?.id}
        keyExtractor={(item) => item?._id?.toString()}
        contentContainerStyle={styles.cartList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${getCartTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  clearAllText: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  cartList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cartItemContent: {
    flex: 1,
    marginLeft: 16,
  },
  cartItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  cartItemPrice: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "500",
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginHorizontal: 16,
  },
  cartItemTotal: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  cartItemTotalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  checkoutButton: {
    backgroundColor: "#FF6B6B",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
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

export default CartScreen
