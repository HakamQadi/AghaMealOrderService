import { Dimensions, StyleSheet } from "react-native";

const windowWidth = Dimensions.get("window").width;

const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },

  subText: {
    color: "#2C3E50",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 5,
  },

  categoryName: {
    color: "#6C757D",
    fontSize: 16,
    fontWeight: "500",
  },

  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },

  touchableCard: {
    borderRadius: 16,
    overflow: "hidden",
  },

  cardImage: {
    backgroundColor: "#F8F9FA",
    height: 160,
    width: (windowWidth - 48) / 2,
    justifyContent: "flex-end",
  },

  priceBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  priceBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  itemDetailsContainer: {
    padding: 16,
    gap: 8,
    width: (windowWidth - 48) / 2,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    lineHeight: 22,
  },

  description: {
    fontSize: 14,
    color: "#6C757D",
    fontWeight: "400",
  },

  flatListContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6C757D",
    fontWeight: "500",
  },

  buttonContainer: {
    paddingBottom: 50,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
  },

  doneButton: {
    alignSelf: "center",
    minWidth: 200,
  },
});

export default Style;
