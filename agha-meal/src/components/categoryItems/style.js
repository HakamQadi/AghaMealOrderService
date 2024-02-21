import { Dimensions, StyleSheet } from "react-native";

const windowWidth = Dimensions.get("window").width;

const Style = StyleSheet.create({
  
  cardImage: {
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 8,
    height: 200,
    width: (windowWidth - 32) / 2, // Calculate the width dynamically for 2 columns
  },
  itemDetailsContainer: {
    gap: 5,
    width: (windowWidth - 32) / 2, // Calculate the width dynamically for 2 columns
    alignSelf: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "right",
  },
  price: {
    fontSize: 15,
    color: "#000",
    textAlign: "right",
  },
  flatListContainer: {
    padding: 8,
    alignItems: "center",
  },
});

export default Style;
