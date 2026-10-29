// It's Tea Time 匿名煩惱牆
/* ===================================================================
   ★ 牆上一開始就有的範例煩惱 ★
   - t：煩惱內容（想換行打 \n）
   - cat：種類 self 自我懷疑與自卑 / study 學業壓力 / people 人際關係壓力 / other 其他
   - hug：抱抱數、ago：幾天前貼的
   =================================================================== */
const SAMPLES = [
  { t: '每次滑 IG 都覺得大家都過得好好的，只有我在原地踏步。', cat: 'self', hug: 42, ago: 1 },
  { t: '期中考快到了，書怎麼念都念不完，晚上躺在床上還在想進度。', cat: 'study', hug: 37, ago: 1 },
  { t: '朋友已讀不回一整天，我一直在想是不是我說錯了什麼…', cat: 'people', hug: 51, ago: 2 },
  { t: '被稱讚的時候會覺得「他只是客氣而已」，好難相信自己真的有做好。', cat: 'self', hug: 28, ago: 2 },
  { t: '不知道自己以後想做什麼，看到同學都有目標就好慌。', cat: 'study', hug: 33, ago: 3 },
  { t: '在群組裡講話都要想很久，怕說錯話氣氛變尷尬。', cat: 'people', hug: 25, ago: 3 },
  { t: '最近什麼都不想做，但又會因為什麼都沒做而自責。', cat: 'other', hug: 46, ago: 4 },
  { t: '照鏡子的時候總是先看到自己不喜歡的地方。', cat: 'self', hug: 30, ago: 5 },
  { t: '報告分組又被丟最多工作，但我不敢說不。', cat: 'people', hug: 22, ago: 5 },
  { t: '明明已經很努力了，成績出來還是不如預期，好怕爸媽失望。', cat: 'study', hug: 39, ago: 6 },
  { t: '晚上總是睡不著，腦袋一直轉個不停。', cat: 'other', hug: 18, ago: 7 },
  { t: '和家人說話常常吵起來，其實我只是想被好好聽完。', cat: 'people', hug: 27, ago: 8 }
];
const CAT_NAME = { self: '自我懷疑與自卑', study: '學業壓力', people: '人際關係壓力', other: '其他' };
const CHARA_CAT = { dokimi: 'self', gurumi: 'study', rabumi: 'people' };   // 從聊天頁過來時，預設選這隻角色的煩惱種類
const MAX_LEN = 120;   // 一張便條最多幾個字（也要改 wall.html 的 maxlength）
/* ===== 範例寫到這裡為止，下面是程式 ===== */

/* ---------- 1. 讀取：範例 + 自己貼過的（存在這台裝置的瀏覽器裡） ---------- */
function load(k, fallback){ try { return JSON.parse(localStorage.getItem(k)) || fallback; } catch (_) { return fallback; } }
function save(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} }
let mine = load('teaWallMine', []);    // 自己貼的：[{ id, t, cat, time }]
let hugged = load('teaWallHugs', {});  // 自己抱抱過的：{ id: true }

const DAY = 86400000;
const samples = SAMPLES.map((s, i) => ({ id: 's' + i, t: s.t, cat: s.cat, hug: s.hug, time: Date.now() - s.ago * DAY }));

function ago(time){
  const m = Math.floor((Date.now() - time) / 60000);
  if (m < 1) return '剛剛';
  if (m < 60) return m + ' 分鐘前';
  if (m < 1440) return Math.floor(m / 60) + ' 小時前';
  return Math.floor(m / 1440) + ' 天前';
}

/* ---------- 2. 把便條貼到牆上 ---------- */
const board = document.getElementById('wlBoard');
const countEl = document.getElementById('wlCount');
let filter = 'all';

function render(newId){
  const all = [...mine.map(n => ({ ...n, hug: 0, mine: true })), ...samples];
  const list = all.filter(n => filter === 'all' || n.cat === filter);
  board.innerHTML = '';
  list.forEach((n, i) => {
    const el = document.createElement('article');
    el.className = 'wl-note' + (n.mine ? ' mine' : '') + (n.id === newId ? ' new' : '');
    el.dataset.cat = n.cat;
    el.style.setProperty('--r', [-2.5, 1.5, -1, 2, -1.8, .8][i % 6] + 'deg');   // 每張歪一點點
    const p = document.createElement('p'); p.textContent = n.t;
    const meta = document.createElement('div'); meta.className = 'wl-meta';
    const tag = document.createElement('span'); tag.className = 'wl-tag'; tag.textContent = CAT_NAME[n.cat];
    const time = document.createElement('span'); time.className = 'wl-time'; time.textContent = ago(n.time);
    const hug = document.createElement('button'); hug.type = 'button'; hug.className = 'wl-hug';
    const setHug = () => {
      const on = !!hugged[n.id];
      hug.classList.toggle('on', on);
      hug.textContent = (on ? '♥ ' : '♡ ') + (n.hug + (on ? 1 : 0));
      hug.setAttribute('aria-label', on ? '取消抱抱' : '給它一個抱抱');
    };
    hug.addEventListener('click', () => {
      if (hugged[n.id]) delete hugged[n.id]; else hugged[n.id] = true;
      save('teaWallHugs', hugged);
      setHug();
      hug.classList.remove('pop'); void hug.offsetWidth; hug.classList.add('pop');
    });
    setHug();
    meta.append(tag, time, hug);
    el.append(p, meta);
    board.appendChild(el);
  });
  countEl.textContent = list.length ? '牆上有 ' + list.length + ' 張便條' : '';
  if (!list.length) board.innerHTML = '<p class="wl-empty">這個分類還沒有便條，當第一個寫下來的人吧 ♡</p>';
}

document.querySelectorAll('#wlFilter button').forEach(b => b.addEventListener('click', () => {
  filter = b.dataset.f;
  document.querySelectorAll('#wlFilter button').forEach(x => x.classList.toggle('on', x === b));
  render();
}));

/* ---------- 3. 寫下煩惱 ---------- */
const dim = document.getElementById('wlDim');
const form = document.getElementById('wlForm');
const text = document.getElementById('wlText');
const len = document.getElementById('wlLen');

function openForm(prefill, cat){
  if (prefill) text.value = prefill.slice(0, MAX_LEN);
  if (cat) form.querySelector('input[value="' + cat + '"]').checked = true;
  syncForm();
  dim.classList.add('show');
  setTimeout(() => text.focus(), 300);
}
function closeForm(){ dim.classList.remove('show'); }
function syncForm(){
  len.textContent = text.value.length + ' / ' + MAX_LEN;
  len.classList.remove('warn');
  form.dataset.cat = form.querySelector('input[name="cat"]:checked').value;   // 便條紙換成這個種類的顏色
}
text.addEventListener('input', syncForm);
form.querySelectorAll('input[name="cat"]').forEach(r => r.addEventListener('change', syncForm));
document.getElementById('wlPostBtn').addEventListener('click', () => openForm());
document.getElementById('wlCancel').addEventListener('click', closeForm);
dim.addEventListener('click', e => { if (e.target === dim) closeForm(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeForm(); });

form.addEventListener('submit', e => {
  e.preventDefault();
  const t = text.value.trim();
  if (!t){
    len.textContent = '寫一點點也可以喔～';
    len.classList.add('warn');
    form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
    text.focus();
    return;
  }
  const note = { id: 'm' + Date.now(), t, cat: form.dataset.cat, time: Date.now() };
  mine.unshift(note);
  save('teaWallMine', mine);
  text.value = '';
  closeForm();
  filter = 'all';
  document.querySelectorAll('#wlFilter button').forEach(x => x.classList.toggle('on', x.dataset.f === 'all'));
  render(note.id);
  document.getElementById('scrollPage').scrollTo({ top: board.offsetTop - 40, behavior: 'smooth' });
});

/* ---------- 4. 開始：從聊天頁按「把煩惱貼到煩惱牆」過來，會自動打開表單、先填好 ---------- */
render();
const params = new URLSearchParams(location.search);
if (params.has('post')) setTimeout(() => openForm(params.get('post'), CHARA_CAT[params.get('c')]), 1400);
