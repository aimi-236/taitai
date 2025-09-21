import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { sampleData } from "../data/sampleData"; //既存タグ取得用

const screenWidth = Dimensions.get('window').width;

const FormScreen = ({ route }: any) => {
  const router = useRouter();

  // 編集時は route.params に各値が直接入る
  const rawTags = route?.params?.tags;

  // まずここで配列に正規化（文字列で来たときは split）
  const initialTags: string[] = Array.isArray(rawTags)
    ? rawTags
    : typeof rawTags === 'string' && rawTags.length > 0
      ? rawTags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

  // 編集時は route.params に各値が直接入る
  const [title, setTitle] = useState(route?.params?.title ?? '');
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState(''); //入力中のタグ
  const [place, setAddress] = useState(route?.params?.place ?? '');
  const [price, setPrice] = useState(route?.params?.price ?? '');
  const [memo, setMemo] = useState(route?.params?.memo ?? '');
  const [link, setLink] = useState(route?.params?.link ?? '');
  const [photo, setPhoto] = useState(route?.params?.photo ?? null);

  //既存タグ一覧をユニーク化
  const existingTags = useMemo(() => {
    const allTags = sampleData.flatMap(item => item.tags || []);
    return Array.from(new Set(allTags));
  }, []);

  // ひらがな → カタカナ
  const hiraToKana = (str: string) =>
    str.replace(/[\u3041-\u3096]/g, ch =>
      String.fromCharCode(ch.charCodeAt(0) + 0x60)
    );

  // カタカナ → ひらがな
  const kanaToHira = (str: string) =>
    str.replace(/[\u30A1-\u30F6]/g, ch =>
      String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );

  //候補の絞り込み
  const suggestions = useMemo(() => {
    if (tagInput.trim() === '') return [];

    const inputHira = kanaToHira(tagInput);
    const inputKana = hiraToKana(tagInput);

    return existingTags.filter(tag => {
      const tagHira = kanaToHira(tag);
      const tagKana = hiraToKana(tag);

      return (
        (tagHira.startsWith(inputHira) || tagKana.startsWith(inputKana)) &&
        !tags.includes(tag)
      );
    });
  }, [tagInput, existingTags, tags]);

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
      tags,
      place,
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

  const tagInputRef = useRef<TextInput>(null);

  const addTag = (tag: string) => {
    if (!tag.trim()) return;
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
    tagInputRef.current?.focus(); //再フォーカス
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContent}
      enableOnAndroid={true}
      extraScrollHeight={60}   // キーボードが出たときの余白
      keyboardShouldPersistTaps="handled"
      keyboardOpeningTime={0}
    >

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

      {/* 写真プレビュー（タップでアップロード） */}
      <TouchableOpacity onPress={pickImage} style={{ marginHorizontal: -16 }}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.image} resizeMode="cover" />
        ) : (
          <View
            style={[
              styles.image,
              { justifyContent: "center", backgroundColor: "#c0c0c0" }
            ]}
          >
            <Text style={{ color: "#fff", fontSize: 18, textAlign: "center", width: "100%" }}>
              Upload image
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* 入力フォーム */}
      <TextInput
        style={styles.inputTitle}
        placeholder="タイトルを入力"
        value={title}
        onChangeText={setTitle}
      />

      {/* タグ入力欄（タグ + 入力ボックス一体型） */}
      <View style={styles.tagInputRow}>
        {tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text>#{tag}</Text>
          </View>
        ))}
        <TextInput
          ref={tagInputRef}
          style={styles.tagTextInput}
          placeholder="タグを入力"
          value={tagInput}
          onChangeText={setTagInput}


          onSubmitEditing={() => {
            addTag(tagInput);
            // blurが走る直後にフォーカスを復帰
            requestAnimationFrame(() => {
              tagInputRef.current?.focus();
            });
          }}

          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace' && tagInput === '') {
              setTags(tags.slice(0, -1)); // ← バックスペースで直前のタグ削除
            }
          }}
        />
      </View>

      {/* 候補リスト */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionBox}>
          {suggestions.map(item => (
            <TouchableOpacity
              key={item}
              style={styles.suggestion}
              onPress={() => addTag(item)}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="住所を入力"
        value={place}
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
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backArrow: { fontSize: 20, fontWeight: 'bold', marginRight: 8 },
  headerActions: { flexDirection: 'row' },
  action: { fontSize: 16, color: 'black', marginLeft: 12 },
  scrollContent: { padding: 16 },
  image: { width: screenWidth, height: 200, marginBottom: 16 },
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
  suggestionBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginBottom: 8,
  },
  suggestion: {
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  tag: {
    backgroundColor: "#eee",
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 4,
    borderRadius: 6,
  },
  tagInputRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  tagTextInput: {
    minWidth: 60,
    flex: 1,
    padding: 4,
    fontSize: 16,
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
