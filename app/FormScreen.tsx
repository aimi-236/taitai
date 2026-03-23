import { addData, deleteData, updateData } from '@/data/sampleData';
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
  const [toast, setToast] = useState<string | null>(null);
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

  // --- 削除 ---
  const handleDelete = () => {
    if (!id) return;
    deleteData(id);
    alert('削除しました');
    router.back();
  };

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
      updateData(id, title, tags, place, memo, price, link, photo);
      showToast('更新しました！');
    } else {
      addData(title, tags, place, memo, price, link, photo);
      showToast('新規作成しました！');
    }
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  // トースト表示関数
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1000);
  };

  const handleBack = () => router.back();

  const tagInputRef = useRef<TextInput>(null);
  // Backspace検知用フラグ
  const backspacePressedRef = useRef(false);
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.palette.background }]} edges={['top']}>
      {/* トーストメッセージ（iOS用） */}
      {toast && (
        <View style={{ position: 'absolute', top: '50%', left: 0, right: 0, zIndex: 100, alignItems: 'center' }} pointerEvents="none">
          <View style={{ backgroundColor: '#333', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 24, opacity: 0.92 }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>{toast}</Text>
          </View>
        </View>
      )}
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
          {photo && typeof photo === 'string' && /^https?:\/\//.test(photo) ? (
            <Image source={{ uri: photo }} style={styles.image} resizeMode="cover" />
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
            { color: theme.palette.text, fontFamily: theme.font, borderBottomColor: theme.palette.tagBg },
            theme.font === 'System' ? { fontWeight: 'bold' } : { fontWeight: 'normal' }
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
            onChangeText={text => {
              setTagInput(text);
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') {
                if (tagInput === '' && tags.length > 0) {
                  // 入力が空の状態でBackspace → 最後のタグを削除
                  setTags(prev => prev.slice(0, -1));
                }
              }
            }}
            onSubmitEditing={() => addTag(tagInput)}
          />

        </View>
        {/* タグ補完候補 */}
        {suggestions.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
            {suggestions.map(s => (
              <TouchableOpacity
                key={s}
                onPress={() => addTag(s)}
                style={{
                  backgroundColor: theme.palette.tagBg,
                  borderRadius: 6,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  margin: 4,
                }}
              >
                <Text style={{ color: theme.palette.tagText, fontFamily: theme.font }}>#{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

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

        {/* URL + AI生成ボタン */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={[
              styles.input,
              { color: theme.palette.text, fontFamily: theme.font, borderBottomColor: theme.palette.tagBg, flex: 1 }
            ]}
            placeholder="URLを入力"
            placeholderTextColor="#888"
            value={link}
            onChangeText={setLink}
          />
          <TouchableOpacity
            style={{ marginLeft: 8, backgroundColor: theme.palette.tagBg, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 12 }}
            onPress={async () => {
              if (!link) return;
              let aiTitle = '';
              let aiPlace = '';
              let aiTags: string[] = [];
              try {
                // HTML取得
                const res = await fetch(link);
                const html = await res.text();
                // Hugging Faceの無料APIで情報抽出（例: bigscience/bloomz）
                const prompt = `以下のHTMLから「タイトル」「場所」「タグ」「詳細」を日本語で抽出し、JSONで返してください。\n\n- タイトルは15文字以内で、途中で単語や文節を切らず自然な日本語で要約してください。\n- 詳細は100文字以内で、省略記号（...や[…]など）を使わず、\n  "このサイトには〜が載っています"のようなサイト自体の説明は避け、\n  その場所・施設・お店自体の特徴や魅力を自然な日本語で説明してください。\n- 場所・タグも可能な限り抽出してください。\n\nHTML:\n${html.slice(0, 4000)}`;
                try {
                  const hfRes = await fetch('https://api-inference.huggingface.co/models/bigscience/bloomz-560m', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ inputs: prompt })
                  });
                  const hfData = await hfRes.json();
                  let result = {};
                  try {
                    const text = hfData[0]?.generated_text || '';
                    result = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}');
                  } catch { }
                  const r: any = result;
                  if (r.title) aiTitle = r.title;
                  if (r.place) aiPlace = r.place;
                  if (r.tags && Array.isArray(r.tags)) aiTags = r.tags;
                } catch { }

                // AIでタイトルが取れなければ<title>やog:titleから抽出
                if (!aiTitle) {
                  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
                  if (titleMatch && titleMatch[1]) {
                    aiTitle = titleMatch[1].trim();
                  } else {
                    const ogMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i);
                    if (ogMatch && ogMatch[1]) {
                      aiTitle = ogMatch[1].trim();
                    }
                  }
                }


                let aiMemo = '';
                // 詳細抽出: description, og:description, 本文pタグなど
                const metaDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i);
                if (metaDesc && metaDesc[1]) {
                  aiMemo = metaDesc[1].trim();
                } else {
                  const ogDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i);
                  if (ogDesc && ogDesc[1]) {
                    aiMemo = ogDesc[1].trim();
                  } else {
                    // 本文の最初の<p>タグ
                    const pTag = html.match(/<p[^>]*>([^<]{10,})<\/p>/i);
                    if (pTag && pTag[1]) {
                      aiMemo = pTag[1].replace(/\s+/g, ' ').trim();
                    }
                  }
                }

                // 画像抽出: og:image, サイト内img（ロゴ除外、main/photo/image等優先）
                let aiPhoto = '';
                // 画像候補リスト
                let imgCandidates: string[] = [];
                // og:image
                const ogImg = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i);
                if (ogImg && ogImg[1]) imgCandidates.push(ogImg[1].trim());
                // imgタグ全取得
                const imgTags = Array.from(html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*([^>]*)>/gi));
                imgTags.forEach(m => {
                  const src = m[1]?.trim();
                  const attrs = m[2] || '';
                  // ロゴ除外
                  if (/logo|ロゴ/i.test(src + attrs)) return;
                  imgCandidates.push(src);
                });
                // main/photo/image/gallery等を優先
                let bestImg = imgCandidates.find(u => /main|photo|image|gallery|food|menu|pic|picture/i.test(u));
                if (!bestImg && imgCandidates.length > 0) bestImg = imgCandidates[0];
                // 相対パス→絶対URL
                if (bestImg && !/^https?:\/\//.test(bestImg) && link) {
                  try {
                    const u = new URL(link);
                    if (bestImg.startsWith('/')) {
                      bestImg = u.origin + bestImg;
                    } else {
                      bestImg = new URL(bestImg, u.origin + u.pathname).href;
                    }
                  } catch { }
                }
                if (bestImg) aiPhoto = bestImg;

                // 住所抽出: 「都道府県 市区町村 ...」の日本語住所パターン
                if (!aiPlace) {
                  const addrMatch = html.match(/[\u4e00-\u9fa5]{2,8}(都|道|府|県)[^\n\r<>]{2,40}?(市|区|町|村)[^\n\r<>]{0,40}/);
                  if (addrMatch && addrMatch[0]) {
                    aiPlace = addrMatch[0].trim();
                  }
                }
                // 住所末尾の不要記号除去
                if (aiPlace) {
                  aiPlace = aiPlace.replace(/[\s,\-"'。、]+$/g, '');
                }

                // タグ抽出: 既存タグからのみ自動付与（タイトル・説明・h1/h2・URLに部分一致）
                if (!aiTags || aiTags.length === 0) {
                  // 既存タグ一覧
                  const allTags = sampleData.flatMap(item => item.tags || []);
                  const uniqueTags = Array.from(new Set(allTags));
                  let tagText = (aiTitle || '') + ' ' + (link || '');
                  // meta description
                  const metaDescTag = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i);
                  if (metaDescTag && metaDescTag[1]) tagText += ' ' + metaDescTag[1];
                  // h1/h2
                  const hTags = Array.from(html.matchAll(/<(h1|h2)[^>]*>([^<]{1,30})<\/\1>/gi)).map(m => m[2]?.trim()).filter(Boolean);
                  if (hTags.length) tagText += ' ' + hTags.join(' ');
                  // 部分一致で既存タグを抽出
                  aiTags = uniqueTags.filter(t => t.length > 0 && tagText.includes(t));

                  // 食べ物系・観光地系ワードで #食べたい/#行きたい を追加
                  const foodWords = /食|グルメ|レストラン|cafe|カフェ|ランチ|ディナー|寿司|ラーメン|カレー|パン|スイーツ|居酒屋|焼肉|うどん|そば|定食|喫茶|bar|bistro|ビストロ|steak|burger|curry|ramen|sushi|pasta|pizza|餃子|焼き鳥|串|天ぷら|天丼|丼|弁当|bento|restaurant|food|meal|lunch|dinner/i;
                  const placeWords = /観光|寺|神社|公園|博物館|美術館|温泉|滝|山|海|湖|城|庭園|展望|museum|park|temple|shrine|onsen|spa|zoo|aquarium|garden|castle|mountain|beach|island|sightseeing|spot|宿|ホテル|旅館|inn|hotel/i;
                  // 既存タグに含まれていなければ追加
                  if (foodWords.test(tagText) && !aiTags.includes('食べたい')) {
                    aiTags.push('食べたい');
                  } else if (placeWords.test(tagText) && !aiTags.includes('行きたい')) {
                    aiTags.push('行きたい');
                  }
                }

                // 省略記号や途中切れを防ぐ後処理
                // 題名: 句読点を除外し自然な区切りで15文字以内
                function trimTitle(str: string, max: number) {
                  if (!str) return '';
                  str = str.replace(/(\.{3,}|\[.*?\]|…+|[。、，,.])/g, ''); // 省略記号・句読点除去
                  if (str.length <= max) return str;
                  // スペース・記号・カタカナ長音・カンマ等で区切る
                  const cut = str.slice(0, max);
                  const lastSep = Math.max(cut.lastIndexOf(' '), cut.lastIndexOf('・'), cut.lastIndexOf('-'), cut.lastIndexOf('／'), cut.lastIndexOf('/'));
                  if (lastSep > 5) return cut.slice(0, lastSep);
                  return cut;
                }
                // 詳細: サイト説明系を除外し、場所自体の説明を優先。なければh1/h2やタイトルからテンプレ生成
                function trimMemo(str: string, max: number) {
                  if (!str) str = '';
                  str = str.replace(/(\.{3,}|\[.*?\]|…+)/g, ''); // 省略記号除去
                  // サイト説明系ワード
                  const ngPatterns = [
                    /このサイトには.*載って(い|います|いる)/i,
                    /サイト(の|には|で|に)\s*.*(紹介|掲載|案内|まとめ|情報|載せて|載っています|載っている)/i,
                    /ホームページ(の|には|で|に)\s*.*(紹介|掲載|案内|まとめ|情報|載せて|載っています|載っている)/i,
                    /webサイト(の|には|で|に)\s*.*(紹介|掲載|案内|まとめ|情報|載せて|載っています|載っている)/i,
                    /メニューが載って(い|います|いる)/i,
                    /日誌が載って(い|います|いる)/i,
                    /掲載/i,
                    /情報/i,
                    /案内/i,
                    /アクセス/i,
                  ];
                  // 句点で区切ってサイト説明系を除外
                  const sentences = str.split('。').map(s => s.trim()).filter(Boolean);
                  let result = '';
                  for (let i = 0; i < sentences.length; i++) {
                    let s = sentences[i];
                    let isNG = false;
                    for (const pat of ngPatterns) {
                      if (pat.test(s)) { isNG = true; break; }
                    }
                    if (isNG) continue;
                    const next = result + (result ? '。' : '') + s;
                    if (next.length > max) break;
                    result = next;
                  }
                  if (result) return result + '。';
                  // 適切な文がなければh1/h2やタイトルからテンプレ生成
                  let tagText = (aiTitle || '');
                  const hTags = Array.from(html.matchAll(/<(h1|h2)[^>]*>([^<]{1,30})<\/\1>/gi)).map(m => m[2]?.trim()).filter(Boolean);
                  if (hTags.length) tagText += ' ' + hTags.join(' ');
                  // 例：「新江ノ島水族館は家族で楽しめる水族館です。」
                  if (tagText) {
                    // 施設名候補
                    const facility = tagText.match(/([\u4e00-\u9fa5A-Za-z0-9]+水族館|[\u4e00-\u9fa5A-Za-z0-9]+博物館|[\u4e00-\u9fa5A-Za-z0-9]+美術館|[\u4e00-\u9fa5A-Za-z0-9]+公園|[\u4e00-\u9fa5A-Za-z0-9]+寺|[\u4e00-\u9fa5A-Za-z0-9]+神社|[\u4e00-\u9fa5A-Za-z0-9]+温泉|[\u4e00-\u9fa5A-Za-z0-9]+城|[\u4e00-\u9fa5A-Za-z0-9]+動物園|[\u4e00-\u9fa5A-Za-z0-9]+庭園|[\u4e00-\u9fa5A-Za-z0-9]+滝|[\u4e00-\u9fa5A-Za-z0-9]+山|[\u4e00-\u9fa5A-Za-z0-9]+海|[\u4e00-\u9fa5A-Za-z0-9]+カフェ|[\u4e00-\u9fa5A-Za-z0-9]+レストラン|[\u4e00-\u9fa5A-Za-z0-9]+店)/);
                    if (facility && facility[0]) {
                      return `${facility[0]}はおすすめのスポットです。`;
                    }
                    // それ以外はタイトルで「〇〇のスポットです」
                    return `${aiTitle}のスポットです。`;
                  }
                  // それでも無理なら空
                  return '';
                }
                if (aiTitle) setTitle(trimTitle(aiTitle, 15));
                if (aiPlace) setAddress(aiPlace);
                if (aiTags && Array.isArray(aiTags)) setTags(aiTags);
                if (aiMemo) setMemo(trimMemo(aiMemo, 100));
                if (aiPhoto) setPhoto(aiPhoto);
                showToast('AIで自動入力しました');
              } catch (e) {
                alert('AI自動入力に失敗しました');
              }
            }}
          >
            <Text style={{ color: theme.palette.tagText, fontFamily: theme.font, fontSize: 14 }}>AI生成</Text>
          </TouchableOpacity>
        </View>

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
    paddingTop: 10,
    paddingHorizontal: 20, // ← 余白を広げる
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backArrow: { fontSize: 20, fontWeight: 'bold', marginRight: 8 },
  headerActions: { flexDirection: 'row' },
  action: { fontSize: 16, marginLeft: 12 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 0, paddingBottom: 16 },
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