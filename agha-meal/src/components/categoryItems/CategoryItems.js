import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Style from "./style";
import BottomPopUp from "../UI/modal/BottomPopUp";
import Button from "../button/Button";
import { OrderContext } from "../../context/OrderContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

export default function CategoryItems({ navigation, route }) {
  const { setOrder } = useContext(OrderContext);

  const [selectedItem, setSelectedItem] = useState();
  const [orderData, setOrderData] = useState([]);
  const [items, setItems] = useState([]);

  const { category } = route.params;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/admin/meals/category/${category.name}`
        );
        setItems(response.data.mealsByCategory);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const onCategoryPress = (item) => {
    setSelectedItem(item);
  };

  const hideModal = () => {
    setSelectedItem(null);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const ordersString = await AsyncStorage.getItem("orders");
      if (ordersString !== null) {
        const orders = JSON.parse(ordersString);
        setOrderData(orders);
      }
    } catch (error) {
      console.error("Error loading orders from AsyncStorage:", error);
    }
  };

  const getOrderData = (order) => {
    setOrderData((prevOrders) => [...prevOrders, order]);
    AsyncStorage.setItem("orders", JSON.stringify([...orderData, order]));
  };

  const finishOrder = async () => {
    setOrder(orderData);
    navigation.goBack("Home");
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ flexDirection: "column" }}>
        <TouchableOpacity onPress={() => onCategoryPress(item)}>
          <ImageBackground
            style={Style.cardImage}
            source={{
              uri: `${API_URL}/images/${item.image}`,
            }}
            resizeMode="cover"
          ></ImageBackground>
        </TouchableOpacity>
        <View style={Style.itemDetailsContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={Style.title}>
            {item.meal}
          </Text>
          <Text style={Style.price}>{item.price} JOD</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={Style.subText}>Choose from these Items</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        contentContainerStyle={Style.flatListContainer}
      />
      <Button
        style={{ alignSelf: "center" }}
        text="Done"
        onPress={finishOrder}
      />
      <BottomPopUp
        selectedItem={selectedItem}
        hideModal={hideModal}
        name={category}
        getOrderData={getOrderData}
      />
    </View>
  );
}
