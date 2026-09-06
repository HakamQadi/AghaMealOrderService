import { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RatingStars from "../RatingStars";
import { submitReview } from "../../services/api";

/**
 * Post-order feedback. Rates the order as a whole and, optionally, each meal
 * in it — the per-meal scores are what make the menu judgeable item by item.
 */
const ReviewModal = ({ visible, onClose, order, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [mealRatings, setMealRatings] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const rateMeal = (mealId, value) =>
    setMealRatings((prev) => ({ ...prev, [mealId]: value }));

  const submit = async () => {
    if (rating === 0) {
      setError("Please choose a rating first.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await submitReview({
        orderId: order._id,
        rating,
        comment: comment.trim() || undefined,
        mealRatings: Object.entries(mealRatings).map(([meal, value]) => ({
          meal,
          rating: value,
        })),
      });
      onSubmitted?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not send your review.");
    } finally {
      setSubmitting(false);
    }
  };

  const rateableItems = (order?.cartItems ?? []).filter((item) => item.meal);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>How was your order?</Text>
              <TouchableOpacity onPress={onClose} style={styles.close}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
              <RatingStars value={rating} onChange={setRating} size={36} style={styles.stars} />

              {rateableItems.length > 0 && (
                <>
                  <Text style={styles.sectionLabel}>Rate the items (optional)</Text>
                  {rateableItems.map((item) => (
                    <View key={String(item.meal)} style={styles.mealRow}>
                      <Text style={styles.mealName} numberOfLines={1}>
                        {item.name?.en}
                      </Text>
                      <RatingStars
                        value={mealRatings[String(item.meal)] ?? 0}
                        onChange={(v) => rateMeal(String(item.meal), v)}
                        size={20}
                      />
                    </View>
                  ))}
                </>
              )}

              <Text style={styles.sectionLabel}>Anything else? (optional)</Text>
              <TextInput
                style={styles.input}
                value={comment}
                onChangeText={setComment}
                placeholder="Tell us what went well, or what did not"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={1000}
              />

              {!!error && <Text style={styles.error}>{error}</Text>}

              <TouchableOpacity
                style={[styles.submit, submitting && { opacity: 0.6 }]}
                onPress={submit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Send feedback</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  container: { backgroundColor: "#fff", borderRadius: 20, maxHeight: "85%" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
  close: { padding: 6, backgroundColor: "#f8f9fa", borderRadius: 8 },
  body: { padding: 20 },
  stars: { justifyContent: "center", marginBottom: 20 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginTop: 12,
    marginBottom: 8,
  },
  mealRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 6,
  },
  mealName: { flex: 1, fontSize: 14, color: "#3a3a3c" },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  error: { color: "#FF6B6B", fontSize: 13, marginTop: 10 },
  submit: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

export default ReviewModal;
