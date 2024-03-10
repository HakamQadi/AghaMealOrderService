import { StyleSheet } from "react-native";

const Style = StyleSheet.create({
  headerText: {
    marginHorizontal: 16,
    fontSize: 33,
    color: "black",
    marginTop: 10,
  },
  input: {
    height: 40,
    color: "black",
    fontSize: 16,
    backgroundColor: "#FBFBFB",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#efefef",
    margin: 16,
    borderRadius: 10,
  },
  orderItem: {
    borderBottomWidth: 1,
    marginBottom: 10,
    borderColor: "#f0f0f0",
    marginHorizontal: 16,
  },
  nameText: {
    fontWeight: "bold",
    marginVertical: 5,
  },
  divider: {
    backgroundColor: "#f0f0f0",
    width: 100,
    height: 1,
    alignSelf: "flex-end",
    marginVertical: 5,
  },
  totalContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  detailsText: { color: "#F8B64C" },
  button: { alignSelf: "center", marginBottom: 20 },
});

export default Style;
