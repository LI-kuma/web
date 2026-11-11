// It's Tea Time 專屬甜點頁
/* ===================================================================
   ★ 甜點怎麼決定 ★
   甜點名字 = 口味（看你和哪個孩子聊）+ 樣子（看你第三輪選的心情）
   例如：和 Rabumi 聊、選「難過」→「草莓雲朵布丁」
   介紹 = 樣子的那句 + 口味的那句

   ★ 想換成自己畫的甜點圖 ★
   把圖放進 img/desserts/，檔名 = 樣子-口味.png，例如 pudding-strawberry.png、tart-lemon.png
   有圖就用圖，沒有圖就用程式畫的簡單甜點（建議：透明背景、甜點底部貼齊圖片下緣）
   =================================================================== */

// 口味：看聊天的是哪一個孩子（c1 甜點本體、c2 深一點的顏色、cream 奶油色）
const FLAVORS = {
  rabumi: { id: 'strawberry', name: '草莓', c1: '#FBD3DC', c2: '#F29CB0', cream: '#FFFBF5',
            items: [['🍓', '草莓'], ['🥛', '鮮奶油']],
            desc: '酸酸甜甜的草莓，就像你在意著別人的同時，也希望有人能懂你的心情。' },
  dokimi: { id: 'lemon', name: '檸檬', c1: '#FFF1B8', c2: '#F7D35E', cream: '#FFFDF3',
            items: [['🍋', '檸檬'], ['🍯', '蜂蜜']],
            desc: '清爽的檸檬帶一點點酸，提醒你不用跟誰比，你本來的味道就很好。' },
  gurumi: { id: 'matcha', name: '抹茶', c1: '#D6EBC8', c2: '#8DBE7A', cream: '#FFFDF3',
            items: [['🍵', '抹茶'], ['🫘', '紅豆']],
            desc: '微苦的抹茶配上甜甜的紅豆，努力很辛苦，但也別忘了給自己一點甜。' }
};
// 樣子：看第三輪選的心情（自己打字的心情 → free）
const SHAPES = {
  '難過':      { id: 'pudding', name: '雲朵布丁', items: [['🥚', '雞蛋'], ['🍬', '砂糖']],
                 desc: '軟軟的布丁會輕輕接住你，難過的時候，不用急著好起來。' },
  '焦慮、不安': { id: 'souffle', name: '舒芙蕾', items: [['🥚', '蛋白'], ['🍬', '砂糖']],
                 desc: '舒芙蕾要慢慢等它膨起來，就像不安的心，也需要一點時間慢慢安定。' },
  '委屈':      { id: 'tart', name: '奶油塔', items: [['🧈', '奶油'], ['🌾', '麵粉']],
                 desc: '酥酥的塔皮包著軟軟的奶油，在外面撐著的你，心裡也值得被溫柔對待。' },
  '生氣':      { id: 'jelly', name: '氣泡果凍', items: [['🫧', '氣泡水'], ['🍬', '砂糖']],
                 desc: '氣泡咕嚕咕嚕往上冒，生氣也是一種在乎，讓它慢慢冒出來就好。' },
  '好累、無力': { id: 'pancake', name: '鬆餅塔', items: [['🌾', '麵粉'], ['🥚', '雞蛋']],
                 desc: '一層一層疊起來的鬆餅，提醒你今天已經做了好多，可以先休息一下。' },
  '孤單':      { id: 'roll', name: '蛋糕捲', items: [['🥚', '雞蛋'], ['🥛', '牛奶']],
                 desc: '一圈一圈捲起來的蛋糕，就像有人輕輕抱著你，你不是一個人。' },
  free:        { id: 'cake', name: '小蛋糕', items: [['🌾', '麵粉'], ['🧈', '奶油']],
                 desc: '這是只屬於你的一份蛋糕，你說的話，我都好好收下了。' }
};
// Rabumi 在這頁說的話（{NAME} 玩家名字、{FRIEND} 剛剛聊天的孩子、{DESSERT} 甜點名字）
const LINES = {
  helloSelf:   '{NAME}，歡迎來到我的甜點店♡\n剛剛跟你聊了好多，我一直在想要做什麼給你吃。',
  helloFriend: '歡迎光臨～啊，是 {NAME}！我是 Rabumi，在這裡開甜點店。\n{FRIEND} 說你們剛剛聊了好久呢。',
  start:  '讓我用你今天的心情，幫你做一份專屬甜點吧！',
  items:  '先準備……{ITEMS}！',
  mix:    '攪一攪、拌一拌……\n加一點點耐心，再加一點點溫柔……',
  done:   '完成了！這是只屬於你的「{DESSERT}」♡',
  eat:    '快嚐嚐看吧！\n點甜點或下面的湯匙，一口一口慢慢吃～',
  bites: [   // 每吃一口說一句（最後一句 = 吃光光）
    '希望這份甜點，能陪你度過今天。',
    '也希望你記得，要好好照顧自己的心情喔！',
    '最後一口了～慢慢吃，不用急。',
    '吃光光了！\n謝謝你今天願意停下來，陪自己一下♡'
  ]
};
const FRIEND_NAMES = { dokimi: 'Dokimi', gurumi: 'Gurumi', rabumi: 'Rabumi' };
const TYPE_SPEED = 38;   // 打字速度：每個字幾毫秒
const WALL_URL = 'https://tea-time.spcp94523.workers.dev/wall';
/* ===== 設定到這裡為止，下面是程式 ===== */

/* ---------- 1. 拿聊天頁留下來的結果 ---------- */
let R = null;
try { R = JSON.parse(sessionStorage.getItem('teaResult')); } catch (_) {}
if (!R || !FLAVORS[R.chara]) R = { chara: 'rabumi', name: '' };   // 直接打開這頁時
R.memo = R.memo || {}; R.reply = R.reply || {};
const playerName = R.name || '你';
const nameQ = R.name ? '&n=' + encodeURIComponent(R.name) : '';
const F = FLAVORS[R.chara];
const SH = SHAPES[R.memo.feel] || SHAPES.free;
const dessertName = F.name + SH.name;
const fill = s => s.replaceAll('{NAME}', playerName).replaceAll('{FRIEND}', FRIEND_NAMES[R.chara])
                   .replaceAll('{DESSERT}', dessertName)
                   .replaceAll('{ITEMS}', [...F.items, ...SH.items].map(i => i[1]).join('、'));

/* ---------- 2. 畫甜點（SVG；有自己畫的圖就用圖） ---------- */
function fruit(x, y, s){
  const g = inner => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
  if (F.id === 'strawberry') return g(`<path d="M0 14C-12 4-12-8 0-8S12 4 0 14Z" fill="#E8586E"/><path d="M-7-8 0-15 7-8 0-5Z" fill="#7FB069"/>
    <circle cx="-3" r="1.2" fill="#FFE9A8"/><circle cx="3" cy="4" r="1.2" fill="#FFE9A8"/><circle cx="1" cy="-3" r="1.2" fill="#FFE9A8"/>`);
  if (F.id === 'lemon') return g(`<circle r="11" fill="#FFE066" stroke="#F2C230" stroke-width="2.5"/>
    <path d="M0-9V9M-9 0H9M-6-6 6 6M6-6-6 6" stroke="#FFF8D6" stroke-width="1.5"/>`);
  return g(`<ellipse cx="-6" cy="2" rx="5" ry="4" fill="#8E4A4A"/><ellipse cx="5" cy="3" rx="5" ry="4" fill="#9C5555"/><ellipse cy="-4" rx="5" ry="4" fill="#874343"/>
    <path d="M6-6Q14-14 18-6Q12-2 6-6Z" fill="#7FB069"/>`);
}
const cream = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${F.cream}"/><circle cx="${x - r * .3}" cy="${y - r * .35}" r="${r * .3}" fill="#fff"/>`;
const DRAW = {
  pudding: () => `<path d="M72 166 84 96Q120 86 156 96L168 166Q120 176 72 166Z" fill="${F.c1}"/>
    <path d="M84 96Q120 86 156 96L153 114Q120 106 87 114Z" fill="${F.c2}"/>
    <path d="M93 124 89 156" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"/>
    ${cream(107, 90, 13)}${cream(133, 88, 13)}${cream(120, 78, 12)}${fruit(120, 64, 1.25)}`,
  souffle: () => `<path d="M68 118Q68 58 120 56Q172 58 172 118Z" fill="${F.c1}"/><path d="M84 80Q120 54 156 80Q120 70 84 80Z" fill="${F.c2}"/>
    <rect x="72" y="112" width="96" height="54" rx="8" fill="#fff" stroke="#EAD9D6" stroke-width="2"/>
    <path d="M86 116V162M100 116V162M114 116V162M128 116V162M142 116V162M156 116V162" stroke="#F3E6E3" stroke-width="3"/>
    <circle cx="100" cy="76" r="2" fill="#fff"/><circle cx="130" cy="68" r="2" fill="#fff"/><circle cx="116" cy="86" r="2" fill="#fff"/>
    ${fruit(150, 66, .95)}`,
  tart: () => `<path d="M54 138 66 166Q120 176 174 166L186 138Z" fill="#E9C089"/>
    <path d="M54 138q6-8 12 0t12 0 12 0 12 0 12 0 12 0 12 0 12 0 12 0 12 0 12 0 12 0" fill="none" stroke="#D9A867" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="120" cy="136" rx="60" ry="12" fill="${F.c1}"/>
    ${cream(92, 128, 9)}${cream(148, 128, 9)}${fruit(100, 118, .9)}${fruit(122, 112, 1)}${fruit(142, 120, .9)}`,
  jelly: () => `<path d="M68 166Q62 84 120 78Q178 84 172 166Q120 176 68 166Z" fill="${F.c2}" opacity=".8"/>
    <path d="M80 160Q78 96 120 92Q162 96 160 160Z" fill="${F.c1}" opacity=".65"/>
    <circle cx="100" cy="140" r="5" fill="none" stroke="#fff" stroke-width="2"/><circle cx="132" cy="124" r="4" fill="none" stroke="#fff" stroke-width="2"/>
    <circle cx="118" cy="150" r="3" fill="none" stroke="#fff" stroke-width="2"/><circle cx="144" cy="146" r="6" fill="none" stroke="#fff" stroke-width="2"/>
    <path d="M86 108Q90 96 100 92" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/>
    ${cream(120, 78, 11)}${fruit(120, 64, 1.1)}`,
  pancake: () => [148, 128, 108].map(y => `<rect x="62" y="${y}" width="116" height="22" rx="11" fill="#EBBE80"/><rect x="66" y="${y}" width="108" height="8" rx="4" fill="#F7DCAC"/>`).join('') +
    `<path d="M66 110Q120 98 174 110V118Q166 132 158 118Q144 128 132 118Q114 134 104 118Q88 128 78 118Q70 126 66 118Z" fill="${F.c2}"/>
    <rect x="106" y="94" width="26" height="15" rx="3" fill="#FFF3B0" stroke="#F2DC86" stroke-width="2"/>${fruit(152, 98, .95)}`,
  roll: () => [[150, 132, 30], [102, 128, 36]].map(([x, y, r]) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${F.c1}" stroke="${F.c2}" stroke-width="4"/>
     <circle cx="${x}" cy="${y}" r="${r * .62}" fill="none" stroke="${F.cream}" stroke-width="6"/>
     <circle cx="${x}" cy="${y}" r="${r * .25}" fill="${F.cream}"/>`).join('') + `${cream(102, 92, 10)}${fruit(102, 80, 1)}`,
  cake: () => `<rect x="78" y="104" width="84" height="62" rx="6" fill="${F.c1}"/><rect x="78" y="132" width="84" height="8" fill="${F.cream}"/>
    <path d="M76 108q7 10 14 0t14 0 14 0 14 0 14 0 14 0V98H76Z" fill="${F.cream}"/>
    <path d="M78 150H162" stroke="${F.c2}" stroke-width="4"/>${cream(104, 96, 9)}${cream(136, 96, 9)}${fruit(120, 88, 1.25)}`
};
const imgUrl = `../img/desserts/${SH.id}-${F.id}.png`;
let hasImg = false;
function dessertSvg(id){
  const body = hasImg ? `<image href="${imgUrl}" x="44" y="24" width="152" height="146" preserveAspectRatio="xMidYMax meet"/>` : DRAW[SH.id]();
  return `<svg viewBox="0 0 240 200" aria-hidden="true">
    <ellipse cx="120" cy="172" rx="104" ry="22" fill="#fff" stroke="#F1C5C8" stroke-width="3"/>
    <ellipse cx="120" cy="170" rx="80" ry="14" fill="#FBF3EE"/>
    <g class="ds-crumbs"></g>
    ${id ? `<mask id="${id}"><rect width="240" height="200" fill="#fff"/></mask>` : ''}
    <g ${id ? `mask="url(#${id})"` : ''}>${body}</g>
  </svg>`;
}

/* ---------- 3. 說話（和聊天頁一樣：一個字一個字打出來） ---------- */
const box = document.getElementById('chatBox');
const textEl = document.getElementById('chatText');
const nextBtn = document.getElementById('chatNext');
const chara = document.getElementById('chatChara');
let typing = null, finishTyping = null, waitNext = null;
function type(text){
  return new Promise(done => {
    const full = fill(text);
    box.classList.remove('next'); void box.offsetWidth; box.classList.add('next');
    chara.classList.remove('talk'); void chara.offsetWidth; chara.classList.add('talk');
    nextBtn.hidden = true;
    let i = 0;
    textEl.textContent = '';
    finishTyping = () => { clearInterval(typing); typing = null; finishTyping = null; textEl.textContent = full; done(); };
    typing = setInterval(() => { textEl.textContent = full.slice(0, ++i); if (i >= full.length) finishTyping(); }, TYPE_SPEED);
  });
}
async function say(text){
  await type(text);
  nextBtn.hidden = false;
  return new Promise(done => { waitNext = done; });
}
function advance(){
  if (finishTyping) return finishTyping();
  if (waitNext){ const w = waitNext; waitNext = null; nextBtn.hidden = true; w(); }
}
box.addEventListener('click', advance);
addEventListener('keydown', e => {
  if ((e.key === ' ' || e.key === 'Enter') && !e.target.closest('button, a') && !endDim.classList.contains('show')){ e.preventDefault(); advance(); }
});
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ---------- 4. 做甜點：食材 → 攪拌 → 完成 ---------- */
const stage = document.getElementById('dsStage');
const itemsEl = document.getElementById('dsItems');
const dessertEl = document.getElementById('dsDessert');
const eatBtn = document.getElementById('dsEat');
const spoon = document.getElementById('dsSpoon');

async function make(){
  await say(R.chara === 'rabumi' ? LINES.helloSelf : LINES.helloFriend);
  await say(LINES.start);

  // 食材一個一個跳到桌上
  [...F.items, ...SH.items].forEach(([emoji, label], i) => {
    const it = document.createElement('span');
    it.className = 'ds-item'; it.style.setProperty('--i', i);
    it.innerHTML = `<i>${emoji}</i><small>${label}</small>`;
    itemsEl.appendChild(it);
  });
  stage.classList.add('items');
  await say(LINES.items);

  // 食材飛進碗裡，攪一攪
  stage.classList.add('mixing');
  await type(LINES.mix);
  await wait(1800);

  // 甜點完成
  dessertEl.innerHTML = dessertSvg('dsBite');
  document.getElementById('dsName').textContent = dessertName;
  stage.classList.add('done');
  await wait(700);
  await say(LINES.done);
  await say(SH.desc);
  await say(F.desc);

  // 開始吃
  await type(LINES.eat);
  stage.classList.add('eating');
  dessertEl.disabled = false;
  eatBtn.hidden = false;
}

/* ---------- 5. 吃甜點：每吃一口，甜點就少一塊 ---------- */
// 每一口咬掉的地方：[x, y, 半徑]（座標是 240×200 的甜點畫布）
const BITES = [
  [[120, 64, 30], [146, 84, 22], [98, 84, 20]],                  // 第一口：上面的水果和奶油
  [[172, 110, 34], [176, 150, 32], [150, 96, 26]],               // 第二口：右邊
  [[68, 110, 34], [70, 150, 30], [100, 92, 28], [124, 80, 30]],  // 第三口：左邊
  [[120, 120, 90]]                                               // 最後一口：全部吃光
];
let bites = 0, chewing = false;
async function bite(){
  if (chewing || bites >= BITES.length) return;
  chewing = true;
  spoon.classList.remove('scoop'); void spoon.offsetWidth; spoon.classList.add('scoop');
  await wait(420);   // 湯匙碰到甜點的時候才咬掉
  const mask = document.getElementById('dsBite');
  BITES[bites].forEach(([x, y, r]) => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', r); c.setAttribute('fill', '#000');
    mask.appendChild(c);
  });
  // 盤子上掉一點點碎屑
  const crumbs = dessertEl.querySelector('.ds-crumbs');
  for (let i = 0; i < 3; i++) crumbs.insertAdjacentHTML('beforeend',
    `<circle cx="${70 + Math.random() * 100}" cy="${164 + Math.random() * 12}" r="${1.5 + Math.random() * 2}" fill="${F.c2}"/>`);
  dessertEl.classList.remove('chomp'); void dessertEl.offsetWidth; dessertEl.classList.add('chomp');
  type(LINES.bites[bites]);
  bites++;
  if (bites >= BITES.length){
    dessertEl.disabled = true; eatBtn.hidden = true;
    stage.classList.add('empty');
    await wait(2600);
    openEnd();
  }
  await wait(500);
  chewing = false;
}
dessertEl.addEventListener('click', bite);
eatBtn.addEventListener('click', bite);

/* ---------- 6. 吃完：結尾卡片 ---------- */
const endDim = document.getElementById('endDim');
const endWallBtn = document.getElementById('endWall');
function openEnd(){
  document.getElementById('endPlate').innerHTML = dessertSvg('');
  document.getElementById('endName').textContent = '「' + dessertName + '」';
  document.getElementById('endDesc').textContent = SH.desc + F.desc;
  // 很難受的時候先不貼牆；直接打開這頁（沒聊天）也沒有東西可以貼
  const canPost = !R.crisis && !!R.memo.type && !!R.reply.comfort;
  endWallBtn.hidden = !canPost;
  document.getElementById('endWallNote').hidden = !canPost;
  endDim.classList.add('show');
}
// 貼到煩惱牆：小紙條（名字會拿掉）+ 甜點名字
const noName = s => !R.name ? (s || '') : (s || '').replaceAll(new RegExp(R.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[，,、！!～~ ]*', 'g'), '');
endWallBtn.addEventListener('click', async () => {
  if (endWallBtn.disabled) return;
  endWallBtn.disabled = true; endWallBtn.textContent = '貼上去中…';
  try {
    const m = R.memo;
    const res = await fetch(WALL_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chara: R.chara, type: m.type, core: m.core, feel: m.feel, need: noName(m.need),
                             comfort: noName(R.reply.comfort), advice: noName(R.reply.advice), dessert: dessertName })
    });
    const data = await res.json();
    if (!res.ok) throw 0;
    goTo('../wall.html?new=' + data.note.id + nameQ);
  } catch (_) {
    endWallBtn.disabled = false; endWallBtn.textContent = '貼不上去，等一下再試試';
  }
});
document.getElementById('endHome').addEventListener('click', () => goTo('page3.html?back=1' + nameQ));

/* ---------- 7. 開始：先看看有沒有自己畫的甜點圖，再讓 Rabumi 開口 ---------- */
const probe = new Image();
probe.onload = () => { hasImg = true; };
probe.src = imgUrl;
setTimeout(() => { box.classList.add('in'); make(); }, 1600);
