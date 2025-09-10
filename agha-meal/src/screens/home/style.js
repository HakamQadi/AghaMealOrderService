import { StyleSheet } from "react-native"

const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#f97316",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    textAlign: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f97316",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#f97316",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  nameTextContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  subTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  subText: {
    color: "#6b7280",
    fontSize: 16,
    marginLeft: 6,
    fontWeight: "500",
  },
  categoryContainer: {
    flex: 1,
    paddingTop: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 16,
  },
  continueButton: {
    alignSelf: "stretch",
  },
})

export default Style
