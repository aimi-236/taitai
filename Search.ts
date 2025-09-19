// AllSearch.ts
function norm(v: any) {
    if (v === null || v === undefined) return "";
    let s = String(v).toLowerCase().trim();
    try { if (typeof (s as any).normalize === "function") s = s.normalize("NFKC"); } catch {}
    return s;
  }
  function tokenize(q: string) {
    return norm(q).split(/[\s\u3000]+/).filter(Boolean); // 半角/全角スペース
  }
  
  /** 数字だけ取り出して整数に（"¥2,000円" → 2000） */
  function toIntOrNull(s: string): number | null {
    const m = s.replace(/,/g, "").match(/\d+/g);
    if (!m) return null;
    const n = parseInt(m.join(""), 10);
    return Number.isFinite(n) ? n : null;
  }
  
  /** 価格文字列 → [min,max] へ（"¥1000〜2000" / "1500-2500" / "2000"） */
  function parsePriceRange(text: string | undefined | null): [number, number] | null {
    const t = norm(text ?? "");
    if (!t) return null;
    const sep = /[~〜\-–—]/; // いろいろな区切りに対応
    if (sep.test(t)) {
      const [a, b] = t.split(sep, 2);
      const n1 = toIntOrNull(a ?? "");
      const n2 = toIntOrNull(b ?? "");
      if (n1 != null && n2 != null) return [Math.min(n1, n2), Math.max(n1, n2)];
      if (n1 != null) return [n1, n1]; // 片方欠けても一応扱う
      if (n2 != null) return [n2, n2];
      return null;
    }
    const n = toIntOrNull(t);
    return n != null ? [n, n] : null;
  }
  
  /** クエリトークンが数値 or 範囲かを判定 */
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
  
  function rangesOverlap(a: [number, number], b: [number, number]) {
    return a[0] <= b[1] && b[0] <= a[1];
  }
  
  /** 総合検索：部分一致＋関連度順（価格は数値検索にも対応） */
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
  
        // 価格の数値/範囲クエリを先にチェック
        const numInfo = parseQueryNumberOrRange(t);
        if (numInfo && f.priceRange) {
          if (numInfo.value != null) {
            // 単一値が価格帯に含まれるか
            if (f.priceRange[0] <= numInfo.value && numInfo.value <= f.priceRange[1]) {
              score += 36; // 価格一致は強めに
              hit = true;
            }
          } else if (numInfo.range) {
            // クエリも範囲 → オーバーラップ判定
            if (rangesOverlap(numInfo.range, f.priceRange)) {
              score += 34;
              hit = true;
            }
          }
        }
  
        // タグ完全一致/タイトル・タグ・place/memo/date/link の文字ヒット
        if (f.tagsArr.some((x: string) => x === t)) { score += 90; hit = true; }
        if (f.title === t) { score += 80; hit = true; }
        const tOcc = occ(f.title, t); if (tOcc) { score += tOcc * 40; hit = true; }
        const tgOcc = occ(f.tags, t); if (tgOcc) { score += tgOcc * 28; hit = true; }
        const pOcc  = occ(f.place, t); if (pOcc)  { score += pOcc * 24; hit = true; }
        const mOcc  = occ(f.memo, t);  if (mOcc)  { score += mOcc * 20; hit = true; }
        const dOcc  = occ(f.date, t);  if (dOcc)  { score += dOcc * 14; hit = true; }
  
        // 文字としての price 部分一致（"¥2000" 検索など）は従来どおり
        const prTxt = occ(f.price, t); if (prTxt) { score += prTxt * 12; hit = true; }
  
        const lOcc  = occ(f.link, t);  if (lOcc)  { score += lOcc * 10; hit = true; }
  
        if (hit) tokensHit++; else allTokensHit = false;
      }
  
      if (allTokensHit) score += 30;   // すべてのトークンにどこかがヒット
      score += tokensHit * 2;
  
      return { item, ok: tokensHit > 0, score };
    });
  
    return scored
      .filter(s => s.ok)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return norm(a.item?.title).localeCompare(norm(b.item?.title));
      })
      .map(s => s.item);
  }