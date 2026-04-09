import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../../lib/auth-context";
import { registerSchema } from "../../lib/validators";
import { COLORS } from "../../lib/constants";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setErrors({});
    const result = registerSchema.safeParse({ email, password, confirmPassword, fullName, phone: phone || undefined });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await register(email, password, fullName, phone || undefined);
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Registration Failed", "This email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.brand}>eRevive</Text>
          <Text style={styles.brandSuffix}> NW</Text>
        </View>
        <Text style={styles.title}>Create your account</Text>

        <View style={styles.form}>
          <Input label="Full Name" value={fullName} onChangeText={setFullName} error={errors.fullName} placeholder="Jane Doe" autoComplete="name" />
          <Input label="Email" value={email} onChangeText={setEmail} error={errors.email} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          <Input label="Phone (optional)" value={phone} onChangeText={setPhone} placeholder="(206) 555-0100" keyboardType="phone-pad" autoComplete="tel" />
          <Input label="Password" value={password} onChangeText={setPassword} error={errors.password} placeholder="At least 8 characters" secureTextEntry autoComplete="new-password" />
          <Input label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} error={errors.confirmPassword} placeholder="Repeat your password" secureTextEntry />
          <Button title="Create Account" onPress={handleRegister} loading={loading} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" style={styles.link}>Sign in</Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },
  header: { flexDirection: "row", alignItems: "baseline", justifyContent: "center", marginBottom: 8 },
  brand: { fontSize: 32, fontWeight: "700", color: COLORS.primary },
  brandSuffix: { fontSize: 16, color: COLORS.textSecondary },
  title: { fontSize: 20, fontWeight: "600", color: COLORS.text, textAlign: "center", marginBottom: 32 },
  form: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: COLORS.border },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: COLORS.textSecondary, fontSize: 14 },
  link: { color: COLORS.primary, fontSize: 14, fontWeight: "600" },
});
