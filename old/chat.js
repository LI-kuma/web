// It's Tea Time 聊天頁
/* ===================================================================
   ★ 三隻角色的對話都寫在這裡 ★
   聊天分成五輪：
     第一輪 最近發生什麼事？（選煩惱的細分類型）
     第二輪 你在意的是什麼？（依第一輪選的類型，問不一樣的問題）
     第三輪 你的感受是什麼？（選情緒）
     第四輪 你現在最需要什麼？還有什麼想跟我說？（自由打字）
     第五輪 角色回應：先安慰、再給建議（有接 AI 就由 AI 回；沒接 AI 或 AI 壞掉，就用下面 reply 寫好的話：open + close 當安慰、類型那句當建議）
   聊完 → invite 邀請去甜點店 → 今天的小紙條 → dessert.html 做甜點、吃甜點（甜點設定在 dessert.js）
   每一輪最後都會自動多一個「✎ 都不是，我想自己說」，玩家可以自己打字
   - {NAME} 玩家名字、{TYPE} 第一輪選的、{CORE} 第二輪選的、{FEEL} 第三輪選的
   - 想換行打 \n；文字裡有單引號 ' 的話，外面改用雙引號 " " 包
   - choices 裡：t = 按鈕上的字、memo = 寫進最後「今天的小紙條」的字（沒寫就用 t）
   =================================================================== */
const SCRIPTS = {

  /* ===== Dokimi｜自我懷疑與自卑｜網紅美食家・房屋仲介｜外表很有活力，其實很沒自信 ===== */
  dokimi: {
    hello: [
      '哇！真的假的！？是 {NAME} 耶！我是 Dokimi～\n平常是美食網紅，偶爾也幫人找房子喔！',
      '嘿嘿……其實我每次發文之前，都會看留言看到很晚。\n大家都說我很有自信，可是……我常常覺得自己不夠好。'
    ],
    // 第一輪：細分類型（say = 選了之後角色的反應）
    r1: { ask: '{NAME}，你最近是哪一種感覺比較多呢？',
          types: [
            { id: 'doubt',    t: '常常懷疑自己做不到', memo: '自我懷疑', say: '懷疑自己啊……我懂！\n每次拍影片，我都要重拍好幾次才敢上傳。' },
            { id: 'inferior', t: '覺得自己比不上別人', memo: '自卑',     say: '比不上別人……\n這種感覺，我滑手機的時候也常常有。' }
          ] },
    // 第二輪：依第一輪的類型問（free = 第一輪選「都不是」時問的）
    r2: {
      doubt:    { ask: '那你最常懷疑自己的，是哪一部分呢？',
                  choices: [ { t: '怕自己的決定是錯的', memo: '害怕自己做錯決定' },
                             { t: '覺得自己的能力不夠' },
                             { t: '被稱讚也不太相信', memo: '被稱讚的時候也不太相信' } ] },
      inferior: { ask: '你最常拿自己跟別人比的，是什麼呢？',
                  choices: [ { t: '外表、身材', memo: '在意自己的外表和身材' },
                             { t: '成績、表現、成就', memo: '覺得自己的表現比不上別人' },
                             { t: '人緣、生活過得好不好', memo: '覺得別人的生活都過得比自己好' } ] },
      free:     { ask: '那在這件事裡，你最在意的是什麼呢？',
                  choices: [ { t: '別人怎麼看我' }, { t: '我是不是不夠好' }, { t: '怕自己會失敗' } ] }
    },
    r2say: '「{CORE}」……真的假的！？我也是耶……\n原來不是只有我。',
    r3: { ask: '那這種時候，你心裡是什麼感覺呢？\n選一個最接近的就好！', say: '「{FEEL}」……嗯，能說出來，就已經很勇敢了喔！' },
    r4: { ask: '最後最後～你現在最需要的是什麼呢？\n還有什麼想說的，都可以打給我，我會認真看完！',
          placeholder: '例如：想被肯定、想知道怎麼不跟別人比…',
          say: '收到！我都看到了……\n讓我想一下怎麼說比較好……', skip: '沒關係！不想說也完全 OK～\n讓我想一下喔……' },
    freeSay: '原來是這樣……謝謝你告訴我！',
    // 第五輪：沒接 AI 時的回應 = open + 這個類型的話 + close
    reply: {
      open: '{NAME}，會覺得「{FEEL}」，真的一點都不奇怪！\n你看，我這麼愛拍美食，還不是每天都在懷疑自己。',
      doubt: '我後來發現，會懷疑自己，其實是因為你很認真、很想做好。\n「不行，我要再試一次！」——這句話我每天都說。做錯了也沒關係，再試一次就好。',
      inferior: '網路上大家放的，都是修過圖的「精華片段」；你拿來比的，卻是自己的「幕後花絮」。\n今天睡前，寫下三件自己做到的小事吧，再小都算數！',
      free: '你本來的樣子，就已經有很多別人沒有的好。\n試試看，用對朋友說話的溫柔語氣，對自己說一句話吧。',
      close: '「這個也太好看了吧！」——下次，我希望你也可以這樣稱讚自己♡'
    },
    bye: '謝謝你陪我聊天，{NAME}！\n你本來的樣子，就已經值得被好好對待喔。',
    invite: '對了對了！Rabumi 說要用你今天的心情，做一份專屬甜點送你！\n真的假的！？快去甜點店看看吧！'
  },

  /* ===== Gurumi｜學業壓力｜補習班班導師｜做事有條理、喜歡看心靈叢書 ===== */
  gurumi: {
    hello: [
      '你好，{NAME}。我是 Gurumi，在補習班當班導師。\n不好意思，剛剛還在改考卷……請坐。',
      '我覺得呢……每天看著學生被考試追著跑，就會想起以前的自己。\n所以，如果你也很累，我很想聽你說說。'
    ],
    r1: { ask: '最近讓你壓力最大的，是哪一種呢？',
          types: [
            { id: 'study',  t: '考試、作業、成績',     memo: '課業焦慮',       say: '課業的壓力啊……我想想喔，\n每到考試前，教室裡的空氣都會變得好重。' },
            { id: 'future', t: '畢業、升學、未來方向', memo: '畢業與未來迷茫', say: '未來的方向……嗯，\n這個問題，連大人也常常答不出來呢。' }
          ] },
    r2: {
      study:  { ask: '在課業上，你最在意的是什麼呢？',
                choices: [ { t: '書念不完、進度跟不上' },
                           { t: '怕成績不好讓人失望', memo: '害怕成績不好讓家人失望' },
                           { t: '很努力了還是考不好', memo: '很努力了，成績還是不如預期' } ] },
      future: { ask: '想到未來的時候，最讓你不安的是什麼？',
                choices: [ { t: '不知道自己想做什麼' },
                           { t: '怕選錯科系或方向', memo: '害怕選錯科系或方向' },
                           { t: '看到別人都有目標就好慌', memo: '看到別人都有目標，覺得自己落後' } ] },
      free:   { ask: '那在這件事裡，你最在意的是什麼呢？',
                choices: [ { t: '時間不夠用' }, { t: '怕自己做不好' }, { t: '不知道該從哪裡開始' } ] }
    },
    r2say: '「{CORE}」……好，我記下來了。\n這真的會讓人肩膀好重。',
    r3: { ask: '那壓力很大的時候，你心裡是什麼感覺呢？\n選一個最接近的就好，沒有標準答案。', say: '「{FEEL}」……嗯，我覺得呢，\n願意看見自己的感覺，就是整理的第一步。' },
    r4: { ask: '最後一題——你現在最需要的是什麼呢？\n還有什麼想說的，都可以寫在下面，我會好好看完。',
          placeholder: '例如：想好好休息、想知道怎麼安排讀書…',
          say: '好，我再檢查一下……嗯，都看完了。\n讓我想想怎麼說……', skip: '沒關係，不用勉強。\n讓我想想怎麼說……' },
    freeSay: '我想想喔……嗯，我懂了，謝謝你告訴我。',
    reply: {
      open: '{NAME}，會覺得「{FEEL}」是很正常的。\n你一直撐著，真的辛苦了。',
      study: '我很喜歡一本書裡的一句話：「休息不是偷懶，是為了走更遠的路。」\n試試看把今天的任務切成小小步，專心 25 分鐘、休息 5 分鐘，一次只做一小步就好。',
      future: '還不知道想做什麼，不代表你落後了，只是你還在認識自己。\n可以先寫下「我喜歡做的事」和「我不想做的事」，方向常常就藏在裡面。',
      free: '壓力大的時候，先把腦袋裡的事全部寫下來，再挑一件最小的開始做。\n事情一件一件來，就不會那麼可怕了。',
      close: '不管成績怎麼樣，你都不只是一個分數喔。'
    },
    bye: '今天也辛苦了，{NAME}。\n累了就回來這裡，我泡杯茶等你。',
    invite: '對了，Rabumi 說要用你今天的心情做一份專屬甜點。\n休息一下，去甜點店吃點甜的吧。'
  },

  /* ===== Rabumi｜人際關係壓力｜糕點師｜容易想太多，但很會聽人說話 ===== */
  rabumi: {
    hello: [
      '歡迎光臨～啊，是 {NAME}！我是 Rabumi，平常在開甜點店。\n今天幫你留了一塊草莓蛋糕喔♡',
      '欸……你看起來好像有點累？是不是我誤會了啊？\n沒關係，慢慢說，我很會聽人聊天的！'
    ],
    r1: { ask: '最近發生什麼事了呢？是跟誰之間的事嗎？',
          types: [
            { id: 'family', t: '家人',             memo: '和家人之間的事',       say: '家人啊……越親近的人，\n有時候越不知道怎麼開口，對吧？' },
            { id: 'friend', t: '朋友',             memo: '和朋友之間的事',       say: '朋友……欸，我懂！\n朋友一句話，就能讓人想一整晚。' },
            { id: 'peer',   t: '同學、同事（同儕）', memo: '和同學、同事之間的事', say: '每天都要見面的人，氣氛一卡卡的，\n真的會好累喔……' },
            { id: 'lover',  t: '情侶',             memo: '和另一半之間的事',     say: '是另一半啊……越在乎，就越怕失去，\n心會揪成一團吧。' },
            { id: 'crush',  t: '曖昧對象',         memo: '和曖昧對象之間的事',   say: '啊啊啊，是曖昧！\n猜來猜去的感覺，最折磨人了啦！' }
          ] },
    r2: {
      family: { ask: '跟家人相處時，你最在意的是什麼呢？',
                choices: [ { t: '覺得他們不懂我', memo: '家人不懂我真正的想法' },
                           { t: '怕讓他們失望', memo: '害怕讓家人失望' },
                           { t: '常常吵架、說不上話', memo: '和家人常常吵架、說不上話' } ] },
      friend: { ask: '跟朋友之間，最讓你放不下的是什麼？',
                choices: [ { t: '怕自己被冷落、被排擠' },
                           { t: '不知道對方是不是在生氣', memo: '擔心朋友是不是在生我的氣' },
                           { t: '總是我在配合別人', memo: '總是自己在配合別人' } ] },
      peer:   { ask: '和同學或同事相處時，你最在意的是什麼？',
                choices: [ { t: '融入不了大家', memo: '融入不了團體' },
                           { t: '很在意別人怎麼看我' },
                           { t: '意見不合、不敢說出來', memo: '合作時意見不合，不敢表達' } ] },
      lover:  { ask: '和另一半之間，你最在意的是什麼呢？',
                choices: [ { t: '覺得自己不被重視' },
                           { t: '常常吵架或冷戰' },
                           { t: '擔心感情會走不下去', memo: '擔心這段感情會走不下去' } ] },
      crush:  { ask: '曖昧的時候，最讓你心裡亂亂的是什麼？',
                choices: [ { t: '不知道對方怎麼想', memo: '猜不透對方的想法' },
                           { t: '怕說出口連朋友都當不成', memo: '怕告白後連朋友都當不成' },
                           { t: '對方忽冷忽熱', memo: '對方忽冷忽熱，讓人好不安' } ] },
      free:   { ask: '那在這件事裡，你最在意的是什麼呢？',
                choices: [ { t: '別人怎麼看我' }, { t: '關係會不會變壞' }, { t: '是不是我做錯了什麼' } ] }
    },
    r2say: '「{CORE}」……嗯，\n我好像能懂那種感覺。',
    r3: { ask: '那……這件事讓你心裡是什麼感覺呢？\n不用想得很清楚，選一個最接近的就好。', say: '原來是「{FEEL}」的感覺啊……\n謝謝你願意說出來，這一點都不簡單喔。' },
    r4: { ask: '最後……你現在最需要的是什麼呢？\n還有什麼想跟我說的，都可以打在下面喔，我會好好看完的。',
          placeholder: '例如：想有人聽我說、想知道該怎麼開口…',
          say: '嗯嗯……我都看到了。\n讓我想一想喔……', skip: '沒關係，不想說也可以的。\n讓我想一想喔……' },
    freeSay: '嗯嗯，原來是這樣……謝謝你說給我聽。',
    reply: {
      open: '{NAME}，會覺得「{FEEL}」，一點都不奇怪喔。\n因為你很在乎，所以才會這麼放在心上。',
      family: '家人有時候用的是他們習慣的方式在愛人，不一定是你需要的方式。\n可以找一個大家都比較放鬆的時候，用「我覺得……」開頭，說一件小小的感受就好。',
      friend: '「是不是我誤會了啊？」——這句話我也常常問自己。\n可是很多時候，對方其實沒有想那麼多。真的很在意的話，問一句「你還好嗎？」，常常就解開了。',
      peer: '不用讓每個人都喜歡你，有一兩個能自在說話的人，就已經很好了。\n先從身邊一個比較好聊的人開始，就像做甜點，一次放一點點糖就好。',
      lover: '感情裡的不安，常常是因為「沒被說出口的期待」。\n試著把你希望對方做的事說得具體一點點，例如「我希望你忙完可以跟我說一聲」。',
      crush: '猜來猜去真的好累對吧……可是你的心情是真的，值得被好好對待。\n不用急著知道答案，先照顧好自己的節奏，對方的行動會慢慢告訴你的。',
      free: '人和人之間，本來就很難完全不卡卡的。\n先把「想法」和「真正發生的事」分開寫下來，常常會發現，事情沒有想像中那麼糟。',
      close: '不管怎麼樣，我的甜點店永遠幫你留一個位子♡'
    },
    bye: '下次再來吃蛋糕吧，{NAME}！\n在這裡，你不用猜別人的心情，只要做你自己就好喔。',
    invite: '對了！我想用你今天的心情，幫你做一份專屬甜點♡\n跟我一起去甜點店吧！'
  }
};

// 第三輪的情緒選項（三隻共用）
const FEELINGS = ['難過', '焦慮、不安', '委屈', '生氣', '好累、無力', '孤單'];
// 玩家打的字裡有這些詞，就先溫柔地提醒求助資訊（第五輪不走一般回應）
const CRISIS_WORDS = ['想死', '去死', '自殺', '不想活', '活不下去', '傷害自己', '割腕', '結束生命', '消失就好'];
const CRISIS_REPLY = '{NAME}……謝謝你願意把這麼重的話說出來。\n你現在的感受很重要，請不要一個人撐著——現在就找一個信任的人陪著你，或打 1925 安心專線、1995 生命線（24 小時），會有人好好聽你說。';

// 每隻角色的名字、圖、顏色、煩惱種類（頭像框和選項按鈕會用角色色；wallCat = 貼到煩惱牆時的分類）
const CHARAS = {
  dokimi: { name: 'Dokimi', kana: 'ドキミー', img: '../img/char-1.png', light: '#FBFEBB', main: '#FFDF8C', wallCat: 'self' },
  gurumi: { name: 'Gurumi', kana: 'グルミー', img: '../img/char-2.png', light: '#D0EDE6', main: '#E0D2B7', wallCat: 'study' },
  rabumi: { name: 'Rabumi', kana: 'ラブミー', img: '../img/rabumi.png', light: '#FAE6F6', main: '#F1C5C8', wallCat: 'people' }
};
const TYPE_SPEED = 38;   // 打字速度：每個字幾毫秒，越小越快
// 第五輪的 AI：之後把 Cloudflare Worker 的網址貼在引號裡就會啟用；空白 = 不用 AI，改用上面 reply 寫好的話
const AI_URL = 'https://tea-time.spcp94523.workers.dev';
/* ===== 對話寫到這裡為止，下面是程式 ===== */

/* ---------- 1. 是哪一隻角色、玩家叫什麼名字 ---------- */
const params = new URLSearchParams(location.search);
let key = params.get('c');
if (!SCRIPTS[key]) { try { key = sessionStorage.getItem('teaPick'); } catch (_) {} }
if (!SCRIPTS[key]) key = 'dokimi';
let playerName = params.get('n') || '';
if (!playerName) { try { playerName = sessionStorage.getItem('teaName') || ''; } catch (_) {} }
const nameQ = playerName ? '&n=' + encodeURIComponent(playerName) : '';
if (!playerName) playerName = '你';

const C = CHARAS[key];
const S = SCRIPTS[key];
document.body.style.setProperty('--pc-light', C.light);
document.body.style.setProperty('--pc-main', C.main);
document.getElementById('charaImg').src = C.img;
document.getElementById('charaImg').alt = C.name;
document.getElementById('avatarImg').src = C.img;
document.getElementById('chatName').textContent = C.name + '｜' + C.kana;

// 玩家這次聊天的內容（最後寫進小紙條、也會傳給 AI）
const memo = { type: '', typeId: 'free', core: '', feel: '', need: '' };
function fill(s){
  return s.replaceAll('{NAME}', playerName).replaceAll('{TYPE}', memo.type)
          .replaceAll('{CORE}', memo.core).replaceAll('{FEEL}', memo.feel);
}

/* ---------- 2. 說話、出選項、打字框 ---------- */
const box = document.getElementById('chatBox');
const textEl = document.getElementById('chatText');
const nextBtn = document.getElementById('chatNext');
const panel = document.getElementById('chatChoices');
const chara = document.getElementById('chatChara');
let typing = null, finishTyping = null, waitNext = null;

// 一個字一個字打出來；打完才 resolve
function type(text){
  return new Promise(done => {
    const full = fill(text);
    box.classList.remove('next'); void box.offsetWidth; box.classList.add('next');
    chara.classList.remove('talk'); void chara.offsetWidth; chara.classList.add('talk');   // 角色跳一下
    nextBtn.hidden = true;
    textEl.classList.remove('thinking');
    let i = 0;
    textEl.textContent = '';
    finishTyping = () => { clearInterval(typing); typing = null; finishTyping = null; textEl.textContent = full; done(); };
    typing = setInterval(() => { textEl.textContent = full.slice(0, ++i); if (i >= full.length) finishTyping(); }, TYPE_SPEED);
  });
}
// 說一句話，等玩家按「▸」
async function say(text, last){
  await type(text);
  nextBtn.textContent = last ? '♡' : '▸';
  nextBtn.hidden = false;
  return new Promise(done => { waitNext = done; });
}
// 點對話框 / 按「▸」/ 按空白鍵或 Enter：還在打字就直接顯示整句，打完了就下一句
function advance(){
  if (finishTyping) return finishTyping();
  if (waitNext){ const w = waitNext; waitNext = null; nextBtn.hidden = true; w(); }
}
box.addEventListener('click', advance);
addEventListener('keydown', e => {
  if ((e.key === ' ' || e.key === 'Enter') && !e.target.closest('button, a, input, textarea') && !endDim.classList.contains('show')){ e.preventDefault(); advance(); }
});

function clearPanel(){ panel.classList.remove('show', 'many', 'input'); panel.innerHTML = ''; }
function button(text, cls, i){
  const b = document.createElement('button');
  b.type = 'button'; b.className = cls; b.textContent = text; b.style.setProperty('--i', i);
  return b;
}
// 問一個問題 + 出選項（最後自動多一個「都不是，我想自己說」）；回傳 { t, memo, id, free }
async function ask(question, options){
  await type(question);
  return new Promise(done => {
    const showOptions = () => {
      clearPanel();
      options.forEach((o, i) => {
        const b = button(o.t, 'chat-choice', i);
        b.addEventListener('click', () => { clearPanel(); done({ ...o, memo: o.memo || o.t, free: false }); });
        panel.appendChild(b);
      });
      const f = button('✎ 都不是，我想自己說', 'chat-choice chat-choice-free', options.length);
      f.addEventListener('click', () => showInput());
      panel.appendChild(f);
      panel.classList.toggle('many', options.length > 3);
      requestAnimationFrame(() => panel.classList.add('show'));
    };
    const showInput = () => {
      inputPanel({ placeholder: '用自己的話說說看…', send: '告訴你', back: '← 回到選項', single: true }, v => {
        if (v === null) return showOptions();
        done({ t: v, memo: v, id: 'free', free: true });
      });
    };
    showOptions();
  });
}
// 打字框（第四輪、和「都不是」用）：按送出回傳打的字；按 back 回傳 null（或第四輪的「沒有了」回傳 ''）
function inputPanel(o, cb){
  clearPanel();
  panel.classList.add('input');
  const field = document.createElement(o.single ? 'input' : 'textarea');
  field.className = 'chat-input'; field.placeholder = o.placeholder; field.maxLength = o.single ? 40 : 200;
  if (o.single) field.type = 'text';
  const row = document.createElement('div'); row.className = 'chat-input-btns';
  const back = button(o.back, 'chat-choice chat-choice-free', 0);
  const send = button(o.send, 'chat-choice', 1);
  back.addEventListener('click', () => { clearPanel(); cb(o.single ? null : ''); });
  send.addEventListener('click', () => {
    const v = field.value.trim();
    if (!v){ field.classList.remove('shake'); void field.offsetWidth; field.classList.add('shake'); field.focus(); return; }
    clearPanel(); cb(v);
  });
  field.addEventListener('keydown', e => { if (e.key === 'Enter' && (o.single || e.ctrlKey)) { e.preventDefault(); send.click(); } });
  row.append(back, send);
  panel.append(field, row);
  requestAnimationFrame(() => { panel.classList.add('show'); field.focus(); });
}
function askText(question, placeholder){
  return type(question).then(() => new Promise(done =>
    inputPanel({ placeholder, send: '送出 ♡', back: '沒有了，就這樣', single: false }, done)));
}

/* ---------- 3. 第五輪：AI 回應（沒有 AI 就用寫好的話） ---------- */
const isCrisis = t => CRISIS_WORDS.some(w => t.includes(w));
// 回應分兩段：comfort 安慰、advice 建議（小紙條上也會各寫一格）
function presetReply(){
  const R = S.reply;
  return { comfort: fill(R.open + '\n' + R.close), advice: fill(R[memo.typeId] || R.free) };
}
async function getReply(){
  if (!AI_URL) return presetReply();
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 35000);   // 35 秒沒回應就放棄，改用寫好的話
    const res = await fetch(AI_URL, {
      method: 'POST', signal: ctrl.signal, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chara: key, name: playerName, type: memo.type, core: memo.core, feel: memo.feel, need: memo.need })
    });
    clearTimeout(timer);
    const data = await res.json();
    if (!res.ok || !(data.comfort || data.reply)) return presetReply();
    return { comfort: data.comfort || data.reply, advice: data.advice || '' };
  } catch (_) { return presetReply(); }
}
// AI 在想的時候：對話框出現「……」
function thinking(){ nextBtn.hidden = true; textEl.textContent = '……'; textEl.classList.add('thinking'); }

/* ---------- 4. 五輪對話的順序 ---------- */
async function run(){
  for (const line of S.hello) await say(line);

  // 第一輪：最近發生什麼事？
  const a1 = await ask(S.r1.ask, S.r1.types);
  memo.type = a1.memo; memo.typeId = a1.free ? 'free' : a1.id;
  await say(a1.free ? S.freeSay : a1.say);

  // 第二輪：你在意的是什麼？
  const q2 = S.r2[memo.typeId] || S.r2.free;
  const a2 = await ask(q2.ask, q2.choices);
  memo.core = a2.memo;
  await say(a2.free ? S.freeSay : S.r2say);

  // 第三輪：你的感受是什麼？
  const a3 = await ask(S.r3.ask, FEELINGS.map(f => ({ t: f })));
  memo.feel = a3.memo;
  await say(S.r3.say);

  // 第四輪：你現在最需要什麼？（自由打字）
  memo.need = await askText(S.r4.ask, S.r4.placeholder);
  await type(memo.need ? S.r4.say : S.r4.skip);
  await new Promise(r => setTimeout(r, 700));

  // 第五輪：角色回應
  const crisis = isCrisis(memo.need + memo.type + memo.core + memo.feel);
  thinking();
  const reply = crisis ? { comfort: fill(CRISIS_REPLY), advice: '' } : await getReply();
  for (const p of toPages(reply.comfort)) await say(p);   // 先安慰
  for (const p of toPages(reply.advice)) await say(p);    // 再給建議

  if (!crisis) await say(S.bye);
  await say(S.invite, true);   // 邀請去甜點店
  openEnd(crisis, reply);
}
// 回應比較長：按句號、問號、換行切成幾段，一段一段說
function toPages(text){
  const parts = text.split(/(?<=[。！？!?♡])(?![」』）])\s*|\n/).map(s => s.trim()).filter(Boolean);
  const pages = [];
  parts.forEach(p => { const last = pages[pages.length - 1]; if (last && (last + p).length <= 46) pages[pages.length - 1] = last + p; else pages.push(p); });
  return pages;
}

/* ---------- 5. 聊完：今天的小紙條 ---------- */
const endDim = document.getElementById('endDim');
let endReply = null, endCrisis = false;
function openEnd(crisis, reply){
  endReply = reply; endCrisis = crisis;
  const none = '（還在慢慢整理）';
  document.getElementById('endName').textContent = playerName;
  document.getElementById('endWhat').textContent = memo.type || none;
  document.getElementById('endCore').textContent = memo.core || none;
  document.getElementById('endFeel').textContent = memo.feel || none;
  document.getElementById('endNeed').textContent = memo.need || '（這次先不說也沒關係）';
  document.getElementById('endCharaName').textContent = C.name + ' 想對你說';
  document.getElementById('endSay').textContent = reply.comfort;
  document.getElementById('endTipText').textContent = reply.advice;
  document.getElementById('endTip').hidden = !reply.advice;
  document.getElementById('endHelp').classList.toggle('urgent', crisis);
  endDim.classList.add('show');
}
// 去甜點店：把今天聊的結果交給甜點頁（甜點口味、樣子都看這些決定；吃完後在那邊貼到煩惱牆）
document.getElementById('endDessert').addEventListener('click', () => {
  try {
    sessionStorage.setItem('teaResult', JSON.stringify({ chara: key, name: playerName === '你' ? '' : playerName,
                                                        memo, reply: endReply, crisis: endCrisis }));
  } catch (_) {}
  goTo('dessert.html');
});
document.getElementById('endRoom').addEventListener('click', () => goTo('page3.html?back=1' + nameQ));
document.getElementById('endAgain').addEventListener('click', () => location.reload());

// 隨時可以換路：左上角的兩個小按鈕
document.getElementById('toolRoom').addEventListener('click', () => goTo('page3.html?back=1' + nameQ));
document.getElementById('toolWall').addEventListener('click', () => goTo('../wall.html' + (nameQ ? '?' + nameQ.slice(1) : '')));

/* ---------- 6. 開始：等白幕淡出、角色走進來再開口 ---------- */
setTimeout(() => { box.classList.add('in'); run(); }, 1600);
