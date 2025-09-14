// app/index.tsx

import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput, // ★ 追加
  TouchableOpacity,
  View,
} from "react-native";
import { sampleData } from "./sampleData"; // 既存のまま
import { filterByExactTag } from "./Search"; // ★ Search.js から関数だけ

export default function IndexScreen({ navigation }: any) {
  const [query, setQuery] = useState("");

  // 完全一致（trimのみ）。空なら全件表示
  const filtered = useMemo(
    () => filterByExactTag(sampleData as any[], query),
    [query]
  );

  return (
    <View style={styles.container}>
      {/* ヘッダー部分（UIは既存のまま） */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.button}>
          <Text>＋</Text>
        </TouchableOpacity>

        {/* 中央の検索枠：見た目は既存のまま、内部だけ TextInput に変更 */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="タグを完全一致で検索（例：水族館）"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            style={{ paddingVertical: 4, fontSize: 16 }}
          />
        </View>

        <TouchableOpacity style={styles.button}>
          <Text>並び替え</Text>
        </TouchableOpacity>
      </View>

      {/* 一覧表示：検索結果をカードで表示（UIは既存のまま） */}
      <FlatList
        data={filtered}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: { item: any }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Detail", { item })}
          >
            <Image
              source={
                typeof item.photo === "number" ? item.photo : { uri: item.photo }
              }
              style={styles.photo}
            />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text>{item.place}</Text>
              <Text>{item.price}</Text>
              <Text>{item.date}</Text>
              <Text>{item.tags.map((tag: string) => `#${tag} `).join("")}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", padding: 10, alignItems: "center" },
  button: { marginHorizontal: 5, padding: 5, backgroundColor: "#eee", borderRadius: 5 },
  searchBox: { flex: 1, backgroundColor: "#f0f0f0", padding: 5, marginHorizontal: 5 },
  card: { flexDirection: "row", padding: 10, borderBottomWidth: 1, borderColor: "#ddd" },
  photo: { width: 80, height: 80, marginRight: 12, borderRadius: 8, resizeMode: "cover" },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold" },
});