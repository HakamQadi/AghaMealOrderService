import React from "react";
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styles from "./style";

const Category = ({ navigation, name }) => {
  console.log("NAME (CATEGORY) ::: ", name);
  const categoryList = [
    {
      id: 1,
      name: "شاورما",
      image: require("../../assets/Shawerma.jpg"),
    },
    {
      id: 2,
      name: "مشاوي",
      image: require("../../assets/Mashawe.jpeg"),
    },
    {
      id: 3,
      name: "دجاج مقلي",
      image: require("../../assets/Broasted.jpg"),
    },
    {
      id: 4,
      name: "ارز الوجبة",
      image: require("../../assets/RiseMeal.jpeg"),
    },
    {
      id: 5,
      name: "الساندويشات",
      image: require("../../assets/Sandwich.jpg"),
    },
    {
      id: 6,
      name: "طلبات جانبية",
      image: require("../../assets/SideOrders.jpeg"),
    },
  ];

  const onCategoryPress = (category) => {
    navigation.navigate("Items", { name: name, category: category });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => onCategoryPress(item.name)}
      style={styles.card}
    >
      <ImageBackground
        style={styles.cardImage}
        source={item.image}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>{item.name}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={categoryList}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

export default Category;
