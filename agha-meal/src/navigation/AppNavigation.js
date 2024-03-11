import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/home/HomeScreen";
import AddNamesScreen from "../screens/addNames/AddNamesScreen";
import CategoryItems from "../components/categoryItems/CategoryItems";
import AllOrdersScreen from "../screens/allOrders/AllOrdersScreen";
import CheckoutScreen from "../screens/checkout/CheckoutScreen";

const AppNavigation = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Names"
        screenOptions={{
          cardStyle: {
            backgroundColor: "white",
          },
        }}
      >
        <Stack.Screen
          name="Names"
          component={AddNamesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Items" component={CategoryItems} />
        <Stack.Screen name="Orders" component={AllOrdersScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
