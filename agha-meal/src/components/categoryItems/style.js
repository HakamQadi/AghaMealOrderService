import { Dimensions, StyleSheet } from "react-native";

const windowWidth = Dimensions.get("window").width;

const Style = StyleSheet.create({
  subText: {
    color: "#000",
    fontSize: 20,
    marginTop: 20,
    marginHorizontal: 16,
    marginBottom: 15,
  },
  cardImage: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    margin: 8,
    height: 200,
    width: (windowWidth - 32) / 2.1, // Calculate the width dynamically for 2 columns
  },
  itemDetailsContainer: {
    gap: 5,
    width: (windowWidth - 32) / 2.1, // Calculate the width dynamically for 2 columns
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
    paddingVertical: 8,
    alignItems: "center",
  },
});

export default Style;
