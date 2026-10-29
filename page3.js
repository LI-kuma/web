// It's Tea Time 第三頁互動
/* ===== 可以自己調的設定 ===== */
const DIALOG_DELAY = 2000;   // 白幕淡出後停幾毫秒才跳出對話框
// 對話內容：{NAME} 會換成輸入的名字；換行直接用 \n；
// face = 莓露露的表情（名字對應下面的 FACES），和上一句不一樣時會翻牌
const LINES = {
  ask:     { text: '哈囉! 我是這裡的主人叫莓露露♡可以告訴我你叫什麼名字嗎~~', btn: '好呀~我告訴你', face: 'normal' },
  welcome: { text: '{NAME}這名字真適合你!\n你是有煩惱才來這裡的對吧?',      btn: '嗯!被你發現了...', face: 'wink' },
  guide:   { text: '嘻嘻...沙發上每隻角色皆為一種煩惱!可點選每隻角色查看煩惱~~', btn: '嗯嗯!了解',   face: 'smile' },
  choose:  { text: '最近最大的煩惱是什麼就選擇那個，之後該角色會和你聊聊你的煩惱喲(^_<)〜♫♡', btn: '我了解了!!★', face: 'smile' }
};
// 莓露露的表情圖：想加新表情就在這裡加一行（圖要和 maid.png 一樣 700×969、人物對齊）
const FACES = {
  normal: 'img/maid.png',        // 一般
  smile:  'img/maid-smile.png',  // 笑臉
  wink:   'img/maid-wink.png'    // 眨眼
};
// 對話順序：按下按鈕後接哪一句（最後一句 choose 按完會收起對話框）
// ask → 輸入名字 → welcome → guide → choose → 收起

const dialog = document.getElementById('dialog');
const dialogText = document.getElementById('dialogText');
const dialogBtn = document.getElementById('dialogBtn');
const nameDim = document.getElementById('nameDim');
const nameForm = document.getElementById('nameForm');
const nameInput = document.getElementById('nameInput');
let step = 'ask';
let userName = '';

// 圖還沒放進來的時候先藏起來，不會出現破圖
document.querySelectorAll('.chara img, .maid img').forEach(img => img.addEventListener('error', () => img.style.visibility = 'hidden'));

function say(key){
  step = key;
  dialog.dataset.step = key;   // 讓 style.css 可以針對每一句台詞的按鈕分開調（.dialog[data-step="ask"] / [data-step="welcome"]）
  dialogText.textContent = LINES[key].text.replace('{NAME}', userName);
  dialogBtn.textContent = LINES[key].btn;
  // 換下一句的小動畫：對話框輕輕彈一下、字從下面浮上來（樣式在 style.css 的 .dialog.next）
  dialog.classList.remove('next'); void dialog.offsetWidth; dialog.classList.add('next');
  setTimeout(() => setMaidFace(LINES[key].face), 400);   // 換台詞 .4 秒後再換表情，比較自然
}

// 莓露露翻牌：卡片有正反兩面，翻之前先把「背對我們那一面」換成新表情，再翻過去
const maid = document.getElementById('maid');
const maidA = maid.querySelector('.maid-a');
const maidB = maid.querySelector('.maid-b');
let maidFace = 'normal';
Object.values(FACES).forEach(src => { new Image().src = src; });   // 先把表情圖載好，翻牌時才不會空白
function setMaidFace(face){
  if (!FACES[face] || face === maidFace) return;
  maidFace = face;
  const hidden = maid.classList.contains('flipped') ? maidA : maidB;   // 現在背對我們的那一面
  hidden.src = FACES[face];
  maid.classList.toggle('flipped');
  maid.classList.remove('hop'); void maid.offsetWidth; maid.classList.add('hop');
}

/* ---------- 1. 進場：白幕淡出後跳出對話框 ---------- */
// 已經輸入過名字、從角色檔案頁回來（按「回客廳」或瀏覽器的上一頁）：
// 不用再對話、不用再輸入名字，直接跳到可以點角色的狀態（在檔案最下面處理）
const params = new URLSearchParams(location.search);
let savedName = '', picked = '';
try { savedName = sessionStorage.getItem('teaName') || ''; picked = sessionStorage.getItem('teaPick') || ''; } catch (_) {}
if (!savedName) savedName = params.get('n') || '';   // sessionStorage 拿不到時，改用網址上的名字
const RETURNING = savedName !== '' && (params.has('back') || picked !== '');
say('ask');
dialog.classList.add('hide');
if (!RETURNING) setTimeout(() => dialog.classList.remove('hide'), DIALOG_DELAY);

// 和莓露露對話完：收起對話框、出現小幫手、角色醒過來、跑馬燈從下面滑上來
function finishIntro(){
  dialog.classList.add('hide');
  helper.classList.add('show');
  document.querySelectorAll('.chara').forEach(btn => btn.disabled = false);   // 三隻角色才可以點、滑鼠移上去才會放大發光
  document.getElementById('marquee').classList.add('show');
}

/* ---------- 2. 按對話框按鈕 ---------- */
dialogBtn.addEventListener('click', () => {
  if (step === 'ask'){
    nameDim.classList.add('show');
    setTimeout(() => nameInput.focus(), 300);
  } else if (step === 'welcome'){
    say('guide');                   // 「嗯!被你發現了...」→ 下一句
  } else if (step === 'guide'){
    say('choose');                  // 「嗯嗯!了解」→ 下一句
  } else if (step === 'choose'){
    finishIntro();                  // 「我了解了!!★」→ 對話結束
  }
});

/* ---------- 3. 輸入名字 ---------- */
const nameHint = document.getElementById('nameHint');
nameInput.addEventListener('input', () => nameHint.classList.remove('warn'));   // 重新打字時提醒變回灰色
nameForm.addEventListener('submit', e => {
  e.preventDefault();
  const v = nameInput.value.trim();
  // 規則：1～5 個字，只能是文字（中文、英文、日文…）或數字，不能有 */-+~@#$%^ 這類符號和空白
  if (!/^[\p{L}\p{N}]{1,5}$/u.test(v)){
    nameHint.classList.add('warn');
    nameInput.classList.remove('shake'); void nameInput.offsetWidth; nameInput.classList.add('shake');
    nameInput.focus();
    return;
  }
  userName = v;
  try { sessionStorage.setItem('teaName', v); } catch (_) {}   // 之後的頁面也可以叫出名字
  document.getElementById('helperName').textContent = v;       // 小幫手的「需要幫忙嗎?○○○」也換成這個名字
  nameDim.classList.remove('show');
  say('welcome');
});

/* ---------- 5. 小幫手：右下角莓露露 ---------- */
const helper = document.getElementById('helper');
const helperHead = document.getElementById('helperHead');
const helperShade = document.getElementById('helperShade');

function setHelper(open){
  helper.classList.toggle('open', open);
  helperShade.classList.toggle('show', open);
  helperHead.setAttribute('aria-expanded', open);
}
helperHead.addEventListener('click', () => setHelper(!helper.classList.contains('open')));   // 點頭像：打開 / 收起
helperShade.addEventListener('click', () => setHelper(false));                               // 點旁邊暗暗的地方：收起
document.addEventListener('keydown', e => { if (e.key === 'Escape') setHelper(false); });     // 按 Esc：收起

// 兩個選項按下去要做的事（之後寫在這裡）
document.querySelectorAll('.helper-opt').forEach(btn => btn.addEventListener('click', () => {
  setHelper(false);
  if (btn.dataset.help === 'todo'){
    // 「現在我該做甚麼」：小幫手先收起來，莓露露再說一次「嘻嘻...」那句
    helper.classList.remove('show');
    say('guide');
    dialog.classList.remove('hide');
  } else if (btn.dataset.help === 'world'){
    // 「想了解世界觀」：淡出後換到世界觀介紹頁
    goTo('world.html');
  }
}));

/* ---------- 4. 點角色：跳出角色檔案卡 ---------- */
// 每隻角色的資料：數字對應 page3.html 角色按鈕的 data-chara；
// light / main / accent = 卡片用的角色代表色（淡 / 主 / 點綴）；glow = 蕾絲愛心後面的光（和沙發上的光暈同色）
// size = 卡片裡角色的大小倍數（Rabumi 耳朵比較寬，要放大一點身體才會和另外兩隻一樣大）
// gif = 卡片裡播的動畫；crop = 把 3000×3000 的 GIF 裁到只剩角色用的數字（寬% / 左移% / 上移% / 高寬比），換 GIF 時要一起重算
const CHARAS = {
  1: { name: 'Dokimi', kana: 'ドキミー', tag: '自我懷疑與自卑', gif: 'img/char-1.gif', crop: [180.07, -38.78, -38.42, 836/700], size: 1.06,
       desc: '總是不自覺地和別人比較，很在意外表與他人的評價。即使已經很努力，還是覺得自己不夠好，渴望被認同與肯定。',
       light: '#FBFEBB', main: '#FFDF8C', accent: '#E9FFA3', glow: '#FFDF8C' },
  2: { name: 'Gurumi', kana: 'グルミー', tag: '學業壓力', gif: 'img/char-2.gif', crop: [169.11, -35.06, -33.71, 747/700], size: 1.06,
       desc: '總是被待辦清單追著跑，害怕進度落後或做得不夠好。即使完成了所有事情，仍然無法安心，總擔心自己還能做得更好。',
       light: '#D0EDE6', main: '#E0D2B7', accent: '#D0EDE6', glow: '#D0EDE6' },
  3: { name: 'Rabumi', kana: 'ラブミー', tag: '人際關係壓力', gif: 'img/rabumi.gif', crop: [136.36, -17.09, -4.27, 792/700], size: 1.3,
       desc: '總是很在意別人的想法，容易因為一句話或一個小動作想很多。明明沒有發生什麼，卻忍不住懷疑是不是自己做錯了什麼。',
       light: '#FAE6F6', main: '#F1C5C8', accent: '#FAE6F6', glow: '#F1C5C8' }
};
const ccDim = document.getElementById('ccDim');
const ccCard = document.getElementById('ccCard');
let ccCurrent = null;

function openChara(id){
  const c = CHARAS[id];
  ccCurrent = id;
  document.getElementById('ccImg').src = c.gif;
  const [gw, gx, gy, ratio] = c.crop;
  ccCard.style.setProperty('--gw', gw);      // GIF 裁切：寬
  ccCard.style.setProperty('--gx', gx);      // 左移
  ccCard.style.setProperty('--gy', gy);      // 上移
  ccCard.style.setProperty('--pr', ratio);   // 角色的高寬比
  ccCard.style.setProperty('--cc-glow', c.glow);
  ccCard.style.setProperty('--ps', c.size);   // 角色大小倍數
  document.getElementById('ccName').textContent = c.name;
  document.getElementById('ccKana').textContent = c.kana;
  document.getElementById('ccTag').textContent = c.tag;
  document.getElementById('ccDesc').textContent = c.desc;
  ccCard.style.setProperty('--cc-light', c.light);   // 換成這隻角色的代表色
  ccCard.style.setProperty('--cc-main', c.main);
  ccCard.style.setProperty('--cc-accent', c.accent);
  ccDim.classList.add('show');
  setHelper(false);
}
function closeChara(){ ccDim.classList.remove('show'); }

document.querySelectorAll('.chara').forEach(btn => btn.addEventListener('click', () => openChara(btn.dataset.chara)));
document.getElementById('ccClose').addEventListener('click', closeChara);   // 只有右上角的 × 可以關閉（點空白處、按 Esc 都不會關）

// 按「選擇我! pick me!」：記住選了誰 → 停頓一下 → 白光從按鈕慢慢擴散到整個畫面 → 換到這隻角色的個人檔案頁
const PICK_PAUSE = 150;      // 按下後停頓幾毫秒才開始泛白
const PICK_WIPE = 1400;    // 白光擴散到全螢幕花幾毫秒（也要改 style.css 的 .pick-wipe.go 的 1.4s）
const ccPick = document.getElementById('ccPick');
const pickWipe = document.getElementById('pickWipe');
ccPick.addEventListener('click', () => {
  const key = CHARAS[ccCurrent].name.toLowerCase();   // dokimi / gurumi / rabumi
  try { sessionStorage.setItem('teaPick', key); } catch (_) {}
  ccPick.disabled = true;
  document.getElementById('ccClose').disabled = true;
  ccPick.classList.add('picked');                     // 按鈕彈一下

  // 白光的中心 = 按鈕中心；算出要放多大才蓋得住整個畫面
  const r = ccPick.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  pickWipe.style.left = x + 'px';
  pickWipe.style.top = y + 'px';
  pickWipe.style.setProperty('--wipe-scale', far / 60 + 1);   // 60 = 白光實心部分的半徑（style.css 的 120px 的一半）

  setTimeout(() => pickWipe.classList.add('go'), PICK_PAUSE);
  setTimeout(() => {
    location.href = 'profile.html?c=' + key + '&n=' + encodeURIComponent(userName);
  }, PICK_PAUSE + PICK_WIPE + 100);
});

/* ---------- 6. 從角色檔案頁回來：跳過對話，直接回到可以點角色的狀態 ---------- */
if (RETURNING){
  userName = savedName;
  try { sessionStorage.setItem('teaName', savedName); } catch (_) {}
  document.getElementById('helperName').textContent = savedName;   // 「需要幫忙嗎?」旁邊顯示玩家的名字
  finishIntro();
}
