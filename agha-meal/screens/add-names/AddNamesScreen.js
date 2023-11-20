import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "../../style/NamesScreenStyle";
import InputField from "../../components/InputField";

const AddNamesScreen = ({ navigation }) => {
  const [inputFields, setInputFields] = useState([1, 2]);

  const addInputField = () => {
    setInputFields((prevFields) => [...prevFields, prevFields.length + 1]);
  };

  const removeInputField = (index) => {
    setInputFields((prevFields) =>
      prevFields.filter((_, i) => i !== index)
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.namesStyle.scrollContainer}>
      <View style={styles.namesStyle.container}>
        <View>
          <Text style={styles.namesStyle.wlcmText}>
            Welcome to Agha Meal Order Service
          </Text>
          <Text style={styles.namesStyle.secondryText}>
            Enter all names who want to order
          </Text>
        </View>
        <View style={styles.namesStyle.addBtnContainer}>
          {inputFields.map((field, index) => (
            <View key={index} style={styles.namesStyle.inputFieldContainer}>
              <InputField onRemove={() => removeInputField(index)} />
              <TouchableOpacity
                style={styles.namesStyle.removeBtn}
                onPress={() => removeInputField(index)}
              >
                <FontAwesome5 name="minus" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.namesStyle.addBtn}
            onPress={addInputField}
          >
            <FontAwesome5 name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.namesStyle.continueBtnContainer}>
          <TouchableOpacity
            style={styles.namesStyle.continueBtn}
            // onPress={addInputField}
          >
            <Text style={styles.namesStyle.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddNamesScreen;
