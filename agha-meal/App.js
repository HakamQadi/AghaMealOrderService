import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./src/navigation/TabNavigation";
import { Provider as OrderDataProvider } from "./src/context/OrderContext";

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={styles.container}
        edges={["right", "bottom", "left"]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <OrderDataProvider>
          <NavigationContainer>
            <TabNavigation />
          </NavigationContainer>
        </OrderDataProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;
