// TODO we need here an API to get all categories

import React from "react";
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styles from "./style";

// npm i expo-constants
// 1) add any thing you want to the app.json
// 2) Import this
// import Constants from "expo-constants";

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
    // TODO here we need to get all items for the category and navigate to items screen
    // navigation.navigate("Items", { name: name, category: /*here*/ });
    navigation.navigate("Items", { name: name, category: category });

    // navigation.navigate("Items", { name: name, });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      // onPress={onCategoryPress}
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
  // 3)use it here
  // console.log(Constants.expoConfig.API.TEST);
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
