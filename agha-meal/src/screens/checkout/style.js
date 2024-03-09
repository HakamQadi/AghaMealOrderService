import { Dimensions, StyleSheet } from "react-native";

const Style = StyleSheet.create({
  //   headerText: {
  //     marginHorizontal: 16,
  //     fontSize: 33,
  //     color: "black",
  //     marginTop: 10,
  //   },
  //   input: {
  //     height: 40,
  //     color: "black",
  //     fontSize: 16,
  //     backgroundColor: "#FBFBFB",
  //     paddingHorizontal: 10,
  //     borderWidth: 1,
  //     borderColor: "#efefef",
  //     margin: 16,
  //     borderRadius: 10,
  //   },
  //   orderItem: {
  //     borderBottomWidth: 1,
  //     marginBottom: 10,
  //     borderColor: "#f0f0f0",
  //     marginHorizontal: 16,
  //   },
  //   nameText: {
  //     fontWeight: "bold",
  //     marginVertical: 5,
  //   },
  listContainer: {
    // backgroundColor: "red",
    marginTop: 30,
  },
  detailsContainer: {
    gap: 5,
    marginVertical: 20,
  },
  detailsRowContainer: {
    // backgroundColor: "green",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  divider: {
    backgroundColor: "#f0f0f0",
    width:Dimensions.get('screen').width-32 ,
    height: 1,
    alignSelf: "center",
    marginVertical: 15,
    paddingHorizontal: 16,
  },
  //   totalContainer: {
  //     alignItems: "flex-end",
  //     marginBottom: 10,
  //   },
  //   detailsText: { color: "#F8B64C" },
  button: { alignSelf: "center", marginBottom: 20 },
});

export default Style;
