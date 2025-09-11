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
  const onCategoryPress = (category) => {
    navigation.navigate("Items", { category, name });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity onPress={() => onCategoryPress(item)} style={styles.card}>
      <ImageBackground
        style={styles.cardImage}
        source={{
          uri:item.image,
          // uri: `${API_URL}/images/${item.image}`,
        }}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>{item.name.en}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
  return (
    <View style={{ flex: 1 }}>
      <FlatList
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
