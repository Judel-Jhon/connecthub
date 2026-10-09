import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8FAFC' },
          animation: 'fade_from_bottom',
        }}
      >
        {/* Auth */}
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />

        {/* Stakeholder */}
        <Stack.Screen name="index" />
        <Stack.Screen name="submit-concern" />
        <Stack.Screen name="my-concerns" />
        <Stack.Screen name="concern-detail" />
        <Stack.Screen name="announcements" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="profile" />

        {/* Admin */}
        <Stack.Screen name="admin-dashboard" />
        <Stack.Screen name="admin-concerns" />
        <Stack.Screen name="admin-review" />
      </Stack>
    </>
  );
}
