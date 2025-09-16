import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TermsAndConditionsScreen from "../screens/TermsAndConditionsScreen";
import AboutUsScreen from "../screens/AboutUsScreen";

const Stack = createStackNavigator();

const AuthNavigation = ({ onLogin }) => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {(props) => <RegisterScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditionsScreen}
      />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
