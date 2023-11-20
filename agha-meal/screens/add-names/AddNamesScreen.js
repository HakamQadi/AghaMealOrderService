import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import styles from "../../style/NamesScreenStyle";
import InputField from "../../components/InputField";

const AddNamesScreen = ({ navigation }) => {
  const [inputFields, setInputFields] = useState([1,2]); 

  const addInputField = () => {
    setInputFields(prevFields => [...prevFields, prevFields.length + 1]);
  };

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
        {inputFields.map((field, index) => (
          <InputField key={index} />
        ))}
        <Button title="Add Input Field" onPress={addInputField} />
      </View>
    </View>
  );
};

export default AddNamesScreen;
