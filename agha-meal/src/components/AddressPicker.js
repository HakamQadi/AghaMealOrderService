import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

/**
 * Delivery address capture.
 *
 * Delivery orders previously carried no address at all, so every one of them
 * needed a phone call. Street addressing in Jordan is inconsistent, so the
 * written line (building / floor / landmark) matters as much as the GPS pin —
 * both are required.
 */
const AddressPicker = ({
  address,
  onAddressChange,
  note,
  onNoteChange,
  coordinates,
  onCoordinatesChange,
  savedAddresses = [],
  onSelectSaved,
  saveForNextTime,
  onToggleSave,
  error,
}) => {
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const useCurrentLocation = async () => {
    setLocationError("");
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError(
          "Location permission denied. You can still type your address below."
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      onCoordinatesChange([position.coords.longitude, position.coords.latitude]);
    } catch (err) {
      setLocationError(
        "Could not get your location. Please type your address below."
      );
    } finally {
      setLocating(false);
    }
  };

  const hasPin = Array.isArray(coordinates) && coordinates.length === 2;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Delivery address</Text>

      {savedAddresses.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.savedRow}
        >
          {savedAddresses.map((saved, index) => (
            <TouchableOpacity
              key={saved._id ?? index}
              style={styles.savedChip}
              onPress={() => onSelectSaved(saved)}
            >
              <Ionicons name="bookmark-outline" size={14} color="#FF6B6B" />
              <Text style={styles.savedChipText} numberOfLines={1}>
                {saved.label || saved.address}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        style={[styles.locationButton, hasPin && styles.locationButtonSet]}
        onPress={useCurrentLocation}
        disabled={locating}
      >
        {locating ? (
          <ActivityIndicator size="small" color="#FF6B6B" />
        ) : (
          <Ionicons
            name={hasPin ? "checkmark-circle" : "locate"}
            size={18}
            color={hasPin ? "#4CAF50" : "#FF6B6B"}
          />
        )}
        <Text style={[styles.locationButtonText, hasPin && styles.locationSetText]}>
          {hasPin ? "Location pinned — tap to update" : "Use my current location"}
        </Text>
      </TouchableOpacity>

      {hasPin && (
        <Text style={styles.coordsHint}>
          {coordinates[1].toFixed(5)}, {coordinates[0].toFixed(5)}
        </Text>
      )}

      {!!locationError && <Text style={styles.errorText}>{locationError}</Text>}

      <Text style={styles.label}>Building, floor and landmark</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={address}
        onChangeText={onAddressChange}
        placeholder="e.g. Building 12, 3rd floor, next to Al-Salam pharmacy"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Delivery note (optional)</Text>
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={onNoteChange}
        placeholder="e.g. call on arrival"
      />

      <TouchableOpacity style={styles.saveRow} onPress={onToggleSave}>
        <Ionicons
          name={saveForNextTime ? "checkbox" : "square-outline"}
          size={20}
          color="#FF6B6B"
        />
        <Text style={styles.saveText}>Save this address for next time</Text>
      </TouchableOpacity>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  savedRow: { marginBottom: 12 },
  savedChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff5f5",
    borderColor: "#ffe0e0",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    maxWidth: 200,
  },
  savedChipText: { fontSize: 13, color: "#1a1a1a", flexShrink: 1 },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#ffe0e0",
    backgroundColor: "#fff5f5",
    borderRadius: 12,
    paddingVertical: 14,
  },
  locationButtonSet: { borderColor: "#c8e6c9", backgroundColor: "#f1f8f2" },
  locationButtonText: { fontSize: 15, fontWeight: "600", color: "#FF6B6B" },
  locationSetText: { color: "#2e7d32" },
  coordsHint: {
    fontSize: 11,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  multiline: { minHeight: 80 },
  saveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  saveText: { fontSize: 14, color: "#1C1C1E" },
  errorText: { color: "#FF6B6B", fontSize: 12, marginTop: 8 },
});

export default AddressPicker;
