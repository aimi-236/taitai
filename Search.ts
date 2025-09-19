// AllSearch.ts

/* 文字を正規化（大小/全半角をそろえる） */
function norm(v: any) {
    if (v === null || v === undefined) return "";
    let s = String(v).toLowerCase().trim();
    try {
      if (typeof (s as any).normalize === "function") s = s.normalize("NFKC");
    } catch {}
    return s;
  }
  
  /* クエリをトークン化（半角/全角スペース対応） */
  function tokenize(q: string) {
    return norm(q).split(/[\s\u3000]+/).filter(Boolean);
  }
  
  /* "¥2,000円" -> 2000 みたいに数字だけ取り出して整数に */
  function toIntOrNull(s: string): number | null {
    const m = s.replace(/,/g, "").match(/\d+/g);
    if (!m) return null;
    const n = parseInt(m.join(""), 10);
    return Number.isFinite(n) ? n : null;
  }
  
  /* 価格文字列 -> [min,max] へ ("¥1000〜2000" / "1500-2500" / "2000") */
  function parsePriceRange(text: string | null | undefined): [number, number] | null {
    const t = norm(text ?? "");
    if (!t) return null;
    const sep = /[~〜\-–—]/; // さまざまな区切りに対応
    if (sep.test(t)) {
      const [a, b] = t.split(sep, 2);
      const n1 = toIntOrNull(a ?? "");
      const n2 = toIntOrNull(b ?? "");
      if (n1 != null && n2 != null) return [Math.min(n1, n2), Math.max(n1, n2)];
      if (n1 != null) return [n1, n1];
      if (n2 != null) return [n2, n2];
      return null;
    }
    const n = toIntOrNull(t);
    return n != null ? [n, n] : null;
  }
  
  /* クエリトークンが数値or範囲かを判定 */
  function parseQueryNumberOrRange(token: string): { value?: number; range?: [number, number] } | null {
    const t = norm(token);
    const sep = /[~〜\-–—]/;
    if (sep.test(t)) {
      const r = parsePriceRange(t);
      return r ? { range: r } : null;
    }
    const n = toIntOrNull(t);
    return n != null ? { value: n } : null;
  }
  
  /* 各フィールドを正規化してまとめる */
  function fieldsOf(item: any) {
    const title = norm(item?.title);
    const place = norm(item?.place);
    const price = norm(item?.price);
    const link  = norm(item?.link);
    const date  = norm(item?.date);
    const memo  = norm(item?.memo);
    const tagsArr = Array.isArray(item?.tags) ? item.tags.map(norm) : [];
    const tags = tagsArr.join(" ");
    const priceRange = parsePriceRange(item?.price);
    return { title, place, price, link, date, memo, tags, tagsArr, priceRange };
  }
  
  /* text 内で token が何回出現するか（部分一致回数） */
  function occ(text: string, token: string) {
    if (!text || !token) return 0;
    let i = 0, c = 0;
    while (true) {
      const p = text.indexOf(token, i);
      if (p === -1) break;
      c++;
      i = p + Math.max(token.length, 1);
    }
    return c;
  }
  
  /* 2つの範囲が重なるか */
  function rangesOverlap(a: [number, number], b: [number, number]) {
    return a[0] <= b[1] && b[0] <= a[1];
  }
  
  /** 総合検索：部分一致＋関連度順（価格は数値/範囲検索対応、誤ヒット防止済み） */
  export function searchAllFields(items: any[], query: string): any[] {
    const tokens = tokenize(query);
    if (tokens.length === 0) return items ?? [];
  
    const scored = (items ?? []).map((item) => {
      const f = fieldsOf(item);
      let score = 0;
      let tokensHit = 0;
      let allTokensHit = true;
  
      for (const t of tokens) {
        let hit = false;
  
        // 1) 価格の数値/範囲クエリを優先評価
        const numInfo = parseQueryNumberOrRange(t);
        if (numInfo && f.priceRange) {
          if (numInfo.value != null) {
            // 単一値が価格帯に含まれる
            if (f.priceRange[0] <= numInfo.value && numInfo.value <= f.priceRange[1]) {
              score += 36; // 価格一致の重み
              hit = true;
            }
          } else if (numInfo.range) {
            // クエリが範囲 → オーバーラップで一致
            if (rangesOverlap(numInfo.range, f.priceRange)) {
              score += 34;
              hit = true;
            }
          }
        }
  
        // 2) 文字ベースの一致（価格は数値クエリ時は評価しない）
        if (f.tagsArr.some((x: string) => x === t)) { score += 90; hit = true; } // タグ完全一致
        if (f.title === t) { score += 80; hit = true; }                           // タイトル完全一致
  
        const tOcc = occ(f.title, t); if (tOcc) { score += tOcc * 40; hit = true; }
        const tgOcc = occ(f.tags, t); if (tgOcc) { score += tgOcc * 28; hit = true; }
        const pOcc  = occ(f.place, t); if (pOcc) { score += pOcc * 24; hit = true; }
        const mOcc  = occ(f.memo, t);  if (mOcc) { score += mOcc * 20; hit = true; }
        const dOcc  = occ(f.date, t);  if (dOcc) { score += dOcc * 14; hit = true; }
  
        // ★数値/範囲クエリのときは price の「文字部分一致」は無効（2000が20000に当たらない）
        if (!numInfo) {
          const prTxt = occ(f.price, t);
          if (prTxt) { score += prTxt * 12; hit = true; }
        }
  
        const lOcc  = occ(f.link, t);  if (lOcc)  { score += lOcc * 10; hit = true; }
  
        if (hit) tokensHit++; else allTokensHit = false;
      }
  
      if (allTokensHit) score += 30;   // 全トークンがどこかにヒット
      score += tokensHit * 2;          // 多くの語を満たすほど微加点
  
      return { item, ok: tokensHit > 0, score };
    });
  
    return scored
      .filter(s => s.ok)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return norm(a.item?.title).localeCompare(norm(b.item?.title)); // 安定ソート
      })
      .map(s => s.item);
  }