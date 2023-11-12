import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import AppNavigation from "./navigation/AppNavigation";

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <AppNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
