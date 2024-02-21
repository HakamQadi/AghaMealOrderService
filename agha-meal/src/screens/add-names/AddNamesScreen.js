// const addName = () => {
//   if (name.trim() !== "") {
//     setNamesList((prevNames) => [...prevNames, name]);
//   }
//   setNames(namesList);
// };
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

{
  /* <Button text={"Continue"} onPress={() => nameSubmit(handleSubmit)} /> */
}
{
  /* <View style={styles.continueBtnContainer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => setNamesToLocalStorage(namesList)}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View> */
}
{
  /* <View style={styles.continueBtnContainer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => test()}
          >
            <Text style={styles.ƒ√}>test</Text>
          </TouchableOpacity>
        </View> */
}

import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { OrderContext } from "../../context/OrderContext";
import Button from "../../components/button/Button";
import styles from "./styles";

const AddNamesScreen = ({ navigation }) => {
  const { setNames } = useContext(OrderContext);
  const [namesList, setNamesList] = useState([]);
  const [error, setError] = useState(false);

  const NamesSchema = yup.object({
    name: yup.string().required("Please enter a name").trim(),
  });

  const form = useForm({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(NamesSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = form;

  const addName = ({ name }) => {
    if (name.trim() !== "") {
      const updatedNamesList = [...namesList, name];
      setNamesList(updatedNamesList);
      setNames(updatedNamesList);

      // reset states
      reset({ name: "" });
      setError(!error);
    }
  };
  const continueSubmit = () => {
    if (namesList.length === 0) {
      setError("Please add at least one name");
    } else {
      setError(false);
      // TODO Optional : remove the names from here and get them from the context in the home screen
      navigation.navigate("Home", { names: namesList });
    }
  };

  const renderNameItem = ({ item, index }) => (
    <View style={styles.nameContainer}>
      <Text style={styles.nameText}>{item}</Text>
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
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter a name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleSubmit(addName)}>
          <FontAwesome5 name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={namesList}
        renderItem={renderNameItem}
        keyExtractor={(index) => index.toString()}
        contentContainerStyle={{
          width: 250,
          paddingVertical: 20,
        }}
      />
      {error && <Text style={styles.error}>Please add at least one name</Text>}
      <Button text="Continue" onPress={continueSubmit} />
    </View>
  );
};

export default AddNamesScreen;
