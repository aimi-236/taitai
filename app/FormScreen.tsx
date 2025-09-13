import { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const FormScreen = ({ route, navigation }: any) => {
  // 編集時は route.params.item にデータが入る
  const item = route?.params?.item;

  const [title, setTitle] = useState(item?.title ?? '');
  const [tags, setTags] = useState(item?.tags?.join(',') ?? '');
  const [address, setAddress] = useState(item?.address ?? '');
  const [price, setPrice] = useState(item?.price ?? '');
  const [memo, setMemo] = useState(item?.memo ?? '');

  const handleSave = () => {
    const data = {
      title,
      tags: tags.split(',').map(t => t.trim()),
      address,
      price,
      memo,
    };
    console.log("保存データ:", data);
    alert(item ? "更新しました！" : "新規作成しました！");

    // 保存後に戻る
    navigation.goBack();
  };

  const handleBack = () => {
    navigation.goBack();
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
            <Text style={styles.action}>{item ? "更新" : "保存"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 画像（編集時は既存のものを表示、なければダミー） */}
      <Image
        source={{ uri: item?.photo ?? "https://via.placeholder.com/400x200.png?text=画像" }}
        style={styles.image}
      />

      {/* 入力フォーム */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TextInput
          style={styles.inputTitle}
          placeholder="タイトルを入力"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="タグ（カンマ区切りで入力）"
          value={tags}
          onChangeText={setTags}
        />

        <TextInput
          style={styles.input}
          placeholder="住所を入力"
          value={address}
          onChangeText={setAddress}
        />

        <TextInput
          style={styles.input}
          placeholder="価格を入力"
          value={price}
          onChangeText={setPrice}
        />

        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>詳細</Text>
          <View style={styles.detailLine} />
        </View>

        <TextInput
          style={[styles.input, styles.memo]}
          placeholder="説明文を入力"
          value={memo}
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
