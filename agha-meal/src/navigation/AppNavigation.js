// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import HomeScreen from "../screens/home/HomeScreen";
// import AddNamesScreen from "../screens/addNames/AddNamesScreen";
// import CategoryItems from "../components/categoryItems/CategoryItems";
// import AllOrdersScreen from "../screens/allOrders/AllOrdersScreen";

// import CheckoutScreen from "../screens/checkout/CheckoutScreen";

// const AppNavigation = () => {
//   const Stack = createStackNavigator();

//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Names"
//         screenOptions={{
//           cardStyle: {
//             backgroundColor: "white",
//           },
//         }}
//       >
//         <Stack.Screen
//           name="Names"
//           component={AddNamesScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="Items" component={CategoryItems} />
//         <Stack.Screen name="Orders" component={AllOrdersScreen} />
//         <Stack.Screen name="Checkout" component={CheckoutScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigation;

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

// Import screens
import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import CartScreen from "../screens/CartScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#fff",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#f0f0f0",
          },
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 18,
            color: "#1a1a1a",
          },
          headerTintColor: "#1a1a1a",
          cardStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ title: "Menu", headerShown: false }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: "Your Cart", headerShown: false }}
        />
        <Stack.Screen
          name="OrderHistory"
          component={OrderHistoryScreen}
          options={{ title: "Order History" }}
        />
        <Stack.Screen
          name="OrderDetails"
          component={OrderDetailsScreen}
          options={{ title: "Order Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
