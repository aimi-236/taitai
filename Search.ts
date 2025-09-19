// AllSearch.ts
function norm(v: any) {
    if (v === null || v === undefined) return "";
    let s = String(v).toLowerCase().trim();
    try { if (typeof (s as any).normalize === "function") s = s.normalize("NFKC"); } catch {}
    return s;
  }
  function tokenize(q: string) {
    // 半角/全角スペースで区切り（複数語OK）
    return norm(q).split(/[\s\u3000]+/).filter(Boolean);
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
    return { title, place, price, link, date, memo, tags, tagsArr };
  }
  function occ(text: string, token: string) {
    if (!text || !token) return 0;
    let i = 0, c = 0;
    while (true) { const p = text.indexOf(token, i); if (p === -1) break; c++; i = p + Math.max(token.length, 1); }
    return c;
  }
  
  /** 総合検索：部分一致ヒットを関連度順で並べる */
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
  
        // 強い順に加点
        if (f.tagsArr.some((x: string) => x === t)) { score += 90; hit = true; }        if (f.title === t)                 { score += 80; hit = true; }   // タイトル完全一致
        const tOcc = occ(f.title, t); if (tOcc) { score += tOcc * 40; hit = true; }
        const tgOcc = occ(f.tags, t);  if (tgOcc){ score += tgOcc * 28; hit = true; }
        const pOcc = occ(f.place, t);  if (pOcc) { score += pOcc * 24; hit = true; }
        const mOcc = occ(f.memo, t);   if (mOcc) { score += mOcc * 20; hit = true; }
        const dOcc = occ(f.date, t);   if (dOcc) { score += dOcc * 14; hit = true; }
        const prOcc= occ(f.price, t);  if (prOcc){ score += prOcc * 12; hit = true; }
        const lOcc = occ(f.link, t);   if (lOcc) { score += lOcc * 10; hit = true; }
  
        if (hit) tokensHit++; else allTokensHit = false;
      }
  
      if (allTokensHit) score += 30;   // 全トークンどこかにヒットでボーナス
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