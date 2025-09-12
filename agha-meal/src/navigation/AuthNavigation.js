import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "../screens/LoginScreen"
import RegisterScreen from "../screens/RegisterScreen"

const Stack = createStackNavigator()

const AuthNavigation = ({ onLogin }) => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login">{(props) => <LoginScreen {...props} onLogin={onLogin} />}</Stack.Screen>
      <Stack.Screen name="Register">{(props) => <RegisterScreen {...props} onLogin={onLogin} />}</Stack.Screen>
    </Stack.Navigator>
  )
}

export default AuthNavigation
