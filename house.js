// It's Tea Time 娃娃屋（index.html 的後半段）
/* ===================================================================
   ★ 新流程：莓露露邀請你來茶會，Rabumi 陪你把煩惱一步一步做成甜點 ★
   邀請卡     invite.js：標準字 → 拆信封、抽出莓露露的邀請卡 → 收下 → 同一頁換成娃娃屋（叫這個檔案的 startHouse）
   開場       莓露露（茶會主人）：歡迎 → 問你的名字 → 說明怎麼玩 → 拉一下緞帶，打開娃娃屋
   ① 色粉櫃   察覺情緒：像朋友閒聊（最近好嗎 → 掛心的事）→ 選心情的顏色（天然色粉，最多 3 種），撒進一碗白色鮮奶油
   ② 包裝檯   知道在煩什麼、釐清它：鮮奶油裡拌不開的那一小團 = 最放不下的事 → 解開纏住的緞帶（想法換個說法）
   ③ 廚房     和煩惱和解：用這碗有顏色的鮮奶油做甜點（學業＝舒芙蕾鬆餅、人際＝可麗餅、自我＝布丁）
              → 呼吸等它做好 → 加一點甜，顏色變柔和 → 最後一步（按鬆餅／捲可麗餅／倒出布丁）→ 吃掉它
   ④ 茶桌     收好：茶端上來 → 心情有沒有不一樣 → 下次的自己 → 掰開幸運餅乾，看到小紙條 → 折好、綁緞帶 → 匿名擺上煩惱牆
   每個房間做完，右上的緞帶會多一個小掛飾；往下拉緞帶就去下一個房間

   ★ 台詞的寫法 ★
   - 開頭的［表情］= 說這句時的表情，例如 '[好奇]你是不是……'（Rabumi 沒寫就是［微笑］，莓露露沒寫就是［一般］）
     表情有哪些、對應哪張圖，看下面的 FACES（Rabumi）和 MAID_FACES（莓露露）
   - 選項裡的 re = 玩家選了它之後，Rabumi 先回應的話（先回應，再問下一題）
   - {NAME} 玩家名字、{TYPE} 最近發生的事、{CORE} 在意的是、{COLORS} 選的顏色、{MAIN} 主色的心情、{MAINCN} 主色的顏色名、
     {KNOT} 正在解的結、{SWEET} 加的甜、{NEED} 想要的甜、{DESSERT} 甜點名字、{X} 玩家剛剛自己打的字、{NEXT} 下次想先做的事
   - 想換行打 \n

   ★ 畫好的圖放進這些資料夾就會自動換上去（還沒畫的會先用程式畫的暫代圖）★
   - Rabumi 的表情：img/rabumi/（檔名看 FACES）
   - 甜點：img/desserts/pancake-line.png + pancake-fill.png、crepe-…、pudding-…（fill = 要上心情顏色的地方，畫白色）
           一開始的樣子：pancake-flat.png、crepe-open.png、pudding-cup.png
           配料：honey.png、cream.png、candy.png
   - 其他：img/house/fortune.png、fortune-open.png（幸運餅乾）、teacup.png（茶杯）、jar-line.png + jar-fill.png（色粉罐）
   =================================================================== */

// 對話框上的人：莓露露（茶會主人：歡迎你、問名字、說明玩法）、Rabumi（陪你走完全部房間）
const SPEAKERS = {
  maid:   { name: 'メルル｜莓露露',   img: 'img/maid.png',   light: '#FFF1F4', main: '#F6C9D4' },
  rabumi: { name: 'Rabumi｜ラブミー', img: 'img/rabumi.png', light: '#FAE6F6', main: '#F1C5C8' }
};
// 莓露露的表情（和客廳 page3 一樣的三張圖）
const MAID_FACES = { 一般: 'img/maid.png', 笑臉: 'img/maid-smile.png', 眨眼: 'img/maid-wink.png' };
const DEFAULT_NAME = '客人';   // 玩家不想說名字時的稱呼

// Rabumi 的表情：img = 畫好的圖放在 img/rabumi/ 裡的檔名（還沒畫的會先用 rabumi.png）；mark = 頭上跳出來的漫畫符號
const FACE_DIR = 'img/rabumi/';
const SHOW_FACE_TAG = true;   // 對話框名字旁邊顯示［表情］小標籤（原型用；正式版改成 false）
const FACES = {
  微笑: { img: 'smile',     mark: '' },
  好奇: { img: 'curious',   mark: '？' },
  驚訝: { img: 'surprised', mark: '！' },
  傾聽: { img: 'listen',    mark: '…' },
  心疼: { img: 'sad',       mark: '💧' },
  思考: { img: 'think',     mark: '💭' },
  慌張: { img: 'panic',     mark: '💦' },
  明白: { img: 'idea',      mark: '💡' },
  溫柔: { img: 'gentle',    mark: '♡' },
  害羞: { img: 'shy',       mark: '///' },
  開心: { img: 'happy',     mark: '♪' },
  幹勁: { img: 'cheer',     mark: '✦' },
  擔心: { img: 'worry',     mark: '' }    // 玩家提到想傷害自己時用：不要可愛的符號
};

const LINES = {
  /* 開場：莓露露（看整間娃娃屋的時候） */
  host: {
    hello: ['[笑臉]你來了！謝謝你收下我的邀請卡♡\n我是今天茶會的主人，莓露露。'],
    askName: '[一般]茶會開始之前……\n可以告訴我，該怎麼稱呼你嗎？',
    namePh: '你的名字或暱稱',
    named:  '[笑臉]{NAME}！好好聽的名字，我記住了♡',
    noName: '[一般]不想說也沒關係，\n那今天就叫你「客人」囉。',
    howto: [
      '[一般]今天的茶會，會由廚房的糕點師 Rabumi 陪著你。',
      '[笑臉]你們會一個房間一個房間走——\n先找到心情的顏色；再解開纏住的緞帶；最後一起把煩惱做成甜點。',
      '[一般]玩法很簡單：點對話框，就會看到下一句。\n出現選項時，選一個最接近你的就好；都不像的話，也可以自己打字。',
      '[眨眼]還有——看到右上角垂下來的緞帶了嗎？\n每個房間結束時，往下拉一下它，就會去下一個房間。'
    ],
    ready: '[笑臉]不用急，也沒有標準答案。\n準備好了，就拉一下緞帶，打開娃娃屋吧♡'
  },
  /* Rabumi 第一次出場（色粉櫃） */
  open: [
    '[開心]啊，{NAME}來了！莓露露說今天有客人要來～\n我是 Rabumi，這裡的糕點師♡',
    '[害羞]今天由我來陪你……\n有點緊張，不過鮮奶油已經打好了！'
  ],
  next: '[微笑]好了的話，拉一下右上角的緞帶，\n我們去下一個房間吧。',
  free: ['[傾聽]「{X}」……嗯，謝謝你告訴我。'],   // 玩家自己打字時，Rabumi 先這樣回

  /* ① 色粉櫃：察覺情緒（像朋友一樣閒聊 → 選心情的顏色） */
  color: {
    hello: ['[開心]來，先坐下來，我們聊聊天～'],
    askHow: '[微笑]最近過得怎麼樣呀？',
    how: [
      { t: '還不錯啦',     re: ['[開心]真的嗎？那太好了！', '[好奇]不過你會走進娃娃屋……\n是不是心裡還有一點點、說不上來的東西呢？'] },
      { t: '有點累',       re: ['[心疼]嗯……聽起來你最近一直在撐著呢。', '[微笑]那今天就慢慢來，不用急。'] },
      { t: '其實不太好',   re: ['[驚訝]欸……', '[傾聽]謝謝你願意老實說。\n沒關係，我們就從這裡開始，慢慢聊。'] }
    ],
    askTopic: '[好奇]最近有沒有什麼事，一直掛在心上呢？',
    topicFree: ['[傾聽]「{TYPE}」……嗯，我聽到了。'],
    subFree: ['[傾聽]「{TYPE}」……嗯，我記住了。'],
    intro: [
      '[思考]跟你說，我做甜點的時候，很喜歡用天然的色粉。\n草莓粉、抹茶粉、蝶豆花……每一種都是食物做的顏色。',
      '[害羞]我覺得心情好像也有顏色。\n像我今天，大概是焦糖色吧……一直在小火上煮著，靜不下來。',
      '[好奇]那今天的你，是什麼顏色呢？'
    ],
    pick: '[微笑]點一下色粉罐，就會撒進鮮奶油裡。\n最多選三種，第一個選的，會是最多的顏色喔。',
    full: '[慌張]啊，碗快裝不下了！\n最多三種喔，可以點一下已經選的，把它拿掉。',
    empty: '[好奇]還沒有選顏色喔，\n點一下最像你現在心情的色粉罐吧。',
    reflect: '[傾聽]你的鮮奶油裡，有{COLORS}……',
    main:    '[心疼]最多的是{MAINCN}的「{MAIN}」。\n心裡裝著這些顏色，一定不輕鬆吧。',
    named:   '[明白]不過你看，顏色被說出名字之後，\n就看得清清楚楚了。',
    brave:   '[溫柔]能看見自己是什麼顏色，已經很了不起了喔。'
  },

  /* ② 包裝檯：知道在煩什麼、釐清它（像觀察家一樣慢慢看） */
  bench: {
    hello: [
      '[微笑]我把剛剛那碗鮮奶油端過來了。',
      '[驚訝]欸？你看，碗裡還有一小團{MAINCN}，\n怎麼拌都拌不開……',
      '[好奇]心裡有時候，也會有一團拌不開的東西。\n我們來看看它是什麼吧。'
    ],
    askCore: '[好奇]在「{TYPE}」這件事裡，\n那一團拌不開的，是哪一個呢？',
    coreFree: ['[傾聽]「{CORE}」……嗯。'],
    coreSay: '[明白]原來拌不開的那一團，是「{CORE}」。\n謝謝你，願意看得這麼仔細。',
    tangle: [
      '[慌張]啊啊啊，等一下！\n包甜點用的緞帶，又被我弄得纏成一團了……',
      '[思考]煩惱也是這樣——\n一個想法纏著另一個想法，越拉越緊。'
    ],
    demoKnot: '客人剩了半塊蛋糕 → 一定是我做得很難吃',
    demo:  '[害羞]這是我昨天的結……',
    demo2: '[思考]客人剩下半塊，是真的發生的事。\n可是「我做得很難吃」，是我自己纏上去的。',
    demoTo: '也許只是吃飽了',
    demo3: '[開心]所以我換個說法——\n你看，鬆開之後，就變成蝴蝶結了！',
    pick:  '[好奇]換你看看。這些結裡，有沒有哪一個也纏在你心裡？\n點點看那個結。',
    more:  '[好奇]還有別的結也纏著你嗎？',
    customAsk: '[好奇]你心裡的那個結，寫的是什麼呢？',
    real: '[思考]我們一起看看這個結——\n「{KNOT}」，這是真的發生了，還是心裡擔心會發生的呢？',
    realSay: {
      fact:   ['[傾聽]嗯，是真的發生了，難怪你會這麼在意。', '[思考]可是發生了這件事，\n不代表後面想像的那些，也一定會成真喔。'],
      worry:  ['[明白]原來是心裡擔心的。', '[溫柔]擔心很正常，可是它現在還沒有發生喔。'],
      unsure: ['[傾聽]分不清楚也沒關係。', '[思考]很多時候，事情和想像本來就纏在一起，\n就像這團緞帶一樣。']
    },
    rewrite: '[微笑]那我們試著換個說法？\n選一個你比較願意相信的就好。',
    customRewrite: '[好奇]如果換個溫柔一點的說法，你會怎麼對自己說呢？',
    untied: ['[開心]解開了！是個漂亮的蝴蝶結♡', '[明白]你看，鬆開之後，它就沒那麼緊了。', '[開心]又一個蝴蝶結！你越來越會解了耶。'],
    done: [
      '[溫柔]煩惱還在，可是結鬆開之後，\n它就不會越纏越緊了。',
      '[驚訝]啊，你看碗裡——\n那一團{MAINCN}，也拌開了！',
      '[明白]好，我們把這碗鮮奶油帶去廚房吧！'
    ]
  },

  /* ③ 廚房：和煩惱和解（像朋友邀請你一起做甜點；每種甜點自己的台詞在下面的 DESSERTS） */
  bake: {
    invite: ['[幹勁]聊了這麼多，我想替你做一份特別的甜點。'],
    inviteAsk: '[害羞]不過這次……\n我想邀請你跟我一起做，好不好？',
    inviteOpts: [
      { t: '好呀',             re: ['[開心]太好了！那我們開始吧♡'] },
      { t: '可是我不太會做',   re: ['[開心]沒關係！我也常常失敗，還烤焦過好幾次呢。', '[微笑]我們一起慢慢來就好。'] }
    ],
    breatheHow: '\n按住右邊的按鈕慢慢吸氣，圈圈滿了就放開，慢慢吐氣。',
    sweetAsk: '[好奇]最後，要加哪一種甜呢？\n現在的你，最想要的是……',
    sweets: [
      { t: '有人懂我',     id: 'honey', sweet: '蜂蜜',   re: ['[溫柔]那就淋上蜂蜜，\n慢慢地、暖暖地化開。'] },
      { t: '好好休息一下', id: 'cream', sweet: '鮮奶油', re: ['[微笑]那就擠一團軟綿綿的鮮奶油，\n讓心躺下來休息一下。'] },
      { t: '多一點勇氣',   id: 'candy', sweet: '跳跳糖', re: ['[幹勁]那就撒一點跳跳糖！\n啪滋啪滋，幫你打打氣！'] }
    ],
    sweetFree: ['[傾聽]「{NEED}」……好，我把它化成糖，撒上去。'],
    soften: ['[驚訝]欸，你看！', '[溫柔]加了{SWEET}之後，顏色都變得柔柔的了。\n煩惱沒有不見，只是變得溫柔一點了。'],
    askCard: '[好奇]做好之前，要不要寫一句話給自己？\n想對自己說的、想說給誰聽的都可以。',
    cardPh: '例如：其實我已經很努力了…',
    cardSay: '[開心]嗯嗯，我收好了。',
    cardSkip: '[微笑]不寫也沒關係。',
    ding: ['[開心]完成了！\n這是用你今天的心情做的「{DESSERT}」♡'],
    eat: '[微笑]快嚐嚐看吧！\n點甜點，或按下面的湯匙。',
    bites: [   // 每吃一口說一句（最後一句 = 吃光光）
      '[好奇]第一口……是甜的吧？\n那是你加的「{SWEET}」。',
      '[傾聽]這一口有{MAINCN}，\n是你的「{MAIN}」。',
      '[溫柔]它還在，沒有消失——\n可是加了甜之後，就變成吃得下去的味道了。',
      '[開心]吃光光了！\n這就是和煩惱和好的味道喔♡'
    ]
  },

  /* ④ 茶桌：收好 */
  table: {
    hello: ['[微笑]來，回到茶桌這邊。\n茶已經泡好了，慢慢喝。'],
    feelAsk: '[好奇]現在的心情，\n跟剛來的時候，有沒有一點點不一樣？',
    feelOpts: [
      { t: '好像輕一點了', re: ['[開心]真的嗎！那我今天的甜點做得很成功耶♡'] },
      { t: '還是有點重',   re: ['[傾聽]嗯，這樣也沒關係。', '[溫柔]煩惱不會一次就變輕，\n願意停下來看看它，就已經很好了。'] },
      { t: '說不上來',     re: ['[微笑]說不上來也沒關係，\n慢慢來就好。'] }
    ],
    nextAsk: '[好奇]再問你一個問題——\n下次這種顏色又出現的時候，你想先做哪件事？',
    nextOpts: [
      { t: '先深呼吸，等它慢慢好', memo: '先深呼吸，等心慢慢平靜',   re: ['[溫柔]嗯！吸——吐——，你已經會了。'] },
      { t: '分清楚是真的，還是擔心', memo: '分清楚是真的發生，還是擔心', re: ['[明白]對！先看看那是真的發生，還是纏上去的結。'] },
      { t: '給自己一點甜，休息一下', memo: '給自己一點甜，休息一下',   re: ['[開心]好主意！\n我的廚房隨時歡迎你♡'] }
    ],
    nextFree: ['[傾聽]「{NEXT}」……好，我幫你寫進紙條裡。'],
    fortune: '[開心]對了，還有這個——\n茶會的最後，每個人都會拿到一個幸運餅乾。\n點一下，把它掰開看看吧？',
    memo: '[微笑]裡面是今天的小紙條，\n寫著你一路整理好的東西。',
    fold: '[微笑]把它折起來吧——\n點一下小紙條。',
    tie:  '[幹勁]再用緞帶綁起來！\n拉著蝴蝶結，從左邊拉到右邊～',
    tied: '[溫柔]綁好了♡\n煩惱沒有消失，只是被你好好地收起來了。',
    ending: ['[溫柔]有些煩惱不會因為一次聊天就消失，\n但願意停下來理解自己的心情，就是很重要的一步。'],
    final: '[好奇]最後，要把這張小紙條擺上煩惱牆嗎？\n別人看到，就會知道不是只有自己這樣。（會拿掉你的名字）',
    posting: '[幹勁]好～幫你擺上去囉……',
    postFail: '[慌張]欸……好像擺不上去，等一下再試試看吧。',
    bye: '[微笑]那就收進口袋吧。\n累了隨時回來，我會幫你留一個位子♡'
  }
};

// 最近發生的事（色粉櫃）：dessert = 做哪一種甜點（DESSERTS）；re = 選了之後 Rabumi 的回應
// cores = 到包裝檯時問「拌不開的那一團是哪一個」的選項，每個也有自己的回應
const TOPICS = [
  { id: 'people', t: '和別人之間的事', dessert: 'crepe', ask: '[好奇]是跟誰之間的事呢？',
    re: ['[驚訝]欸……是人和人之間的事嗎？', '[害羞]其實我也很容易為這種事想很多耶。'],
    subs: [
      { id: 'family', t: '家人', memo: '和家人之間的事', re: ['[傾聽]家人啊……\n越親近的人，有時候越說不出口呢。'],
        cores: [
          { t: '覺得他們不懂我', memo: '家人不懂我真正的想法', re: ['[心疼]明明是最親近的人，卻好像隔著一層玻璃……', '[思考]我猜，你其實很想被好好聽完一次吧。'] },
          { t: '怕讓他們失望', memo: '害怕讓家人失望', re: ['[傾聽]怕讓家人失望……', '[好奇]我有點好奇，你是不是常常把他們的期待，\n放在自己的想法前面呢？'] },
          { t: '常常吵架、說不上話', memo: '和家人常常吵架、說不上話', re: ['[心疼]吵完架之後，家裡的空氣一定很沉吧。', '[思考]明明都在乎彼此，卻總是說成刺人的話……'] } ] },
      { id: 'friend', t: '朋友', memo: '和朋友之間的事', re: ['[傾聽]朋友呀……\n越在乎，就越容易想東想西呢。'],
        cores: [
          { t: '怕自己被冷落、被排擠', re: ['[驚訝]欸……那種被留在外面的感覺，真的好難受。', '[害羞]我也是，看到大家聊天沒叫我，\n就會一直想是不是我做錯了什麼。'] },
          { t: '不知道對方是不是在生氣', memo: '擔心朋友是不是在生我的氣', re: ['[慌張]啊啊，這個我超懂！\n訊息回得短一點，就開始想一百種可能……', '[傾聽]猜不到答案的時候，心最懸了。'] },
          { t: '總是我在配合別人', memo: '總是自己在配合別人', re: ['[心疼]一直配合別人，自己的心情就被擠到最角落了吧。', '[思考]我猜，你是不是很怕一說「不要」，就會被討厭？'] } ] },
      { id: 'peer', t: '同學、同事', memo: '和同學、同事之間的事', re: ['[思考]同學、同事……\n每天都要見面，躲也躲不掉呢。'],
        cores: [
          { t: '融入不了大家', memo: '融入不了團體', re: ['[傾聽]大家都在笑，只有自己不知道該站在哪裡……', '[心疼]那種感覺，比一個人待著還孤單呢。'] },
          { t: '很在意別人怎麼看我', re: ['[害羞]這個……我也是耶。', '[思考]別人一個眼神，就能在心裡轉好久對吧。'] },
          { t: '意見不合、不敢說出來', memo: '合作時意見不合，不敢表達', re: ['[思考]想說又不敢說，話就一直卡在喉嚨……', '[傾聽]是不是怕一開口，氣氛就會變僵？'] } ] },
      { id: 'lover', t: '情侶', memo: '和另一半之間的事', re: ['[害羞]另一半的事……\n那是心裡最軟的地方吧。'],
        cores: [
          { t: '覺得自己不被重視', re: ['[心疼]在最在乎的人那裡，覺得自己不重要……\n一定很委屈。'] },
          { t: '常常吵架或冷戰', re: ['[傾聽]冷戰的時候，安靜得好吵喔。', '[心疼]明明在同一個地方，卻好像離很遠。'] },
          { t: '擔心感情會走不下去', memo: '擔心這段感情會走不下去', re: ['[思考]還沒發生的結局，\n有時候比真的發生還讓人害怕呢。'] } ] },
      { id: 'crush', t: '曖昧對象', memo: '和曖昧對象之間的事', re: ['[慌張]曖昧的時候最難熬了！\n每一則訊息都要想好久對不對！'],
        cores: [
          { t: '不知道對方怎麼想', memo: '猜不透對方的想法', re: ['[慌張]猜猜猜，猜到半夜都睡不著……', '[傾聽]不確定的感覺，最磨人了。'] },
          { t: '怕說出口連朋友都當不成', memo: '怕告白後連朋友都當不成', re: ['[思考]想靠近，又怕一靠近就全部失去……', '[心疼]這種兩難，心一定揪得好緊。'] },
          { t: '對方忽冷忽熱', memo: '對方忽冷忽熱，讓人好不安', re: ['[心疼]一下暖、一下冷，\n心情就像被丟進冰塊又撈出來。', '[害羞]……我最怕冰塊了。'] } ] }
    ] },
  { id: 'self', t: '對自己沒有信心', dessert: 'pudding', ask: '[好奇]是哪一種感覺比較多呢？',
    re: ['[心疼]對自己沒信心的時候……\n連泡一杯茶，都會覺得自己泡不好呢。'],
    subs: [
      { id: 'doubt', t: '常常懷疑自己做不到', memo: '自我懷疑', re: ['[心疼]常常懷疑自己……\n那一定很累吧，每件事都要先跟自己吵一架。'],
        cores: [
          { t: '怕自己的決定是錯的', memo: '害怕自己做錯決定', re: ['[思考]每個決定都要想好多遍，\n是因為很怕選錯吧。'] },
          { t: '覺得自己的能力不夠', re: ['[傾聽]覺得自己的能力不夠……', '[好奇]我有點好奇，那是你真的做不到，\n還是你對自己特別嚴格呢？'] },
          { t: '被稱讚也不太相信', memo: '被稱讚的時候也不太相信', re: ['[驚訝]欸？被稱讚也不相信嗎？', '[心疼]那些好話，都被你擋在門外了呢。'] } ] },
      { id: 'inferior', t: '覺得自己比不上別人', memo: '自卑', re: ['[傾聽]比來比去的時候，\n好像怎麼樣都不夠呢。'],
        cores: [
          { t: '外表、身材', memo: '在意自己的外表和身材', re: ['[傾聽]一直盯著自己不喜歡的地方，\n就會越看越大呢。'] },
          { t: '成績、表現、成就', memo: '覺得自己的表現比不上別人', re: ['[思考]拿自己的全部，去比別人最亮的那一面……\n當然會覺得輸呀。'] },
          { t: '人緣、生活過得好不好', memo: '覺得別人的生活都過得比自己好', re: ['[心疼]看著別人好像都過得好好的，\n自己就更難受了吧。'] } ] }
    ] },
  { id: 'study', t: '課業、未來', dessert: 'pancake', ask: '[好奇]是哪一種壓力呢？',
    re: ['[驚訝]課業和未來……光聽就覺得好重！'],
    subs: [
      { id: 'study', t: '考試、作業、成績', memo: '課業焦慮', re: ['[慌張]考試、作業、成績……\n光聽我就想躲進烤箱裡了！'],
        cores: [
          { t: '書念不完、進度跟不上', re: ['[驚訝]天啊，感覺事情都堆成一座小山了……', '[心疼]你是不是連休息的時候，\n都還在想著那些沒做完的事？'] },
          { t: '怕成績不好讓人失望', memo: '害怕成績不好讓家人失望', re: ['[傾聽]怕讓人失望……', '[思考]我猜你在意的不只是分數，\n而是那些看著你的眼睛吧。'] },
          { t: '很努力了還是考不好', memo: '很努力了，成績還是不如預期', re: ['[心疼]努力了卻沒有回報……\n那種委屈，最說不出口了。'] } ] },
      { id: 'future', t: '畢業、升學、未來方向', memo: '畢業與未來迷茫', re: ['[思考]未來的事……\n看不清楚的時候，最讓人心慌了。'],
        cores: [
          { t: '不知道自己想做什麼', re: ['[思考]不知道自己想做什麼……', '[微笑]偷偷跟你說，很多大人也都還在找喔。'] },
          { t: '怕選錯科系或方向', memo: '害怕選錯科系或方向', re: ['[傾聽]會怕選錯，\n是因為你很認真看待自己的人生呢。'] },
          { t: '看到別人都有目標就好慌', memo: '看到別人都有目標，覺得自己落後', re: ['[慌張]看大家都在往前跑，自己好像站在原地……', '[心疼]那種慌，真的很難受。'] } ] }
    ] }
];
const FREE_TOPIC = { id: 'free', dessert: 'crepe' };   // 自己打字的煩惱：做可麗餅
const FREE_CORES = [
  { t: '別人怎麼看我',         re: ['[害羞]這個……我也常常在意耶。'] },
  { t: '我是不是不夠好',       re: ['[心疼]一直問自己夠不夠好，\n心一定很累吧。'] },
  { t: '事情會不會變得更糟',   re: ['[思考]還沒發生的事，\n有時候最讓人害怕呢。'] }
];

// 心情色粉（色粉櫃）：name = 心情、src = 色粉是什麼做的、cn = 顏色的名字、col = 顏色（'marble' = 大理石混色）、say = 選了之後 Rabumi 說的話
const FEELS = [
  { name: '難過',     src: '竹炭',   cn: '竹炭灰',         col: '#ADA9B4', say: '[心疼]灰灰的竹炭粉……\n難過的時候，好像什麼顏色都淡掉了。' },
  { name: '焦慮',     src: '焦糖',   cn: '焦糖色',         col: '#C98F5A', say: '[思考]焦糖色……焦慮的「焦」。\n心裡是不是一直在小火上煮著？' },
  { name: '煩躁',     src: '南瓜',   cn: '南瓜橘',         col: '#F2A93B', say: '[驚訝]橘黃色的南瓜粉！\n煩躁的時候，心裡好像一直有東西在冒泡。' },
  { name: '委屈',     src: '草莓',   cn: '草莓粉',         col: '#F4A3B8', say: '[心疼]粉粉的草莓粉……\n委屈的時候，眼眶也會紅紅的吧。' },
  { name: '生氣',     src: '覆盆子', cn: '覆盆子紅',       col: '#E0525F', say: '[傾聽]紅紅的覆盆子……\n生氣也是一種在乎喔，不用覺得自己不好。' },
  { name: '好累',     src: '薰衣草', cn: '薰衣草紫',       col: '#CDA6DE', say: '[溫柔]淡紫色的薰衣草，\n是讓人想好好睡一覺的顏色。' },
  { name: '孤單',     src: '蝶豆花', cn: '蝶豆花藍',       col: '#7FA8E0', say: '[心疼]藍藍的蝶豆花……\n一個人的時候，心裡是不是也有點涼涼的？' },
  { name: '忌妒',     src: '抹茶',   cn: '抹茶綠',         col: '#8DB86B', say: '[害羞]綠色的抹茶粉……\n偷偷跟你說，英文說忌妒，就叫「green with envy」喔。' },
  { name: '五味雜陳', src: '大理石', cn: '大理石紋',       col: 'marble',  say: '[思考]什麼顏色都有一點……\n說不清楚也沒關係，五味雜陳本來就是這樣。' }
];
const MARBLE = ['#F4A3B8', '#F2A93B', '#7FA8E0', '#8DB86B', '#CDA6DE'];   // 大理石紋用的顏色
const MAX_COLORS = 3;   // 最多選幾種顏色

// 纏住的緞帶（包裝檯）：t = 結上寫的想法、re = 可以換成的說法
const KNOTS = {
  people: [
    { t: '大家一定都討厭我', re: ['有人沒回應，不代表討厭我', '我不用讓每個人都喜歡我'] },
    { t: '一定是我做錯了什麼', re: ['事情卡卡的，不一定都是我的錯', '就算我有做不好的地方，也可以慢慢修補'] },
    { t: '說出來，關係就會壞掉', re: ['好好說出感受，也是在照顧這段關係', '我可以挑一個比較放鬆的時候說說看'] }
  ],
  self: [
    { t: '我什麼都做不好', re: ['我有做不好的事，也有做得到的事', '「還沒做好」不等於「做不好」'] },
    { t: '大家都比我好', re: ['我看到的是別人的精華，不是全部', '我只需要跟昨天的自己比'] },
    { t: '被稱讚一定只是客套', re: ['也許對方是真心的，我可以先說聲謝謝', '我值得被好好稱讚'] }
  ],
  study: [
    { t: '考不好，人生就完了', re: ['一次考試，只是很長的路上的一小段', '考不好，代表我知道下次要加強哪裡'] },
    { t: '我一定會讓大家失望', re: ['我已經很努力了，這件事本身就很重要', '在乎我的人，在乎的是我，不只是分數'] },
    { t: '別人都知道自己要什麼，只有我不知道', re: ['還在找方向，代表我還在認識自己', '每個人的步調本來就不一樣'] }
  ],
  free: [
    { t: '事情一定會變得更糟', re: ['現在還沒發生，我可以先顧好眼前', '就算變糟，我也撐過很多事了'] },
    { t: '都是我不好', re: ['事情發生，通常不只一個原因', '我可以負責我的部分，不用扛下全部'] },
    { t: '我只能一個人撐', re: ['我可以找一個人分擔一點點', '說出來，不代表我很弱'] }
  ]
};

// 三種甜點（廚房）：哪一種煩惱做哪一種，看上面 TOPICS 的 dessert
// intro = 為什麼是這個甜點、color = 把鮮奶油加進去、breathe = 呼吸等它做好、formed = 做好了、act = 最後一步的按鈕、acted = 做完最後一步、desc = 甜點的意思
const DESSERTS = {
  pancake: {   // 學業：堆疊、壓縮、塌陷、膨脹、溫熱
    name: '舒芙蕾鬆餅',
    intro: ['[思考]你的煩惱，讓我想到舒芙蕾鬆餅。', '[傾聽]事情一件一件疊上來，疊得太高，就會塌下去……\n就像現在這片扁扁的鬆餅。'],
    color: '[微笑]這碗有顏色的鮮奶油，\n等一下要夾在鬆餅中間。',
    breathe: '[微笑]鬆餅要用小火慢慢等，才會膨起來。',
    formed: '[開心]你看，每吸一口氣，鬆餅就膨起來一層！',
    actAsk: '[好奇]按按看鬆餅？', act: '👆 按一下鬆餅',
    acted: ['[驚訝]壓下去了……', '[開心]又彈回來了！\n被壓著的時候，也可以像這樣，慢慢彈回來喔。'],
    desc: '[溫柔]蓬蓬的舒芙蕾鬆餅，要小火慢慢煎才好吃。\n努力也是，不用一次做完全部。'
  },
  crepe: {     // 人際：捲起來、包住、分不開，熱餅皮包冰淇淋＝忽冷忽熱
    name: '可麗餅',
    intro: ['[思考]你的煩惱，讓我想到原宿的可麗餅。', '[傾聽]好多人、好多事，全部捲在一起，\n分也分不開……'],
    color: '[微笑]我們用這碗鮮奶油做成冰淇淋，\n一球一球放在餅皮上。',
    breathe: '[微笑]餅皮要用小火，慢慢煎到金黃色。',
    formed: '[開心]餅皮煎得金金黃黃的了！',
    actAsk: '[好奇]最後，把它捲起來吧？', act: '🌀 捲起來',
    acted: ['[開心]捲好了！', '[溫柔]熱熱的餅皮，包著冰冰的冰淇淋……\n關係也是，一冷一熱都沒關係，有好好包住就好。'],
    desc: '[溫柔]可麗餅把好多東西捲在一起，\n每一口吃到的都不一樣，就像身邊每一個不一樣的人。'
  },
  pudding: {   // 自我：晃動、凝固、Q彈、冰涼，倒出來歪歪的也沒關係
    name: '布丁',
    intro: ['[思考]你的煩惱，讓我想到喫茶店的布丁。', '[傾聽]軟軟的、晃來晃去，\n很怕自己不夠好看……'],
    color: '[微笑]把這碗鮮奶油拌進布丁液裡，\n倒進杯子。',
    breathe: '[微笑]布丁要慢慢等它凝固。',
    formed: '[開心]布丁凝固了，不晃了！',
    actAsk: '[好奇]最緊張的時候到了——\n把布丁倒扣到盤子上吧？', act: '🍮 倒出來',
    acted: ['[驚訝]啵！', '[開心]出來了！有一點點歪歪的……', '[溫柔]歪歪的也沒關係，\n它還是好好地站著喔。'],
    desc: '[溫柔]晃來晃去的布丁，其實很有彈性。\n不完美的地方，也是你的一部分喔。'
  }
};
// 沒接 AI 或 AI 壞掉時，用這些寫好的話
const PRESET = {
  comfort: '{NAME}，你的鮮奶油裡有「{FEEL}」的顏色，一點都不奇怪喔。\n因為你很在乎，所以才會這麼放在心上。',
  advice:  '下次心裡又亂成一團的時候，先深呼吸，再分清楚「真的發生的事」和「心裡纏上去的結」。\n不管怎麼樣，我的廚房永遠幫你留一個位子♡'
};
// 玩家打的字裡有這些詞，就馬上溫柔地提醒求助資訊
const CRISIS_WORDS = ['想死', '去死', '自殺', '不想活', '活不下去', '傷害自己', '割腕', '結束生命', '消失就好'];
const CRISIS_REPLY = '[擔心]{NAME}……謝謝你願意把這麼重的話說出來。\n你現在的感受很重要，請不要一個人撐著——現在就找一個信任的人陪著你，或打 1925 安心專線、1995 生命線（24 小時），會有人好好聽你說。';
const CRISIS_AGAIN = '{NAME}，甜點快好了，我想再跟你說一次：\n你不用一個人撐著。1925 和 1995 都 24 小時有人在，我也會一直在這裡等你回來。';   // 說過求助資訊之後，做甜點時的話

const TYPE_SPEED = 38;   // 打字速度：每個字幾毫秒
const BREATHS = 3;       // 要跟著呼吸幾次
const INHALE = 3000;     // 吸氣要按住幾毫秒
const EXHALE = 4000;     // 吐氣幾毫秒
const AI_URL = 'https://tea-time.spcp94523.workers.dev';
const WALL_URL = AI_URL + '/wall';
/* ===== 設定到這裡為止，下面是程式 ===== */

const $ = id => document.getElementById(id);
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ---------- 0. 畫好的圖：有放進資料夾就用，沒有就用程式畫的 ---------- */
const ART = {};
function probe(key, url){ const im = new Image(); im.onload = () => { ART[key] = url; }; im.src = url; }
['pancake', 'crepe', 'pudding'].forEach(t => { probe(t + '-line', `img/desserts/${t}-line.png`); probe(t + '-fill', `img/desserts/${t}-fill.png`); });
['pancake-flat', 'crepe-open', 'pudding-cup', 'honey', 'cream', 'candy'].forEach(k => probe(k, `img/desserts/${k}.png`));
['fortune', 'fortune-open', 'teacup'].forEach(k => probe(k, `img/house/${k}.png`));
const jarProbe = new Image();   // 色粉罐有畫好的圖：換成圖（style.css 的 .has-jar-img）
jarProbe.onload = () => document.body.classList.add('has-jar-img');
jarProbe.src = 'img/house/jar-line.png';

/* ---------- 1. 玩家名字、今天整理的內容 ---------- */
const params = new URLSearchParams(location.search);
let playerName = params.get('n') || '';
if (!playerName) { try { playerName = sessionStorage.getItem('teaName') || ''; } catch (_) {} }
const savedName = playerName;   // 之前說過的名字：問名字時先幫忙填好
let nameQ = '';
function setName(v){
  playerName = v || DEFAULT_NAME;
  nameQ = v ? '&n=' + encodeURIComponent(v) : '';
  if (v) { try { sessionStorage.setItem('teaName', v); } catch (_) {} }   // 其他頁面也叫得出名字
}
setName(savedName);

const memo = { topic: FREE_TOPIC, sub: null, type: '', core: '', feels: [], feel: '', colors: '', main: null,
               knots: [], sweet: null, words: '', next: '' };
const extra = {};   // {KNOT}、{DESSERT}、{X} 這種只用一下的
function fill(s){
  const m = memo.main;
  return s.replaceAll('{NAME}', playerName).replaceAll('{TYPE}', memo.type).replaceAll('{CORE}', memo.core)
          .replaceAll('{FEEL}', m ? m.name : '').replaceAll('{MAIN}', m ? m.name : '').replaceAll('{MAINCN}', m ? m.cn : '')
          .replaceAll('{COLORS}', memo.colors).replaceAll('{KNOT}', extra.knot || '')
          .replaceAll('{SWEET}', memo.sweet ? memo.sweet.sweet : '').replaceAll('{NEED}', memo.sweet ? memo.sweet.t : '')
          .replaceAll('{DESSERT}', extra.dessert || '').replaceAll('{X}', extra.x || '').replaceAll('{NEXT}', memo.next);
}

/* ---------- 2. 誰在說話、表情：換頭像、房間裡的圖，Rabumi 頭上跳出漫畫符號 ---------- */
const avatar = $('avatarImg'), host = document.querySelector('.dh-host');
let speaker = 'maid', face = '';
function setSpeaker(who){
  speaker = who; face = '';
  const S = SPEAKERS[who];
  document.body.style.setProperty('--pc-light', S.light);
  document.body.style.setProperty('--pc-main', S.main);
  $('chatName').textContent = S.name;
}
const faceOk = {};   // 這張表情圖畫好了沒（有放進 img/rabumi/ 就會用）
Object.values(FACES).forEach(f => { const im = new Image(); im.onload = () => { faceOk[f.img] = true; }; im.src = FACE_DIR + f.img + '.png'; });
document.querySelectorAll('.dh-chara').forEach(c => { const m = document.createElement('span'); m.className = 'dh-mark'; m.setAttribute('aria-hidden', 'true'); c.appendChild(m); });
function setFace(name){
  $('faceTag').textContent = SHOW_FACE_TAG ? '［' + name + '］' : '';
  if (speaker === 'maid'){ avatar.src = host.querySelector('img').src = MAID_FACES[name] || SPEAKERS.maid.img; return; }
  const f = FACES[name] || FACES.微笑;
  const src = faceOk[f.img] ? FACE_DIR + f.img + '.png' : SPEAKERS.rabumi.img;
  avatar.src = src;
  document.querySelectorAll('.dh-chara img').forEach(im => { im.src = src; });
  if (name === face) return;
  face = name;
  const m = document.querySelector('.dh-room.on .dh-mark');
  if (!m || !f.mark) return;
  m.textContent = f.mark;
  m.classList.toggle('shy', name === '害羞');
  m.classList.remove('pop'); void m.offsetWidth; m.classList.add('pop');
  clearTimeout(m.hideT); m.hideT = setTimeout(() => m.classList.remove('pop'), 1800);
}
// '[好奇]你是不是……' → ['好奇', '你是不是……']
function splitFace(s){ const m = s.match(/^\[(.+?)\]/); return m ? [m[1], s.slice(m[0].length)] : [speaker === 'maid' ? '一般' : '微笑', s]; }

/* ---------- 3. 對話框：一個字一個字打出來、選項、打字框 ---------- */
const box = $('chatBox'), textEl = $('chatText'), nextBtn = $('chatNext'), panel = $('chatChoices');
let typing = null, finishTyping = null, waitNext = null;

function type(text){
  return new Promise(done => {
    if (typing){ clearInterval(typing); typing = null; finishTyping = null; }   // 上一句還在打：直接換成這句
    const [f, line] = splitFace(text);
    const full = fill(line);
    setFace(f);
    box.classList.remove('next'); void box.offsetWidth; box.classList.add('next');
    const who = speaker === 'maid' ? host : document.querySelector('.dh-room.on .dh-chara');   // 說話的人跳一下
    if (who){ who.classList.remove('talk'); void who.offsetWidth; who.classList.add('talk'); }
    nextBtn.hidden = true;
    textEl.classList.remove('thinking');
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
async function sayAll(list){ for (const l of [].concat(list || [])) await say(l); }
function advance(){
  if (finishTyping) return finishTyping();
  if (waitNext){ const w = waitNext; waitNext = null; nextBtn.hidden = true; w(); }
}
box.addEventListener('click', advance);
addEventListener('keydown', e => {
  if ((e.key === ' ' || e.key === 'Enter') && !e.target.closest('button, a, input, textarea')){ e.preventDefault(); advance(); }
});
function thinking(){ setFace('思考'); nextBtn.hidden = true; textEl.textContent = '……'; textEl.classList.add('thinking'); }

function clearPanel(){ panel.classList.remove('show', 'many', 'input'); panel.innerHTML = ''; }
function button(text, cls, i){
  const b = document.createElement('button');
  b.type = 'button'; b.className = cls; b.textContent = text; b.style.setProperty('--i', i);
  return b;
}
// 只出幾個按鈕（不問問題）：[{ t, on, free }]，free = 白色那種次要按鈕
function panelButtons(list){
  clearPanel();
  list.forEach((o, i) => {
    const b = button(o.t, 'chat-choice' + (o.free ? ' chat-choice-free' : ''), i);
    b.addEventListener('click', o.on);
    panel.appendChild(b);
  });
  requestAnimationFrame(() => panel.classList.add('show'));
}
// 問一個問題 + 出選項；freeLabel = 最後的「自己說」按鈕（null = 不要）；回傳 { ...選項, memo, free }
async function ask(question, options, freeLabel = '✎ 都不是，我想自己說'){
  await type(question);
  return new Promise(done => {
    const show = () => {
      clearPanel();
      options.forEach((o, i) => {
        const b = button(o.t, 'chat-choice', i);
        b.addEventListener('click', () => { clearPanel(); done({ ...o, memo: o.memo || o.t, free: false }); });
        panel.appendChild(b);
      });
      if (freeLabel){
        const f = button(freeLabel, 'chat-choice chat-choice-free', options.length);
        f.addEventListener('click', () => inputPanel({ placeholder: '用自己的話說說看…', send: '告訴你', back: '← 回到選項', single: true },
          v => v === null ? show() : done({ t: v, memo: v, id: 'free', free: true })));
        panel.appendChild(f);
      }
      panel.classList.toggle('many', options.length > 3);
      requestAnimationFrame(() => panel.classList.add('show'));
    };
    show();
  });
}
// 選完之後 Rabumi 先回應：選項有 re 就說 re；自己打字的就說 freeLines（沒給就用 LINES.free）
async function react(a, freeLines){
  extra.x = a.free ? a.t : '';
  if (a.free && await checkCrisis(a.t)) return;
  await sayAll(a.free ? (freeLines || LINES.free) : a.re);
}
// 打字框：按送出回傳打的字；按 back 回傳 null（single）或 ''
function inputPanel(o, cb){
  clearPanel();
  panel.classList.add('input');
  const field = document.createElement(o.single ? 'input' : 'textarea');
  field.className = 'chat-input'; field.placeholder = o.placeholder; field.maxLength = o.max || (o.single ? 40 : 200);
  if (o.value) field.value = o.value;
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
// 問一句、等玩家打字（single = 一行；back 按了回傳 ''；more = 其他設定，例如 value 先填好的字、max 最多幾個字）
function askInput(question, placeholder, single = true, back = '先跳過', more = {}){
  return type(question).then(() => new Promise(done =>
    inputPanel({ placeholder, send: single ? '好了' : '送出 ♡', back, single, ...more }, v => done(v || ''))));
}

// 玩家打的字裡有危險的詞：馬上停下來，先給求助資訊（之後不會貼到煩惱牆，也不會叫 AI）
let crisis = false;
const isCrisis = t => CRISIS_WORDS.some(w => (t || '').includes(w));
async function checkCrisis(t){
  if (!isCrisis(t)) return false;
  if (!crisis){ crisis = true; await say(CRISIS_REPLY); }
  return true;
}

/* ---------- 4. 鏡頭：先看整間娃娃屋，再一間一間拉近 ---------- */
const house = $('house');
const ROOM_AT = { color: [0, 0], bench: [1, 0], bake: [1, 1], table: [0, 1] };   // [第幾欄, 第幾列]
const ROOF = .4;   // 屋頂高度 = 房間高度的幾倍（和 style.css 的 .dh-roof 一樣）
let where = 'all';
const navH = () => document.querySelector('.nav-lace').getBoundingClientRect().height;
function layout(){
  const W = innerWidth, H = innerHeight;
  document.body.style.setProperty('--rw', W + 'px');
  document.body.style.setProperty('--rh', H + 'px');
  let s = 1, tx, ty;
  if (where === 'all'){
    const top = navH() + 30, bottom = box.getBoundingClientRect().top - 16;
    s = Math.min(.45, (bottom - top) / ((2 + ROOF) * H), W * .9 / (2 * W));
    tx = (W - 2 * W * s) / 2;
    ty = top + ROOF * H * s + Math.max(0, (bottom - top) - (2 + ROOF) * H * s) / 2;
  } else {
    const [c, r] = ROOM_AT[where];
    tx = -c * W; ty = -r * H;
  }
  house.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
}
function view(w){
  where = w;
  document.querySelectorAll('.dh-room').forEach(r => r.classList.toggle('on', r.dataset.room === w));
  layout();
  return wait(1700);
}
addEventListener('resize', () => { house.style.transition = 'none'; layout(); void house.offsetWidth; house.style.transition = ''; });

/* ---------- 5. 緞帶：從 doily 垂下來，滑鼠撥過去會晃；有蝴蝶結的那條往下拉 = 去下一個房間 ---------- */
const NS = 'http://www.w3.org/2000/svg';
const ribbonSvg = $('ribbons'), pullBtn = $('pull'), pullHint = $('pullHint');
const pointer = { x: -999, y: -999, vx: 0, vy: 0 };
addEventListener('pointermove', e => {
  if (pointer.x > -900){ pointer.vx += e.clientX - pointer.x; pointer.vy += e.clientY - pointer.y; }
  pointer.x = e.clientX; pointer.y = e.clientY;
}, { passive: true });
function svg(tag, attrs, parent){
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  parent.appendChild(e);
  return e;
}
// 一條緞帶 = 一串小點，用簡單的物理（重力 + 每兩點距離固定）算形狀
class Ribbon{
  constructor({ at, len, w, col, handle }){
    Object.assign(this, { at, len, w, handle });
    this.n = 10; this.seg = len / this.n; this.charms = []; this.stretch = 0;
    this.pts = Array.from({ length: this.n + 1 }, () => ({ x: 0, y: 0, ox: 0, oy: 0 }));
    const g = svg('g', {}, ribbonSvg);
    g.style.setProperty('--col', col);
    this.tail = svg('path', { class: 'rb-tail' }, g);
    this.body = svg('path', { class: 'rb-body', 'stroke-width': w }, g);
    this.shine = svg('path', { class: 'rb-shine' }, g);
    this.charmG = svg('g', {}, g);
  }
  anchor(){ return [innerWidth * this.at(), navH() * .62]; }
  step(){
    const p = this.pts, [ax, ay] = this.anchor(), n = this.n;
    if (!this.placed){ p.forEach((q, i) => { q.x = q.ox = ax; q.y = q.oy = ay + i * this.seg; }); this.placed = true; }
    p[0].x = p[0].ox = ax; p[0].y = p[0].oy = ay;
    for (let i = 1; i <= n; i++){
      const q = p[i];
      const vx = (q.x - q.ox) * .96, vy = (q.y - q.oy) * .96;
      q.ox = q.x; q.oy = q.y;
      q.x += vx; q.y += vy + .4;   // .4 = 重力
      const dx = q.x - pointer.x, dy = q.y - pointer.y;
      if (!this.drag && dx * dx + dy * dy < 1600){ q.x += pointer.vx * .3; q.y += pointer.vy * .1; }   // 滑鼠撥過去
    }
    let seg = this.seg;
    if (this.drag){   // 抓著蝴蝶結：尾巴跟著滑鼠，最多拉長到 1.5 倍
      const e = p[n], max = this.len * 1.5;
      let dx = pointer.x - ax, dy = pointer.y - ay;
      const d = Math.hypot(dx, dy) || 1;
      if (d > max){ dx *= max / d; dy *= max / d; }
      e.x = e.ox = ax + dx; e.y = e.oy = ay + dy;
      seg = Math.max(this.seg, Math.min(d, max) / n);
      this.stretch = Math.min(d, max) - this.len;
    }
    for (let k = 0; k < 12; k++){
      for (let i = 0; i < n; i++){
        const a = p[i], b = p[i + 1];
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .001, diff = (d - seg) / d;
        const aFix = i === 0, bFix = this.drag && i + 1 === n;
        const fa = aFix ? 0 : bFix ? 1 : .5, fb = bFix ? 0 : aFix ? 1 : .5;
        a.x += dx * diff * fa; a.y += dy * diff * fa;
        b.x -= dx * diff * fb; b.y -= dy * diff * fb;
      }
    }
  }
  draw(){
    const p = this.pts, e = p[this.n], b = p[this.n - 1];
    let d = `M${p[0].x} ${p[0].y}`;
    for (let i = 1; i < this.n; i++) d += ` Q${p[i].x} ${p[i].y} ${(p[i].x + p[i + 1].x) / 2} ${(p[i].y + p[i + 1].y) / 2}`;
    d += ` L${e.x} ${e.y}`;
    this.body.setAttribute('d', d);
    this.shine.setAttribute('d', d);
    // 尾巴剪成燕尾
    const ang = Math.atan2(e.y - b.y, e.x - b.x), L = this.w * 2;
    const at = (a, l) => `${e.x + Math.cos(ang + a) * l} ${e.y + Math.sin(ang + a) * l}`;
    if (!this.handle) this.tail.setAttribute('d', `M${at(-1.2, this.w * .5)} L${at(-.4, L)} L${at(0, L * .5)} L${at(.4, L)} L${at(1.2, this.w * .5)}Z`);
    // 小掛飾：從下面往上一個一個掛
    this.charms.forEach((c, k) => { const q = p[Math.max(1, this.n - 2 - k * 2)]; c.setAttribute('x', q.x); c.setAttribute('y', q.y); });
    if (this.handle){
      this.handle.style.transform = `translate(${e.x}px, ${e.y}px)`;
      pullHint.style.transform = `translate(calc(${e.x - 34}px - 100%), ${e.y + 4}px)`;
    }
  }
  addCharm(emoji){ const t = svg('text', { class: 'rb-charm' }, this.charmG); t.textContent = emoji; this.charms.push(t); }
}
const small = innerWidth < 640;
const ribbons = [
  new Ribbon({ at: () => .3,  len: 70,  w: 7,  col: '#F7D6DE' }),
  new Ribbon({ at: () => .64, len: 96,  w: 7,  col: '#CFE7DF' }),
  new Ribbon({ at: () => innerWidth < 640 ? .74 : .9, len: small ? 120 : 150, w: 11, col: '#F1B5C2', handle: pullBtn })   // 拉鈴的緞帶
];
const bell = ribbons[2];
(function tick(){
  ribbons.forEach(r => { r.step(); r.draw(); });
  pointer.vx *= .4; pointer.vy *= .4;
  requestAnimationFrame(tick);
})();

// 拉緞帶：往下拉夠長（或直接點一下）就算拉了
let pullDone = null, downAt = null;
pullBtn.addEventListener('pointerdown', e => {
  pullBtn.setPointerCapture(e.pointerId);
  pointer.x = e.clientX; pointer.y = e.clientY;
  bell.drag = true; bell.stretch = 0; downAt = [e.clientX, e.clientY];
  pullBtn.classList.add('grab');
});
function release(e){
  if (!bell.drag) return;
  bell.drag = false; pullBtn.classList.remove('grab');
  const moved = Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]);
  if (moved < 6){ const end = bell.pts[bell.n]; end.oy = end.y - 22; }   // 只是點一下：讓緞帶自己往下彈一下
  if (bell.stretch > 40 || moved < 6) tug();
}
pullBtn.addEventListener('pointerup', release);
pullBtn.addEventListener('pointercancel', release);
pullBtn.addEventListener('click', e => { if (e.detail === 0){ const end = bell.pts[bell.n]; end.oy = end.y - 22; tug(); } });   // 鍵盤按 Enter
function tug(){
  if (!pullDone) return;
  const d = pullDone; pullDone = null;
  pullBtn.classList.remove('armed'); pullHint.classList.remove('show');
  setTimeout(d, 350);
}
function pull(){
  pullBtn.classList.add('armed'); pullHint.classList.add('show');
  return new Promise(r => { pullDone = r; });
}
async function nextRoom(charm){
  bell.addCharm(charm);
  await type(LINES.next);
  await pull();
}

/* ---------- 6. 顏色的小工具：上色、變柔和、大理石紋 ---------- */
// 會被上色的地方都加 class="tint"，最後「變柔和」時一起換成淡一點的顏色
let softNow = false;   // 甜點已經加了甜、變柔和了沒
function tint(c, id, prop = 'fill'){
  const v = c === 'marble' ? `url(#${id}-mbl)` : (id === 'd' && softNow ? soften(c) : c);
  return `class="tint" data-c="${c}" data-p="${prop}" style="${prop}:${v}"`;
}
function soften(c){   // 和白色混一半 = 粉嫩一點的顏色
  if (!/^#/.test(c)) return c;
  const n = parseInt(c.slice(1), 16), m = v => Math.round(v + (255 - v) * .45);
  return `rgb(${m(n >> 16)}, ${m(n >> 8 & 255)}, ${m(n & 255)})`;
}
function mix(a, b, t){   // 兩個顏色之間（t = 0～1）
  const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
  const ch = s => Math.round((A >> s & 255) + ((B >> s & 255) - (A >> s & 255)) * t);
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}
const marbleDefs = id => `<pattern id="${id}-mbl" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">` +
  MARBLE.map((c, i) => `<rect x="${i * 4.8}" width="4.8" height="24" ${tint(c, id)}/>`).join('') + '</pattern>';
const expand = cols => cols.flatMap(c => c === 'marble' ? MARBLE.slice(0, 3) : [c]);   // 漸層裡不能用花紋：大理石拆成幾個顏色

// 一碗鮮奶油：cols = 撒進去的顏色（第一個是主色，畫最多）；lump = 拌不開的那一團
function bowlSvg(cols, id, lump){
  // 鮮奶油表面：每個顏色畫成一條彎彎的紋路（主色最粗，再加一大片淡淡的主色）
  const swirl = cols.map((c, i) => {
    const y = 50 + [0, -12, 12][i];
    return `<path d="M20 ${y + 6} C50 ${y - 18} 78 ${y + 16} 108 ${y} S162 ${y - 18} 200 ${y + 2}" fill="none" stroke-width="${i ? 8 : 13}" stroke-linecap="round" opacity=".85" ${tint(c, id, 'stroke')}/>`;
  }).join('');
  const blob = cols.length ? `<ellipse cx="80" cy="58" rx="40" ry="14" opacity=".4" ${tint(cols[0], id)}/>` : '';
  const lumpEl = lump ? `<g class="dh-lump"><path d="M132 50 Q134 36 148 38 Q162 38 160 50 Q162 60 146 61 Q130 61 132 50Z" ${tint(lump, id)}/><circle cx="141" cy="44" r="3.5" fill="#fff" opacity=".6"/></g>` : '';
  return `<svg viewBox="0 0 220 150" aria-hidden="true"><defs>${marbleDefs(id)}<clipPath id="${id}-cream"><ellipse cx="110" cy="50" rx="88" ry="32"/></clipPath></defs>
    <ellipse cx="110" cy="50" rx="98" ry="40" fill="#fff" stroke="#F1C5C8" stroke-width="2"/>
    <ellipse cx="110" cy="50" rx="88" ry="32" fill="#FFFBF5"/>
    <g clip-path="url(#${id}-cream)">${blob}${swirl}</g>${lumpEl}
    <path d="M12 54 Q16 142 110 146 Q204 142 208 54 Q190 90 110 90 Q30 90 12 54Z" fill="#fff" stroke="#F1C5C8" stroke-width="2"/>
    <path d="M32 106 Q110 132 188 106" fill="none" stroke="#F6C9D4" stroke-width="5" stroke-dasharray="1 10" stroke-linecap="round"/>
  </svg>`;
}

/* ---------- 7. ① 色粉櫃：選心情的顏色（最多 3 種），撒進鮮奶油 ---------- */
const jarsEl = $('jars'), bowlEl = $('bowl');
let picked = [];   // 選的心情（照順序；第一個 = 主色）
FEELS.forEach(f => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'dh-jar' + (f.col === 'marble' ? ' marble' : ''); b.dataset.name = f.name;
  if (f.col !== 'marble') b.style.setProperty('--col', f.col);
  b.innerHTML = '<i aria-hidden="true"></i><b></b><small></small>';
  b.querySelector('b').textContent = f.name;
  b.querySelector('small').textContent = f.src;
  b.setAttribute('aria-pressed', 'false');
  b.addEventListener('click', () => pickJar(f, b));
  jarsEl.appendChild(b);
});
function pickJar(f, b){
  if (!jarsEl.classList.contains('live')) return;
  const i = picked.indexOf(f);
  if (i >= 0) picked.splice(i, 1);
  else {
    if (picked.length >= MAX_COLORS){ b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); type(LINES.color.full); return; }
    picked.push(f);
    sprinkle(f);
    type(f.say);
  }
  drawJars(); drawBowl();
}
function drawJars(){
  jarsEl.querySelectorAll('.dh-jar').forEach(b => {
    const n = picked.findIndex(f => f.name === b.dataset.name);
    b.classList.toggle('on', n >= 0);
    b.dataset.n = n >= 0 ? (n ? n + 1 : '主') : '';
    b.setAttribute('aria-pressed', n >= 0);
  });
}
function drawBowl(){ bowlEl.innerHTML = bowlSvg(picked.map(f => f.col), 'b'); }
// 撒色粉：一小撮粉從上面飄進碗裡
function sprinkle(f){
  const wrap = bowlEl.parentElement;
  for (let i = 0; i < 16; i++){
    const s = document.createElement('i');
    s.className = 'dh-dust';
    s.style.setProperty('--col', f.col === 'marble' ? MARBLE[i % MARBLE.length] : f.col);
    s.style.setProperty('--x', (35 + Math.random() * 30) + '%');
    s.style.setProperty('--d', (Math.random() * .35) + 's');
    wrap.appendChild(s);
    setTimeout(() => s.remove(), 1400);
  }
}
drawBowl();
function chooseColors(){
  jarsEl.classList.add('live');
  return new Promise(done => {
    panelButtons([
      { t: '就是這些顏色了 ♡', on: () => {
          if (!picked.length){ type(LINES.color.empty); return; }
          jarsEl.classList.remove('live'); clearPanel(); done();
        } },
      { t: '倒掉重來', free: true, on: () => { picked = []; drawJars(); drawBowl(); } }
    ]);
  });
}

async function roomColor(){
  await view('color');
  setSpeaker('rabumi');
  await sayAll(LINES.open);
  await sayAll(LINES.color.hello);

  // 閒聊：最近好嗎？
  await react(await ask(LINES.color.askHow, LINES.color.how, '✎ 我想自己說'));

  // 最近掛心的事（先選大類，再選細的），每一步 Rabumi 都先回應
  const a = await ask(LINES.color.askTopic, TOPICS.map(t => ({ t: t.t, id: t.id })));
  if (a.free){ memo.topic = FREE_TOPIC; memo.type = a.memo; await react(a, LINES.color.topicFree); }
  else {
    memo.topic = TOPICS.find(t => t.id === a.id);
    await sayAll(memo.topic.re);
    const b = await ask(memo.topic.ask, memo.topic.subs);
    memo.sub = b.free ? null : memo.topic.subs.find(s => s.id === b.id);
    memo.type = b.memo;
    await react(b, LINES.color.subFree);
  }

  // 心情的顏色
  await sayAll(LINES.color.intro);
  await type(LINES.color.pick);
  await chooseColors();
  memo.feels = [...picked];
  memo.main = picked[0];
  memo.feel = picked.map(f => f.name).join('、');
  memo.colors = picked.map(f => f.cn + '的「' + f.name + '」').join('、');
  await say(LINES.color.reflect);
  await say(LINES.color.main);
  await say(LINES.color.named);
  await say(LINES.color.brave);
  await nextRoom('🎨');
}

/* ---------- 8. ② 包裝檯：拌不開的那一團 → 解開纏住的緞帶 ---------- */
const knotsEl = $('knots');
const TANGLE = '<svg viewBox="0 0 60 60"><path d="M8 34C12 12 46 8 48 28S18 52 16 34 42 10 52 30 30 54 20 42"/></svg>';
let knots = [];   // [{ el, from, re, to }]
function addKnot(from, re, cls){
  const el = document.createElement('button');
  el.type = 'button'; el.className = 'dh-knot' + (cls ? ' ' + cls : '');
  el.innerHTML = `<span class="dh-tangle" aria-hidden="true">${TANGLE}</span><span class="dh-bow" aria-hidden="true">🎀</span><span class="dh-tag"><s></s><b></b></span>`;
  el.querySelector('s').textContent = from;
  el.setAttribute('aria-label', '解開「' + from + '」這個結');
  knotsEl.appendChild(el);
  const k = { el, from, re };
  knots.push(k);
  knots.forEach((o, i) => {   // 重新排一次位置
    o.el.style.setProperty('--x', ((i + .5) / knots.length * 100) + '%');
    o.el.style.setProperty('--rot', [-3, 2, -1.5, 3, -2][i % 5] + 'deg');
  });
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
  return k;
}
function untie(k, to){
  k.to = to;
  k.el.querySelector('b').textContent = to;
  k.el.classList.add('undone');
  k.el.setAttribute('aria-label', '已經解開：' + to);
}
// 等玩家點一個結（或按下面的按鈕）：回傳那個結、'custom' 或 'done'
function chooseKnot(canFinish){
  knotsEl.classList.add('live');
  return new Promise(done => {
    const finish = v => { knotsEl.classList.remove('live'); knots.forEach(o => { o.el.onclick = null; }); clearPanel(); done(v); };
    knots.forEach(o => { if (!o.to) o.el.onclick = () => finish(o); });
    const list = [{ t: '✎ 我的結長得不一樣', free: true, on: () => finish('custom') }];
    if (canFinish) list.unshift({ t: '這樣就好了 ♡', on: () => finish('done') });
    panelButtons(list);
  });
}

async function roomBench(){
  const lumpBowl = $('lumpBowl');
  lumpBowl.innerHTML = bowlSvg(memo.feels.map(f => f.col), 'l', memo.main.col === 'marble' ? MARBLE[0] : memo.main.col);
  await view('bench');
  await sayAll(LINES.bench.hello);

  // 拌不開的那一團：最放不下的是什麼？
  const cores = memo.sub ? memo.sub.cores : FREE_CORES;
  const a = await ask(LINES.bench.askCore, cores);
  memo.core = a.memo;
  await react(a, LINES.bench.coreFree);
  await say(LINES.bench.coreSay);

  // 纏住的緞帶：Rabumi 先解一個自己的結
  await sayAll(LINES.bench.tangle);
  const mine = addKnot(LINES.bench.demoKnot, [], 'mine');
  await say(LINES.bench.demo);
  await say(LINES.bench.demo2);
  untie(mine, LINES.bench.demoTo);
  await say(LINES.bench.demo3);

  // 換玩家
  (KNOTS[memo.topic.id] || KNOTS.free).forEach(k => addKnot(k.t, k.re));
  let count = 0;
  await type(LINES.bench.pick);
  while (true){
    const pick = await chooseKnot(count > 0);
    if (pick === 'done') break;
    let k = pick;
    if (pick === 'custom'){
      const v = await askInput(LINES.bench.customAsk, '例如：我一定會搞砸');
      if (!v){ await type(LINES.bench.more); continue; }
      if (await checkCrisis(v)){ await type(LINES.bench.more); continue; }
      k = addKnot(v, []);
    }
    extra.knot = k.from;
    const r = await ask(LINES.bench.real, [ { t: '真的發生了', id: 'fact' }, { t: '是我擔心會發生的', id: 'worry' }, { t: '我也分不清楚', id: 'unsure' } ], null);
    await sayAll(LINES.bench.realSay[r.id]);
    let to;
    if (k.re.length) to = (await ask(LINES.bench.rewrite, k.re.map(t => ({ t })), '✎ 我想自己寫')).memo;
    else to = await askInput(LINES.bench.customRewrite, '例如：搞砸了也可以再試一次') || '先不急著下結論';
    untie(k, to);
    memo.knots.push({ from: k.from, to });
    await say(LINES.bench.untied[count % LINES.bench.untied.length]);
    count++;
    if (knots.every(o => o.to)) break;
    await type(LINES.bench.more);
  }
  await say(LINES.bench.done[0]);
  lumpBowl.classList.add('mixed');   // 拌不開的那一團，拌開了
  await wait(600);
  await sayAll(LINES.bench.done.slice(1));
  await nextRoom('🎀');
}

/* ---------- 9. ③ 廚房：用有顏色的鮮奶油做甜點 → 呼吸 → 加甜變柔和 → 最後一步 → 吃掉它 ---------- */
const kitchen = $('kitchen'), breathBtn = $('breath'), dessertEl = $('dessert'), eatBtn = $('eat'), actBtn = $('act'), spoon = $('spoon');
// 跟著呼吸：按住吸氣（圈圈填滿）→ 放開吐氣；做 times 次，每做完一次叫 onStep(做了幾次)
function breathe(times, onStep){
  return new Promise(done => {
    let left = times, holding = false, phase = 'in', start = 0;
    const label = t => { $('breathLabel').textContent = t; };
    const setP = p => breathBtn.style.setProperty('--p', p);
    breathBtn.hidden = false; label('按住・吸氣');
    let timer = null;
    const down = () => {
      if (phase !== 'in' || holding) return;
      holding = true; start = performance.now(); label('吸——');
      timer = setInterval(() => {   // 吸氣：圈圈一點一點填滿
        const p = Math.min(1, (performance.now() - start) / INHALE);
        setP(p);
        if (p >= 1){ clearInterval(timer); exhale(); }
      }, 30);
    };
    const up = () => {
      if (!holding) return;
      holding = false;
      if (phase === 'in'){ clearInterval(timer); setP(0); label('再按久一點點～'); }
    };
    const exhale = () => {
      phase = 'out'; label('放開・慢慢吐——');
      left--;
      onStep(times - left);
      const s = performance.now();
      timer = setInterval(() => {   // 吐氣：圈圈慢慢退回去
        const p = 1 - (performance.now() - s) / EXHALE;
        setP(Math.max(0, p));
        if (p > 0) return;
        clearInterval(timer);
        if (!left){ cleanup(); breathBtn.hidden = true; done(); return; }
        phase = 'in'; holding = false; label(`按住・吸氣\n（還有 ${left} 次）`);
      }, 30);
    };
    const key = e => { if (e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); if (e.type === 'keydown'){ if (!e.repeat) down(); } else up(); } };
    breathBtn.addEventListener('pointerdown', down);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => breathBtn.addEventListener(t, up));
    breathBtn.addEventListener('keydown', key);
    breathBtn.addEventListener('keyup', key);
    function cleanup(){
      breathBtn.removeEventListener('pointerdown', down);
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => breathBtn.removeEventListener(t, up));
      breathBtn.removeEventListener('keydown', key);
      breathBtn.removeEventListener('keyup', key);
    }
    breathBtn.focus();
  });
}

function presetReply(){ return { comfort: fill(PRESET.comfort), advice: fill(PRESET.advice) }; }
// AI 回應：Rabumi 的口吻（和聊天頁同一個 Worker；chara: 'house' = 用新版茶會的設定和規則，在 worker.js 的 CHARAS.house）
async function getReply(){
  if (!AI_URL) return presetReply();
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 35000);
    const knotText = memo.knots.map(k => `「${k.from}」→「${k.to}」`).join('；');
    const res = await fetch(AI_URL, {
      method: 'POST', signal: ctrl.signal, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chara: 'house', name: nameQ ? playerName : '', topic: memo.topic.t || '自己說的煩惱', type: memo.type,
                             colors: memo.colors, core: memo.core, knots: knotText, sweet: memo.sweet.t,
                             words: memo.words, dessert: extra.dessert })
    });
    clearTimeout(timer);
    const data = await res.json();
    if (!res.ok || !(data.comfort || data.reply)) return presetReply();
    return { comfort: data.comfort || data.reply, advice: data.advice || '' };
  } catch (_) { return presetReply(); }
}
// 長的回應：按句號切成幾段，一段一段說
function toPages(text){
  const parts = text.split(/(?<=[。！？!?♡])(?![」』）])\s*|\n/).map(s => s.trim()).filter(Boolean);
  const pages = [];
  parts.forEach(p => { const last = pages[pages.length - 1]; if (last && (last + p).length <= 46) pages[pages.length - 1] = last + p; else pages.push(p); });
  return pages;
}

// 甜點的樣子：type = 哪一種、cols = 心情的顏色、colored = 加了鮮奶油沒、form = 呼吸了幾次、top = 加的甜、done = 做完最後一步
const D = { type: 'crepe', cols: [], colored: false, form: 0, top: null, done: false };
const img = (key, x, y, w, h, extraAttr = '') => `<image href="${ART[key]}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMax meet" ${extraAttr}/>`;
// 畫好的甜點圖：fill 那張染上心情的顏色，再疊上 line 那張
let tintN = 0;
function imgTint(name, x, y, w, h, c){
  const id = 'd-tf' + (tintN++), col = c === 'marble' ? MARBLE[0] : c;
  return `<filter id="${id}" color-interpolation-filters="sRGB"><feFlood ${tint(col, 'd', 'flood-color')} result="f"/><feComposite in="f" in2="SourceGraphic" operator="in" result="a"/><feBlend in="a" in2="SourceGraphic" mode="multiply"/></filter>` +
    img(name + '-fill', x, y, w, h, `filter="url(#${id})"`) + img(name + '-line', x, y, w, h);
}
const hasArt = name => ART[name + '-line'] && ART[name + '-fill'];
const scoop = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" ${tint(c, 'd')}/>
  <path d="M${x - r} ${y + 3} q${r / 3} 7 ${r * 2 / 3} 1 t${r * 2 / 3} 1 t${r * 2 / 3} -1" ${tint(c, 'd')}/>
  <circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .26}" fill="#fff" opacity=".5"/>`;
const PAN_Y = i => 142 - i * 36;   // 第 i 片鬆餅的上緣（片和片之間留空間夾鮮奶油）
const BODY = {
  // 舒芙蕾鬆餅：一開始塌塌的；每呼吸一次膨起來一層，中間夾心情顏色的鮮奶油
  pancake(){
    if (!D.form){
      if (ART['pancake-flat']) return img('pancake-flat', 56, 112, 128, 60);
      return `<ellipse cx="120" cy="162" rx="60" ry="10" fill="#E9BC7C"/><ellipse cx="120" cy="158" rx="54" ry="7" fill="#F6D9A6"/>
        <path d="M108 158q3 -3 6 0M126 158q3 -3 6 0" stroke="#B98A55" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    }
    const cream = [D.cols[1] || D.cols[0], D.cols[2] || D.cols[0]];
    let s = '';
    for (let i = 0; i < D.form; i++){
      const y = PAN_Y(i);
      if (hasArt('pancake')){ s += imgTint('pancake', 62, y - 16, 116, 52, i ? cream[i - 1] : D.cols[0]); continue; }
      if (i && D.colored) s += `<rect x="74" y="${y + 18}" width="92" height="22" rx="11" ${tint(cream[i - 1], 'd')}/>
        <path d="M80 ${y + 38} q4 8 8 0M146 ${y + 38} q5 10 10 0" ${tint(cream[i - 1], 'd')}/>
        <path d="M84 ${y + 31} q36 5 72 0" stroke="#fff" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>`;
      s += `<rect x="70" y="${y}" width="100" height="26" rx="12" fill="#EDBE80"/><rect x="74" y="${y}" width="92" height="9" rx="4.5" fill="#F8DDAE"/>
        <path d="M78 ${y + 21} q21 4 42 0 t42 0" stroke="#D9A463" stroke-width="2" fill="none" opacity=".45"/>`;
    }
    const top = PAN_Y(D.form - 1);
    if (D.colored && !hasArt('pancake')) s += `<path d="M96 ${top + 4} Q94 ${top - 12} 120 ${top - 15} Q146 ${top - 12} 144 ${top + 4} Q120 ${top + 9} 96 ${top + 4}Z" ${tint(D.cols[0], 'd')}/>
      <ellipse cx="110" cy="${top - 7}" rx="7" ry="3" fill="#fff" opacity=".45"/>`;
    return s;
  },
  // 可麗餅：攤開的餅皮（呼吸 = 慢慢煎到金黃）→ 放上心情顏色的冰淇淋 → 捲起來
  crepe(){
    const n = D.cols.length;
    if (!D.done){
      const g = Math.min(1, D.form / BREATHS);
      let s = ART['crepe-open'] ? img('crepe-open', 20, 120, 200, 64)
        : `<ellipse cx="120" cy="160" rx="98" ry="22" fill="${mix('#FBF1DC', '#F0C57C', g)}"/>
           <ellipse cx="120" cy="158" rx="88" ry="17" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>` +
          (g > .3 ? `<g fill="#D9A15A" opacity="${g * .5}"><circle cx="70" cy="160" r="4"/><circle cx="160" cy="154" r="3"/><circle cx="104" cy="168" r="3"/><circle cx="178" cy="166" r="2.5"/></g>` : '');
      if (D.colored) [[120], [100, 140], [86, 120, 154]][n - 1].forEach((x, i) => { s += scoop(x, 146, 16, D.cols[i]); });
      return s;
    }
    if (hasArt('crepe')) return imgTint('crepe', 56, 22, 128, 160, D.cols[0]);
    const at = [[[120, 80]], [[105, 84], [135, 82]], [[100, 88], [140, 88], [120, 68]]][n - 1];
    return `<path d="M98 140 L142 140 L120 184Z" fill="#F8D4DC"/><path d="M104 150h32M110 162h20" stroke="#fff" stroke-width="2" stroke-dasharray="2 4"/>
      <path d="M120 180 L80 98 Q120 86 160 98Z" fill="#EFC27A"/><path d="M92 124 L152 104" stroke="#D9A463" stroke-width="2" opacity=".5"/>
      ${at.map(([x, y], i) => scoop(x, y, 18, D.cols[i])).join('')}
      <path d="M80 98 q5 -7 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0" fill="none" stroke="#F7DCA6" stroke-width="5" stroke-linecap="round"/>
      <circle cx="84" cy="94" r="8" fill="#fff"/><circle cx="156" cy="94" r="8" fill="#fff"/>`;
  },
  // 布丁：杯子裡的布丁液（呼吸 = 慢慢凝固）→ 倒扣到盤子上
  pudding(){
    const grad = D.colored ? 'url(#d-pud)' : '#FBE6A8';
    if (!D.done){
      if (ART['pudding-cup']) return img('pudding-cup', 70, 78, 100, 96);
      const set = D.form >= BREATHS;
      return `<path d="M82 92 L94 168 Q120 174 146 168 L158 92Z" fill="#fff" fill-opacity=".45" stroke="#E3D3D6" stroke-width="2"/>
        <path class="pd-liquid${set ? '' : ' wavy'}" d="M85 106 Q120 ${set ? 106 : 98} 155 106 L146 166 Q120 172 94 166Z" fill="${grad}"/>
        <path d="M95 156 L145 156 L146 166 Q120 172 94 166Z" fill="#9A5A2E" opacity=".85"/>
        <path d="M90 100 L99 160" stroke="#fff" stroke-width="4" opacity=".6" stroke-linecap="round"/>`;
    }
    if (hasArt('pudding')) return `<g class="pd-body">${imgTint('pudding', 68, 52, 104, 120, D.cols[0])}</g>`;
    return `<g class="pd-body"><path d="M84 166 L96 98 Q120 90 144 98 L156 166 Q120 174 84 166Z" fill="${grad}"/>
      <path d="M96 98 Q120 90 144 98 L142.5 108 Q134 104 130 112 Q124 106 118 110 Q110 104 104 112 Q100 106 97.6 108Z" fill="#8E4F27"/>
      <path d="M92 120 L88 156" stroke="#fff" stroke-width="5" opacity=".5" stroke-linecap="round"/></g>`;
  }
};
// 加的甜放在哪裡
const TOP_AT = {
  pancake: () => [120, PAN_Y(Math.max(1, D.form) - 1) - 18],
  crepe:   () => D.done ? [120, D.cols.length === 3 ? 52 : 64] : [120, 128],
  pudding: () => [120, 88]
};
const TOPS = {
  honey: (x, y) => ART.honey ? img('honey', x - 28, y - 22, 56, 44) :
    `<path d="M${x - 24} ${y} Q${x} ${y - 8} ${x + 24} ${y} Q${x + 20} ${y + 8} ${x + 16} ${y + 3} Q${x + 12} ${y + 15} ${x + 8} ${y + 3} Q${x + 2} ${y + 10} ${x - 4} ${y + 3} Q${x - 10} ${y + 13} ${x - 14} ${y + 3} Q${x - 18} ${y + 8} ${x - 24} ${y}Z" fill="#F6C142" opacity=".92"/>
     <circle cx="${x + 10}" cy="${y - 1}" r="2" fill="#fff" opacity=".7"/>`,
  cream: (x, y) => ART.cream ? img('cream', x - 22, y - 30, 44, 40) :
    `<g fill="#fff" stroke="#F1D9D9" stroke-width="1.5"><ellipse cx="${x}" cy="${y}" rx="17" ry="8"/><ellipse cx="${x}" cy="${y - 8}" rx="12" ry="7"/><path d="M${x - 6} ${y - 13} Q${x} ${y - 28} ${x + 6} ${y - 13}Z"/></g>`,
  candy: (x, y) => ART.candy ? img('candy', x - 24, y - 16, 48, 32) :
    [[-16, 0, '#F4A3B8'], [-8, -6, '#7FA8E0'], [0, 2, '#F6C142'], [8, -5, '#8DB86B'], [16, 1, '#CDA6DE'], [-4, -12, '#F2A93B'], [6, 7, '#E0525F']]
      .map(([dx, dy, c]) => `<rect x="${x + dx - 2}" y="${y + dy - 4}" width="4" height="8" rx="2" fill="${c}" transform="rotate(${dx * 4} ${x + dx} ${y + dy})"/>`).join(''),
  sugar: (x, y) => [[-14, 0], [-4, -8], [6, 2], [14, -6], [0, 8]]
      .map(([dx, dy]) => `<path d="M${x + dx} ${y + dy - 4} l3 4 -3 4 -3 -4Z" fill="#fff" stroke="#F1D9D9"/>`).join('')
};
// 盤子下面墊一張 doily 紙（一圈小圓 = 紙蕾絲的花邊）
const DOILY = Array.from({ length: 30 }, (_, i) => {
  const a = i / 30 * Math.PI * 2;
  return `<circle cx="${(120 + Math.cos(a) * 110).toFixed(1)}" cy="${(172 + Math.sin(a) * 27).toFixed(1)}" r="7" fill="#fff"/>`;
}).join('');
function render(){
  tintN = 0;
  const [tx, ty] = TOP_AT[D.type]();
  const stops = expand(D.cols);
  const pud = D.type === 'pudding' && D.colored ? `<linearGradient id="d-pud" x1="0" y1="0" x2="0" y2="1">${stops.map((c, i) =>
    `<stop offset="${stops.length > 1 ? i / (stops.length - 1) : 0}" ${tint(c, 'd', 'stop-color')}/>`).join('')}</linearGradient>` : '';
  dessertEl.innerHTML = `<svg viewBox="0 0 240 200" aria-hidden="true"><defs>${marbleDefs('d')}${pud}</defs>
    ${DOILY}<ellipse cx="120" cy="172" rx="110" ry="27" fill="#fff"/>
    <ellipse cx="120" cy="172" rx="100" ry="22" fill="none" stroke="#F3D9DF" stroke-width="1.5" stroke-dasharray="2 3"/>
    <ellipse cx="120" cy="170" rx="80" ry="15" fill="#fff" stroke="#F1C5C8" stroke-width="2.5"/>
    <ellipse cx="120" cy="169" rx="64" ry="10" fill="#FBF3EE"/>
    <g class="ds-crumbs"></g>
    <mask id="dhBite"><rect width="240" height="200" fill="#fff"/></mask>
    <g mask="url(#dhBite)"><g class="dh-body">${BODY[D.type]()}${D.top ? TOPS[D.top](tx, ty) : ''}</g></g>
  </svg>`;
}
// 加了甜：所有心情的顏色慢慢變柔和
function softenAll(){
  softNow = true;
  dessertEl.querySelectorAll('.tint').forEach(e => { if (e.dataset.c !== 'marble') e.style.setProperty(e.dataset.p, soften(e.dataset.c)); });
}
// 最後一步：按鬆餅、捲可麗餅、倒出布丁（點甜點或按鈕都可以）
function finishStep(T){
  return new Promise(done => {
    const go = () => {
      dessertEl.onclick = actBtn.onclick = null; actBtn.hidden = true; dessertEl.disabled = true; kitchen.classList.remove('acting');
      if (D.type === 'pancake'){ dessertEl.classList.add('squish'); }
      else { D.done = true; render(); dessertEl.classList.add(D.type === 'pudding' ? 'flip' : 'roll'); }
      setTimeout(done, 1300);
    };
    actBtn.textContent = T.act; actBtn.hidden = false; dessertEl.disabled = false; kitchen.classList.add('acting');
    dessertEl.onclick = actBtn.onclick = go;
  });
}
// 吃一口：每一口咬掉的地方 [x, y, 半徑]
const BITES = [
  [[120, 64, 30], [146, 84, 22], [98, 84, 20]],
  [[172, 110, 34], [176, 150, 32], [150, 96, 26]],
  [[68, 110, 34], [70, 150, 30], [100, 92, 28], [124, 80, 30]],
  [[120, 120, 90]]
];
function eatAll(){
  return new Promise(done => {
    let bites = 0, chewing = false;
    const bite = async () => {
      if (chewing || bites >= BITES.length) return;
      chewing = true;
      spoon.classList.remove('scoop'); void spoon.offsetWidth; spoon.classList.add('scoop');
      await wait(420);
      const mask = $('dhBite');
      BITES[bites].forEach(([x, y, r]) => svg('circle', { cx: x, cy: y, r, fill: '#000' }, mask));
      const crumbs = dessertEl.querySelector('.ds-crumbs');
      const c = memo.main.col === 'marble' ? MARBLE[0] : memo.main.col;
      for (let i = 0; i < 3; i++) svg('circle', { cx: 70 + Math.random() * 100, cy: 164 + Math.random() * 10, r: 1.5 + Math.random() * 2, fill: soften(c) }, crumbs);
      dessertEl.classList.remove('chomp'); void dessertEl.offsetWidth; dessertEl.classList.add('chomp');
      const line = LINES.bake.bites[bites];
      bites++;
      if (bites >= BITES.length){ dessertEl.disabled = true; eatBtn.hidden = true; kitchen.classList.remove('eating'); }
      if (bites < BITES.length){ await type(line); chewing = false; return; }
      await say(line);   // 最後一口：等玩家按 ▸
      done();
    };
    dessertEl.onclick = bite; eatBtn.onclick = bite;
    kitchen.classList.add('eating'); dessertEl.disabled = false; eatBtn.hidden = false;
  });
}

let reply = null;
async function roomBake(){
  const T = DESSERTS[memo.topic.dessert] || DESSERTS.crepe;
  Object.assign(D, { type: memo.topic.dessert || 'crepe', cols: memo.feels.map(f => f.col), colored: false, form: 0, top: null, done: false });
  extra.dessert = memo.main.src + T.name;
  render();
  await view('bake');
  await sayAll(LINES.bake.invite);
  await react(await ask(LINES.bake.inviteAsk, LINES.bake.inviteOpts, null));

  // 這個甜點為什麼像你的煩惱 → 把有顏色的鮮奶油加進去
  await sayAll(T.intro);
  await say(T.color);
  D.colored = true; render();
  await wait(400);

  // 呼吸：等它做好（鬆餅膨起來／餅皮煎好／布丁凝固）
  await type(T.breathe + LINES.bake.breatheHow);
  await breathe(BREATHS, k => { D.form = k; render(); });
  await say(T.formed);

  // 加一點甜（= 現在需要的東西）→ 顏色變柔和
  const s = await ask(LINES.bake.sweetAsk, LINES.bake.sweets, '✎ 我想要別的甜');
  memo.sweet = s.free ? { t: s.t, sweet: '一匙糖' } : { t: s.t, sweet: s.sweet };
  D.top = s.free ? 'sugar' : s.id;
  render();
  await react(s, LINES.bake.sweetFree);
  softenAll();
  await sayAll(LINES.bake.soften);

  // 寫一句話給自己
  memo.words = await askInput(LINES.bake.askCard, LINES.bake.cardPh, false, '不寫了，就這樣');
  if (!await checkCrisis(memo.words)) await say(memo.words ? LINES.bake.cardSay : LINES.bake.cardSkip);

  // 最後一步（等的時候，AI 在後面想要說的話）
  const replyP = crisis ? Promise.resolve({ comfort: fill(CRISIS_AGAIN), advice: '' }) : getReply();
  await type(T.actAsk);
  await finishStep(T);
  await sayAll(T.acted);
  thinking();
  reply = await replyP;
  const comfort = toPages(reply.comfort), advice = toPages(reply.advice);
  for (let i = 0; i < comfort.length; i++) await say((crisis ? '[擔心]' : i ? '[溫柔]' : '[傾聽]') + comfort[i]);
  for (let i = 0; i < advice.length; i++) await say((i ? '[微笑]' : '[思考]') + advice[i]);

  // 完成 → 吃掉它
  $('dessertName').textContent = extra.dessert;
  kitchen.classList.add('named');
  await sayAll(LINES.bake.ding);
  await say(T.desc);
  await type(LINES.bake.eat);
  await eatAll();
  await nextRoom('🧁');
}

/* ---------- 10. ④ 茶桌：茶端上來 → 掰開幸運餅乾 → 小紙條折起來、綁緞帶 → 擺上煩惱牆 ---------- */
const memoEl = $('memo'), tieEl = $('tie'), knob = $('tieKnob'), fortuneEl = $('fortune');
const TEACUP = `<svg viewBox="0 0 120 100" aria-hidden="true"><path class="dh-steam" d="M48 30q-6-8 0-16t0-16M62 30q-6-8 0-16t0-16M76 30q-6-8 0-16t0-16" fill="none" stroke="#E7C9CF" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="62" cy="88" rx="50" ry="9" fill="#fff" stroke="#F1C5C8" stroke-width="2"/>
  <path d="M24 40 Q26 84 62 86 Q98 84 100 40Z" fill="#fff" stroke="#F1C5C8" stroke-width="2"/><ellipse cx="62" cy="40" rx="38" ry="8" fill="#C98F5A" stroke="#F1C5C8" stroke-width="2"/>
  <path d="M100 48 q16 2 12 16 q-4 10 -14 8" fill="none" stroke="#F1C5C8" stroke-width="5"/><path d="M34 60 q28 12 56 0" fill="none" stroke="#F6C9D4" stroke-width="4" stroke-dasharray="1 7" stroke-linecap="round"/></svg>`;
const COOKIE = `<svg viewBox="0 0 140 90" aria-hidden="true">
  <rect class="fc-paper" x="40" y="38" width="60" height="12" rx="1" fill="#fff" stroke="#F1C5C8"/>
  <g class="fc-l"><path d="M70 24 Q38 6 16 42 Q30 70 66 66 Q56 48 70 24Z" fill="#EDBB72"/><path d="M60 30 Q44 26 30 44" fill="none" stroke="#D99A4E" stroke-width="2.5" stroke-linecap="round" opacity=".6"/></g>
  <g class="fc-r"><path d="M70 24 Q102 6 124 42 Q110 70 74 66 Q84 48 70 24Z" fill="#E6AE60"/><path d="M80 30 Q96 26 110 44" fill="none" stroke="#C98741" stroke-width="2.5" stroke-linecap="round" opacity=".6"/></g></svg>`;
$('teacup').innerHTML = TEACUP;
fortuneEl.innerHTML = COOKIE;
// 畫好的圖：換上去
setTimeout(() => {
  if (ART.teacup) $('teacup').innerHTML = `<img src="${ART.teacup}" alt="">`;
  if (ART.fortune) fortuneEl.innerHTML = `<img class="fc-closed" src="${ART.fortune}" alt="">` + (ART['fortune-open'] ? `<img class="fc-opened" src="${ART['fortune-open']}" alt="">` : '');
}, 1500);
function breakCookie(){
  fortuneEl.disabled = false;
  return new Promise(done => {
    fortuneEl.onclick = () => { fortuneEl.onclick = null; fortuneEl.disabled = true; fortuneEl.classList.add('open'); setTimeout(done, 1100); };
  });
}
function fillMemo(){
  const rows = [
    ['最近發生的事', memo.type],
    ['拌不開的那一團', memo.core],
    ['心情的顏色', memo.colors],
    ['解開的結', memo.knots.map(k => '「' + k.from + '」→「' + k.to + '」').join('\n')],
    ['加進去的甜', memo.sweet ? memo.sweet.t + '（' + memo.sweet.sweet + '）' : ''],
    ['寫給自己的話', memo.words],
    ['今天的甜點', extra.dessert],
    ['下次的我', memo.next]
  ];
  const dl = $('memoList');
  dl.innerHTML = '';
  rows.forEach(([k, v]) => {
    if (!v) return;
    const dt = document.createElement('dt'); dt.textContent = k;
    const dd = document.createElement('dd'); dd.textContent = v; dd.style.whiteSpace = 'pre-line';
    dl.append(dt, dd);
  });
}
function fold(){
  const btn = $('memoFold');
  btn.disabled = false;
  return new Promise(done => {
    btn.onclick = () => { btn.onclick = null; btn.disabled = true; memoEl.classList.add('folded'); setTimeout(done, 900); };
  });
}
// 綁緞帶：拉著蝴蝶結從左拉到右（拉不到底放開會彈回去）
function tie(){
  tieEl.hidden = false;
  return new Promise(done => {
    let dragging = false, finished = false;
    const setT = t => tieEl.style.setProperty('--t', t);
    const at = e => { const r = tieEl.getBoundingClientRect(); return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); };
    const finish = () => {
      if (finished) return;
      finished = true; dragging = false;
      tieEl.classList.add('snap', 'done'); setT(1);
      memoEl.classList.add('tied');
      knob.onpointerdown = knob.onpointermove = knob.onpointerup = knob.onpointercancel = knob.onclick = null;
      setTimeout(done, 900);
    };
    knob.onpointerdown = e => { dragging = true; tieEl.classList.remove('snap'); knob.setPointerCapture(e.pointerId); };
    knob.onpointermove = e => { if (!dragging) return; const t = at(e); setT(t); if (t > .92) finish(); };
    knob.onpointerup = knob.onpointercancel = () => { if (!dragging) return; dragging = false; tieEl.classList.add('snap'); setT(0); };
    knob.onclick = e => { if (e.detail === 0) finish(); };   // 鍵盤
    knob.focus();
  });
}
const noName = s => !nameQ ? (s || '') : (s || '').replaceAll(new RegExp(playerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[，,、！!～~ ]*', 'g'), '');
async function postWall(){
  const res = await fetch(WALL_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chara: 'rabumi', type: memo.type, core: memo.core, feel: memo.feel, need: noName(memo.words || memo.sweet.t),
                           comfort: noName(reply.comfort), advice: noName(reply.advice), dessert: extra.dessert })
  });
  const data = await res.json();
  if (!res.ok) throw 0;
  return data.note.id;
}

async function roomTable(){
  await view('table');
  await sayAll(LINES.table.hello);
  await react(await ask(LINES.table.feelAsk, LINES.table.feelOpts, null));

  // 下次這種顏色又出現時，想先做什麼（寫進小紙條）
  const n = await ask(LINES.table.nextAsk, LINES.table.nextOpts, '✎ 我想自己決定');
  memo.next = n.memo;
  await react(n, LINES.table.nextFree);

  // 幸運餅乾 → 小紙條：折起來 → 用緞帶綁好
  await type(LINES.table.fortune);
  await breakCookie();
  fillMemo();
  memoEl.classList.add('show');
  $('teaset').classList.add('away');
  await say(LINES.table.memo);
  await type(LINES.table.fold);
  await fold();
  await type(LINES.table.tie);
  await tie();
  await say(LINES.table.tied);
  await sayAll(LINES.table.ending);
  bell.addCharm('🥠');

  // 擺上煩惱牆（匿名）
  const canPost = !crisis && !!memo.type && !!(reply && reply.comfort);
  if (canPost){
    const a = await ask(LINES.table.final, [ { t: '♡ 擺上煩惱牆', id: 'post' }, { t: '收進口袋就好', id: 'keep' } ], null);
    if (a.id === 'post'){
      type(LINES.table.posting);
      try { const id = await postWall(); goTo('wall.html?new=' + id + nameQ); return; }
      catch (_) { await say(LINES.table.postFail); }
    }
  }
  await say(LINES.table.bye);
  goTo('index.html');   // 重新開始（回到標準字那裡）
}

/* ---------- 11. 開始：莓露露歡迎你、問名字、說明玩法 → 拉緞帶打開娃娃屋 ---------- */
async function run(){
  setSpeaker('maid');
  await sayAll(LINES.host.hello);
  const v = (await askInput(LINES.host.askName, LINES.host.namePh, true, '不想說', { value: savedName, max: 12 })).trim();
  if (v && isCrisis(v)){ setName(''); await checkCrisis(v); }
  else { setName(v); await say(v ? LINES.host.named : LINES.host.noName); }
  await sayAll(LINES.host.howto);
  await type(LINES.host.ready);
  await pull();
  document.body.classList.add('host-gone');   // 莓露露退到旁邊
  house.classList.add('open');                 // 窗簾打開
  await wait(1400);
  await roomColor();
  await roomBench();
  await roomBake();
  await roomTable();
}
// 收下邀請卡之後（invite.js）才開始：娃娃屋出現 → 莓露露出場
function startHouse(){
  house.style.transition = 'none'; layout(); void house.offsetWidth; house.style.transition = '';
  setTimeout(() => { box.classList.add('in'); run(); }, 1600);
}
