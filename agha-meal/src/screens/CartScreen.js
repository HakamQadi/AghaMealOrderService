import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useOrder } from "../context/OrderContext";

const CartScreen = ({ navigation }) => {
  const {
    cart,
    removeFromCart,
    clearCart,
    getCartTotal,
    addToCart,
    decreaseQuantity,
  } = useOrder();

  const handleRemoveItem = (itemId, itemName) => {
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove ${itemName} from your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFromCart(itemId),
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: clearCart },
      ]
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert(
        "Empty Cart",
        "Please add items to your cart before checkout."
      );
      return;
    }
    Alert.alert(
      "Checkout",
      `Total: $${getCartTotal().toFixed(2)}\n\nProceed to checkout?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Checkout",
          onPress: () => {
            Alert.alert("Success", "Order placed successfully!");
            clearCart();
            navigation.navigate("Home");
          },
        },
      ]
    );
  };

  const updateQuantity = (item, change) => {
    if (change > 0) {
      addToCart(item);
    } else if (item.quantity > 1) {
      decreaseQuantity(item._id);
    } else {
      removeFromCart(item._id);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemImageContainer}>
        <Image source={{ uri: item.image }} style={styles.cartItemImage} />
      </View>

      <View style={styles.cartItemContent}>
        <View style={styles.cartItemHeader}>
          <View style={styles.cartItemInfo}>
            <Text style={styles.cartItemName} numberOfLines={2}>
              {item.name.en}
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.cartItemPrice}>${item.price}</Text>
              <Text style={styles.priceLabel}>per item</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleRemoveItem(item._id, item.name)}
            style={styles.removeButton}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        <View style={styles.cartItemFooter}>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Qty:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[styles.quantityButton, styles.quantityButtonLeft]}
                onPress={() => updateQuantity(item, -1)}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={18} color="#666" />
              </TouchableOpacity>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{item.quantity}</Text>
              </View>
              <TouchableOpacity
                style={[styles.quantityButton, styles.quantityButtonRight]}
                onPress={() => updateQuantity(item, 1)}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={18} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.cartItemTotal}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.cartItemTotalText}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="bag-outline" size={100} color="#e0e0e0" />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some delicious meals to get started
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate("Menu")}
            activeOpacity={0.8}
          >
            <Ionicons name="restaurant-outline" size={20} color="#fff" />
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Cart</Text>
        <View style={{ padding: 12 }}>
          <View style={{ width: 24, height: 24 }} />
        </View>
      </View>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={styles.itemCount}>
            <Text style={styles.itemCountText}>{cart.length} items</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleClearCart}
          style={styles.clearButton}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => item?._id}
        contentContainerStyle={styles.cartList}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />

      <View style={styles.footer}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal ({cart.length} items)
            </Text>
            <Text style={styles.summaryValue}>
              ${getCartTotal().toFixed(2)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>${getCartTotal().toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
          activeOpacity={0.8}
        >
          <View style={styles.checkoutContent}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            <Ionicons name="arrow-forward" size={22} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  itemCount: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  itemCountText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff5f5",
    borderWidth: 1,
    borderColor: "#ffe0e0",
  },
  clearAllText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "600",
    marginLeft: 6,
  },
  cartList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  itemSeparator: {
    height: 16,
  },
  cartItem: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f8f9fa",
  },
  cartItemImageContainer: {
    flex: 0.3,
    borderRadius: 12,
    overflow: "hidden",
  },
  cartItemImage: {
    flex: 1,
    borderRadius: 12,
    objectFit: "cover",
  },
  cartItemContent: {
    flex: 0.7,
    padding: 20,
  },
  cartItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cartItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    lineHeight: 24,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  cartItemPrice: {
    fontSize: 18,
    color: "#FF6B6B",
    fontWeight: "700",
  },
  priceLabel: {
    fontSize: 12,
    color: "#999",
    marginLeft: 6,
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fff5f5",
  },
  cartItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginRight: 12,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    overflow: "hidden",
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  quantityButtonLeft: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  quantityButtonRight: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  quantityDisplay: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e9ecef",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    minWidth: 20,
    textAlign: "center",
  },
  cartItemTotal: {
    alignItems: "flex-end",
  },
  totalLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
    marginBottom: 4,
  },
  cartItemTotalText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryContainer: {
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "600",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FF6B6B",
  },
  checkoutButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 16,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginRight: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  browseButton: {
    backgroundColor: "#FF6B6B",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
});

export default CartScreen;
