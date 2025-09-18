// sampleData.ts


// dateは作成日?
export const sampleData = [
  {
    id: "1",
    title: "新江ノ島水族館",
    photo: "https://www.enosui.com/images/exhibition/mainv_exh_sagami.jpg",
    place: "神奈川県藤沢市片瀬海岸2丁目19番1号",
    price: "¥2800",
    link: "https://www.enosui.com",
    date: "2025-9-12",
    tags: ["水族館", "神奈川", "行きたい"],
    memo: "静かな空間で綺麗な海の生物を楽しめる。ショップも広い！"
  },
  {
    id: "2",
    title: "大洗 海鮮丼",
    photo: "https://user0514.cdnw.net/shared/img/thumb/PK-010A1020_TP_V.jpg",
    place: "茨城県東茨城郡大洗町磯浜町8253-56",
    price: "",
    link: "http://www.oarai-kaisen.com",
    date: "2025-10-24",
    tags: ["海鮮", "食べたい", "お刺身"],
    memo: "美味しい海鮮丼が食べられるお店。炙り牡蠣が美味しいらしい"
  },
  {
    id: "3",
    title: "ABCカフェ",
    photo: "https://kyo-hayashiya.jp/wp-content/themes/kyohayashiya/img/sweets_img/sweets_img01.png",
    place: "",
    price: "¥1500〜3000",
    link: "https://kyo-hayashiya.jp/menu_hibiya/",
    date: "2025-09-20",
    tags: ["カフェ", "和スイーツ", "食べたい"],
    memo: "静かな空間で美味しい和スイーツを楽しめる！店舗は複数あるみたい"
  },
  {
    id: "4",
    title: "箱根 芦ノ湖",
    photo: "https://www.hakone-ryokan.or.jp/assets/img/area/ashinoko/ashinoko_img_01.jpg",
    place: "神奈川県足柄下郡箱根町",
    price: "",
    link: "https://www.hakone-ryokan.or.jp/area/ashinoko.html",
    date: "2025-10-01",
    tags: ["温泉", "富士山", "日帰り"],
    memo: "遊覧船や温泉も楽しめる人気の観光地"
  },
  {
    id: "5",
    title: "DEFパフェ",
    photo: "https://q-pot.jp/wp-content/uploads/2025/08/qpotcafe_2025Halloweenmenu1-1.jpg",
    place: "",
    price: "¥1000〜2000",
    link: "https://q-pot.jp/cafe/",
    date: "2025-09-20",
    tags: ["パフェ", "食べたい", "ハロウィン"],
    memo: "可愛い空間で美味しいパフェを楽しめる。店舗は複数あるみたい"
  },
  {
    id: "6",
    title: "GHI遊園地 ABCコラボイベント",
    photo: "https://media2.tokyodisneyresort.jp/home/top/main/2025/06/mainL_01.jpg",
    place: "千葉県浦安市舞浜１−１",
    price: "¥20000〜40000",
    link: "https://www.tokyodisneyresort.jp/tdl/",
    date: "2025-10-05",
    tags: ["遊園地", "行きたい", "期間限定"],
    memo: "GHI遊園地とABCのコラボイベントが開催！"
  }
];

export const addData = function(title: string, tags: Array<string>, place: string, detail: string) {
  sampleData.push({
    id: '${getMaxId() + 1}',
    title: title,
    photo: '',
    place: place,
    price: '',
    link: '',
    date: '',
    tags: tags,
    memo: detail
    }
  )
}

const getMaxId = function() {
  let maxId = 0;
  for (let data of sampleData) {
    if (maxId < parseInt(data["id"])) {
      maxId = parseInt(data["id"]);
    }
  }

  return maxId
}
