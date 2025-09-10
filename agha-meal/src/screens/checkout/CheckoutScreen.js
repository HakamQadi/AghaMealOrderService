import { useContext } from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OrderContext } from "../../context/OrderContext";
import Button from "../../components/button/Button";
import Style from "./style";
import CheckoutItem from "../../components/UI/chekoutItem/CheckoutItem";

const CheckoutScreen = ({ navigation, route }) => {
  const { state } = useContext(OrderContext);
  const { deliveryCost } = route.params;

  // Function to group orders by item name
  const groupOrdersByName = () => {
    const ordersByName = {};
    state.order.forEach((order) => {
      const itemName = order.item.name.en;
      if (!ordersByName[itemName]) {
        // Initialize the entry with an empty array to hold all orders for this name
        ordersByName[itemName] = { count: 0, orders: [] };
      }
      // Accumulate count
      ordersByName[itemName].count += order.count;
      // Push the entire order object into the orders array
      ordersByName[itemName].orders.push(order);
    });
    return ordersByName;
  };

  // Get grouped orders
  const ordersByName = groupOrdersByName();

  // Calculate subtotal
  const calculateSubtotal = () => {
    let subtotal = 0;
    Object.values(ordersByName).forEach((order) => {
      order.orders.forEach((item) => {
        subtotal += item.count * item.item.price;
      });
    });
    return subtotal;
  };

  // Calculate total
  const calculateTotal = () => {
    let total = 0;
    total =
      Number.parseFloat(calculateSubtotal()) +
      Number.parseFloat(deliveryCost || 0);
    return total;
  };

  return (
    <SafeAreaView style={Style.container}>
      <View style={Style.headerContainer}>
        <Text style={Style.headerTitle}>Order Summary</Text>
        <Text style={Style.headerSubtitle}>Review your order details</Text>
      </View>
      <ScrollView
        style={Style.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Display checkout items grouped by name */}
        {Object.entries(ordersByName).map(([itemName, order]) => {
          const price = order.orders[0].item.price;
          return (
            <CheckoutItem
              key={itemName}
              name={itemName}
              count={order.count}
              price={price}
            />
          );
        })}
      </ScrollView>
      <View style={Style.summaryCard}>
        <Text style={Style.summaryTitle}>Order Total</Text>
        <View style={Style.detailsContainer}>
          <View style={Style.detailsRowContainer}>
            <Text style={Style.detailLabel}>Subtotal</Text>
            <Text style={Style.detailValue}>{calculateSubtotal()} JOD</Text>
          </View>
          <View style={Style.detailsRowContainer}>
            <Text style={Style.detailLabel}>Delivery</Text>
            <Text style={Style.detailValue}>
              {deliveryCost ? deliveryCost : 0} JOD
            </Text>
          </View>
          <View style={Style.dividerLine} />
          <View style={Style.detailsRowContainer}>
            <Text style={Style.totalLabel}>Total</Text>
            <Text style={Style.totalValue}>{calculateTotal()} JOD</Text>
          </View>
        </View>
      </View>
      <Button
        style={Style.button}
        text={"Complete Order"}
        onPress={async () => {
          try {
            await AsyncStorage.removeItem("orders");
            console.log("Orders cleared from AsyncStorage");
            navigation.navigate("Names");
          } catch (error) {
            // TODO replace with toast message
            console.error("Error clearing orders from AsyncStorage:", error);
          }
        }}
      />
    </SafeAreaView>
  );
};

export default CheckoutScreen;
