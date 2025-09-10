import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useOrder } from "../context/OrderContext";
import {
  fetchCategories,
  fetchAllMeals,
  fetchMealsByCategory,
} from "../services/api";

const MenuScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const { addToCart, getCartItemCount } = useOrder();
  const cartItemCount = getCartItemCount();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadMeals();
  }, [selectedCategory]);

  useEffect(() => {
    filterMeals();
  }, [searchQuery, meals]);

  // Load categories from API
  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetchCategories();
      const apiCategories = response?.categories || [];
      //   console.log("apiCategories :: ", apiCategories);

      // Add "All" category manually
      setCategories([
        { _id: "all", name: { en: "All", ar: "الكل" } },
        ...apiCategories,
      ]);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load meals based on category
  const loadMeals = async () => {
    try {
      setLoading(true);
      let response;
      if (selectedCategory === "all") {
        response = await fetchAllMeals();
      } else {
        response = await fetchMealsByCategory(selectedCategory);
      }

      setMeals(response?.meals || []);
      setFilteredMeals(response?.meals || []);
    } catch (error) {
      console.error("Error loading meals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter meals by search
  const filterMeals = () => {
    let filtered = meals;

    if (searchQuery) {
      filtered = filtered.filter(
        (meal) =>
          meal.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meal.name.ar.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMeals(filtered);
  };

  const handleAddToCart = (meal) => {
    addToCart(meal);
    Alert.alert(
      "Added to Cart",
      `${meal.name.en} has been added to your cart!`
    );
  };

  const renderMealItem = ({ item }) => (
    <View style={styles.menuItem}>
      <Image source={{ uri: item.image }} style={styles.menuItemImage} />
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemHeader}>
          <Text style={styles.menuItemName}>{item.name.en}</Text>
          <Text style={styles.menuItemPrice}>${item.price}</Text>
        </View>

        <View style={styles.menuItemFooter}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCategoryButton = (category) => {
    // console.log("category :: ", category?._id);

    return (
      <TouchableOpacity
        key={category._id}
        style={[
          styles.categoryButton,
          selectedCategory === category._id && styles.selectedCategoryButton,
        ]}
        onPress={() => setSelectedCategory(category?._id)}
      >
        <Text
          style={[
            styles.categoryButtonText,
            selectedCategory === category._id &&
              styles.selectedCategoryButtonText,
          ]}
        >
          {category.name.en}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Cart */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Menu</Text>

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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for meals..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={({ item }) => renderCategoryButton(item)}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Meals */}
      <FlatList
        data={filteredMeals}
        renderItem={renderMealItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.menuList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  screenTitle: {
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#1a1a1a",
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
  },
  selectedCategoryButton: {
    backgroundColor: "#FF6B6B",
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  selectedCategoryButtonText: {
    color: "#fff",
  },
  menuList: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemImage: {
    width: 100,
    // height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  menuItemContent: {
    flex: 1,
    padding: 16,
  },
  menuItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  menuItemDescription: {
    flex: 0.8,
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  menuItemFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: "#999",
  },
  addButton: {
    backgroundColor: "#FF6B6B",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MenuScreen;
