import { addData, updateData } from '@/data/sampleData';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sampleData } from "../data/sampleData"; //既存タグ取得用
import { useTheme } from "./_layout";

const screenWidth = Dimensions.get('window').width;

const FormScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();   // ← これに統一
  const { theme } = useTheme();

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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.palette.background }}>
      {/* ヘッダー */}
      <View style={[styles.header, { backgroundColor: theme.palette.background }]}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={[styles.backArrow, { color: theme.palette.text, fontFamily: theme.font }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.action, { color: theme.palette.text, fontFamily: theme.font }]}>
              {from === '/details' ? '更新' : '保存'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* 写真 */}
        <TouchableOpacity onPress={pickImage} style={{ marginHorizontal: -16 }}>
          {photo ? (
            <Image source={{ uri: typeof photo === 'string' ? photo : '' }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, { justifyContent: 'center', backgroundColor: theme.palette.tagBg }]}>
              <Text style={{ color: theme.palette.text, fontSize: 18, textAlign: 'center', width: '100%', fontFamily: theme.font }}>
                Upload image
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* タイトル */}
        <TextInput
          style={[
            styles.inputTitle,
            { color: theme.palette.text, fontFamily: theme.font, borderBottomColor: theme.palette.tagBg }
          ]}
          placeholder="タイトルを入力"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        {/* タグ入力 */}
        <View style={[styles.tagInputRow, { borderColor: theme.palette.tagBg }]}>
          {tags.map(tag => (
            <View key={tag} style={[styles.tag, { backgroundColor: theme.palette.tagBg }]}>
              <Text style={{ color: theme.palette.tagText, fontFamily: theme.font }}>#{tag}</Text>
            </View>
          ))}
          <TextInput
            ref={tagInputRef}
            style={[styles.tagTextInput, { color: theme.palette.text, fontFamily: theme.font }]}
            placeholder="タグを入力"
            placeholderTextColor="#888"
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={() => addTag(tagInput)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && tagInput === '') {
                setTags(tags.slice(0, -1));
              }
            }}
          />
        </View>

        {/* 住所 */}
        <TextInput
          style={[
            styles.input,
            { color: theme.palette.text, fontFamily: theme.font, borderBottomColor: theme.palette.tagBg }
          ]}
          placeholder="住所を入力"
          placeholderTextColor="#888"
          value={place}
          onChangeText={setAddress}
        />

        {/* 価格 */}
        <TextInput
          style={[
            styles.input,
            { color: theme.palette.text, fontFamily: theme.font, borderBottomColor: theme.palette.tagBg }
          ]}
          placeholder="価格を入力"
          placeholderTextColor="#888"
          value={price}
          onChangeText={setPrice}
        />

        {/* URL */}
        <TextInput
          style={[
            styles.input,
            { color: theme.palette.text, fontFamily: theme.font, borderBottomColor: theme.palette.tagBg }
          ]}
          placeholder="URLを入力"
          placeholderTextColor="#888"
          value={link}
          onChangeText={setLink}
        />

        {/* 詳細 */}
        <View style={styles.detailHeader}>
          <Text style={[styles.detailTitle, { color: theme.palette.text, fontFamily: theme.font }]}>詳細</Text>
          <View style={[styles.detailLine, { backgroundColor: theme.palette.tagBg }]} />
        </View>
        <TextInput
          style={[
            styles.input,
            styles.memo,
            { color: theme.palette.text, fontFamily: theme.font, borderBottomColor: theme.palette.tagBg }
          ]}
          placeholder="説明文を入力"
          placeholderTextColor="#888"
          value={memo}
          onChangeText={setMemo}
          multiline
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backArrow: { fontSize: 20, fontWeight: 'bold', marginRight: 8 },
  headerActions: { flexDirection: 'row' },
  action: { fontSize: 16, marginLeft: 12 },
  scrollContent: { padding: 16 },
  image: { width: screenWidth, height: 200, marginBottom: 16 },
  inputTitle: { fontSize: 24, fontWeight: 'bold', borderBottomWidth: 1, marginBottom: 12, padding: 4 },
  input: { fontSize: 16, borderBottomWidth: 1, marginBottom: 12, padding: 4 },
  tag: { paddingVertical: 4, paddingHorizontal: 8, margin: 4, borderRadius: 6 },
  tagInputRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', borderWidth: 1, padding: 4, borderRadius: 6, marginBottom: 12 },
  tagTextInput: { minWidth: 60, flex: 1, padding: 4, fontSize: 16 },
  memo: { height: 100, textAlignVertical: 'top' },
  detailHeader: { marginTop: 16, marginBottom: 8 },
  detailTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  detailLine: { height: 2, width: '100%' },
});

export default FormScreen;