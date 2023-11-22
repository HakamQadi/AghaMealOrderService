import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../style/NamesScreenStyle";

const AddNamesScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [namesList, setNamesList] = useState([]);

  const addName = () => {
    if (name.trim() !== "") {
      setNamesList((prevNames) => [...prevNames, name]);
      setName(""); // Clear the input field after adding the name
    }
  };

  const setNamesToLocalStorage = async (value) => {
    try {
      // console.log(namesList)
      await AsyncStorage.setItem("names", JSON.stringify(value));
      navigation.navigate('Home',{names:namesList})
    } catch (e) {
      // saving error
    }
  };


  // const test = async () => {
  //   try {
  //     // console.log(namesList)
  //     const value = await AsyncStorage.getItem('names');
  //     console.log(value)
  //   } catch (e) {
  //     // saving error
  //   }
  // };


  const [isFocused, setIsFocused] = useState(false);
  // const [names, setNames] = useState([]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const outlineScaleX = new Animated.Value(0);
  const outlineScaleY = new Animated.Value(0);

  const animateOutline = (valueX, valueY) => {
    Animated.timing(outlineScaleX, {
      toValue: valueX,
      duration: 300,
      useNativeDriver: false,
    }).start();
    Animated.timing(outlineScaleY, {
      toValue: valueY,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  React.useEffect(() => {
    animateOutline(isFocused ? 1 : 0, isFocused ? 1 : 0);
  }, [isFocused]);

  const handleNamesInput = (text) => {
    setName(text);
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
        <View style={styles.namesStyle.inputFieldContainer}>
          <View style={styles.namesStyle.inputContainer}>
            <TextInput
              style={styles.namesStyle.input}
              placeholder="Enter a name"
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <TouchableOpacity style={styles.namesStyle.addBtn} onPress={addName}>
            <TouchableOpacity onPress={addName} style={{ color: "white" }}>
              <FontAwesome5 name="plus" size={20} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ marginTop: 20  }}>
          {namesList.map((item, index) => (
            <View key={index} style={{ flexDirection: "row", gap: 5,justifyContent:'flex-end' }}>
              <Text>{item}</Text>
              <TouchableOpacity
                onPress={() => {
                  const updatedNames = namesList.filter((_, i) => i !== index);
                  setNamesList(updatedNames);
                }}
                style={styles.namesStyle.removeBtn}
              >
                <FontAwesome5 name="minus" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={styles.namesStyle.continueBtnContainer}>
          <TouchableOpacity
            style={styles.namesStyle.continueBtn}
            onPress={() => setNamesToLocalStorage(namesList)}
          >
            <Text style={styles.namesStyle.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.namesStyle.continueBtnContainer}>
          <TouchableOpacity
            style={styles.namesStyle.continueBtn}
            onPress={() => test()}
          >
            <Text style={styles.namesStyle.continueBtnText}>test</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </ScrollView>
  );
};

export default AddNamesScreen;
