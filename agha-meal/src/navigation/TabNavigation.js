import React from "react";
import { View, Text, StyleSheet, BackHandler, Alert } from "react-native";
import { useNavigationState, useFocusEffect } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

// Screens
import MenuScreen from "../screens/MenuScreen";
import CartScreen from "../screens/CartScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";

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
        options={{ title: "Your Cart" }}
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
        options={{ title: "Order History" }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ title: "Order Details" }}
      />
    </Stack.Navigator>
  );
};

// ✅ Settings Screen
const SettingsScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Settings</Text>
      <Text style={styles.screenSubtitle}>
        Settings will be implemented later
      </Text>
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
});

export default TabNavigation;
