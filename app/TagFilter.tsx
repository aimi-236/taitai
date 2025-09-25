import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "./_layout";

type Props = {
  allItems: { tags?: string[] }[];
  onChangeSelected: (selected: string[]) => void;
};

const TagFilter: React.FC<Props> = ({ allItems, onChangeSelected }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const { theme } = useTheme();

  //タグごとの出現回数を計算
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allItems.forEach(item => {
      (item.tags || []).forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    //出現回数の多い順にソート
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) // 降順ソート
      .map(([tag, count]) => ({ tag, count }));
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
        style={{ maxHeight: 100 }}
        contentContainerStyle={styles.tagList}
      >
        {tagCounts.map(({ tag, count }) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tag,
              { backgroundColor: selected.includes(tag) ? theme.palette.tagBg : theme.palette.tagBg },
              selected.includes(tag) && { borderWidth: 2, borderColor: theme.palette.tagText }
            ]}
            onPress={() => toggleTag(tag)}
            activeOpacity={0.7}
          >
            <Text
              style={{ color: theme.palette.tagText, fontSize: 14, fontFamily: theme.font, lineHeight: 18, textAlign: 'center' }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              #{tag} ({count})
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
    minHeight: 26,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    maxWidth: 120,
  },
  tagSelected: {
    backgroundColor: "#1E90FF",
  },
  text: { fontSize: 14, color: "#333" },
  textSelected: { fontSize: 14, color: "#fff" },
});

export default TagFilter;
