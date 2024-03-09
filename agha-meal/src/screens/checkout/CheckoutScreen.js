import React, { useContext } from "react";
import { View, Text, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OrderContext } from "../../context/OrderContext";
import Button from "../../components/button/Button";
import Style from "./style";
import CheckoutItem from "../../components/UI/chekoutItem/CheckoutItem";

const CheckoutScreen = ({ navigation }) => {
  const { state } = useContext(OrderContext);

  // Function to group orders by item name
  const groupOrdersByName = () => {
    const ordersByName = {};
    state.order.forEach((order) => {
      const itemName = order.item.name;
      if (!ordersByName[itemName]) {
        ordersByName[itemName] = { ...order, count: 0 };
      }
      ordersByName[itemName].count += order.count;
    });
    return ordersByName;
  };

  // Get grouped orders
  const ordersByName = groupOrdersByName();

  // Calculate subtotal
  const calculateSubtotal = () => {
    let subtotal = 0;
    Object.values(ordersByName).forEach((order) => {
      subtotal += order.count * order.item.price;
    });
    return subtotal;
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={Style.listContainer}>
        {/* Display checkout items grouped by name */}
        {Object.entries(ordersByName).map(([itemName, order]) => (
          <CheckoutItem
            key={itemName}
            name={itemName}
            count={order.count}
            price={order.item.price * order.count}
          />
        ))}
      </ScrollView>
      <View style={Style.detailsContainer}>
        <View style={Style.detailsRowContainer}>
          <Text>Subtotal</Text>
          <Text>{calculateSubtotal()} JOD</Text>
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
    </View>
  );
};

export default CheckoutScreen;
