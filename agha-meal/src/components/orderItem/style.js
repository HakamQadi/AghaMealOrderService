import { StyleSheet } from "react-native";
const Style = StyleSheet.create({
  itemContainer: {
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 170,
  },
  itemDetailsContainer: {
    alignItems: "flex-end",
  },
  detailsText: { color: "#F8B64C" },
});

export default Style;
