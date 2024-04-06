import React from "react";
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { API_URL } from "@env";
import styles from "./style";

const Category = ({ navigation, name, categories }) => {
  const categoryList = [
    {
      id: 1,
      name: "شاورما",
      image: require("../../assets/Shawerma.jpg"),
    },
    {
      id: 2,
      name: "دجاج مقلي",
      image: require("../../assets/FriedChicken.jpg"),
    },
    {
      id: 3,
      name: "دجاج مقلي - بروستد",
      image: require("../../assets/Broasted.jpg"),
    },
    {
      id: 4,
      name: "مشاوي",
      image: require("../../assets/Mashawe.jpeg"),
    },
    {
      id: 5,
      name: "ساندويش",
      image: require("../../assets/Sandwich.jpg"),
    },
  ];

  const onCategoryPress = (category) => {
    navigation.navigate("Items", { category, name });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity onPress={() => onCategoryPress(item)} style={styles.card}>
      <ImageBackground
        style={styles.cardImage}
        source={{
          uri: `${API_URL}/images/${item.image}`,
        }}
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
        // data={categoryList}
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

export default Category;
