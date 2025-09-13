import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { sampleData } from "../data/sampleData"; // サンプルデータを読み込み

export default function IndexScreen() {
  const router = useRouter(); // ← 追加

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ヘッダー部分 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/FormScreen')}>
            <Text>＋</Text>
          </TouchableOpacity>
          <View style={styles.searchBox}>
            <Text>🔍検索窓</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text>並び替え</Text>
          </TouchableOpacity>
        </View>

        {/* 一覧表示 */}
        <FlatList
          data={sampleData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({ pathname: "/details", params: item })}
            >
              <Image
                source={
                  typeof item.photo === "number"
                    ? item.photo // require で読み込んだローカル画像
                    : { uri: item.photo } // URL文字列
                }
                style={styles.photo}
              />
              <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text>{item.place}</Text>
                <Text>{item.price}</Text>
                <Text>{item.date}</Text>
                <Text>{item.tags.map((tag) => `#${tag} `).join("")}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // iOS: SafeAreaで対応
  // Android: StatusBar.currentHeight 分の余白を加える
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", padding: 10, alignItems: "center" },
  button: { marginHorizontal: 5, padding: 5, backgroundColor: "#eee", borderRadius: 5 },
  searchBox: { flex: 1, backgroundColor: "#f0f0f0", padding: 5, marginHorizontal: 5 },
  card: { flexDirection: "row", padding: 10, borderBottomWidth: 1, borderColor: "#ddd" },
  photo: { width: 80, height: 80, marginRight: 12, borderRadius: 8, resizeMode: "cover" },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold" }
});
