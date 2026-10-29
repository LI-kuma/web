// It's Tea Time 聊天頁
/* ===================================================================
   ★ 三隻角色的對話都寫在這裡 ★
   每一句是一個「節點」，用名字（start、what…）互相連起來：
   - say：角色說的話；{NAME} 會換成玩家名字、{WHAT} 會換成玩家選的煩惱
   - next：說完按「▸」接哪一句
   - choices：輪到玩家回答（最多 3 個選項），每個選項：
       t = 按鈕上的字、next = 選了之後接哪一句
       what / why / how = 寫進最後「今天的小紙條」的內容（我在煩什麼 / 為什麼會煩 / 可以怎麼舒緩）
   - end: true：這句說完就跳出「今天的小紙條」
   規則和 profile.js 一樣：文字裡有單引號 ' 的話，外面改用雙引號 " " 包
   =================================================================== */
const SCRIPTS = {

  /* ===== Dokimi｜自我懷疑與自卑 ===== */
  dokimi: {
    start: { say: '啊…你、你好，{NAME}。我是 Dokimi。\n你選了我…是不是代表，你也常常覺得自己不夠好？',
             choices: [ { t: '嗯…常常這樣覺得', next: 'what' },
                        { t: '有時候會，但說不太上來', next: 'what0' } ] },
    what0: { say: '沒關係，說不太上來也很正常。\n我先說說我的…我每天滑手機，都覺得大家過得好好的，只有我還在原地。', next: 'what' },
    what:  { say: '那…最近是什麼時候，最有這種感覺呢？',
             choices: [ { t: '看到別人比我厲害的時候', what: '和別人比較，覺得自己比不上', next: 'echo' },
                        { t: '被別人評價、批評的時候', what: '很在意別人的評價', next: 'echo' },
                        { t: '照鏡子、在意外表的時候', what: '對自己的外表沒有自信', next: 'echo' } ] },
    echo:  { say: '{WHAT}…原來不是只有我。\n光是願意說出來，就已經很勇敢了喔。', next: 'why' },
    why:   { say: '那你覺得…這種感覺是從哪裡來的呢？',
             choices: [ { t: '我總是用別人的標準看自己', why: '習慣用別人的標準衡量自己', next: 'why1' },
                        { t: '怕不夠好，就不會被喜歡', why: '擔心不夠好，就不會被喜歡、被認同', next: 'why1' },
                        { t: '我也不知道…', why: '還在慢慢找原因，這樣也沒關係', next: 'why1' } ] },
    why1:  { say: '我懂…我也一直覺得，要變得更好，才有資格被喜歡。', next: 'why2' },
    why2:  { say: '可是莓露露跟我說過：\n「你看到的是別人的精華片段，拿來比的卻是自己的幕後花絮。」', next: 'how' },
    how:   { say: '所以我最近在練習一些小方法…你想先試試哪一個？',
             choices: [ { t: '睡前寫下今天做到的三件小事', how: '睡前寫下今天做到的三件小事', next: 'how1' },
                        { t: '滑社群前先深呼吸、設個時間', how: '滑社群前先深呼吸，替自己設個時間', next: 'how1' },
                        { t: '用對朋友說話的語氣對自己說話', how: '用對朋友說話的溫柔語氣，對自己說話', next: 'how1' } ] },
    how1:  { say: '好！那我們一起試試看～\n不用一次做得很好，做到一點點就很棒了。', next: 'bye' },
    bye:   { say: '謝謝你今天陪我聊天，{NAME}。\n你本來的樣子，就已經值得被好好對待喔。', end: true }
  },

  /* ===== Gurumi｜學業壓力 ===== */
  gurumi: {
    start: { say: '汪…你好，{NAME}。我是 Gurumi。\n不好意思，我剛剛還在對待辦清單…你也是被功課追著跑的人嗎？',
             choices: [ { t: '對…最近壓力好大', next: 'what' },
                        { t: '還好，但總覺得做不完', next: 'what0' } ] },
    what0: { say: '「總覺得做不完」…這句話我好熟悉。\n清單劃掉一項，就又多出兩項，對吧？', next: 'what' },
    what:  { say: '最近讓你最喘不過氣的，是什麼呢？',
             choices: [ { t: '考試、成績', what: '考試和成績的壓力', next: 'echo' },
                        { t: '作業、報告做不完', what: '作業和報告堆積如山', next: 'echo' },
                        { t: '未來、升學的方向', what: '對未來和升學方向感到迷惘', next: 'echo' } ] },
    echo:  { say: '{WHAT}…光聽就覺得肩膀好重。\n你一直都撐著，真的辛苦了。', next: 'why' },
    why:   { say: '那你覺得，壓力最大的時候，心裡最怕的是什麼？',
             choices: [ { t: '怕表現不好，讓家人失望', why: '害怕讓在乎的人失望', next: 'why1' },
                        { t: '怕跟不上別人的進度', why: '擔心自己跟不上別人', next: 'why1' },
                        { t: '總覺得還不夠、還能更好', why: '對自己要求很高，總覺得還不夠', next: 'why1' } ] },
    why1:  { say: '我也是…就算全部做完了，還是會想「是不是還能做得更好」。', next: 'why2' },
    why2:  { say: '後來我發現，休息不是偷懶，是為了走更遠的路。\n累壞的狗狗，是追不到球的。', next: 'how' },
    how:   { say: '我們來找一個今天就能做的小方法吧！',
             choices: [ { t: '把大任務切成小小步', how: '把大任務切成一小步一小步', next: 'how1' },
                        { t: '專心 25 分鐘、休息 5 分鐘', how: '專心 25 分鐘、休息 5 分鐘（番茄鐘）', next: 'how1' },
                        { t: '睡前把擔心寫下來，交給明天', how: '睡前把擔心寫下來，交給明天的自己', next: 'how1' } ] },
    how1:  { say: '好主意！我也要把它加進我的待辦清單…\n啊，不對，是「想做清單」！', next: 'bye' },
    bye:   { say: '{NAME}，不管成績怎麼樣，你都不只是一個分數喔。\n今天也辛苦了！', end: true }
  },

  /* ===== Rabumi｜人際關係壓力 ===== */
  rabumi: {
    start: { say: '嗨…{NAME}，我是 Rabumi。\n剛剛我的表情是不是怪怪的？…啊，對不起，我又想太多了。',
             choices: [ { t: '沒有啦，你很可愛', next: 'what0' },
                        { t: '我懂，我也常常這樣', next: 'what' } ] },
    what0: { say: '真、真的嗎…謝謝你。\n被這樣說，耳朵都熱起來了。', next: 'what' },
    what:  { say: '最近有沒有哪段關係，讓你心裡一直悶悶的？',
             choices: [ { t: '朋友之間', what: '和朋友之間的相處', next: 'echo' },
                        { t: '家人', what: '和家人的關係', next: 'echo' },
                        { t: '班上、團體裡的氣氛', what: '在團體裡找不到自己的位置', next: 'echo' } ] },
    echo:  { say: '{WHAT}啊…\n那種說不出口、又放不下的感覺，一定很不好受吧。', next: 'why' },
    why:   { say: '那時候，你心裡最常出現的聲音是什麼？',
             choices: [ { t: '「是不是我說錯話了？」', why: '常常懷疑是自己做錯了什麼', next: 'why1' },
                        { t: '「他們是不是不喜歡我？」', why: '害怕不被喜歡、被排擠', next: 'why1' },
                        { t: '「不想讓氣氛變糟，忍著吧」', why: '習慣忍耐，不敢說出真正的想法', next: 'why1' } ] },
    why1:  { say: '嗯…我也是。\n別人一個已讀不回，我就能想出一百種可能。', next: 'why2' },
    why2:  { say: '可是後來我發現，大部分的時候，別人其實沒有想那麼多。\n是我們的心，對自己太嚴格了。', next: 'how' },
    how:   { say: '要不要一起試試看這些小練習？',
             choices: [ { t: '把「想法」和「事實」分開寫下來', how: '把「想法」和「事實」分開寫下來', next: 'how1' },
                        { t: '鼓起勇氣問一句「你還好嗎？」', how: '鼓起勇氣，直接問一句「你還好嗎？」', next: 'how1' },
                        { t: '先好好照顧自己的感受', how: '先好好照顧自己的感受', next: 'how1' } ] },
    how1:  { say: '嗯！慢慢來就好。\n關係不是一次就能變好的，但你願意在乎，就已經很溫柔了。', next: 'bye' },
    bye:   { say: '謝謝你聽我說，{NAME}。\n在這裡，你不用猜別人的心情，只要做你自己就好喔。', end: true }
  }
};

// 每隻角色的名字、圖、顏色（頭像框和選項按鈕會用角色色）
const CHARAS = {
  dokimi: { name: 'Dokimi', kana: 'ドキミー', tag: '自我懷疑與自卑', img: 'img/char-1.png', light: '#FBFEBB', main: '#FFDF8C' },
  gurumi: { name: 'Gurumi', kana: 'グルミー', tag: '學業壓力',       img: 'img/char-2.png', light: '#D0EDE6', main: '#E0D2B7' },
  rabumi: { name: 'Rabumi', kana: 'ラブミー', tag: '人際關係壓力',   img: 'img/rabumi.png', light: '#FAE6F6', main: '#F1C5C8' }
};
const TYPE_SPEED = 38;   // 打字速度：每個字幾毫秒，越小越快
/* ===== 對話寫到這裡為止，下面是程式 ===== */

/* ---------- 1. 是哪一隻角色、玩家叫什麼名字 ---------- */
const params = new URLSearchParams(location.search);
let key = params.get('c');
if (!SCRIPTS[key]) { try { key = sessionStorage.getItem('teaPick'); } catch (_) {} }
if (!SCRIPTS[key]) key = 'dokimi';
let playerName = params.get('n') || '';
if (!playerName) { try { playerName = sessionStorage.getItem('teaName') || ''; } catch (_) {} }
if (!playerName) playerName = '你';

const C = CHARAS[key];
const script = SCRIPTS[key];
document.body.style.setProperty('--pc-light', C.light);
document.body.style.setProperty('--pc-main', C.main);
document.getElementById('charaImg').src = C.img;
document.getElementById('charaImg').alt = C.name;
document.getElementById('avatarImg').src = C.img;
document.getElementById('chatName').textContent = C.name + '｜' + C.kana;

/* ---------- 2. 說話（一個字一個字打出來） ---------- */
const box = document.getElementById('chatBox');
const textEl = document.getElementById('chatText');
const nextBtn = document.getElementById('chatNext');
const choicesEl = document.getElementById('chatChoices');
const chara = document.getElementById('chatChara');
const memo = { what: '', why: '', how: '' };   // 玩家選的內容，最後寫進小紙條
let node = null, full = '', typing = null;

function fill(s){ return s.replaceAll('{NAME}', playerName).replaceAll('{WHAT}', memo.what); }

function show(id){
  node = script[id];
  full = fill(node.say);
  choicesEl.classList.remove('show');
  choicesEl.innerHTML = '';
  nextBtn.hidden = true;
  box.classList.remove('next'); void box.offsetWidth; box.classList.add('next');
  chara.classList.remove('talk'); void chara.offsetWidth; chara.classList.add('talk');   // 角色跳一下
  let i = 0;
  textEl.textContent = '';
  clearInterval(typing);
  typing = setInterval(() => {
    textEl.textContent = full.slice(0, ++i);
    if (i >= full.length) doneTyping();
  }, TYPE_SPEED);
}

// 字打完了：有選項就跳出選項，沒有就出現「▸」
function doneTyping(){
  clearInterval(typing); typing = null;
  textEl.textContent = full;
  if (node.choices){
    node.choices.forEach((c, n) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chat-choice'; b.textContent = fill(c.t);
      b.style.setProperty('--i', n);
      b.addEventListener('click', () => {
        ['what', 'why', 'how'].forEach(k => { if (c[k]) memo[k] = c[k]; });
        show(c.next);
      });
      choicesEl.appendChild(b);
    });
    choicesEl.classList.add('show');
  } else {
    nextBtn.hidden = false;
    nextBtn.textContent = node.end ? '♡' : '▸';
  }
}

// 點對話框 / 按「▸」/ 按空白鍵或 Enter：還在打字就直接顯示整句，打完了就下一句
function advance(){
  if (!node) return;                   // 角色還沒開口
  if (typing) return doneTyping();
  if (node.choices) return;            // 要選選項才能繼續
  if (node.end) return openEnd();
  show(node.next);
}
box.addEventListener('click', advance);
addEventListener('keydown', e => {
  if ((e.key === ' ' || e.key === 'Enter') && !endDim.classList.contains('show') && !e.target.closest('button, a')){ e.preventDefault(); advance(); }
});

/* ---------- 3. 聊完：今天的小紙條 ---------- */
const endDim = document.getElementById('endDim');
function openEnd(){
  document.getElementById('endName').textContent = playerName;
  document.getElementById('endWhat').textContent = memo.what || '（還在慢慢整理）';
  document.getElementById('endWhy').textContent = memo.why || '（還在慢慢整理）';
  document.getElementById('endHow').textContent = memo.how || '（還在慢慢整理）';
  endDim.classList.add('show');
}
const nameQ = '&n=' + encodeURIComponent(playerName === '你' ? '' : playerName);
// 貼到煩惱牆：把「我在煩什麼」帶過去，煩惱牆的輸入框會先幫你填好
document.getElementById('endWall').addEventListener('click', () =>
  goTo('wall.html?c=' + key + '&post=' + encodeURIComponent(memo.what) + nameQ));
document.getElementById('endRoom').addEventListener('click', () => goTo('page3.html?back=1' + nameQ));
document.getElementById('endAgain').addEventListener('click', () => {
  endDim.classList.remove('show');
  memo.what = memo.why = memo.how = '';
  show('start');
});

/* ---------- 4. 開始：等白幕淡出、角色走進來再開口 ---------- */
setTimeout(() => { box.classList.add('in'); show('start'); }, 1600);
