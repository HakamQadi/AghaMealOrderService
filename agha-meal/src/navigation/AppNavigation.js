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
      <Stack.Navigator initialRouteName="Home">
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
