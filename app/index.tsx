import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"; // ★ TextInput を追加
import { SafeAreaView } from "react-native-safe-area-context";
import { searchAllFields } from "../Search"; // ★ 追加
import { sampleData } from "../data/sampleData";
import SortButton from "./SortButton";
import TagFilter from "./TagFilter";
import { useTheme } from "./_layout";

export default function IndexScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [query, setQuery] = useState<string>("");  //検索クエリ
  const [selectedTags, setSelectedTags] = useState<string[]>([]); //選択タグ
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.palette.tagBg }]}>
      <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
        {/* ヘッダー */}
        <View style={[styles.header, { backgroundColor: theme.palette.tagBg }]}>
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.palette.background }]} onPress={() => router.push({ pathname: '/FormScreen', params: { from: '/index' } })}>
            {/* ★変更: 文字色・フォントをテーマ化 */}
            <Text style={{ color: theme.palette.text, fontFamily: theme.font }}>＋</Text>
          </TouchableOpacity>

          {/* 🔍検索窓（中身だけ TextInput に変更） */}
          <View style={[styles.searchBox, { backgroundColor: theme.palette.background }]}>
            <TextInput
              placeholder="全項目を検索"
              placeholderTextColor="#888"
              value={query}
              onChangeText={setQuery}
              style={{
                paddingVertical: 0,
                fontSize: 14,
                color: theme.palette.text,
                fontFamily: theme.font,
                height: 20,
              }}
            />
          </View>

          <View style={{ backgroundColor: theme.palette.background, borderRadius: 5, marginHorizontal: 5 }}>
            <SortButton
              sortOrder={sortOrder}
              onToggle={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            />
          </View>

          {/* 追加: 設定画面へ飛ぶボタン */}
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.palette.background }]} onPress={() => router.push("/theme")}>
            <Ionicons name="settings-outline" size={20} color={theme.palette.text} />
          </TouchableOpacity>
        </View>


        {/* ★ タグフィルター */}
        <TagFilter allItems={sampleData} onChangeSelected={setSelectedTags} />

        {/* 一覧 */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: "/details", params: item })}>
              <Image source={typeof item.photo === "number" ? item.photo : { uri: item.photo }} style={styles.photo} />
              <View style={styles.info}>
                {/* タイトル */}
                <Text
                  style={[
                    styles.title,
                    { color: theme.palette.text, fontFamily: theme.font },
                    theme.font === 'System' ? { fontWeight: 'bold' } : { fontWeight: 'normal' }
                  ]}
                >
                  {item.title}
                </Text>

                {/* 住所 */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 }}>
                  <Ionicons name="location" size={14} color={theme.palette.text} style={{ marginRight: 4, marginTop: 2 }} />
                  <Text style={{ flex: 1, flexWrap: "wrap", color: theme.palette.text, fontFamily: theme.font }}>{item.place}</Text>
                </View>

                {/* 価格 */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                  <Ionicons name="cash-outline" size={14} color={theme.palette.text} style={{ marginRight: 4 }} />
                  <Text style={{ color: theme.palette.text, fontFamily: theme.font }}>{item.price}</Text>
                </View>

                {/* タグ */}
                <View style={styles.tagsContainer}>
                  {item.tags?.map((tag: string, i: number) => (
                    <Text
                      key={i}
                      style={[
                        styles.tag,
                        { backgroundColor: theme.palette.tagBg, color: theme.palette.tagText, fontFamily: theme.font, lineHeight: 18, minHeight: 26, overflow: 'hidden' }
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      #{tag}
                    </Text>
                  ))}
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
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: { flexDirection: "row", padding: 10, alignItems: "center" },
  button: { marginHorizontal: 5, padding: 5, backgroundColor: "#eee", borderRadius: 5 },
  searchBox: { flex: 1, backgroundColor: "#f0f0f0", padding: 5, marginHorizontal: 5, borderRadius: 6, height: 30, justifyContent: 'center' },
  card: { flexDirection: "row", padding: 10, borderBottomWidth: 1, borderColor: "#ddd", alignItems: "center" },
  photo: { width: 85, height: 85, marginRight: 12, borderRadius: 8, resizeMode: "cover" },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold" },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    borderRadius: 6,
    fontSize: 12,
    lineHeight: 18,
    minHeight: 26,
    overflow: 'hidden',
  },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4, rowGap: 8 },
});