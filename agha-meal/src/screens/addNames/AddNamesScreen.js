import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { OrderContext } from "../../context/OrderContext";
import Button from "../../components/button/Button";
import styles from "./styles";

const AddNamesScreen = ({ navigation }) => {
  const { setNames, setOrder } = useContext(OrderContext);
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
      <View style={styles.nameContent}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{item.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.nameText}>{item}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          const updatedNames = namesList.filter((_, i) => i !== index);
          setNamesList(updatedNames);
          setNames(updatedNames);
        }}
        style={styles.removeBtn}
        activeOpacity={0.7}
      >
        <FontAwesome5 name="times" size={14} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" /> */}
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <View style={styles.headerIcon}>
            <FontAwesome5 name="utensils" size={24} color="#EEA734" />
          </View>
          <Text style={styles.wlcmText}>Agha Meal Order</Text>
          <Text style={styles.secondryText}>
            Add everyone who wants to place an order
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Add Names</Text>
          <View style={styles.inputContainer}>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrapper}>
                  <FontAwesome5
                    name="user"
                    size={16}
                    color="#868686"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter a name"
                    placeholderTextColor="#a0a0a0"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={handleSubmit(addName)}
              activeOpacity={0.8}
            >
              <FontAwesome5 name="plus" size={18} color="white" />
            </TouchableOpacity>
          </View>
          {!!errors.name?.message && (
            <Text style={styles.addNamesError}>{errors.name?.message}</Text>
          )}
        </View>

        <View style={styles.listSection}>
          {namesList.length > 0 && (
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>
                Added Names ({namesList.length})
              </Text>
            </View>
          )}
          <FlatList
            data={namesList}
            renderItem={renderNameItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.bottomSection}>
          {error && (
            <View style={styles.errorContainer}>
              <FontAwesome5
                name="exclamation-circle"
                size={16}
                color="#e74c3c"
              />
              <Text style={styles.error}>{error}</Text>
            </View>
          )}
          <Button
            text="Continue"
            onPress={continueSubmit}
            style={styles.continueButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddNamesScreen;
