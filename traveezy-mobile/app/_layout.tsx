import '../global.css';
import { Stack } from 'expo-router';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews']);

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, contentStyle: { backgroundColor: '#020817' } }} />
    </Stack>
  );
}
