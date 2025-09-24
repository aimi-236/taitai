import { addData, updateData } from '@/data/sampleData';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { sampleData } from "../data/sampleData"; //既存タグ取得用

const screenWidth = Dimensions.get('window').width;

const FormScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();   // ← これに統一

  // --- 初期値セット ---
  const rawTags = params.tags;
  const initialTags: string[] = Array.isArray(rawTags)
    ? rawTags
    : typeof rawTags === 'string' && rawTags.length > 0
      ? rawTags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

  const getString = (v: unknown): string => Array.isArray(v) ? (v[0] ?? '') : (typeof v === 'string' ? v : '');
  const [title, setTitle] = useState(getString(params.title));
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState('');
  const [place, setAddress] = useState(getString(params.place));
  const [price, setPrice] = useState(getString(params.price));
  const [memo, setMemo] = useState(getString(params.memo));
  const [link, setLink] = useState(getString(params.link));
  const [photo, setPhoto] = useState(getString(params.photo) || null);
  const [id, setId] = useState(getString(params.id));
  const from = params.from ?? '';

  // --- タグ候補 ---
  const existingTags = useMemo(() => {
    const allTags = sampleData.flatMap(item => item.tags || []);
    return Array.from(new Set(allTags));
  }, []);

  const hiraToKana = (str: string) =>
    str.replace(/[\u3041-\u3096]/g, ch =>
      String.fromCharCode(ch.charCodeAt(0) + 0x60)
    );
  const kanaToHira = (str: string) =>
    str.replace(/[\u30A1-\u30F6]/g, ch =>
      String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );

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

  // --- 画像選択 ---
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

  // --- 保存 ---
  const handleSave = () => {
    const data = { title, tags, place, memo, price, link, photo, id };
    console.log('保存データ:', data);

    if (from === '/details') {
      // updateDataの引数順に合わせる
      updateData(id, title, tags, place, memo, price, link, photo);
      alert('更新しました！');
    } else {
      // addDataの引数順に合わせる
      addData(title, tags, place, memo, price, link, photo);
      alert('新規作成しました！');
    }
    router.back();
  };

  const handleBack = () => router.back();

  const tagInputRef = useRef<TextInput>(null);
  const addTag = (tag: string) => {
    if (!tag.trim()) return;
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
    tagInputRef.current?.focus();
  };

  // --- UI ---
  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.action}>{from === '/details' ? '更新' : '保存'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={60}
        keyboardShouldPersistTaps="handled"
        keyboardOpeningTime={0}
      >
        {/* 写真 */}
        <TouchableOpacity onPress={pickImage} style={{ marginHorizontal: -16 }}>
          {photo ? (
            <Image source={{ uri: typeof photo === 'string' ? photo : '' }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, { justifyContent: 'center', backgroundColor: '#c0c0c0' }]}>
              <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center', width: '100%' }}>
                Upload image
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* タイトル */}
        <TextInput
          style={styles.inputTitle}
          placeholder="タイトルを入力"
          value={typeof title === 'string' ? title : ''}
          onChangeText={setTitle}
        />

        {/* タグ入力 */}
        <View style={styles.tagInputRow}>
          {tags.map(tag => (
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
              requestAnimationFrame(() => {
                tagInputRef.current?.focus();
              });
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && tagInput === '') {
                setTags(tags.slice(0, -1));
              }
            }}
          />
        </View>

        {suggestions.length > 0 && (
          <View style={styles.suggestionBox}>
            {suggestions.map(item => (
              <TouchableOpacity key={item} style={styles.suggestion} onPress={() => addTag(item)}>
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 住所 */}
        <TextInput
          style={styles.input}
          placeholder="住所を入力"
          value={typeof place === 'string' ? place : ''}
          onChangeText={setAddress}
        />

        {/* 価格 */}
        <TextInput
          style={styles.input}
          placeholder="価格を入力"
          value={typeof price === 'string' ? price : ''}
          onChangeText={setPrice}
        />

        {/* URL */}
        <TextInput
          style={styles.input}
          placeholder="URLを入力"
          value={typeof link === 'string' ? link : ''}
          onChangeText={setLink}
        />

        {/* 詳細 */}
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>詳細</Text>
          <View style={styles.detailLine} />
        </View>
        <TextInput
          style={[styles.input, styles.memo]}
          placeholder="説明文を入力"
          value={typeof memo === 'string' ? memo : ''}
          onChangeText={setMemo}
          multiline
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

// --- スタイル ---
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 8,
  },
  suggestion: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tag: {
    backgroundColor: '#eee',
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 4,
    borderRadius: 6,
  },
  tagInputRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  tagTextInput: { minWidth: 60, flex: 1, padding: 4, fontSize: 16 },
  memo: { height: 100, textAlignVertical: 'top' },
  detailHeader: { marginTop: 16, marginBottom: 8 },
  detailTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  detailLine: { height: 2, backgroundColor: '#ddd', width: '100%' },
});

export default FormScreen;
