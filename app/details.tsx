import { deleteData, getCopySampleData } from '@/data/sampleData';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from "expo-router";
import React from 'react';
import { Dimensions, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

const Details = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  // paramsはstring型で渡ってくる場合があるので、必要に応じてparse
  // FlatListからpush時にparams: itemで渡しているので、propsはそのまま受け取れる
  // string | string[] → string へ変換する関数
  const toStr = (v: string | string[] | undefined): string | undefined => {
    if (Array.isArray(v)) return v[0];
    return v;
  };
  
  const item: ItemType = {
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
          id: toStr(params.id)
        };

  useFocusEffect(
      React.useCallback(() => {
        // 画面がフォーカスされたときに実行
        // ここで最新データを取得してstateに反映
        
        let copyData = getCopySampleData();
        for (let element of copyData) {
          if (element.id === item.id) {
            Object.assign(item, element)
            console.log('データの更新')
            
          }
        }

        // cleanupは画面がアンフォーカスされる時
        return () => {
          // ここに必要ならクリーンアップ処理
        };
      }, [])
    );
  

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => {
              // tagsはカンマ区切り文字列、photoはURLまたは空文字に変換
              const params = {
                ...item,
                tags: Array.isArray(item.tags) ? item.tags.join(',') : item.tags ?? '',
                photo:
                  typeof item.photo === 'string'
                    ? item.photo
                    : '',
                title: item.title,
                place: item.place,
                price: item.price,
                date: item.date,
                memo: item.memo,
                link: item.link,
                from: '/details'
              };
              router.push({ pathname: '/FormScreen', params });
            }}
          >
            <Text style={styles.action}>編集</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress= {() => {
              deleteData(item.id ?? '');
              console.log(item.id ?? 'idを読み取れてないかも');
              handleBack();
              alert('削除しました')
            }
          }>
            <Text style={styles.action}>削除</Text>
          </TouchableOpacity>
            
        </View>
      </View>

      {/* 画像をヘッダー直下に */}
      {/* 画像をヘッダー直下に */}
      {item.photo ? (
        <Image
          source={
            typeof item.photo === "number"
              ? item.photo
              : { uri: item.photo }
          }
          style={styles.image}
        />
      ) : null}

      {/* スクロール部分 */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* タイトル */}
        <Text style={styles.title}>{item.title ?? ''}</Text>

        {/* タグ */}
        <View style={styles.tagsContainer}>
          {Array.isArray(item.tags) && item.tags.length > 0 ? (
            item.tags.map((tag: string, index: number) => (
              <Text key={index} style={styles.tag}>#{tag}</Text>
            ))
          ) : null}
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

        {/* リンク（もしあれば） */}
        {item.link && (
          <TouchableOpacity onPress={() => Linking.openURL(item.link!)}>
            <Text style={styles.link}>{item.link}</Text>
          </TouchableOpacity>
        )}

        {/* 詳細見出し */}
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>詳細</Text>
          <View style={styles.detailLine} />
        </View>
        {/* 説明文 */}
        <Text style={styles.text}>{item.memo}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eee',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    elevation: 2, // Android
  },
  address: { marginBottom: 2, fontSize: 14, paddingHorizontal: 5 },
  price: { marginBottom: 2, fontSize: 14, paddingHorizontal: 5 },
  date: { marginBottom: 8, fontSize: 14, paddingHorizontal: 5 },
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

export default Details;
