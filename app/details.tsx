import { deleteData, getCopySampleData } from '@/data/sampleData';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from 'react';
import { Dimensions, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

type ItemType = {
  id?: string;
  title?: string;
  photo?: any;
  place?: string;
  price?: string;
  date?: string;
  tags?: string[];
  memo?: string;
  link?: string;
};

const toStr = (v: string | string[] | undefined): string | undefined => {
  if (Array.isArray(v)) return v[0];
  return v;
};

export default function Details() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // 初期化（paramsからItemTypeに変換）
  const initItem: ItemType = {
    ...params,
    photo: params.photo,
    tags: Array.isArray(params.tags)
      ? params.tags
      : typeof params.tags === 'string'
        ? params.tags.split(',')
        : [],
    memo: toStr(params.memo),
    title: toStr(params.title),
    place: toStr(params.place),
    price: toStr(params.price),
    date: toStr(params.date),
    link: toStr(params.link),
    id: toStr(params.id),
  };

  const [item, setItem] = useState<ItemType>(initItem);

  // 画面に戻ってきたときに最新データを反映
  useFocusEffect(
    React.useCallback(() => {
      const copyData = getCopySampleData();
      const found = copyData.find(e => e.id === item.id);
      if (found) {
        setItem(found);
        console.log("データ更新:", found.id);
      }
      return () => { };
    }, [item.id])
  );

  const handleBack = () => {
    router.back();
  };

  const handleDelete = () => {
    if (!item.id) return;
    deleteData(item.id);
    console.log("削除:", item.id);
    alert("削除しました");
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => {
                const params = {
                  ...item,
                  tags: Array.isArray(item.tags) ? item.tags.join(',') : item.tags ?? '',
                  photo: typeof item.photo === 'string' ? item.photo : '',
                  from: '/details'
                };
                router.push({ pathname: '/FormScreen', params });
              }}
            >
              <Text style={styles.action}>編集</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDelete}>
              <Text style={styles.action}>削除</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 写真 */}
        {item.photo ? (
          <Image
            source={typeof item.photo === "number" ? item.photo : { uri: item.photo }}
            style={styles.image}
          />
        ) : null}

        {/* 詳細スクロール部分 */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>{item.title ?? ''}</Text>

          {/* タグ */}
          <View style={styles.tagsContainer}>
            {item.tags?.map((tag, i) => (
              <Text key={i} style={styles.tag}>#{tag}</Text>
            ))}
          </View>

          {/* 住所 */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2, paddingHorizontal: 5 }}>
            <Ionicons name="location" size={16} color="#555" style={{ marginRight: 4 }} />
            <Text style={{ fontSize: 14 }}>{item.place ?? ''}</Text>
          </View>

          {/* 価格 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2, paddingHorizontal: 5 }}>
            <Ionicons name="cash-outline" size={16} color="#555" style={{ marginRight: 4 }} />
            <Text style={{ fontSize: 14 }}>{item.price ?? ''}</Text>
          </View>

          {/* 日付 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingHorizontal: 5 }}>
            <Ionicons name="calendar" size={16} color="#555" style={{ marginRight: 4 }} />
            <Text style={{ fontSize: 14 }}>{item.date ?? ''}</Text>
          </View>

          {/* リンク */}
          {item.link && (
            <TouchableOpacity
              onPress={async () => {
                const supported = await Linking.canOpenURL(item.link!);
                if (supported) {
                  Linking.openURL(item.link!);
                } else {
                  alert("無効なリンクです");
                }
              }}
            >
              <Text style={styles.link}>{item.link}</Text>
            </TouchableOpacity>
          )}

          {/* 詳細 */}
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>詳細</Text>
            <View style={styles.detailLine} />
          </View>
          <Text style={styles.text}>{item.memo}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backArrow: { fontSize: 20, fontWeight: 'bold', marginRight: 8 },
  headerActions: { flexDirection: 'row' },
  action: { fontSize: 16, color: 'blue', marginLeft: 12 },
  scrollContent: { padding: 16 },
  image: { width: screenWidth, height: 200, resizeMode: 'cover' },
  title: { fontSize: 35, fontWeight: 'bold', marginBottom: 8, paddingHorizontal: 5 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8, paddingHorizontal: 5, rowGap: 8 },
  tag: {
    backgroundColor: '#eee',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    borderRadius: 6,
    fontSize: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  link: {
    marginBottom: 8,
    fontSize: 14,
    color: '#1E90FF',
    textDecorationLine: 'underline',
    paddingHorizontal: 5,
  },
  text: { marginBottom: 8, fontSize: 15, paddingHorizontal: 5 },
  detailHeader: { marginTop: 16, marginBottom: 8 },
  detailTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  detailLine: { height: 2, backgroundColor: '#ddd', width: '100%' },
});
