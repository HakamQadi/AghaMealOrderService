import { Dimensions, StyleSheet } from "react-native";

const Style = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom: 8,
  },
  userHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8B64C",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  itemDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  countContainer: {
    backgroundColor: "#F8B64C",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 16,
    minWidth: 40,
    alignItems: "center",
  },
  countText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  itemInfoContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
  },
  totalContainer: {
    alignItems: "flex-end",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F8B64C",
  },
  itemDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 20,
  },
  sectionDivider: {
    height: 8,
    backgroundColor: "#f8f9fa",
  },
  textColorYellow: {
    color: "#F8B64C",
  },
});

export default Style;
