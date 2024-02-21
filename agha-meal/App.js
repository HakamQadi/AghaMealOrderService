import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import AppNavigation from "./src/navigation/AppNavigation";
import { Provider as OrderDataProvider } from "./src/context/OrderContext";

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <OrderDataProvider>
        <AppNavigation />
      </OrderDataProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
