import { Dimensions, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const Details = () => {
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
        source={{
          uri: 'https://moomcafe.com/serviceimg/gourmet/315401/pg-1751530322245-5343.jpg',
        }}
        style={styles.image}
      />

      {/* スクロール部分 */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* タイトル */}
        <Text style={styles.title}>MooM Cafe</Text>

        {/* タグ */}
        <View style={styles.tagsContainer}>
          <Text style={styles.tag}>#食べたい</Text>
          <Text style={styles.tag}>#大阪</Text>
        </View>

        {/* 住所と価格 */}
        <Text style={styles.address}>〒569-0802 大阪府高槻市 北園町15-15 三精ビル3F</Text>
        <Text style={styles.price}>1500円～2000円</Text>

        {/* リンク */}
        <TouchableOpacity onPress={() => Linking.openURL('https://moomcafe.com/')}>
          <Text style={styles.link}>https://moomcafe.com/</Text>
        </TouchableOpacity>

        {/* 詳細見出し */}
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>詳細</Text>
            <View style={styles.detailLine} />
        </View>
        {/* 説明文 */}
        <Text style={styles.text}>
          高槻市駅から徒歩1分の「MooM Cafe（ムームカフェ）」は、店名の由来でもある「ムー」＝フランス語で“やわらかい”という意味のとおり、ふわふわ食感にこだわったパンケーキが自慢です。
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  backArrow: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  action: {
    fontSize: 16,
    color: 'blue',
    marginLeft: 12,
  },
  scrollContent: {
    padding: 16,
  },
  image: {
    width: screenWidth,
    height: 200,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  tag: {
    backgroundColor: '#eee',
    paddingVertical: 4,
    paddingHorizontal: 5,
    marginRight: 8,
    borderRadius: 4,
    fontSize: 16,
  },
  address: {
    marginBottom: 2,
    fontSize: 14,
    paddingHorizontal: 5,
  },
  price: {
    marginBottom: 8,
    fontSize: 14,
    paddingHorizontal: 5,
  },
  link: {
    marginBottom: 8,
    fontSize: 14,
    color: '#1E90FF',
    textDecorationLine: 'underline',
    paddingHorizontal: 5,
  },
  text: {
    marginBottom: 8,
    fontSize: 15,
    paddingHorizontal: 5,
  },
  detailHeader: {
  marginTop: 16,
  marginBottom: 8,
  },
  detailTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 4,
  },
  detailLine: {
  height: 2,
  backgroundColor: '#ddd',
  width: '100%', // ラインをテキスト幅に合わせる場合は数字や割合調整可
},
});

export default Details;
