# Taimemo（タイメモ） 📝

## 📱 アプリの概要

**Taimemo** は、行きたい場所、食べたい食べ物、やりたいことなど、様々な「やりたい・やってみたい」を一括管理できるモバイルアプリです。

タグ付けされたアイテムを登録し、検索・フィルタリング・ソート機能で簡単に探せます。テーマカラーとフォント選択で自分好みにカスタマイズできます。

### 🌟 主な機能

- **📋 アイテム管理**
  - 新規作成、編集、削除が可能
  - タイトル、場所、価格、メモ、リンク、写真、タグ、日付を記録
  
- **🔍 高度な検索機能**
  - 全フィールドを対象とした部分一致検索
  - 価格の範囲検索に対応（例：1000〜2000）
  - 複数キーワードでの絞り込み
  - 関連度順での自動ソート

- **🏷️ タグフィルタリング**
  - タグの出現回数を表示
  - 複数タグでの絞り込みに対応

- **⬆️⬇️ ソート機能**
  - IDベースの昇順・降順ソート
  - 検索中は関連度順に自動切り替え

- **🎨 カスタマイズ機能**
  - 8つのテーマカラー（ホワイト、ブラック、ブルー、ピンク、グリーン、イエロー、パープル、グレー）
  - 8つのフォント選択（システムフォント＋7種類のカスタムフォント）

- **📱 マルチプラットフォーム対応**
  - iOS / Android / Web ブラウザで動作

---

## 🛠️ 使用技術

### フロントエンド
- **React Native** 0.79.6
- **Expo** 54.0.7
- **TypeScript** 5.8.3
- **Expo Router** 5.1.5（ファイルベースルーティング）

### UI・ナビゲーション
- **@react-navigation** 7系（ボトムタブナビゲーション）
- **@expo/vector-icons** 14.1.0（Ioniconsアイコン）
- **react-native-keyboard-aware-scroll-view** 0.9.5（キーボード対応）
- **react-native-safe-area-context** 5.4.0

### その他
- **expo-image-picker** 17.0.8（画像選択機能）
- **expo-blur** 14.1.5（ぼかしエフェクト）
- **wanakana** 5.3.1（ひらがな↔︎カタカナ変換）
- **expo-font** 14.0.8（カスタムフォント）

### 開発ツール
- **ESLint** 9.25.0
- **Babel** 7.25.2

---

## 📁 ファイル構成

```
taitai/
├── app/                          # メインアプリケーション（Expo Router）
│   ├── _layout.tsx              # レイアウト・テーマコンテキスト定義
│   ├── index.tsx                # 🏠 メイン画面（アイテム一覧・検索・フィルタリング）
│   ├── details.tsx              # 📄 詳細画面（アイテム情報表示）
│   ├── FormScreen.tsx           # ✏️ フォーム画面（新規作成・編集）
│   ├── theme.tsx                # 🎨 テーマ・フォント設定画面
│   ├── TagFilter.tsx            # コンポーネント：タグフィルタ
│   └── SortButton.tsx           # コンポーネント：ソートボタン
│
├── data/
│   └── sampleData.ts            # 📊 データモデル・CRUD操作
│                                 # (addData, updateData, deleteData, getCopySampleData)
│
├── assets/
│   ├── fonts/                   # 🔤 カスタムフォント
│   │   ├── HachiMaruPop-Regular.ttf
│   │   ├── KaiseiDecol-Regular.ttf
│   │   ├── MPLUSRounded1c-Regular.ttf
│   │   ├── ZenKurenaido-Regular.ttf
│   │   ├── NewTegomin-Regular.ttf
│   │   ├── ReggaeOne-Regular.ttf
│   │   └── Stick-Regular.ttf
│   └── images/                  # 📸 アプリアイコン・スプラッシュ画像
│
├── Search.ts                    # 🔍 検索エンジン
│                                # - 複数フィールド対応
│                                # - 価格の数値・範囲検索対応
│                                # - 関連度スコアリング
│
├── package.json                # 📦 依存関係・スクリプト
├── tsconfig.json               # TypeScript設定
├── app.json                    # Expo設定（アプリ名、プラグイン、スプラッシュ画像等）
├── eslint.config.js            # ESLint設定
├── expo-env.d.ts               # Expo型定義
└── index.html                  # Web版のHTMLエントリーポイント
```

### 各ファイルの説明

#### 📄 app/index.tsx（メイン画面）
- アイテム一覧表示
- リアルタイム検索バー
- タグフィルタリング
- ソート機能（昇順/降順）
- 設定画面へのナビゲーション

#### 📄 app/details.tsx（詳細画面）
- 選択アイテムの詳細表示
- 編集・削除の各機能
- 日時や価格などのメタ情報を見やすく表示

#### 📄 app/FormScreen.tsx（フォーム画面）
- 新規アイテム作成時のフォーム
- 既存アイテムの編集
- 画像ピッカー統合
- タグの提案機能（ひらがな・カタカナ自動検出）

#### 📄 app/theme.tsx（テーマ設定画面）
- 8つのカラーテーマから選択
- 8つのフォントから選択
- リアルタイムプレビュー

#### 📄 app/_layout.tsx（レイアウト）
- React Context による グローバルテーマ管理
- カスタムフォントロード
- 全画面でアクセス可能な `useTheme()` フック

#### 📄 Search.ts（検索エンジン）
- 複数フィールドの部分一致検索
- 価格の数値・範囲検索
- テキスト正規化・トークン化
- 関連度スコアリング実装

#### 📄 data/sampleData.ts（データモデル）
- `ItemType` 型定義
- 初期サンプルデータ（16件）
- CRUD 操作関数：`addData()`, `updateData()`, `deleteData()`
- ヘルパー関数：`getCopySampleData()`, `getMaxId()`

---

## 🚀 起動方法

### 前提条件
- **Node.js** 14.0 以上
- **npm** または **yarn**
- **Xcode**（iOS 開発時）または **Android Studio**（Android 開発時）

### インストール・起動

1. **依存関係をインストール**
   ```bash
   npm install
   ```

2. **開発サーバーを起動**
   ```bash
   npm start
   ```

3. **各プラットフォームで起動**
   - **iOS シミュレータで起動**
     ```bash
     npm run ios
     ```
   - **Android エミュレータで起動**
     ```bash
     npm run android
     ```
   - **Web ブラウザで起動**
     ```bash
     npm run web
     ```

4. **Expo Go アプリ経由での起動**
   - `npm start` を実行した後、スマートフォンの Expo Go アプリから QR コードをスキャン

### その他のコマンド

| コマンド | 説明 |
|---------|------|
| `npm run lint` | ESLintでコードをチェック |
| `npm run reset-project` | プロジェクトをリセット |

---

## 📊 データ構造

各アイテムは以下の TypeScript 型で定義されます：

```typescript
export type ItemType = {
  id: string;           // 一意のID（自動採番）
  title: string;        // タイトル（施設名や商品名など）
  tags: string[];       // タグ配列（"水族館"、"行きたい" など）
  place: string;        // 場所（住所など）
  memo: string;         // メモ・説明文
  price: string;        // 価格（"2800"、"1000〜2000" など）
  link: string;         // URL
  photo: string;        // 画像 URI
  date: string;         // 日付（YYYY-MM-DD形式）
};
```

### サンプルデータ例

```typescript
{
  id: "1",
  title: "新江ノ島水族館",
  tags: ["水族館", "神奈川", "行きたい"],
  place: "神奈川県藤沢市片瀬海岸2丁目19番1号",
  memo: "静かな空間で綺麗な海の生物を楽しめる。ショップも広い！",
  price: "2800",
  link: "https://www.enosui.com",
  photo: "https://www.enosui.com/images/...",
  date: "2025-09-12"
}
```

---

## 🔍 検索機能の詳細

### 検索エンジン (Search.ts)

以下の特徴を持つ高度な検索エンジンを実装：

#### 1. テキスト正規化
- 大文字 → 小文字に統一
- 全角 → 半角に統一
- Unicode 正規化（NFKC）を適用

#### 2. 複数フィールド対応
以下の 7 フィールドを検索対象にしています：
- **タイトル**（40点/出現回）
- **タグ**（28点/出現回）
- **場所**（24点/出現回）
- **メモ**（20点/出現回）
- **日付**（14点/出現回）
- **リンク**（10点/出現回）
- **価格**（12点/出現回、範囲検索時）

#### 3. 価格の範囲検索
- **単一値検索**：`2000` → 2000円のアイテムを抽出
- **範囲検索**：`1000〜2000` → 1000円～2000円のアイテムを抽出
- **対応する区切り文字**：`~`、`〜`、`-`、`–`、`—`

```typescript
// 使用例
searchAllFields(sampleData, "2000");           // → 単一値検索
searchAllFields(sampleData, "1000〜2000");     // → 範囲検索
searchAllFields(sampleData, "水族館 2800");   // → 複数キーワード検索
```

#### 4. 関連度スコアリング
結果は以下の優先度でスコアリングされます：
- **タグ完全一致**：90点
- **タイトル完全一致**：80点
- **テーマ内全体マッチ**：+30点
- **複数トークンマッチ**：+2点（トークン数）

より高いスコアを持つアイテムが上に表示されます。

---

## 🎨 テーマ・スタイルシステム

### Color Palette（カラーパレット）

| テーマ名 | 背景色 | テキスト色 | タグ背景 | 特徴 |
|--------|--------|---------|---------|------|
| ホワイト | #fff | #000 | #eee | 標準的なライトテーマ |
| ブラック | #000 | #fff | #333 | ダークモード |
| ブルー | #E6F0F5 | #000 | #9bbfd1 | 落ち着いた青系 |
| ピンク | #FDE2E4 | #000 | #f8a5b5 | 柔らかいピンク系 |
| グリーン | #E2F0E9 | #000 | #9dc9b3 | 緑系治癒色 |
| イエロー | #FFF9DB | #000 | #f5e67c | 暖かい黄系 |
| パープル | #F3E5F5 | #000 | #c7a4d5 | エレガントな紫系 |
| グレー | #F5F5F5 | #000 | #bbb | ニュートラルなグレー系 |

### Font Options（フォント選択肢）

| # | フォント名 | 特徴 |
|---|-----------|------|
| 1 | System | OS デフォルトフォント |
| 2 | HachiMaruPop-Regular | ポップな丸みのある書体 |
| 3 | KaiseiDecol-Regular | 装飾的で個性的な書体 |
| 4 | MPLUSRounded1c-Regular | 優しく丸い書体 |
| 5 | ZenKurenaido-Regular | 古風で上品な書体 |
| 6 | NewTegomin-Regular | 柔らかくて読みやすい書体 |
| 7 | ReggaeOne-Regular | 緩やかでリラックス感のある書体 |
| 8 | Stick-Regular | シンプルで直線的な書体 |

テーマ・フォント設定は **React Context** (ThemeContext) で全画面に共有されます。`useTheme()` フックでどのコンポーネントからもアクセス可能です。

---

## 🧑‍💻 開発者向け情報

### プロジェクト構成の詳細

#### ファイルベースルーティング
Expo Router を使用しており、`app/` ディレクトリ内の `.tsx` ファイルが自動的に루트となります：
- `app/index.tsx` → `/` ホーム画面
- `app/details.tsx` → `/details` 詳細画面
- `app/FormScreen.tsx` → `/FormScreen` フォーム画面
- `app/theme.tsx` → `/theme` テーマ設定画面

#### 状態管理
- **React Hooks**：`useState`, `useMemo`, `useContext` を活用
- **Context API**：`ThemeContext` でアプリ全体のテーマを管理
- **useFocusEffect**：画面フォーカス時のデータリロード

#### イメージ処理
- **Expo Image Picker**：ユーザーが端末から画像を選択
- **URI 管理**：画像は大きなサイズなので URI として管理（必要に応じてローカル保存も可能）

#### データ永続化（現在）
- メモリ内でのデータ管理
- アプリ再起動でデータクリア
- **今後の推奨**：`react-native-sqlite-storage` や `Realm` でローカルDB化

### カスタマイズポイント

#### 1. 新しいアイテムフィールドの追加

```typescript
// Step 1: ItemType を拡張
export type ItemType = {
  // ... 既存フィールド ...
  rating?: number;  // 新規フィールド
};

// Step 2: FormScreen.tsx にフォーム項目を追加
const [rating, setRating] = useState(getString(params.rating));

// Step 3: Search.ts の検索ロジック更新
function fieldsOf(item: any) {
  // ... 既存フィールド ...
  const rating = norm(item?.rating);
  return { ..., rating };
}
```

#### 2. 新しいテーマの追加

```typescript
// theme.tsx の colors 配列に追加
const colors = [
  // ... 既存テーマ ...
  { 
    name: "オレンジ", 
    palette: { 
      background: "#FFE8CC", 
      text: "#000", 
      tagBg: "#FFB380", 
      tagText: "#000" 
    } 
  },
];
```

#### 3. 新しいフォントの追加

```typescript
// Step 1: フォントファイルを assets/fonts/ に配置
// MyFont-Regular.ttf

// Step 2: _layout.tsx で Font.loadAsync() に登録
await Font.loadAsync({
  "MyFont-Regular": require("../assets/fonts/MyFont-Regular.ttf"),
});

// Step 3: theme.tsx の fonts 配列に追加
const fonts = [
  // ... 既存フォント ...
  "MyFont-Regular",
];
```

---

## 📝 初期データについて

`sampleData.ts` には 16 件のサンプルアイテムが含まれています。既存タグを確認し、タグフィルタリングの動作確認に利用できます。

### データ分類

- 🏢 **観光地**（5件）
  - 新江ノ島水族館、しながわ水族館、箱根 芦ノ湖
  - 清水寺、金閣寺

- 🍽️ **飲食店・カフェ**（4件）
  - 大洗 海鮮丼、林屋新兵衛
  - Q-pot CAFE.、イタリアンダイニングDONA
  - 水ノ雅 KYOTO FUSHIMI

- 🎪 **イベント・体験**（3件）
  - 東京ディズニーランド
  - 千秋工房 陶芸体験
  - ヨルシカ ライブ

- 🏨 **宿泊施設・その他**（4件）
  - 季の音（高級宿）
  - ドラゴンクエスト展示会
  - 千葉の観光紹介

### 主なタグ例
- 行動：`行きたい`, `食べたい`, `やりたい`
- カテゴリ：`水族館`, `寺`, `カフェ`, `イベント`
- 地域：`神奈川`, `東京`, `京都`, `千葉`, `近場`
- 特性：`高級`, `期間限定`

---

## 📜 ライセンス

このプロジェクトはプライベートプロジェクトです。

---

## ❓ トラブルシューティング

### ビルドエラーが出た場合

```bash
# キャッシュをクリア
npm run reset-project

# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install

# iOS 特有の問題は Pods を再生成
cd ios && rm -rf Pods Podfile.lock && cd ..
npm run ios
```

### 検索結果が期待と異なる場合

- 検索エンジンは複数フィールドを対象に**部分一致**で検索します
- 価格の範囲検索は `~`, `〜`, `-` などの区切り文字を認識します
- キーワードが複数ある場合は**すべてのキーワード**にマッチするアイテムのみ返されます
- 大文字小文字、全角半角は自動で統一されます

### テーマが反映されない場合

- `ThemeContext` が正しくプロバイダーで囲まれているか確認
- `_layout.tsx` でレイアウト全体をプロバイダーで宣言しています
- `useTheme()` フックで正しくテーマを取得できているか確認

### 画像が表示されない場合

1. ネットワーク接続を確認（URIはオンライン画像を想定）
2. 画像 URL が正しいか確認
3. `expo-image` コンポーネントの仕様を確認

### データが保存されない場合

- 現在のアプリはメモリ内でデータを管理しているため、アプリ再起動でクリアされます
- 永続化が必要な場合はローカルDB（SQLite など）の導入を検討してください

---

## 🔗 参考リンク

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Expo Router](https://docs.expo.dev/routing/introduction/)
- [React Navigation](https://reactnavigation.org/)

---

**最終更新**: 2026年3月23日
