import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  wlcmText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 8,
  },
  secondryText: {
    color: "#7f8c8d",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e1e8ed",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#2c3e50",
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: "#EEA734",
    borderRadius: 12,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EEA734",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addNamesError: {
    color: "#e74c3c",
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  listSection: {
    flex: 1,
    marginBottom: 20,
  },
  listHeader: {
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  listContainer: {
    paddingBottom: 20,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nameContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEA734",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  nameText: {
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "500",
    flex: 1,
  },
  removeBtn: {
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    paddingBottom: 50,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fdf2f2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  error: {
    color: "#e74c3c",
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "500",
  },
  continueButton: {
    alignSelf: "stretch",
    marginHorizontal: 0,
  },
});

export default styles;
