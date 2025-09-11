import { StyleSheet } from "react-native";

const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  headerSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },

  inputContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    paddingHorizontal: 16,
  },
  currencyIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#1a1a1a",
  },

  scrollView: {
    flex: 1,
    paddingBottom: 16,
    marginTop: 16,
  },
  orderCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  nameHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },

  orderItemsContainer: {
    marginBottom: 12,
  },

  totalSection: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 12,
  },
  totalContainer: {
    paddingTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  totalRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
  },
  totalValue: {
    fontSize: 14,
    color: "#F8B64C",
    fontWeight: "500",
  },
  totalLabelFinal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  totalValueFinal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F8B64C",
  },

  buttonContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  button: {
    width: "100%",
  },
});

export default Style;
