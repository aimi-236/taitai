import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sampleData } from "../data/sampleData"; // サンプルデータを読み込み
import SortButton from "./SortButton";

export default function IndexScreen() {
  const router = useRouter(); // ← 追加
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [data, setData] = useState(sampleData);

  useFocusEffect(
    React.useCallback(() => {
      // 画面がフォーカスされたときに実行
      // ここで最新データを取得してstateに反映
      const newData = [...sampleData]; // 例: APIからfetchするならawait fetch()など
      setData(newData);

      console.log('現在残っている要素のid')

      for (let item of sampleData) {
        console.log(item.id + ',')
      }

      // cleanupは画面がアンフォーカスされる時
      return () => {
        // ここに必要ならクリーンアップ処理
      };
    }, [])
  );

  const sortedData = useMemo(() => {
    return [...sampleData].sort((a, b) => {
      if (sortOrder === "asc") {
        return Number(a.id) - Number(b.id);
      } else {
        return Number(b.id) - Number(a.id);
      }
    });
  }, [sortOrder]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ヘッダー部分 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname : '/FormScreen', params: {from : '/index'} })}>
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

        {/* 一覧表示 */}
        <FlatList
          data={sortedData}
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
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                  <Ionicons name="location" size={14} color="#555" style={{ marginRight: 4 }} />
                  <Text>{item.place}</Text>
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
