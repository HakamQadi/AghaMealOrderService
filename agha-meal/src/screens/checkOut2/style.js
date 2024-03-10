import { Dimensions, StyleSheet } from "react-native";

const Style = StyleSheet.create({
  listContainer: {
    marginTop: 30,
  },
  detailsContainer: {
    gap: 5,
    marginVertical: 20,
  },
  detailsRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  divider: {
    backgroundColor: "#f0f0f0",
    width: Dimensions.get("window").width - 32,
    height: 1,
    alignSelf: "center",
    marginVertical: 15,
    paddingHorizontal: 16,
  },
  button: { alignSelf: "center", marginBottom: 20 },
  textColorYellow: {
    color: "#F8B64C",
  },
});

export default Style;
