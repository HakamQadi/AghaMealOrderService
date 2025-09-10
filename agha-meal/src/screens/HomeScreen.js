import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useOrder } from "../context/OrderContext";
import { useEffect, useState } from "react";
import { fetchAllMeals } from "../services/api";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { getCartItemCount } = useOrder();
  const cartItemCount = getCartItemCount();

  const [featuredMeals, setFeaturedMeals] = useState([]);
  const [featuredMealsloading, setFeaturedMealsloading] = useState(true);

  const quickActions = [
    {
      id: 1,
      title: "Browse Menu",
      subtitle: "Explore our delicious meals",
      icon: "restaurant-outline",
      color: "#FF6B6B",
      screen: "Menu",
    },
    {
      id: 2,
      title: "Your Cart",
      subtitle: `${cartItemCount} items in cart`,
      icon: "bag-outline",
      color: "#4ECDC4",
      screen: "Cart",
    },
    {
      id: 3,
      title: "Order History",
      subtitle: "View your past orders",
      icon: "time-outline",
      color: "#45B7D1",
      screen: "OrderHistory",
    },
  ];

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
          onPress={() => navigation.navigate("Cart")}
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
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.quickActionCard,
                  { borderLeftColor: action.color },
                ]}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: action.color },
                  ]}
                >
                  <Ionicons name={action.icon} size={24} color="#fff" />
                </View>
                <View style={styles.quickActionContent}>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionSubtitle}>
                    {action.subtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Meals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Meals</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
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
                  <TouchableOpacity
                    key={meal._id}
                    style={styles.featuredMealCard}
                  >
                    <Image
                      source={{ uri: meal.image }}
                      style={styles.featuredMealImage}
                    />
                    <View style={styles.featuredMealInfo}>
                      <Text style={styles.featuredMealName}>
                        {meal.name.en}
                      </Text>
                      <View style={styles.featuredMealMeta}>
                        <Text style={styles.featuredMealPrice}>
                          ${meal.price}
                        </Text>
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={14} color="#FFD700" />
                          <Text style={styles.ratingText}>{meal.rating}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  cartButton: {
    position: "relative",
    padding: 8,
  },
  cartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#f8f9fa",
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 12,
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  featuredMealsContainer: {
    flexDirection: "row",
    gap: 16,
    // paddingRight: 20,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  featuredMealCard: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredMealImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  featuredMealInfo: {
    padding: 12,
  },
  featuredMealName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  featuredMealMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredMealPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  featuredMealsLoader: {
    width: width, // full width of screen

    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
