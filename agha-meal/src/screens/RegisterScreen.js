import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import * as Yup from "yup";
import { register } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import InfoDialog from "../components/dialog/infoDialog";

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Full name is required")
    .min(3, "Full name must be at least 3 characters"),
  phone: Yup.string()
    .trim()
    .required("Phone number is required")
    // .matches(/^\d{10}$/, "Phone must be exactly 10 digits"),
    .matches(
      /^(077|078|079)\d{7}$/,
      "Phone must be 10 digits and start with 077, 078, or 079"
    ),
  password: Yup.string()
    .trim()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
      "Password must be at least 8 characters, include 1 lowercase, 1 uppercase, and 1 special character (!@#$%^&*)"
    ),
});

const RegisterScreen = ({ navigation }) => {
  const { login: loginUser } = useAuth();

  const [dialogVisible, setDialogVisible] = useState(false);

  const [infoDialogData, setInfoDialogData] = useState({
    title: "",
    message: "",
    type: "info",
    onClose: null,
  });

  const showDialog = (title, message, type = "info", onClose = null) => {
    setInfoDialogData({
      title,
      message,
      type,
      onClose: onClose || (() => setDialogVisible(false)),
    });
    setDialogVisible(true);
  };

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      const data = await register(values);

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      showDialog("Success", "Registration successful", "success", () => {
        setDialogVisible(false);
        loginUser(data.token, data.user);
        navigation.navigate("Menu");
      });
    } catch (error) {
      if (error.response) {
        showDialog(
          "Error",
          error.response.data?.message || "Something went wrong",
          "error"
        );
      } else {
        showDialog(
          "Error",
          "Network error. Please check your connection",
          "error"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <Formik
            initialValues={{ name: "", phone: "", password: "", role: "user" }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
              setFieldValue,
            }) => (
              <View style={styles.form}>
                {/* Full Name */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    placeholder="Enter your full name"
                    autoCapitalize="words"
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>

                {/* Phone */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={values.phone}
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                  />
                  {touched.phone && errors.phone && (
                    <Text style={styles.errorText}>{errors.phone}</Text>
                  )}
                </View>

                {/* Password */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    placeholder="Create a password"
                    secureTextEntry
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[styles.button, isSubmitting && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>Create Account</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Already have an account?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={styles.linkText}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
      <InfoDialog
        visible={dialogVisible}
        title={infoDialogData.title}
        message={infoDialogData.message}
        type={infoDialogData.type}
        onClose={infoDialogData.onClose}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1C1C1E",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 40,
  },
  form: { width: "100%" },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", color: "#1C1C1E", marginBottom: 8 },
  input: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    color: "#1C1C1E",
  },
  errorText: { color: "#FF3B30", fontSize: 14, marginTop: 4 },
  roleContainer: { flexDirection: "row", gap: 12 },
  roleButton: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F2F2F7",
  },
  roleButtonActive: { backgroundColor: "#FF6B6B", borderColor: "#FF6B6B" },
  roleButtonText: { fontSize: 16, fontWeight: "600", color: "#8E8E93" },
  roleButtonTextActive: { color: "#FFFFFF" },
  button: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: { fontSize: 16, color: "#8E8E93" },
  linkText: { fontSize: 16, color: "#FF6B6B", fontWeight: "600" },
});

export default RegisterScreen;
