import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  FlatList,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";
import Button from "../../components/button/Button";
import { OrderContext } from "../../context/OrderContext";

const AddNamesScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [namesList, setNamesList] = useState([]);
  const { state, setNames } = useContext(OrderContext);

  console.log("STATE ::: ", state);

  // const addName = () => {
  //   if (name.trim() !== "") {
  //     setNamesList((prevNames) => [...prevNames, name]);
  //   }
  //   setNames(namesList);
  // };

  const addName = () => {
    if (name.trim() !== "") {
      const updatedNamesList = [...namesList, name];
      setNamesList(updatedNamesList);
      setNames(updatedNamesList);
      setName("");
    }
  };

  const handleSubmit = () => {
    {
      namesList.length != 0
        ? // TODO Optional : remove the names from here and get them from the context in the home screen
          navigation.navigate("Home", { names: namesList })
        : null;
    }
  };

  // const setNamesToLocalStorage = async (value) => {
  //   try {
  //     await AsyncStorage.setItem("names", JSON.stringify(value));
  //     navigation.navigate("Home", { names: namesList });
  //   } catch (e) {}
  // };

  // const [isFocused, setIsFocused] = useState(false);

  // const handleFocus = () => {
  //   setIsFocused(true);
  // };

  // const handleBlur = () => {
  //   setIsFocused(false);
  // };

  // const outlineScaleX = new Animated.Value(0);
  // const outlineScaleY = new Animated.Value(0);

  // const animateOutline = (valueX, valueY) => {
  //   Animated.timing(outlineScaleX, {
  //     toValue: valueX,
  //     duration: 300,
  //     useNativeDriver: false,
  //   }).start();
  //   Animated.timing(outlineScaleY, {
  //     toValue: valueY,
  //     duration: 300,
  //     useNativeDriver: false,
  //   }).start();
  // };

  // React.useEffect(() => {
  //   animateOutline(isFocused ? 1 : 0, isFocused ? 1 : 0);
  // }, [isFocused]);

  // const handleNamesInput = (text) => {
  //   setName(text);
  // };

  const renderNameItem = ({ item, index }) => (
    <View style={styles.nameContainer}>
      <Text style={styles.nameContainer}>{item}</Text>
      <TouchableOpacity
        onPress={() => {
          const updatedNames = namesList.filter((_, i) => i !== index);
          setNamesList(updatedNames);
          setNames(updatedNames);
        }}
        style={styles.removeBtn}
      >
        <FontAwesome5 name="minus" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.wlcmText}>Welcome to Agha Meal Order Service</Text>
        <Text style={styles.secondryText}>
          Enter all names who want to order
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addName}>
          <FontAwesome5 name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={namesList}
        renderItem={renderNameItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          width: 250,
          paddingVertical: 20,
        }}
      />

      <Button text={"Continue"} onPress={() => handleSubmit(namesList)} />
      {/* <View style={styles.continueBtnContainer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => setNamesToLocalStorage(namesList)}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View> */}
      {/* <View style={styles.continueBtnContainer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => test()}
          >
            <Text style={styles.ƒ√}>test</Text>
          </TouchableOpacity>
        </View> */}
    </View>
  );
};

export default AddNamesScreen;
