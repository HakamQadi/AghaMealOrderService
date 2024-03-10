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
import axios from "axios"; // Import Axios

export default function CategoryItems({ navigation, route }) {
  const { setOrder } = useContext(OrderContext);

  const [selectedItem, setSelectedItem] = useState();
  const [orderData, setOrderData] = useState([]);
  const [items, setItems] = useState([]);

  const { category } = route.params;
  console.log("itemsssssss :::::: ", items);


  useEffect(() => {
    // Function to fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/admin/meals/${category}`
        ); // Replace URL with your API endpoint
        setItems(response.data.mealsByCategory);
        // console.log("mealsByCategory :::: ", response.data.mealsByCategory);
        // setCategories(response.data.categories); // Update state with fetched categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories(); // Call fetchCategories function when component mounts
  }, []);
  // const items = [
  //   {
  //     id: 1,
  //     name: "شاورما سوبر شاورما سوبر شاورما سوبر شاورما سوبر",
  //     price: 10,
  //     image: require("../../assets/Shawerma.jpg"),
  //   },
  //   {
  //     id: 2,
  //     name: "شاورما دبل",
  //     price: 20,
  //     image: require("../../assets/FriedChicken.jpg"),
  //   },
  //   {
  //     id: 3,
  //     name: "شاورما عادي",
  //     price: 30,
  //     image: require("../../assets/Broasted.jpg"),
  //   },
  //   {
  //     id: 4,
  //     name: "ساندويش شاورما",
  //     price: 40,
  //     image: require("../../assets/Mashawe.jpeg"),
  //   },
  //   {
  //     id: 5,
  //     name: "ساندويش شاورما عادي",
  //     price: 50,
  //     image: require("../../assets/Broasted.jpg"),
  //   },
  //   {
  //     id: 6,
  //     name: " ساندويش ساندويش شاورما",
  //     price: 60,
  //     image: require("../../assets/Mashawe.jpeg"),
  //   },
  //   {
  //     id: 7,
  //     name: "ساندويش شاورما عادي",
  //     price: 70,
  //     image: require("../../assets/Broasted.jpg"),
  //   },
  //   {
  //     id: 8,
  //     name: " ساندويش ساندويش شاورما",
  //     price: 80,
  //     image: require("../../assets/Mashawe.jpeg"),
  //   },
  // ];

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
    console.log("Item:", item); // Log the item object

    return (
      <View style={{ flexDirection: "column" }}>
        <TouchableOpacity onPress={() => onCategoryPress(item)}>
          <ImageBackground
            style={Style.cardImage}
            source={item.image}
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
