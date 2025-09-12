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
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useOrder } from "../context/OrderContext";
import {
  fetchCategories,
  fetchAllMeals,
  fetchMealsByCategory,
} from "../services/api";
import MealCard from "../components/card/MealCard";
import MealModal from "../components/modal/MealModal";

const { width } = Dimensions.get("window");
const itemWidth = (width - 60) / 2; // 20px margin on each side + 20px gap between items

const MenuScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [initialLoading, setInitialLoading] = useState(true);
  const [mealsLoading, setMealsLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemQuantity, setItemQuantity] = useState(1);

  const { addToCart, getCartItemCount } = useOrder();
  const cartItemCount = getCartItemCount();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    setSearchQuery("");
    loadMeals();
  }, [selectedCategory]);

  useEffect(() => {
    filterMeals();
  }, [searchQuery, meals]);

  const loadInitialData = async () => {
    try {
      // fetch categories first
      const categoryResponse = await fetchCategories();
      const apiCategories = categoryResponse?.categories || [];

      setCategories([
        { _id: "all", name: { en: "All", ar: "الكل" } },
        ...apiCategories,
      ]);

      // fetch meals for "all"
      const mealResponse = await fetchAllMeals();
      setMeals(mealResponse?.meals || []);
      setFilteredMeals(mealResponse?.meals || []);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  // Load categories from API
  const loadMeals = async () => {
    try {
      setMealsLoading(true);
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
      setMealsLoading(false);
    }
  };

  // Filter meals by search
  const filterMeals = () => {
    let filtered = meals;

    if (searchQuery) {
      filtered = filtered.filter(
        (meal) =>
          meal.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meal.name.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (selectedCategory === "all" &&
            meal?.category?.name.en
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredMeals(filtered);
  };

  const handleItemPress = (meal) => {
    setSelectedItem(meal);
    setModalVisible(true);
  };

  const renderMealItem = ({ item }) => {
    return <MealCard meal={item} onPress={handleItemPress} width={itemWidth} />;
  };

  const renderCategoryButton = (category) => {
    return (
      <TouchableOpacity
        key={category._id}
        style={[
          styles.categoryButton,
          selectedCategory === category._id && styles.selectedCategoryButton,
        ]}
        onPress={() => {
          setSelectedCategory(category._id);
          loadMeals();
        }}
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

  if (initialLoading) {
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
      {/* Meals Grid */}
      {mealsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading meals...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMeals}
          renderItem={renderMealItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.menuGrid}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  menuGrid: {
    paddingHorizontal: 20,
    // paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
});

export default MenuScreen;
