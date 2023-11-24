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
    backgroundColor: "#EEA734",
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
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
    paddingHorizontal: 5,
    marginBottom: 5,
    
    // color:'white'
  },
  inputFieldContainer: {
    flexDirection: "row-reverse",
    gap: 5,
  },
  input: {
    width: 20 * 16,
    color: "black",
    fontSize: 16,
    backgroundColor: "#D6D6D6",
    paddingVertical: 0.35 * 16,
    paddingHorizontal: 0.45 * 16,
    borderWidth: 1,
    borderColor: "#D6D6D6",
  },
});



export default {
  namesStyle,
};
