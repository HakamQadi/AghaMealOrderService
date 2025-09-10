import { Dimensions, StyleSheet } from "react-native"

const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    fontWeight: "400",
  },
  listContainer: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  detailsContainer: {
    gap: 12,
  },
  detailsRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "400",
  },
  detailValue: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F8B64C",
  },
  divider: {
    backgroundColor: "#f0f0f0",
    width: Dimensions.get("window").width - 32,
    height: 1,
    alignSelf: "center",
    marginVertical: 15,
    paddingHorizontal: 16,
  },
  button: {
    alignSelf: "center",
    marginBottom: 40,
    marginHorizontal: 16,
  },
  textColorYellow: {
    color: "#F8B64C",
  },
})

export default Style
