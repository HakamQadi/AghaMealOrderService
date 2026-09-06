import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigation from "./TabNavigation";
import AuthNavigation from "./AuthNavigation";

const RootStack = createStackNavigator();

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* Always accessible tabs */}
        <RootStack.Screen name="Main" component={TabNavigation} />
        {/* Auth stack available for login/register */}
        <RootStack.Screen name="Auth" component={AuthNavigation} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
