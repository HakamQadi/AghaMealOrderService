import React, { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { OrderContext } from "../../context/OrderContext";
import Button from "../../components/button/Button";
import OrderItem from "../../components/orderItem/OrderItem";
import Style from "./style";
import SomethingWentWrong from "../../components/UI/wentWrong/SomethingWentWrong";

export default function AllOrdersScreen({ navigation }) {
  const { state } = useContext(OrderContext);
  const [deliveryCost, setDeliveryCost] = useState("");
  const [deliveryCostPerName, setDeliveryCostPerName] = useState("");
  const [totalPrices, setTotalPrices] = useState({});
  const [isEmptyOrders, setIsEmptyOrders] = useState(false);

  const nameCount = state.names.length;

  const handleDeliveryCost = (cost) => {
    setDeliveryCostPerName(parseFloat(cost) / nameCount);
    setDeliveryCost(cost);
  };


  const handleCompleteOrder = () => {
    navigation.navigate("Checkout", { deliveryCost: deliveryCost });
  };
  useEffect(() => {
    const calculateTotalPrices = () => {
      const ordersByName = {};
      state.order.forEach((order) => {
        if (!ordersByName[order.name]) {
          ordersByName[order.name] = [];
        }
        ordersByName[order.name].push(order);
      });
      const updatedTotalPrices = {};
      Object.entries(ordersByName).forEach(([name, orders]) => {
        let totalPriceForName = 0;
        orders.forEach((order) => {
          const totalItemPrice = order.item.price * order.count;
          totalPriceForName += totalItemPrice;
        });
        if (!isNaN(parseFloat(deliveryCostPerName))) {
          totalPriceForName += parseFloat(deliveryCostPerName);
        }
        updatedTotalPrices[name] = totalPriceForName;
      });
      setTotalPrices(updatedTotalPrices);
    };

    calculateTotalPrices();
  }, [state.order, nameCount, deliveryCostPerName]);

  return (
    <View style={{ flex: 1 }}>
      <Text style={Style.headerText}>Delivery Cost</Text>
      <TextInput
        style={Style.input}
        placeholder="0 JD"
        value={deliveryCost}
        onChangeText={handleDeliveryCost}
      />
      {isEmptyOrders ? (
        <SomethingWentWrong message={"There is no orders yet"} />
      ) : (
        <ScrollView>
          {Object.entries(totalPrices).map(
            ([name, totalPriceForName], index) => (
              <View style={Style.orderItem} key={index}>
                <Text style={Style.nameText}>{name}</Text>
                {state.order
                  .filter((order) => order.name === name)
                  .map((order, index) => (
                    <OrderItem
                      key={index}
                      item={order.item}
                      count={order.count}
                      totalItemPrice={order.item.price * order.count}
                    />
                  ))}
                <View style={Style.divider}></View>
                <View style={Style.totalContainer}>
                  <Text style={Style.detailsText}>
                    Delivery {deliveryCostPerName ? deliveryCostPerName : 0}
                  </Text>
                  <Text style={Style.detailsText}>
                    Total {totalPriceForName}
                  </Text>
                </View>
              </View>
            )
          )}
        </ScrollView>
      )}
      <Button
        style={Style.button}
        text={"Complete Order"}
        onPress={handleCompleteOrder}
      />
    </View>
  );
}
