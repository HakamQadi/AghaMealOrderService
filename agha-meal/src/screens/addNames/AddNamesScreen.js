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
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddNamesScreen = ({ navigation }) => {
  const { setNames,setOrder } = useContext(OrderContext);
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
    const updatedNamesList = [...namesList, name];
    setNamesList(updatedNamesList);
    setNames(updatedNamesList);

    // reset states
    reset({ name: "" });
    setError(false);
  };
  const continueSubmit = async () => {
    if (namesList.length === 0) {
      setError("Please add at least one name");
    } else {
      setError(false);
      reset({ name: "" });
      setNamesList([]);
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
      {!!errors.name?.message && (
        <Text style={styles.addNamesError}>{errors.name?.message}</Text>
      )}
      <FlatList
        data={namesList}
        renderItem={renderNameItem}
        keyExtractor={(index) => index.toString()}
        contentContainerStyle={{
          width: 250,
          paddingVertical: 20,
          // android
          alignSelf: "center",
        }}
      />
      {error && <Text style={styles.error}>Please add at least one name</Text>}
      <Button
        text="Continue"
        onPress={continueSubmit}
        // android
        style={{ alignSelf: "center" }}
      />
    </View>
  );
};

export default AddNamesScreen;
