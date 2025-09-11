import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>

      {/* ヘッダーは表示するがタイトルだけ消す */}
      <Stack.Screen name="index" options={{
        title: "",
        headerShadowVisible: false, //下線を消す
      }} />

      <Stack.Screen name="detail" options={{ title: "" }} />

    </Stack>
  );
}