import { addData, updateData } from '@/data/sampleData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const FormScreen = ({ route }: any) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  

  // 編集時は route.params に各値が直接入る
  const [title, setTitle] = useState(params.title ?? '');
  const [tags, setTags] = useState(params.tags ?? '');
  const [address, setAddress] = useState(params.place ?? '');
  const [price, setPrice] = useState(params.price ?? '');
  const [memo, setMemo] = useState(params.memo ?? '');
  const [id, setId] = useState(params.id ?? '');
  const from = params.memo ?? '';

  // string | string[] → string へ変換する関数
  const toStr = (v: string | string[] | undefined): string | undefined => {
    if (Array.isArray(v)) return v[0];
    return v;
  };

  const data = {
      title: typeof title === 'string' ? title : '',
      tags: typeof tags === "string" 
        ? tags.split(',')
        : Array.isArray(tags) 
          ? tags
          : [],
      address: Array.isArray(address) 
        ? address.join(',') 
        : address ?? '',
      memo:  Array.isArray(memo) 
        ? memo.join(',') 
        : memo ?? '',
      price: Array.isArray(price) 
        ? price.join(',') 
        : price ?? '',
      id: Array.isArray(id)
        ? id.join(',')
        : id ?? '',
    };

  const handleSave = () => {
    
    console.log("保存データ:", data);
    if (from === 'details') {
      updateData(data.id, data.title, data.tags, data.address, data.memo);
    } else {
      addData(data.title, data.tags, data.address, data.memo);
    }
    
    alert(route?.params ? "更新しました！" : "新規作成しました！");

    // 保存後に戻る
    router.back();
  };

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
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.action}>{route?.params ? "更新" : "保存"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 画像（編集時は既存のものを表示、なければダミー） */}
      <Image
        source={{ uri: route?.params?.photo ?? "https://via.placeholder.com/400x200.png?text=画像" }}
        style={styles.image}
      />

      {/* 入力フォーム */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TextInput
          style={styles.inputTitle}
          placeholder={data.title? data.title : "タイトルを入力"}
          value={data.title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="タグ（カンマ区切りで入力）"
          value={data.tags.join(',')}
          onChangeText={setTags}
        />

        <TextInput
          style={styles.input}
          placeholder="住所を入力"
          value={data.address}
          onChangeText={setAddress}
        />

        <TextInput
          style={styles.input}
          placeholder="価格を入力"
          value={data.price}
          onChangeText={setPrice}
        />

        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>詳細</Text>
          <View style={styles.detailLine} />
        </View>

        <TextInput
          style={[styles.input, styles.memo]}
          placeholder="説明文を入力"
          value={data.memo}
          onChangeText={setMemo}
          multiline
        />
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
  image: { width: screenWidth, height: 200, resizeMode: 'cover', marginBottom: 16 },
  inputTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 12,
    padding: 4,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 12,
    padding: 4,
  },
  memo: {
    height: 100,
    textAlignVertical: 'top',
  },
  detailHeader: { marginTop: 16, marginBottom: 8 },
  detailTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  detailLine: { height: 2, backgroundColor: '#ddd', width: '100%' },
});

export default FormScreen;
