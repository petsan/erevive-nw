import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "../../lib/constants";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline";
}

export default function Button({ title, onPress, loading, disabled, variant = "primary" }: ButtonProps) {
  const isPrimary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.outline,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#fff" : COLORS.primary} size="small" />
      ) : (
        <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textOutline]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 12, paddingVertical: 14, paddingHorizontal: 20, alignItems: "center" },
  primary: { backgroundColor: COLORS.primary },
  outline: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: COLORS.primary },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
  text: { fontSize: 15, fontWeight: "600" },
  textPrimary: { color: "#fff" },
  textOutline: { color: COLORS.primary },
});
