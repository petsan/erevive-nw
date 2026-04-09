import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../lib/auth-context";
import { api } from "../../lib/api-client";
import { COLORS, PICKUP_TIME_WINDOWS, SEATTLE_ZIP_PREFIXES } from "../../lib/constants";
import Button from "../../components/ui/Button";
import type { PickupResponse } from "../../types/api";

export default function PickupsScreen() {
  const { getToken } = useAuth();
  const [pickups, setPickups] = useState<PickupResponse[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [date, setDate] = useState("");
  const [timeWindow, setTimeWindow] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [instructions, setInstructions] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isValidZip = zipCode.length >= 3 && SEATTLE_ZIP_PREFIXES.some((p) => zipCode.startsWith(p));

  const loadPickups = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    try {
      const data = await api.get<PickupResponse[]>("/pickups", { token });
      setPickups(data);
    } catch {}
  }, [getToken]);

  useEffect(() => { loadPickups(); }, [loadPickups]);

  const onRefresh = async () => { setRefreshing(true); await loadPickups(); setRefreshing(false); };

  const handleSchedule = async () => {
    const token = await getToken();
    if (!token) return;

    setSubmitting(true);
    try {
      await api.post("/pickups", {
        scheduled_date: date,
        time_window: timeWindow,
        address_line1: address,
        zip_code: zipCode,
        special_instructions: instructions || null,
      }, { token });
      setShowForm(false);
      setDate(""); setTimeWindow(""); setAddress(""); setZipCode(""); setInstructions("");
      await loadPickups();
      Alert.alert("Scheduled!", "Your pickup has been scheduled.");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to schedule pickup");
    } finally {
      setSubmitting(false);
    }
  };

  if (showForm) {
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.formTitle}>Schedule a Pickup</Text>

          <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
          <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2026-04-20" />

          <Text style={styles.label}>Time Window</Text>
          <View style={styles.timeWindows}>
            {PICKUP_TIME_WINDOWS.map((w) => (
              <Pressable
                key={w.value}
                style={[styles.timeBtn, timeWindow === w.value && styles.timeBtnActive]}
                onPress={() => setTimeWindow(w.value)}
              >
                <Text style={[styles.timeBtnText, timeWindow === w.value && styles.timeBtnTextActive]}>{w.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Street Address</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="123 Pine Street" />

          <Text style={styles.label}>ZIP Code</Text>
          <TextInput style={[styles.input, zipCode.length >= 3 && !isValidZip && styles.inputError]} value={zipCode} onChangeText={setZipCode} placeholder="98101" maxLength={5} keyboardType="number-pad" />
          {zipCode.length >= 3 && !isValidZip && (
            <Text style={styles.errorText}>Seattle metro only (980xx / 981xx)</Text>
          )}

          <Text style={styles.label}>Special Instructions (optional)</Text>
          <TextInput style={[styles.input, { height: 60, textAlignVertical: "top" }]} value={instructions} onChangeText={setInstructions} multiline placeholder="Gate code, etc." />

          <View style={{ height: 8 }} />
          <Button title="Schedule Free Pickup" onPress={handleSchedule} loading={submitting} disabled={!date || !timeWindow || !address || !isValidZip} />
          <View style={{ height: 8 }} />
          <Button title="Cancel" onPress={() => setShowForm(false)} variant="outline" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pickups}
        keyExtractor={(p) => p.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        contentContainerStyle={pickups.length === 0 ? styles.emptyContainer : styles.list}
        ListHeaderComponent={
          <Pressable style={styles.scheduleBtn} onPress={() => setShowForm(true)}>
            <Text style={styles.scheduleBtnText}>+ Schedule a Pickup</Text>
          </Pressable>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No pickups scheduled</Text>
            <Text style={styles.emptyText}>Schedule a free pickup for your donated items</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardDate}>{item.scheduled_date}</Text>
              <View style={[styles.badge, { backgroundColor: item.status === "requested" ? "#fef3c7" : COLORS.primaryLight }]}>
                <Text style={[styles.badgeText, { color: item.status === "requested" ? "#92400e" : COLORS.primaryDark }]}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.cardTime}>{item.time_window}</Text>
            <Text style={styles.cardAddr}>{item.address_line1}, {item.city} {item.zip_code}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16 },
  emptyContainer: { flex: 1, padding: 16 },
  scheduleBtn: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 14, alignItems: "center", marginBottom: 16 },
  scheduleBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  empty: { alignItems: "center", paddingVertical: 40 },
  emptyTitle: { fontSize: 18, fontWeight: "600", color: COLORS.text },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8 },
  card: { backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  cardDate: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: "600" },
  cardTime: { fontSize: 14, color: COLORS.primary, fontWeight: "500" },
  cardAddr: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  form: { padding: 20 },
  formTitle: { fontSize: 20, fontWeight: "600", color: COLORS.text, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", color: COLORS.text, marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, backgroundColor: COLORS.surface },
  inputError: { borderColor: COLORS.error },
  errorText: { fontSize: 13, color: COLORS.error, marginTop: 4 },
  timeWindows: { gap: 8 },
  timeBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, backgroundColor: COLORS.surface },
  timeBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  timeBtnText: { fontSize: 14, color: COLORS.textSecondary },
  timeBtnTextActive: { color: COLORS.primaryDark, fontWeight: "500" },
});
