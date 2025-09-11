import { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
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
  const [loading, setLoading] = useState(true);

  const { category, name } = route.params;
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/admin/meals/category/${category._id}`
        );
        setItems(response?.data?.meals);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const onItemPress = (item) => {
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
      <View style={Style.cardContainer}>
        <TouchableOpacity
          onPress={() => onItemPress(item)}
          style={Style.touchableCard}
          activeOpacity={0.8}
        >
          <ImageBackground
            style={Style.cardImage}
            source={{
              uri: item.image,
            }}
            resizeMode="cover"
          >
            <View style={Style.priceBadge}>
              <Text style={Style.priceBadgeText}>{item.price} JOD</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        <View style={Style.itemDetailsContainer}>
          <Text numberOfLines={2} ellipsizeMode="tail" style={Style.title}>
            {item.name.en}
          </Text>
          <Text style={Style.description} numberOfLines={1}>
            Delicious meal option
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={Style.container}>
      <View style={Style.headerSection}>
        <Text style={Style.subText}>Choose from these Items</Text>
        <Text style={Style.categoryName}>
          {category?.name?.en || "Menu Items"}
        </Text>
      </View>

      {loading ? (
        <View style={Style.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={Style.loadingText}>Loading delicious options...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          contentContainerStyle={Style.flatListContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      <View style={Style.buttonContainer}>
        {!selectedItem && (
          <Button
            style={Style.doneButton}
            text={`Done (${orderData.length} items)`}
            onPress={finishOrder}
          />
        )}
      </View>

      <BottomPopUp
        selectedItem={selectedItem}
        hideModal={hideModal}
        name={name}
        getOrderData={getOrderData}
      />
    </SafeAreaView>
  );
}
