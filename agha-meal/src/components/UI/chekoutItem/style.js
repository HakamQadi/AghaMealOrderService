import { Dimensions, StyleSheet } from "react-native";

const Style = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
  },
  itemDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  countContainer: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: "#868686",
  },
  textColorYellow: {
    color: "#F8B64C",
  },
  divider: {
    backgroundColor: "#f0f0f0",
    width: Dimensions.get("screen").width - 32,
    height: 1,
    alignSelf: "center",
    marginVertical: 15,
    paddingHorizontal: 16,
  },
});

export default Style;
