import { useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/auth-context";
import { api } from "../../lib/api-client";
import { COLORS, CONDITION_OPTIONS, ITEM_GROUPS } from "../../lib/constants";
import Button from "../../components/ui/Button";
import type { IdentifyResponse, ItemResponse } from "../../types/api";

type Step = "choose" | "capture" | "uploading" | "review" | "contact" | "receipt";

export default function DonateScreen() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [step, setStep] = useState<Step>("choose");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [itemId, setItemId] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<IdentifyResponse | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");

  const toggleItem = (item: string) => {
    setSelectedItems((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  const startDonation = async (): Promise<string> => {
    if (itemId) return itemId;
    const token = await getToken();
    // Use public donate endpoint (no auth needed)
    const resp = await fetch(`${api.baseUrl || ""}/donate/start`, { method: "POST" });
    if (!resp.ok) throw new Error("Failed to start donation");
    const item: ItemResponse = await resp.json();
    setItemId(item.id);
    return item.id;
  };

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

  const handleDescribeManually = async () => {
    try {
      await startDonation();
      setStep("review");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleUploadAndIdentify = async () => {
    if (!imageUri) return;
    setStep("uploading");
    try {
      const id = await startDonation();
      const token = await getToken();
      await api.uploadFile(`/donate/${id}/upload`, imageUri, "photo.jpg", "image/jpeg", token || "");
      const resp = await fetch(`${api.baseUrl || ""}/donate/${id}/identify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (resp.ok) {
        const identify: IdentifyResponse = await resp.json();
        setAiResult(identify);
        setDescription(identify.description);
        setCondition(identify.condition || "");
      }
      setStep("review");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to process image");
      setStep("capture");
    }
  };

  const handleSubmit = async () => {
    if (!itemId) return;
    try {
      const resp = await fetch(`${api.baseUrl || ""}/donate/${itemId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedItems.length > 0 ? selectedItems.join(", ") : "Donated Item",
          description: description || "No description provided",
          category: selectedItems.length > 0 ? selectedItems[0] : null,
          condition: condition || null,
          donor_name: donorName || null,
          donor_email: donorEmail || null,
          donor_phone: donorPhone || null,
        }),
      });
      if (!resp.ok) throw new Error("Submission failed");
      const data: ItemResponse = await resp.json();
      setReceiptNumber(data.id.split("-")[0].toUpperCase());
      setStep("receipt");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const reset = () => {
    setStep("choose");
    setImageUri(null);
    setItemId(null);
    setAiResult(null);
    setSelectedItems([]);
    setDescription("");
    setCondition("");
    setDonorName("");
    setDonorEmail("");
    setDonorPhone("");
  };

  // Choose step
  if (step === "choose") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Donate Electronics</Text>
        <Text style={styles.subheading}>No account needed. Photo optional.</Text>

        <Pressable style={styles.optionCard} onPress={() => setStep("capture")}>
          <Text style={styles.optionIcon}>📷</Text>
          <View style={styles.optionTextWrap}>
            <Text style={styles.optionTitle}>Upload a photo</Text>
            <Text style={styles.optionDesc}>AI identifies the item for you</Text>
          </View>
        </Pressable>

        <Pressable style={styles.optionCard} onPress={handleDescribeManually}>
          <Text style={styles.optionIcon}>✏️</Text>
          <View style={styles.optionTextWrap}>
            <Text style={styles.optionTitle}>Describe it</Text>
            <Text style={styles.optionDesc}>No photo — select what you have</Text>
          </View>
        </Pressable>

        <Pressable style={styles.optionCard} onPress={handleDescribeManually}>
          <Text style={styles.optionIcon}>📍</Text>
          <View style={styles.optionTextWrap}>
            <Text style={styles.optionTitle}>Bring it myself</Text>
            <Text style={styles.optionDesc}>Drop off at our Seattle location</Text>
          </View>
        </Pressable>
      </ScrollView>
    );
  }

  // Uploading spinner
  if (step === "uploading") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.uploadText}>AI is analyzing your item...</Text>
      </View>
    );
  }

  // Capture step
  if (step === "capture") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
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
            <Text style={styles.captureText}>Take a photo or choose from gallery</Text>
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
            <View style={{ marginTop: 24 }}>
              <Button title="Back" onPress={() => setStep("choose")} variant="outline" />
            </View>
          </View>
        )}
      </ScrollView>
    );
  }

  // Review step — grouped multi-select
  if (step === "review") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
        {aiResult && (
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI identified with {Math.round(aiResult.confidence * 100)}% confidence</Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>What are you donating? *</Text>
        {ITEM_GROUPS.map((group) => (
          <View key={group.label} style={styles.groupWrap}>
            <Text style={styles.groupLabel}>{group.label}</Text>
            <View style={styles.chipWrap}>
              {group.items.map((item) => {
                const sel = selectedItems.includes(item);
                return (
                  <Pressable
                    key={`${group.label}-${item}`}
                    onPress={() => toggleItem(item)}
                    style={[styles.chip, sel && styles.chipSelected]}
                  >
                    <Text style={[styles.chipText, sel && styles.chipTextSelected]}>
                      {sel ? "✓ " : ""}{item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
        {selectedItems.length > 0 && (
          <Text style={styles.selectedCount}>{selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""} selected</Text>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Details (optional)</Text>
          <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline placeholder="Brand, model, age, qty, issues..." placeholderTextColor={COLORS.textSecondary} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Condition</Text>
          {CONDITION_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => setCondition(opt.value)}
              style={[styles.radioRow, condition === opt.value && styles.radioRowActive]}
            >
              <View style={[styles.radio, condition === opt.value && styles.radioActive]} />
              <Text style={styles.radioText}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>

        <Button title="Next: Contact Info" onPress={() => setStep("contact")} disabled={selectedItems.length === 0} />
      </ScrollView>
    );
  }

  // Contact step
  if (step === "contact") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionLabel}>Contact Info (optional)</Text>
        <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 16 }}>Leave blank to donate anonymously.</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={donorName} onChangeText={setDonorName} placeholder="Jane Doe" placeholderTextColor={COLORS.textSecondary} />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={donorEmail} onChangeText={setDonorEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={COLORS.textSecondary} />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Phone</Text>
          <TextInput style={styles.input} value={donorPhone} onChangeText={setDonorPhone} placeholder="(206) 555-0100" keyboardType="phone-pad" placeholderTextColor={COLORS.textSecondary} />
        </View>
        <Button title="Submit Donation" onPress={handleSubmit} />
        <View style={{ height: 8 }} />
        <Pressable onPress={handleSubmit}><Text style={styles.skipLink}>Skip — donate anonymously</Text></Pressable>
      </ScrollView>
    );
  }

  // Receipt step
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.receiptCard}>
        <View style={styles.receiptHeader}>
          <Text style={styles.receiptBrand}>eRevive NW</Text>
          <Text style={styles.receiptNum}>#{receiptNumber}</Text>
        </View>
        <Text style={styles.receiptDate}>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</Text>

        {(donorName || donorEmail) && (
          <View style={styles.receiptSection}>
            <Text style={styles.receiptSectionTitle}>DONOR</Text>
            {donorName ? <Text style={styles.receiptText}>{donorName}</Text> : null}
            {donorEmail ? <Text style={styles.receiptTextSub}>{donorEmail}</Text> : null}
            {donorPhone ? <Text style={styles.receiptTextSub}>{donorPhone}</Text> : null}
          </View>
        )}

        <View style={styles.receiptSection}>
          <Text style={styles.receiptSectionTitle}>ITEMS DONATED</Text>
          {selectedItems.map((item) => (
            <Text key={item} style={styles.receiptItem}>✓ {item}</Text>
          ))}
        </View>

        {description ? (
          <View style={styles.receiptSection}>
            <Text style={styles.receiptSectionTitle}>DETAILS</Text>
            <Text style={styles.receiptTextSub}>{description}</Text>
          </View>
        ) : null}

        <Text style={styles.receiptFooter}>Thank you for recycling responsibly with eRevive NW.</Text>
      </View>

      <View style={{ marginTop: 16 }}>
        <Button title="Donate Another Item" onPress={reset} />
        <View style={{ height: 8 }} />
        <Button title="Back to Home" onPress={() => router.push("/(tabs)")} variant="outline" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background },
  heading: { fontSize: 22, fontWeight: "700", color: COLORS.text, marginBottom: 4 },
  subheading: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 24 },
  optionCard: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 18, marginBottom: 12, gap: 14 },
  optionIcon: { fontSize: 28 },
  optionTextWrap: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  optionDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  uploadText: { marginTop: 16, fontSize: 16, color: COLORS.textSecondary },
  previewImage: { width: "100%", height: 220, borderRadius: 14, marginBottom: 16, backgroundColor: COLORS.border },
  aiBadge: { backgroundColor: COLORS.primaryLight, borderRadius: 10, padding: 12, marginBottom: 16 },
  aiBadgeText: { color: COLORS.primaryDark, fontSize: 14, fontWeight: "500", textAlign: "center" },
  sectionLabel: { fontSize: 15, fontWeight: "600", color: COLORS.text, marginBottom: 12 },
  groupWrap: { marginBottom: 14 },
  groupLabel: { fontSize: 11, fontWeight: "700", color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: COLORS.surface },
  chipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: "500", color: COLORS.text },
  chipTextSelected: { color: "#fff" },
  selectedCount: { fontSize: 12, color: COLORS.primary, fontWeight: "600", marginTop: 4, marginBottom: 8 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", color: COLORS.text, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: COLORS.text, backgroundColor: COLORS.surface },
  textArea: { height: 70, textAlignVertical: "top" },
  radioRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, marginBottom: 4 },
  radioRowActive: { backgroundColor: COLORS.primaryLight },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: COLORS.border, marginRight: 10 },
  radioActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  radioText: { fontSize: 14, color: COLORS.text },
  skipLink: { textAlign: "center", fontSize: 14, color: COLORS.textSecondary, paddingVertical: 12 },
  captureArea: { alignItems: "center", paddingVertical: 40 },
  captureTitle: { fontSize: 20, fontWeight: "600", color: COLORS.text },
  captureText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8, marginBottom: 32 },
  captureButtons: { flexDirection: "row", gap: 16 },
  captureBtn: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, padding: 24, alignItems: "center", width: 130 },
  captureBtnIcon: { fontSize: 32 },
  captureBtnText: { marginTop: 8, fontSize: 14, fontWeight: "500", color: COLORS.text },
  receiptCard: { backgroundColor: COLORS.surface, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
  receiptHeader: { backgroundColor: COLORS.primary, padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  receiptBrand: { fontSize: 20, fontWeight: "700", color: "#fff" },
  receiptNum: { fontSize: 16, fontWeight: "700", color: "#fff" },
  receiptDate: { fontSize: 13, color: COLORS.textSecondary, paddingHorizontal: 20, paddingTop: 16 },
  receiptSection: { paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1, borderColor: COLORS.border, marginTop: 16 },
  receiptSectionTitle: { fontSize: 11, fontWeight: "700", color: COLORS.textSecondary, letterSpacing: 1, marginBottom: 6 },
  receiptText: { fontSize: 15, fontWeight: "500", color: COLORS.text },
  receiptTextSub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  receiptItem: { fontSize: 14, color: COLORS.text, marginBottom: 4 },
  receiptFooter: { fontSize: 12, color: COLORS.textSecondary, textAlign: "center", padding: 20 },
});
