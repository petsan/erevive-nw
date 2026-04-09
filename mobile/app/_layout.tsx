import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../lib/auth-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="donate" options={{ presentation: "modal" }} />
        <Stack.Screen name="pickup" options={{ presentation: "modal" }} />
      </Stack>
    </AuthProvider>
  );
}
