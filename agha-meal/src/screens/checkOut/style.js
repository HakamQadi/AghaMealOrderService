import { StyleSheet } from "react-native";

const Style = StyleSheet.create({
  container: {},
  screenBottom: {
    // backgroundColor: "blue",
    gap: 30,
    paddingTop: 20,
  },
  detailsContainer: {
    // backgroundColor: "red",
    marginHorizontal: 16,
    gap: 10,
  },
  detailsTextContailner: {
    // backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: 'center',
  },
  detailsText: {
    fontSize: 17,
  },
  totalText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#F8B64C",
  },
  itemContainer: {
    // backgroundColor: "red",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  itemDetailsContailner: {
    // backgroundColor: "yellow",
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    gap: 10,
  },
  countContainer: {
    borderWidth: 1,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    borderColor: "#868686",
  },
  countText: {
    color: "#F8B64C",
  },
  priceText: {
    color: "#F8B64C",
  },
});

export default Style;
