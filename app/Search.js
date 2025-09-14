// tagSearch.js
// 完全一致で tag を絞り込むユーティリティと、検索バーのUI（React Native用）を提供します。
// すべて JavaScript（.js）で書いています。TypeScript 依存なし。

import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

/**
 * 完全一致でタグを絞り込む関数
 * @param {Array<Object>} items - データ配列（各要素は tags: string[] を持つ）
 * @param {string} query - 入力文字列（trim後、空なら全件返す）
 * @returns {Array<Object>} - 絞り込み結果
 */
export function filterByExactTag(items, query) {
  const q = (query ?? "").trim();
  if (q.length === 0) return items;
  return (items ?? []).filter(
    (item) => Array.isArray(item?.tags) && item.tags.some((t) => t === q)
  );
}

/**
 * 検索バー（完全一致）
 * 外から value / onChange を受け取り、UI だけ提供するシンプルなコンポーネント。
 */
export function SearchBar({ value, onChange }) {
  return (
    <View style={styles.header}>
      <View style={styles.searchBox}>
        <TextInput
          placeholder="タグを完全一致で検索（例：水族館）"
          value={value}
          onChangeText={onChange}
          style={styles.input}
          returnKeyType="search"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => onChange?.("")}>
        <Text>クリア</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", padding: 10, alignItems: "center" },
  searchBox: { flex: 1, backgroundColor: "#f7f7f7", paddingHorizontal: 10, paddingVertical: 6, marginRight: 6, borderRadius: 8 },
  input: { paddingVertical: 4, fontSize: 16 },
  button: { marginLeft: 6, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: "#eee", borderRadius: 6 },
});