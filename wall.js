// It's Tea Time 匿名煩惱牆
/* ===================================================================
   ★ 煩惱牆的設定 ★
   - 牆上的小紙條都是大家聊完、吃完甜點後，按「把小紙條和甜點匿名貼到煩惱牆」貼上來的
   - 不能自己留言，只能給抱抱
   - 資料存在 Cloudflare（和第五輪 AI 同一個 Worker），所以每個人看到的是同一面牆
   =================================================================== */
const WALL_URL = 'https://tea-time.spcp94523.workers.dev/wall';   // 和 chat.js 的 AI_URL 同一個網址，後面加 /wall
const CHARA_INFO = {
  dokimi: { name: 'Dokimi', cat: 'self',   tag: '自我懷疑與自卑' },
  gurumi: { name: 'Gurumi', cat: 'study',  tag: '學業壓力' },
  rabumi: { name: 'Rabumi', cat: 'people', tag: '人際關係壓力' }
};
/* ===== 設定到這裡為止，下面是程式 ===== */

/* ---------- 1. 這台裝置抱抱過哪些（避免同一個人一直按） ---------- */
function load(k, fallback){ try { return JSON.parse(localStorage.getItem(k)) || fallback; } catch (_) { return fallback; } }
function save(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} }
// 舊版煩惱牆（自己寫的便條、舊的抱抱）全部清掉
try { localStorage.removeItem('teaWallMine'); localStorage.removeItem('teaWallHugs'); } catch (_) {}
let hugged = load('teaWallHugged', {});   // { 紙條id: true }
let mine = load('teaWallPosted', []);     // 自己貼過的紙條 id（右上角顯示「you ♡」）

function ago(time){
  const m = Math.floor((Date.now() - time) / 60000);
  if (m < 1) return '剛剛';
  if (m < 60) return m + ' 分鐘前';
  if (m < 1440) return Math.floor(m / 60) + ' 小時前';
  return Math.floor(m / 1440) + ' 天前';
}

/* ---------- 2. 把小紙條貼到牆上 ---------- */
const board = document.getElementById('wlBoard');
const countEl = document.getElementById('wlCount');
const params = new URLSearchParams(location.search);
const newId = params.get('new');   // 剛從聊天頁貼上來的那張
if (newId && !mine.includes(newId)) { mine.push(newId); save('teaWallPosted', mine); }
let notes = [];
let filter = 'all';

function el(tag, cls, text){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
function render(){
  const list = notes.filter(n => CHARA_INFO[n.chara] && (filter === 'all' || n.chara === filter));
  board.innerHTML = '';
  list.forEach((n, i) => {
    const info = CHARA_INFO[n.chara];
    const card = el('article', 'wl-note' + (mine.includes(n.id) ? ' mine' : '') + (n.id === newId ? ' new' : ''));
    card.dataset.cat = info.cat;
    card.style.setProperty('--r', [-2.5, 1.5, -1, 2, -1.8, .8][i % 6] + 'deg');   // 每張歪一點點

    // 聊了什麼
    const dl = el('dl', 'wl-memo');
    [['最近發生的事', n.type], ['在意的是', n.core], ['感受', n.feel], ['想說的話', n.need]].forEach(([k, v]) => {
      if (!v) return;
      dl.append(el('dt', '', k), el('dd', k === '想說的話' ? 'wl-need' : '', v));
    });
    // 角色說了什麼
    const say = el('div', 'wl-say');
    say.append(el('b', '', info.name + ' 想對你說'), el('p', '', n.comfort));
    if (n.dessert) card.append(el('p', 'wl-dessert', '🍰 今天的甜點：' + n.dessert));
    card.append(dl, say);
    if (n.advice){
      const tip = el('div', 'wl-say wl-tip');
      tip.append(el('b', '', '✎ 小建議'), el('p', '', n.advice));
      card.append(tip);
    }

    // 下面：種類、時間、抱抱
    const meta = el('div', 'wl-meta');
    const hug = el('button', 'wl-hug'); hug.type = 'button';
    const setHug = () => {
      const on = !!hugged[n.id];
      hug.classList.toggle('on', on);
      hug.textContent = (on ? '♥ ' : '♡ ') + (n.hug || 0);
      hug.setAttribute('aria-label', on ? '取消抱抱' : '給它一個抱抱');
    };
    hug.addEventListener('click', () => {
      const on = !hugged[n.id];
      if (on) hugged[n.id] = true; else delete hugged[n.id];
      n.hug = Math.max(0, (n.hug || 0) + (on ? 1 : -1));   // 先在畫面上 +1，再告訴伺服器
      save('teaWallHugged', hugged);
      setHug();
      hug.classList.remove('pop'); void hug.offsetWidth; hug.classList.add('pop');
      fetch(WALL_URL + '/hug', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: n.id, on }) })
        .then(r => r.json()).then(d => { if (typeof d.hug === 'number'){ n.hug = d.hug; setHug(); } }).catch(() => {});
    });
    setHug();
    meta.append(el('span', 'wl-tag', info.tag), el('span', 'wl-time', ago(n.time)), hug);
    card.append(meta);
    board.appendChild(card);
  });
  countEl.textContent = list.length ? '牆上有 ' + list.length + ' 張小紙條' : '';
  if (!list.length) board.innerHTML = '<p class="wl-empty">這裡還沒有小紙條。<br>參加完茶會之後，就可以把你的小紙條貼上來喔 ♡</p>';
}

document.querySelectorAll('#wlFilter button').forEach(b => b.addEventListener('click', () => {
  filter = b.dataset.f;
  document.querySelectorAll('#wlFilter button').forEach(x => x.classList.toggle('on', x === b));
  render();
}));

/* ---------- 3. 去參加茶會（右下角按鈕） ---------- */
document.getElementById('wlPostBtn').addEventListener('click', () => goTo('index.html'));

/* ---------- 4. 開始：從 Cloudflare 拿牆上的小紙條 ---------- */
board.innerHTML = '<p class="wl-empty">正在把小紙條貼上牆…</p>';
fetch(WALL_URL)
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(d => {
    notes = d.notes || [];
    render();
    // 剛貼上來的那張：捲到它的位置
    const fresh = board.querySelector('.wl-note.new');
    if (fresh) setTimeout(() => document.getElementById('scrollPage').scrollTo({ top: fresh.offsetTop - 120, behavior: 'smooth' }), 900);
  })
  .catch(() => { board.innerHTML = '<p class="wl-empty">煩惱牆暫時連不上，等一下再回來看看吧。</p>'; });
