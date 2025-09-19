import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const FormScreen = ({ route }: any) => {
  const router = useRouter();

  // 編集時は route.params に各値が直接入る
  const [title, setTitle] = useState(route?.params?.title ?? '');
  const [tags, setTags] = useState(route?.params?.tags ?? '');
  const [address, setAddress] = useState(route?.params?.place ?? '');
  const [price, setPrice] = useState(route?.params?.price ?? '');
  const [memo, setMemo] = useState(route?.params?.memo ?? '');
  const [link, setLink] = useState(route?.params?.link ?? '');
  const [photo, setPhoto] = useState(route?.params?.photo ?? '');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    const data = {
      title,
      tags: tags.split(',').map((t: string) => t.trim()),
      address,
      price,
      memo,
      link,
      photo,
    };
    console.log("保存データ:", data);
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

      {/* 📷 写真プレビュー（なければダミー画像） */}
      <Image
        source={{ uri: photo || "https://via.placeholder.com/400x200.png?text=画像" }}
        style={styles.image}
      />

      {/* 写真追加ボタン */}
      <TouchableOpacity onPress={pickImage} style={styles.photoButton}>
        <Text style={{ color: "black" }}>写真を追加</Text>
      </TouchableOpacity>

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

        <TextInput
          style={styles.input}
          placeholder="URLを入力"
          value={link}
          onChangeText={setLink}
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
  photoButton: { alignItems: 'center', marginBottom: 16 },
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
