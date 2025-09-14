import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Screens
import MenuScreen from "../screens/MenuScreen";
import CartScreen from "../screens/CartScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/dialog/ConfirmDialog";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Menu Stack
const MenuStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Menu"
        component={MenuScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// ✅ Orders Stack
const OrdersStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Orders"
        component={OrderHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// ✅ Settings Screen
const SettingsScreen = ({ navigation }) => {
  const { logout, user } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    logout();
    navigation.navigate("Auth", {
      screen: "Login",
    });
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Settings</Text>
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>Welcome, {user.name}</Text>
          <Text style={styles.userInfoSubtext}>Role: {user.role}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <ConfirmDialog
        visible={showLogoutDialog}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        confirmStyle="destructive"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </View>
  );
};

// ✅ Tab Navigation
const TabNavigation = () => {
  // const state = useNavigationState((state) => state);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       // Check if we are on Menu tab (index 1)
  //       if (state?.index === 1) {
  //         Alert.alert(
  //           "Exit App",
  //           "Are you sure you want to exit?",
  //           [
  //             { text: "Cancel", style: "cancel", onPress: () => {} },
  //             {
  //               text: "Exit",
  //               style: "destructive",
  //               onPress: () => BackHandler.exitApp(),
  //             },
  //           ],
  //           { cancelable: true }
  //         );
  //         return true; // prevent default back behavior
  //       }
  //       return false; // normal navigation
  //     };

  //     const subscription = BackHandler.addEventListener(
  //       "hardwareBackPress",
  //       onBackPress
  //     );

  //     return () => subscription.remove();
  //   }, [state?.index])
  // );

  return (
    <Tab.Navigator
      initialRouteName="MenuTab"
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          elevation: 0,
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          height: 85,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{
          tabBarLabel: "Orders",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MenuTab"
        component={MenuStack}
        options={{
          tabBarLabel: "Menu",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    padding: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 40,
  },
  userInfoText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  userInfoSubtext: {
    fontSize: 14,
    color: "#8E8E93",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
export default TabNavigation;
