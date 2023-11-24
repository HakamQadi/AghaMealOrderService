import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  Dimensions,
} from "react-native";

// npm i expo-constants
// 1) add any thing you want to the app.json
// 2) Import this
// import Constants from "expo-constants";

const Category = () => {
  const categoryList = [
    {
      name: "شاورما",
      image: require("../assets/Shawerma.jpg"),
    },
    {
      name: "دجاج مقلي",
      image: require("../assets/FriedChicken.jpg"),
    },
    {
      name: "دجاج مقلي - بروستد",
      image: require("../assets/Broasted.jpg"),
    },
    {
      name: "مشاوي",
      image: require("../assets/Mashawe.jpeg"),
    },
    {
      name: "ساندويش",
      image: require("../assets/Sandwich.jpg"),
    },
  ];

  const renderCategoryItem = ({ item }) => (
    <ImageBackground source={item.image} style={styles.card} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.name}</Text>
      </View>
    </ImageBackground>
  );
  // 3)use it here
  // console.log(Constants.expoConfig.API.TEST);
  return (
    <View style={{}}>
      <FlatList
        data={categoryList}
        renderItem={renderCategoryItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: "hidden",
    margin: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 200,
    width: (windowWidth - 32) / 2, // Calculate the width dynamically for 2 columns
    // justifyContent:'center',
    // alignItems:'center'
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark layer
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    margin: 16,
  },
  flatListContainer: {
    padding: 8,
    alignItems: "center",
  },
});

export default Category;
