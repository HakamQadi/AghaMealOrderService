import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useOrder } from "../context/OrderContext";
import { useEffect, useState } from "react";
import { fetchAllMeals } from "../services/api";
import MealCard from "../components/card/MealCard";
import MealModal from "../components/modal/MealModal";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { getCartItemCount } = useOrder();
  const cartItemCount = getCartItemCount();

  const [featuredMeals, setFeaturedMeals] = useState([]);
  const [featuredMealsloading, setFeaturedMealsloading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const loadMeals = async () => {
    try {
      setFeaturedMealsloading(true);
      const response = await fetchAllMeals();
      setFeaturedMeals(response?.meals.slice(0, 10) || []);
    } catch (error) {
      console.error("Error loading meals:", error);
    } finally {
      setFeaturedMealsloading(false);
    }
  };

  useEffect(() => {
    loadMeals();
  }, []);

  const handleItemPress = (meal) => {
    setSelectedItem(meal);
    setModalVisible(true);
  };
  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#FF6B6B" />
  //       <Text style={styles.loadingText}>Loading menu...</Text>
  //     </View>
  //   );
  // }
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.appName}>Agha Meal</Text>
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation?.navigate("Cart")}
        >
          <Ionicons name="bag-outline" size={24} color="#1a1a1a" />
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>
          Delicious meals{"\n"}delivered fresh
        </Text>
        <Text style={styles.heroSubtitle}>
          Order your favorite meals and get them delivered right to your door
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Menu button */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation?.navigate("Menu")}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name="restaurant-outline" size={32} color="#fff" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Browse Menu</Text>
              <Text style={styles.menuSubtitle}>
                Explore our delicious meals
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
        {/* Menu button */}

        <View style={styles.orderHistorySection}>
          <TouchableOpacity
            style={styles.orderHistoryCard}
            onPress={() => navigation?.navigate("OrderHistory")}
          >
            <View style={styles.orderHistoryIconContainer}>
              <Ionicons name="time-outline" size={32} color="#fff" />
            </View>
            <View style={styles.orderHistoryContent}>
              <Text style={styles.orderHistoryTitle}>Order History</Text>
              <Text style={styles.orderHistorySubtitle}>
                View your past orders
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#45B7D1" />
          </TouchableOpacity>
        </View>

        {/* Featured Meals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Meals</Text>
            <TouchableOpacity onPress={() => navigation?.navigate("Menu")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {featuredMealsloading ? (
            <View style={styles.featuredMealsLoader}>
              <ActivityIndicator size="large" color="#FF6B6B" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.featuredMealsContainer}>
                {featuredMeals.map((meal) => (
                  <MealCard
                    key={meal._id}
                    meal={meal}
                    onPress={handleItemPress}
                  />
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </ScrollView>
      <MealModal
        visible={modalVisible}
        meal={selectedItem}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 16,
    color: "#8e8e93",
    marginBottom: 4,
    fontWeight: "500",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  cartButton: {
    position: "relative",
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: "#FF6B6B",
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 24,
    fontWeight: "500",
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  orderHistorySection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  orderHistoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#45B7D1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#45B7D1",
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#45B7D1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#FF6B6B",
  },
  menuIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#45B7D1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  orderHistoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#45B7D1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#45B7D1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  menuContent: {
    flex: 1,
  },
  orderHistoryContent: {
    flex: 1,
  },
  orderHistoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  orderHistorySubtitle: {
    fontSize: 15,
    color: "#8e8e93",
    fontWeight: "500",
  },
  menuSubtitle: {
    fontSize: 15,
    color: "#8e8e93",
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "600",
  },
  featuredMealsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#8e8e93",
    fontWeight: "500",
  },
  featuredMealsLoader: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
});

export default HomeScreen;
