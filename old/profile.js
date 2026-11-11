// It's Tea Time 角色個人檔案頁
/* ===================================================================
   ★ 三隻角色的檔案文字都填在這裡 ★
   - 只改引號 ' ' 裡面的字，引號、逗號、中括號 [ ] 都不要刪
   - likes / dislikes 是清單：一個項目一組引號，用逗號隔開，想加幾個都可以
   - catchphrase 口頭禪也可以寫成清單 ['第一句', '第二句']，有幾句就出現幾個對話框
   - 文字裡想換行就打 \n
   - 文字裡不能用單引號 '，要引用請用「」
   =================================================================== */
const PROFILES = {

  /* ===== Dokimi｜ドキミー ===== */
  dokimi: {
    no: 'No.01', name: 'Dokimi', kana: 'ドキミー', tag: '自我懷疑與自卑',
    img: '../img/char-1.png',
    light: '#FBFEBB', main: '#FFDF8C', accent: '#E9FFA3',            // 代表色：淡 / 主 / 點綴
    bg: '#F9F7ED', dot: '#FFDF8C', cover: '#FBFEBB',                   // 整頁背景色 / 波點色 / 檔案本硬殼色
    likes:       ['鏡子', '各種飾品', '化妝品', '讚和留言', '手機', '修圖軟體'],                // ← p1 喜歡
    dislikes:    ['和別人比較', '看到別人比自己出色', '被批評', '照片不好看、外貌被評論'],    // ← p1 不喜歡
    personality: '很容易拿自己和別人比較，明明做得不錯，卻總覺得還不夠好。\n表面裝得沒事，內心其實很容易受傷。很希望得到肯定，但又覺得自己不值得被肯定。',   // ← p2 個性
    catchphrase: ['真的假的！？', '這個也太好看了吧！', '不行，我要再試一次！'],                                               // ← p2 口頭禪
    story1:      '（成長故事：前半段打在這裡）',                                  // ← p3 故事（前半）
    story2:      '（成長故事：後半段打在這裡）'                                   // ← p4 故事（後半）
  },

  /* ===== Gurumi｜グルミー ===== */
  gurumi: {
    no: 'No.02', name: 'Gurumi', kana: 'グルミー', tag: '學業壓力',
    img: '../img/char-2.png',
    light: '#D0EDE6', main: '#E0D2B7', accent: '#D0EDE6',
    bg: '#F9F7ED', dot: '#D0EDE6', cover: '#E0D2B7',                   // 整頁背景色 / 波點色 / 檔案本硬殼色
    likes:       ['筆記本', '文具', '圖書館', '咖啡', '提神飲料'],                          // ← p1 喜歡
    dislikes:    ['遊戲機', '懶骨頭沙發', '溫泉'],                                        // ← p1 不喜歡
    personality: '很有責任感，對自己要求很高，事情沒做完會一直放不下。\n常常責備自己，又鼓勵自己「要更努力才對」，結果反而更焦慮。對未來有期待，也因此容易不安。',   // ← p2 個性
    catchphrase: ['我覺得呢……', '我想想喔……', '好，我再檢查一下!'],                                                // ← p2 口頭禪
    story1:      '（成長故事：前半段打在這裡）',                                  // ← p3 故事（前半）
    story2:      '（成長故事：後半段打在這裡）'                                   // ← p4 故事（後半）
  },

  /* ===== Rabumi｜ラブミー ===== */
  rabumi: {
    no: 'No.03', name: 'Rabumi', kana: 'ラブミー', tag: '人際關係壓力',
    img: '../img/rabumi.png',
    light: '#FAE6F6', main: '#F1C5C8', accent: '#FAE6F6',
    bg: '#F9F7ED', dot: '#F1C5C8', cover: '#FAE6F6',                   // 整頁背景色 / 波點色 / 檔案本硬殼色
    likes:       ['廚師帽', '餅乾和草莓蛋糕', '食譜書', '和朋友一起吃下午茶'],              // ← p1 喜歡
    dislikes:    ['尷尬的氣氛', '已讀不回', '冰塊', '鉚釘金屬鏈頸鍊', '生麵團'],            // ← p1 不喜歡
    personality: '很會察覺別人的情緒，也很在意別人怎麼看自己，常常把一句話想很多。\n不喜歡衝突，總是自己消化。很會安慰別人，卻不太會照顧自己的心情。',   // ← p2 個性
    catchphrase: ['欸……是這樣嗎？', '啊啊啊，怎麼辦啦！', '是不是我誤會了啊？'],                                                // ← p2 口頭禪
    story1:      '（成長故事：前半段打在這裡）',                                  // ← p3 故事（前半）
    story2:      '（成長故事：後半段打在這裡）'                                   // ← p4 故事（後半）
  }
};
/* ===== 文字填到這裡為止，下面是程式 ===== */

/* ---------- 1. 看網址是哪一隻角色，把資料填進檔案本 ---------- */
let key = new URLSearchParams(location.search).get('c');
if (!PROFILES[key]) { try { key = sessionStorage.getItem('teaPick'); } catch (_) {} }
if (!PROFILES[key]) key = 'dokimi';
const P = PROFILES[key];

document.body.style.setProperty('--pc-light', P.light);    // 整頁換成這隻角色的代表色
document.body.style.setProperty('--pc-main', P.main);
document.body.style.setProperty('--pc-accent', P.accent);
document.body.style.setProperty('--pc-bg', P.bg);         // 背景色
document.body.style.setProperty('--pc-dot', P.dot);       // 波點色
document.body.style.setProperty('--pc-cover', P.cover);   // 檔案本硬殼色

document.querySelectorAll('[data-k]').forEach(el => {
  const v = P[el.dataset.k];
  if (el.tagName === 'IMG') el.src = v;
  else if (el.tagName === 'UL') v.forEach(t => { const li = document.createElement('li'); li.textContent = t; el.appendChild(li); });
  else if (el.classList.contains('pf-bubbles')) [].concat(v).forEach(t => {   // 口頭禪：一句一個對話框
    const b = document.createElement('div'); b.className = 'pf-bubble'; b.textContent = t; el.appendChild(b);
  });
  else el.textContent = v;
});

/* ---------- 2. 翻頁（點頁面、點右邊索引標籤、按鍵盤左右鍵） ---------- */
const book = document.getElementById('pfBook');
let spread = 0;   // 0 = 看 p1-p2、1 = 看 p3-p4

function showSpread(n){
  spread = Math.max(0, Math.min(1, n));
  book.classList.toggle('flipped', spread === 1);
  document.querySelectorAll('.pf-tabs button').forEach(b => b.classList.toggle('on', +b.dataset.spread === spread));
}
document.querySelector('.pf-front').addEventListener('click', () => showSpread(1));   // 點右頁（p2）也會往後翻
document.querySelector('.pf-back').addEventListener('click', () => showSpread(0));    // 點翻過去的左頁（p3）也會往回翻
document.querySelectorAll('.pf-tabs button').forEach(b => b.addEventListener('click', () => showSpread(+b.dataset.spread)));
addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') showSpread(spread + 1);
  if (e.key === 'ArrowLeft') showSpread(spread - 1);
});
showSpread(0);

/* ---------- 3. 回客廳：淡出後回到第三頁（不會再重新對話一次，名字也會保留） ---------- */
// 名字同時放在網址（n=名字），有些瀏覽器開本機檔案時頁面之間不共用 sessionStorage
const playerName = new URLSearchParams(location.search).get('n') || '';
document.getElementById('pfBack').addEventListener('click', () =>
  goTo('page3.html?back=1' + (playerName ? '&n=' + encodeURIComponent(playerName) : '')));

/* ---------- 4. 一起聊聊天 ---------- */
// 淡出後換到聊天頁（帶著選了哪隻角色、玩家名字）
document.getElementById('pfChat').addEventListener('click', () => {
  goTo('chat.html?c=' + key + (playerName ? '&n=' + encodeURIComponent(playerName) : ''));
});
