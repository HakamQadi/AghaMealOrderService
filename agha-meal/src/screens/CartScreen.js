import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useOrder } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { createOrder } from "../services/api";
import CheckoutModal from "../components/modal/CheckoutModal";
import ConfirmDialog from "../components/dialog/ConfirmDialog";
import InfoDialog from "../components/dialog/infoDialog";

const CartScreen = ({ navigation }) => {
  const {
    cart,
    removeFromCart,
    clearCart,
    getCartTotal,
    addToCart,
    decreaseQuantity,
  } = useOrder();

  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState("pickup"); // default pickup
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState(null); // 'removeItem' | 'clearCart'
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [infoDialogData, setInfoDialogData] = useState({
    title: "",
    message: "",
    type: "info",
    onClose: null,
  });

  const handleRemoveItem = (itemId, itemName) => {
    setDialogType("removeItem");
    setSelectedItemId(itemId);
    setDialogMessage(
      `Are you sure you want to remove ${itemName.en} from your cart?`
    );
    setShowDialog(true);
  };

  // For clearing the cart
  const handleClearCart = () => {
    setDialogType("clearCart");
    setDialogMessage(
      "Are you sure you want to remove all items from your cart?"
    );
    setSelectedItemId(null);
    setShowDialog(true);
  };

  const confirmDialog = () => {
    if (dialogType === "removeItem" && selectedItemId) {
      removeFromCart(selectedItemId);
    } else if (dialogType === "clearCart") {
      clearCart();
    }

    // Reset dialog state
    setShowDialog(false);
    setSelectedItemId(null);
    setDialogType(null);
    setDialogMessage("");
  };

  const cancelDialog = () => {
    setShowDialog(false);
    setSelectedItemId(null);
    setDialogType(null);
    setDialogMessage("");
  };

  const showInfo = (title, message, type = "info", onClose = null) => {
    setInfoDialogData({
      title,
      message,
      type,
      onClose: onClose || (() => setShowInfoDialog(false)),
    });
    setShowInfoDialog(true);
  };

  const handleCheckout = async () => {
    // if (cart.length === 0) {
    if (cart.length === 0) {
      showInfo(
        "Empty Cart",
        "Please add items to your cart before checkout.",
        "info"
      );
      return;
    }

    if (isAuthenticated) {
      setShowCheckoutModal(true);
    } else {
      showInfo("Unauthorized", "Please login to place order.", "info", () => {
        setShowInfoDialog(false);
        navigation.navigate("Auth", {
          screen: "Login",
          params: { redirectTo: "Cart" },
        });
      });
    }
  };

  const handleConfirmOrder = async (customerInfo) => {
    try {
      setLoading(true);

      const orderData = {
        userId: user.id,
        contact: customerInfo.phone,
        name: customerInfo.name,
        type: orderType,
        cartItems: cart.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };
      const response = await createOrder(orderData);

      showInfo(
        "Success",
        `Order placed successfully!\nOrder ID: ${response?.orderId
          ?.slice(-5)
          ?.toUpperCase()}`,
        "success",
        () => {
          setShowInfoDialog(false);
          clearCart();
          setShowCheckoutModal(false);
          navigation.navigate("Menu");
        }
      );
    } catch (error) {
      showInfo(
        "Error",
        error.response?.data?.message || "Failed to place order.",
        "error"
      );
    } finally {
      setLoading(false);
    }
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Your Cart</Text>
        </View>
        <TouchableOpacity
          onPress={handleClearCart}
          style={styles.clearButton}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
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
          style={[styles.checkoutButton, loading && { opacity: 0.7 }]}
          onPress={handleCheckout}
          activeOpacity={0.8}
          disabled={loading}
        >
          <View style={styles.checkoutContent}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.checkoutButtonText}>
                  Proceed to Checkout
                </Text>
                <Ionicons name="arrow-forward" size={22} color="#fff" />
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <CheckoutModal
        visible={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onConfirm={handleConfirmOrder}
        user={user}
        orderType={orderType}
        setOrderType={setOrderType}
        cartTotal={getCartTotal()}
        loading={loading}
      />
      <ConfirmDialog
        visible={showDialog}
        title={dialogType === "removeItem" ? "Remove Item" : "Clear Cart"}
        message={dialogMessage}
        confirmText={dialogType === "removeItem" ? "Remove" : "Clear All"}
        cancelText="Cancel"
        confirmStyle="destructive"
        onConfirm={confirmDialog}
        onCancel={cancelDialog}
      />
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
    backgroundColor: "#fff",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
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
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "#fff",
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
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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

  // Type input
  inputContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  label: { fontSize: 16, fontWeight: "600", color: "#1C1C1E", marginBottom: 8 },
  typeContainer: { flexDirection: "row", gap: 12 },
  typeButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  typeButtonActive: { backgroundColor: "#FF6B6B", borderColor: "#FF6B6B" },
  typeButtonText: { fontSize: 16, fontWeight: "600", color: "#8E8E93" },
  typeButtonTextActive: { color: "#FFFFFF" },
});

export default CartScreen;
