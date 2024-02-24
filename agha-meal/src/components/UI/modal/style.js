import { Platform, StyleSheet } from "react-native";
const Style = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    backgroundColor: "white",
    height: "30%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    // android
    marginBottom: Platform.OS === "ios" ? 20 : 0,
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemDetailsContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemNameText: {
    width: 160,
  },
  itemPriceText: {
    width: 140,
    // android
    textAlign: "left",
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 8,
  },
  counterContainer: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 80,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  icon: {
    width: 50,
    height: 40,
  },
  addButton: {
    width: "50%",
    marginBottom: 10,
  },
});

export default Style;
