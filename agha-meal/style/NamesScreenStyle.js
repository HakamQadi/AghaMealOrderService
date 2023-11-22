// NamesScreenStyle.js
import { StyleSheet } from "react-native";

const namesStyle = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 21,
    marginTop: 46,
  },
  wlcmText: {
    fontSize: 33,
    color: "black",
  },
  secondryText: {
    color: "#868686",
    fontSize: 16,
    marginBottom: 30,
  },
  addBtnContainer: {
    alignItems: "center",
  },
  addBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEA734",
    borderRadius: 50,
    padding: 10,
    width: 50,
    height: 50,
    marginTop: 40,
  },
  continueBtnContainer: {
    width: "85%",
  },
  continueBtn: {
    backgroundColor: "#EEA734",
    padding: 8,
    marginTop: 60,
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
  },
  continueBtnText: {
    color: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  removeBtn: {
    backgroundColor: "red",
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  inputFieldContainer: {
    flexDirection: "row-reverse",
    gap: 5,
  },
});

export default {
  namesStyle,
};
