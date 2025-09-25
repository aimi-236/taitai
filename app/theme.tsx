// app/theme.tsx
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "./_layout";

const colors = [
  { name: "ホワイト", palette: { background: "#fff", text: "#000", tagBg: "#eee", tagText: "#000" } },
  { name: "ブラック", palette: { background: "#000", text: "#fff", tagBg: "#333", tagText: "#fff" } },
  { name: "ブルー", palette: { background: "#E6F0F5", text: "#000", tagBg: "#9bbfd1", tagText: "#000" } },
  { name: "ピンク", palette: { background: "#FDE2E4", text: "#000", tagBg: "#f8a5b5", tagText: "#000" } },
  { name: "グリーン", palette: { background: "#E2F0E9", text: "#000", tagBg: "#9dc9b3", tagText: "#000" } },
  { name: "イエロー", palette: { background: "#FFF9DB", text: "#000", tagBg: "#f5e67c", tagText: "#000" } },
  { name: "パープル", palette: { background: "#F3E5F5", text: "#000", tagBg: "#c7a4d5", tagText: "#000" } },
  { name: "グレー", palette: { background: "#F5F5F5", text: "#000", tagBg: "#bbb", tagText: "#000" } },
];

const fonts = [
  "System",
  "HachiMaruPop-Regular",
  "KaiseiDecol-Regular",
  "MPLUSRounded1c-Regular",
  "ZenKurenaido-Regular",
  "NewTegomin-Regular"
];

export default function ThemeScreen() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.palette.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: 8 }}>
          <Text style={{ fontSize: 20, color: theme.palette.text }}>←</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 20, color: theme.palette.text, fontFamily: theme.font, marginLeft: 16, marginBottom: 8 }}>テーマ設定</Text>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 18, marginBottom: 12, color: theme.palette.text, fontFamily: theme.font }}>
          テーマカラーを選択
        </Text>
        <View style={styles.row}>
          {colors.map((c, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.colorBox, { backgroundColor: c.palette.tagBg }]}
              onPress={() => setTheme({ ...theme, palette: c.palette })}
            >
              <Text style={{ color: c.palette.text, fontFamily: theme.font }}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 区切り線と余白 */}
        <View style={{ height: 32 }} />
        <View style={{ height: 1, backgroundColor: theme.palette.tagBg, marginVertical: 8, width: '100%' }} />
        <Text style={{ fontSize: 18, marginBottom: 16, color: theme.palette.text, fontFamily: theme.font }}>
          フォントを選択
        </Text>
        {fonts.map((f, i) => (
          <TouchableOpacity key={i} onPress={() => setTheme({ ...theme, font: f })}>
            <Text style={{ fontSize: 16, marginBottom: 8, fontFamily: f, color: theme.palette.text }}>
              {f === "System" ? "デフォルト" : f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap" },
  colorBox: {
    width: "45%",
    margin: 5,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
