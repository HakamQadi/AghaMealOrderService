import { StyleSheet } from "react-native";
const Style = StyleSheet.create({
  itemContainer: {
    // android
    flex: 1,

    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemNameContainer: {
    // android
    flex: 0.5,
    flexDirection: "row",
    alignItems: "center",

    // android
    // justifyContent: "space-between",

    // android
    // width: 170,
    // gap: 10,
  },
  itemDetailsContainer: {
    // android
    flex: 0.3,

    alignItems: "flex-end",
  },
  detailsText: { color: "#F8B64C" },
});

export default Style;
