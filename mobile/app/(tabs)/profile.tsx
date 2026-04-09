import { Alert, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/auth-context";
import { COLORS } from "../../lib/constants";
import Button from "../../components/ui/Button";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.full_name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user.full_name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {user.phone && <Text style={styles.phone}>{user.phone}</Text>}
      </View>

      <View style={styles.infoCard}>
        <InfoRow label="Member since" value={new Date(user.created_at).toLocaleDateString()} />
        <InfoRow label="Email verified" value={user.email_verified ? "Yes" : "Not yet"} />
        <InfoRow label="Account status" value={user.is_active ? "Active" : "Inactive"} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Area</Text>
        <Text style={styles.sectionText}>
          Seattle, WA and surrounding areas (ZIP codes 980xx, 981xx). Free pickup service available.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <Button title="Sign Out" onPress={handleLogout} variant="outline" />
      </View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  card: { backgroundColor: COLORS.surface, alignItems: "center", paddingVertical: 32, borderBottomWidth: 1, borderColor: COLORS.border },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: "700", color: COLORS.primary },
  name: { fontSize: 20, fontWeight: "600", color: COLORS.text },
  email: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  phone: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  infoCard: { backgroundColor: COLORS.surface, marginTop: 16, marginHorizontal: 16, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: COLORS.border },
  infoLabel: { fontSize: 14, color: COLORS.textSecondary },
  infoValue: { fontSize: 14, fontWeight: "500", color: COLORS.text },
  section: { margin: 16, padding: 16, backgroundColor: COLORS.surface, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border },
  sectionTitle: { fontSize: 15, fontWeight: "600", color: COLORS.text, marginBottom: 6 },
  sectionText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
});
