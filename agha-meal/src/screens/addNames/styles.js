import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    // android
    // alignItems: "center",
    flex: 1,
  },
  headerTextContainer: {
    marginTop: 46,
    // android
    paddingHorizontal: 16,
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
  addBtn: {
    backgroundColor: "#EEA734",
    borderRadius: 5,
    padding: 10,
    height: 40,
  },
  nameContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 5,
  },
  removeBtn: {
    backgroundColor: "red",
    borderRadius: 5,
    paddingHorizontal: 5,
    height: 25,
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    gap: 5,
    // android
    // alignItems:"center",
    justifyContent: "center",
  },
  input: {
    width: 320,
    height: 40,
    color: "black",
    fontSize: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    backgroundColor: "#FBFBFB",
    borderColor: "#efefef",
    borderRadius: 5,
  },
  error: {
    color: "red",
    fontSize: 16,
  },
  addNamesError: {
    color: "red",
    fontSize: 16,
    alignSelf: "flex-start",
    marginLeft: 16,
    marginTop: 5,
  },
});

export default styles;
