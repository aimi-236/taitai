import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sampleData } from "../data/sampleData"; // サンプルデータを読み込み
import SortButton from "./SortButton";
import TagFilter from "./TagFilter";

export default function IndexScreen() {
  const router = useRouter(); // ← 追加
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]); //選択タグ

  const sortedData = useMemo(() => {
    return [...sampleData].sort((a, b) => {
      if (sortOrder === "asc") {
        return Number(a.id) - Number(b.id);
      } else {
        return Number(b.id) - Number(a.id);
      }
    });
  }, [sortOrder]);

  // タグでフィルタリング
  const filteredData = useMemo(() => {
    if (selectedTags.length === 0) {
      return sortedData; // タグ未選択時はすべて表示
    }
    return sortedData.filter(item =>
      selectedTags.every(tag => item.tags?.includes(tag))
    );
  }, [sortedData, selectedTags]);

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

          {/* 並び替えボタンを外部ファイル化 */}
          <SortButton
            sortOrder={sortOrder}
            onToggle={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          />
        </View>

        {/* ★ タグフィルター */}
        <TagFilter allItems={sampleData} onChangeSelected={setSelectedTags} />

        {/* 一覧表示 */}
        <FlatList
          data={filteredData}  //タグ検索でヒットしたもののみ
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
                {/* 住所 */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 }}>
                  <Ionicons name="location" size={14} color="#555" style={{ marginRight: 4, marginTop: 2 }} />
                  <Text style={{ flex: 1, flexWrap: "wrap" }}>{item.place}</Text>
                </View>

                {/* 価格 */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                  <Ionicons name="cash-outline" size={14} color="#555" style={{ marginRight: 4 }} />
                  <Text>{item.price}</Text>
                </View>

                <View style={styles.tagsContainer}>
                  {item.tags && item.tags.length > 0 ? (
                    item.tags.map((tag: string, index: number) => (
                      <Text key={index} style={styles.tag}>#{tag}</Text>
                    ))
                  ) : null}
                </View>
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
  },
  tag: {
    backgroundColor: '#eee',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    borderRadius: 6,
    fontSize: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    elevation: 2, // Android影
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',  // 複数行に折り返し
    marginTop: 4,
    rowGap: 8
  },
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", padding: 10, alignItems: "center" },
  button: { marginHorizontal: 5, padding: 5, backgroundColor: "#eee", borderRadius: 5 },
  searchBox: { flex: 1, backgroundColor: "#f0f0f0", padding: 5, marginHorizontal: 5 },
  card: { flexDirection: "row", padding: 10, borderBottomWidth: 1, borderColor: "#ddd", alignItems: "center" },
  photo: { width: 85, height: 85, marginRight: 12, borderRadius: 8, resizeMode: "cover" },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold" }
});
