import { Dimensions, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const Details = ({ route }: any) => {
  const { item } = route.params;

  const handleBack = () => {
    alert('戻るボタンが押されました');
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <Text style={styles.action}>編集</Text>
          <Text style={styles.action}>削除</Text>
        </View>
      </View>

      {/* 画像をヘッダー直下に */}
      <Image
        source={
          typeof item.photo === "number"
            ? item.photo // require のローカル画像
            : { uri: item.photo } // URL の場合
        }
        style={styles.image}
      />

      {/* スクロール部分 */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* タイトル */}
        <Text style={styles.title}>{item.title}</Text>

        {/* タグ */}
        <View style={styles.tagsContainer}>
          {item.tags.map((tag: string, index: number) => (
            <Text key={index} style={styles.tag}>#{tag}</Text>
          ))}
        </View>

        {/* 住所と価格 */}
        <Text style={styles.address}>{item.place}</Text>
        <Text style={styles.price}>{item.price}</Text>

        {/* リンク（もしあれば） */}
        {item.link && (
          <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
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
  tagsContainer: { flexDirection: 'row', marginBottom: 8, paddingHorizontal: 5 },
  tag: {
    backgroundColor: '#eee',
    paddingVertical: 4,
    paddingHorizontal: 5,
    marginRight: 8,
    borderRadius: 4,
    fontSize: 16,
  },
  address: { marginBottom: 2, fontSize: 14, paddingHorizontal: 5 },
  price: { marginBottom: 8, fontSize: 14, paddingHorizontal: 5 },
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
