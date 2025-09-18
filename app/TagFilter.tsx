import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  allItems: { tags?: string[] }[];
  onChangeSelected: (selected: string[]) => void;
};

const TagFilter: React.FC<Props> = ({ allItems, onChangeSelected }) => {
  const [selected, setSelected] = useState<string[]>([]);

  // 全てのタグをユニーク化
  const allTags = useMemo(() => {
    const tags = allItems.flatMap(item => item.tags || []);
    return Array.from(new Set(tags));
  }, [allItems]);

  const toggleTag = (tag: string) => {
    let newSelected;
    if (selected.includes(tag)) {
      newSelected = selected.filter(t => t !== tag);
    } else {
      newSelected = [...selected, tag];
    }
    setSelected(newSelected);
    onChangeSelected(newSelected);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ maxHeight: 100 }} // タグ3段くらいまで表示
        contentContainerStyle={styles.tagList}
      >
        {allTags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, selected.includes(tag) && styles.tagSelected]}
            onPress={() => toggleTag(tag)}
          >
            <Text style={selected.includes(tag) ? styles.textSelected : styles.text}>
              #{tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8, paddingHorizontal: 10 },
  tagList: { flexDirection: "row", flexWrap: "wrap" },
  tag: {
    backgroundColor: "#eee",
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 4,
    borderRadius: 6,
  },
  tagSelected: {
    backgroundColor: "#1E90FF",
  },
  text: { fontSize: 14, color: "#333" },
  textSelected: { fontSize: 14, color: "#fff" },
});

export default TagFilter;
