import { Dimensions, StyleSheet } from "react-native";

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  card: {
    // backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 10.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardImage: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    margin: 8,
    height: 200,
    width: (windowWidth - 32) / 2, // Calculate the width dynamically for 2 columns
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

export default styles;
