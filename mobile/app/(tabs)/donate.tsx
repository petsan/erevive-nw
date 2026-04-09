import { useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/auth-context";
import { api } from "../../lib/api-client";
import { COLORS } from "../../lib/constants";
import Button from "../../components/ui/Button";
import type { IdentifyResponse, ItemResponse } from "../../types/api";

type Step = "capture" | "uploading" | "review" | "done";

export default function DonateScreen() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [step, setStep] = useState<Step>("capture");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<IdentifyResponse | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const pickImage = async (useCamera: boolean) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow access to continue.");
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUploadAndIdentify = async () => {
    if (!imageUri) return;
    const token = await getToken();
    if (!token) return;

    setStep("uploading");

    try {
      // Create item
      const item = await api.post<ItemResponse>("/items", { title: "Pending ID", description: "Uploading..." }, { token });

      // Upload image
      await api.uploadFile(`/items/${item.id}/upload`, imageUri, "photo.jpg", "image/jpeg", token);

      // Identify
      const identify = await api.post<IdentifyResponse>(`/items/${item.id}/identify`, null, { token });

      setAiResult(identify);
      setTitle(identify.title);
      setDescription(identify.description);
      setCategory(identify.category || "");
      setStep("review");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to process image");
      setStep("capture");
    }
  };

  const handleSubmit = () => {
    setStep("done");
    Alert.alert("Submitted!", "Your donation has been submitted.", [
      { text: "OK", onPress: () => { setStep("capture"); setImageUri(null); setAiResult(null); router.push("/(tabs)"); } },
    ]);
  };

  const reset = () => { setStep("capture"); setImageUri(null); setAiResult(null); };

  if (step === "uploading") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.uploadText}>AI is analyzing your item...</Text>
      </View>
    );
  }

  if (step === "review") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
        {aiResult && (
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI identified with {Math.round(aiResult.confidence * 100)}% confidence</Text>
          </View>
        )}
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline numberOfLines={3} />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <TextInput style={styles.input} value={category} onChangeText={setCategory} />
        </View>
        <Button title="Submit Donation" onPress={handleSubmit} />
        <View style={{ height: 8 }} />
        <Button title="Start Over" onPress={reset} variant="outline" />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <Button title="Upload & Identify with AI" onPress={handleUploadAndIdentify} />
            <View style={{ height: 8 }} />
            <Button title="Choose Different Photo" onPress={() => setImageUri(null)} variant="outline" />
          </>
        ) : (
          <View style={styles.captureArea}>
            <Text style={styles.captureTitle}>Photograph your item</Text>
            <Text style={styles.captureText}>Take a photo or choose from your gallery</Text>
            <View style={styles.captureButtons}>
              <Pressable style={styles.captureBtn} onPress={() => pickImage(true)}>
                <Text style={styles.captureBtnIcon}>📷</Text>
                <Text style={styles.captureBtnText}>Camera</Text>
              </Pressable>
              <Pressable style={styles.captureBtn} onPress={() => pickImage(false)}>
                <Text style={styles.captureBtnIcon}>🖼️</Text>
                <Text style={styles.captureBtnText}>Gallery</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background },
  uploadText: { marginTop: 16, fontSize: 16, color: COLORS.textSecondary },
  previewImage: { width: "100%", height: 250, borderRadius: 14, marginBottom: 16, backgroundColor: COLORS.border },
  aiBadge: { backgroundColor: COLORS.primaryLight, borderRadius: 10, padding: 12, marginBottom: 16 },
  aiBadgeText: { color: COLORS.primaryDark, fontSize: 14, fontWeight: "500", textAlign: "center" },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", color: COLORS.text, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: COLORS.text, backgroundColor: COLORS.surface },
  textArea: { height: 80, textAlignVertical: "top" },
  captureArea: { alignItems: "center", paddingVertical: 40 },
  captureTitle: { fontSize: 20, fontWeight: "600", color: COLORS.text },
  captureText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8, marginBottom: 32 },
  captureButtons: { flexDirection: "row", gap: 16 },
  captureBtn: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, padding: 24, alignItems: "center", width: 130 },
  captureBtnIcon: { fontSize: 32 },
  captureBtnText: { marginTop: 8, fontSize: 14, fontWeight: "500", color: COLORS.text },
});
