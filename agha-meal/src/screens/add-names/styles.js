import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  headerTextContainer: {
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
    alignItems: "center",
  },
  input: {
    width: 320,
    height: 40,
    color: "black",
    fontSize: 16,
    backgroundColor: "#D6D6D6",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#D6D6D6",
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
