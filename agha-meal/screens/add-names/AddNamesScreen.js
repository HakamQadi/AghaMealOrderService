import React from "react";
import { View, Text, Button } from "react-native";
import styles from "../../style/NamesScreenStyle";
import InputField from "../../components/InputField";
const AddNamesScreen = ({ navigation }) => {
  return (
    <View style={styles.namesStyle.container}>
      <View>
        <Text style={styles.namesStyle.wlcmText}>
          Welcome to Agha Meal Order Service
        </Text>
        <Text style={styles.namesStyle.secondryText}>
          Enter all names who want to order
        </Text>
      </View>
      <View>
        <InputField />
      </View>
    </View>
  );
};

export default AddNamesScreen;
