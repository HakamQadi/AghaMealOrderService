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
    setItemQuantity(1);
    setModalVisible(true);
  };

  const handleModalAddToCart = () => {
    for (let i = 0; i < itemQuantity; i++) {
      addToCart(selectedItem);
    }
    setModalVisible(false);
    Alert.alert(
      "Added to Cart",
      `${itemQuantity} x ${selectedItem.name.en} has been added to your cart!`
    );
  };

  const increaseQuantity = () => {
    setItemQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (itemQuantity > 1) {
      setItemQuantity((prev) => prev - 1);
    }
  };

  const renderMealItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => handleItemPress(item)}
      >
        <Image source={{ uri: item?.image }} style={styles.gridItemImage} />
        <View style={styles.gridItemContent}>
          <Text style={styles.gridItemName} numberOfLines={2}>
            {item?.name?.en}
          </Text>
          <Text style={styles.gridItemPrice}>${item?.price}</Text>
        </View>
      </TouchableOpacity>
    );
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        />

        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#1a1a1a" />
            </TouchableOpacity>

            {selectedItem && (
              <>
                {/* Item image */}
                <Image
                  source={{ uri: selectedItem.image }}
                  style={styles.modalImage}
                />

                {/* Item name */}
                <Text style={styles.modalItemName}>{selectedItem.name.en}</Text>

                {/* Bottom section with controls */}
                <View style={styles.modalBottomSection}>
                  {/* Quantity controls */}
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={decreaseQuantity}
                    >
                      <Ionicons name="remove" size={20} color="#FF6B6B" />
                    </TouchableOpacity>

                    <Text style={styles.quantityText}>{itemQuantity}</Text>

                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={increaseQuantity}
                    >
                      <Ionicons name="add" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>

                  {/* Add to cart button */}
                  <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={handleModalAddToCart}
                  >
                    <Text style={styles.addToCartText}>
                      Add to Cart - $
                      {(selectedItem.price * itemQuantity).toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  menuGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  gridItem: {
    width: itemWidth,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridItemImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gridItemContent: {
    padding: 12,
  },
  gridItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
    lineHeight: 20,
  },
  gridItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 50,
    minHeight: 400,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 8,
    marginBottom: 10,
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalItemName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 30,
  },
  modalBottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 25,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginHorizontal: 20,
  },
  addToCartButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    flex: 1,
    marginLeft: 20,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MenuScreen;
