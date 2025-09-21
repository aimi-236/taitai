import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"; // ★ TextInput を追加
import { SafeAreaView } from "react-native-safe-area-context";
import { searchAllFields } from "../Search"; // ★ 追加
import { sampleData } from "../data/sampleData";
import SortButton from "./SortButton";
import TagFilter from "./TagFilter";

export default function IndexScreen() {
  const router = useRouter();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [query, setQuery] = useState<string>(""); //追加
  const [selectedTags, setSelectedTags] = useState<string[]>([]); //選択タグ

  // ★ 入力があれば「関連度順（総合検索）」/ 空なら従来のIDソート
  const listData = useMemo(() => {
    const q = query.trim();
    if (q.length > 0) {
      return searchAllFields(sampleData as any[], q);
    }
    return [...sampleData].sort((a, b) =>
      sortOrder === "asc" ? Number(a.id) - Number(b.id) : Number(b.id) - Number(a.id)
    );
  }, [query, sortOrder]);

  // タグでフィルタリング
  const filteredData = useMemo(() => {
    if (selectedTags.length === 0) {
      return listData; // タグ未選択時はすべて表示
    }
    return listData.filter(item =>
      selectedTags.every(tag => item.tags?.includes(tag))
    );
  }, [listData, selectedTags]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ヘッダー部分（見た目は既存のまま） */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/FormScreen')}>
            <Text>＋</Text>
          </TouchableOpacity>

          {/* 🔍検索窓（中身だけ TextInput に変更） */}
          <View style={styles.searchBox}>
            <TextInput
              placeholder="全項目を部分一致で検索（例：温泉 日帰り）"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              style={{ paddingVertical: 2, fontSize: 16 }}
            />
          </View>

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
                    ? item.photo
                    : { uri: item.photo }
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
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
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