import { Colors } from "../../themes/Colors";

export const Style = {
  container: {
    backgroundColor: "#31363F",
    color: "white",
    width: "80%",
  },
  headerText: {
    marginTop: 10,
    textAlign: "center",
  },
  tabelHeader: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: Colors.darkBlue,
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    fontWeight: "bold",
  },
  itemContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    margin: "5px 0 5px 0",
    padding: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Colors.darkBlue,
    borderRadius: 5,
  },
  itemText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  priceText: {
    color: Colors.yellow,
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },
  image: {
    width: 50,
  },
};
