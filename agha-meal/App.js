import React from "react";
import { View, StyleSheet } from "react-native";
import AppNavigation from "./src/navigation/AppNavigation";
import { Provider as OrderDataProvider } from "./src/context/OrderContext";

function App() {
  return (
    <View style={styles.container}>
      <OrderDataProvider>
        <AppNavigation />
      </OrderDataProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
