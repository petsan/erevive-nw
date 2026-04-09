import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/auth-context";
import { api } from "../../lib/api-client";
import { COLORS } from "../../lib/constants";
import type { ItemResponse } from "../../types/api";

export default function HomeScreen() {
  const router = useRouter();
  const { user, getToken } = useAuth();
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadItems = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    try {
      const data = await api.get<ItemResponse[]>("/items", { token });
      setItems(data);
    } catch {}
  }, [getToken]);

  useEffect(() => { loadItems(); }, [loadItems]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "pending": return { bg: "#fef3c7", text: "#92400e" };
      case "approved": return { bg: COLORS.primaryLight, text: COLORS.primaryDark };
      case "picked_up": return { bg: "#dbeafe", text: "#1e40af" };
      default: return { bg: "#f3f4f6", text: "#4b5563" };
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        contentContainerStyle={items.length === 0 ? styles.emptyContainer : styles.list}
        ListHeaderComponent={
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Welcome, {user?.full_name?.split(" ")[0] || "User"}</Text>
            <Pressable style={styles.donateBtn} onPress={() => router.push("/(tabs)/donate")}>
              <Text style={styles.donateBtnText}>+ Donate</Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No items yet</Text>
            <Text style={styles.emptyText}>Tap "Donate" to photograph your first item</Text>
          </View>
        }
        renderItem={({ item }) => {
          const colors = statusColor(item.status);
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.badge, { backgroundColor: colors.bg }]}>
                  <Text style={[styles.badgeText, { color: colors.text }]}>{item.status}</Text>
                </View>
                {item.ai_confidence != null && (
                  <Text style={styles.confidence}>{Math.round(item.ai_confidence * 100)}%</Text>
                )}
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
              {item.category && <Text style={styles.cardCategory}>{item.category}</Text>}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16 },
  emptyContainer: { flex: 1, padding: 16 },
  greeting: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  greetingText: { fontSize: 18, fontWeight: "600", color: COLORS.text },
  donateBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  donateBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: "600", color: COLORS.text },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8 },
  card: { backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: "600" },
  confidence: { fontSize: 12, color: COLORS.textSecondary },
  cardTitle: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  cardDesc: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  cardCategory: { fontSize: 12, color: COLORS.textSecondary, marginTop: 8 },
});
