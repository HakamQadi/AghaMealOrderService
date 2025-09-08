// "use client";

// import { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import { useOrder } from "../context/OrderContext";
// import { fetchMenuItems } from "../services/api";
// import { fetchCategories } from "../services/api";

// const MenuScreen = ({ navigation }) => {
//   const [categories, setCategories] = useState([]);
//   const [menuItems, setMenuItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [loading, setLoading] = useState(true);

//   const { addToCart, getCartItemCount } = useOrder();
//   const cartItemCount = getCartItemCount();

//   //   const categories = ["All", "Main Course", "Appetizers", "Desserts", "Beverages"]

//   useEffect(() => {
//     // loadMenuItems()
//     loadCategories();
//   }, []);

//   useEffect(() => {
//     filterItems();
//   }, [searchQuery, selectedCategory, menuItems]);

//   const loadCategories = async () => {
//     try {
//       setLoading(true);
//       const categories = await fetchCategories();
//       setCategories(categories?.categories);
//     } catch (error) {
//       console.error("Error loading categories:", error);
//       // Fallback to mock data if API fails
//       setMenuItems(mockMenuItems);
//     } finally {
//       setLoading(false);
//     }
//   };
//   //   const loadMenuItems = async () => {
//   //     try {
//   //       setLoading(true);
//   //       const items = await fetchMenuItems();
//   //       setMenuItems(items);
//   //     } catch (error) {
//   //       console.error("Error loading menu items:", error);
//   //       // Fallback to mock data if API fails
//   //       setMenuItems(mockMenuItems);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   const filterItems = () => {
//     let filtered = menuItems;

//     if (selectedCategory !== "All") {
//       filtered = filtered.filter((item) => item.category === selectedCategory);
//     }

//     if (searchQuery) {
//       filtered = filtered.filter(
//         (item) =>
//           item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           item.description.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     setFilteredItems(filtered);
//   };

//   const handleAddToCart = (item) => {
//     addToCart(item);
//     Alert.alert("Added to Cart", `${item.name} has been added to your cart!`);
//   };

//   const renderMenuItem = ({ item }) => (
//     <View style={styles.menuItem}>
//       <Image source={{ uri: item.image }} style={styles.menuItemImage} />
//       <View style={styles.menuItemContent}>
//         <View style={styles.menuItemHeader}>
//           <Text style={styles.menuItemName}>{item.name}</Text>
//           <Text style={styles.menuItemPrice}>${item.price}</Text>
//         </View>
//         <Text style={styles.menuItemDescription}>{item.description}</Text>
//         <View style={styles.menuItemFooter}>
//           <View style={styles.ratingContainer}>
//             <Ionicons name="star" size={16} color="#FFD700" />
//             <Text style={styles.ratingText}>{item.rating}</Text>
//             <Text style={styles.reviewCount}>({item.reviews})</Text>
//           </View>
//           <TouchableOpacity
//             style={styles.addButton}
//             onPress={() => handleAddToCart(item)}
//           >
//             <Ionicons name="add" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   const renderCategoryButton = (category) => (
//     <TouchableOpacity
//       key={category}
//       style={[
//         styles.categoryButton,
//         selectedCategory === category && styles.selectedCategoryButton,
//       ]}
//       onPress={() => setSelectedCategory(category)}
//     >
//       <Text
//         style={[
//           styles.categoryButtonText,
//           selectedCategory === category && styles.selectedCategoryButtonText,
//         ]}
//       >
//         {category}
//       </Text>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#FF6B6B" />
//         <Text style={styles.loadingText}>Loading menu...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header with Cart */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.cartButton}
//           onPress={() => navigation.navigate("Cart")}
//         >
//           <Ionicons name="bag-outline" size={24} color="#1a1a1a" />
//           {cartItemCount > 0 && (
//             <View style={styles.cartBadge}>
//               <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Ionicons
//           name="search"
//           size={20}
//           color="#666"
//           style={styles.searchIcon}
//         />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search for meals..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor="#999"
//         />
//       </View>

//       {/* Categories */}
//       <View style={styles.categoriesContainer}>
//         <FlatList
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           data={
//             categories.length
//               ? ["الكل", ...categories.map((cat) => cat.name)]
//               : ["الكل"]
//           }
//           renderItem={({ item }) => renderCategoryButton(item)}
//           keyExtractor={(item) => item}
//           contentContainerStyle={styles.categoriesList}
//         />
//       </View>

//       {/* Menu Items */}
//       <FlatList
//         data={filteredItems}
//         renderItem={renderMenuItem}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.menuList}
//         showsVerticalScrollIndicator={false}
//       />
//     </SafeAreaView>
//   );
// };

// // Mock data for fallback
// // const mockMenuItems = [
// //   {
// //     id: 1,
// //     name: "Grilled Chicken",
// //     description: "Tender grilled chicken breast with herbs and spices",
// //     price: 15.99,
// //     category: "Main Course",
// //     image: "/grilled-chicken.png",
// //     rating: 4.8,
// //     reviews: 124,
// //   },
// //   {
// //     id: 2,
// //     name: "Beef Burger",
// //     description: "Juicy beef patty with fresh vegetables and special sauce",
// //     price: 12.99,
// //     category: "Main Course",
// //     image: "/beef-burger.png",
// //     rating: 4.6,
// //     reviews: 89,
// //   },
// //   {
// //     id: 3,
// //     name: "Caesar Salad",
// //     description: "Fresh romaine lettuce with caesar dressing and croutons",
// //     price: 9.99,
// //     category: "Appetizers",
// //     image: "/caesar-salad.png",
// //     rating: 4.7,
// //     reviews: 67,
// //   },
// //   {
// //     id: 4,
// //     name: "Chocolate Cake",
// //     description: "Rich chocolate cake with creamy frosting",
// //     price: 6.99,
// //     category: "Desserts",
// //     image: "/decadent-chocolate-cake.png",
// //     rating: 4.9,
// //     reviews: 156,
// //   },
// // ]

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: "#666",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   cartButton: {
//     position: "relative",
//     padding: 8,
//   },
//   cartBadge: {
//     position: "absolute",
//     top: 0,
//     right: 0,
//     backgroundColor: "#FF6B6B",
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cartBadgeText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 20,
//     marginBottom: 20,
//     backgroundColor: "#f8f9fa",
//     borderRadius: 12,
//     paddingHorizontal: 16,
//   },
//   searchIcon: {
//     marginRight: 12,
//   },
//   searchInput: {
//     flex: 1,
//     height: 48,
//     fontSize: 16,
//     color: "#1a1a1a",
//   },
//   categoriesContainer: {
//     marginBottom: 20,
//   },
//   categoriesList: {
//     paddingHorizontal: 20,
//   },
//   categoryButton: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     marginRight: 12,
//     backgroundColor: "#f8f9fa",
//     borderRadius: 20,
//   },
//   selectedCategoryButton: {
//     backgroundColor: "#FF6B6B",
//   },
//   categoryButtonText: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#666",
//   },
//   selectedCategoryButtonText: {
//     color: "#fff",
//   },
//   menuList: {
//     paddingHorizontal: 20,
//   },
//   menuItem: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   menuItemImage: {
//     width: 100,
//     height: 100,
//     borderTopLeftRadius: 12,
//     borderBottomLeftRadius: 12,
//   },
//   menuItemContent: {
//     flex: 1,
//     padding: 16,
//   },
//   menuItemHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 8,
//   },
//   menuItemName: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#1a1a1a",
//     flex: 1,
//   },
//   menuItemPrice: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#FF6B6B",
//   },
//   menuItemDescription: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 12,
//     lineHeight: 20,
//   },
//   menuItemFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   ratingText: {
//     fontSize: 14,
//     color: "#666",
//     marginLeft: 4,
//     marginRight: 4,
//   },
//   reviewCount: {
//     fontSize: 14,
//     color: "#999",
//   },
//   addButton: {
//     backgroundColor: "#FF6B6B",
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default MenuScreen;

"use client";

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
  const [selectedCategory, setSelectedCategory] = useState("All");
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
        //   console.log("selectedCategory :: ", selectedCategory);
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
