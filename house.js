// It's Tea Time 娃娃屋（index.html 的後半段）
/* ===================================================================
   ★ 新流程：莓露露邀請你來茶會，Rabumi 陪你把煩惱一步一步做成甜點 ★
   邀請卡     invite.js：標準字 → 拆信封、抽出莓露露的邀請卡 → 收下 → 同一頁換成娃娃屋（叫這個檔案的 startHouse）
   開場       莓露露（茶會主人）：歡迎 → 問你的名字 → 說明怎麼玩 → 拉一下緞帶，打開娃娃屋
   ① 色粉櫃   察覺情緒：像朋友閒聊（最近好嗎）→ 選心情的顏色（天然色粉），撒進一碗白色鮮奶油 → 拌不勻，結成 3 顆結塊
   ② 攪拌檯   知道在煩什麼、釐清它：聊一輪就拌開一顆結塊（在碗裡按住畫圈攪拌，滑鼠會變成攪拌棒）
              第一輪 發生了什麼事（掛心的事）→ 第二輪 最在意的是什麼 → 第三輪 是真的發生還是擔心（再換個說法）
              三顆都拌開 = 鮮奶油變成均勻的心情色
   ③ 廚房     和煩惱和解：用這碗有顏色的鮮奶油做甜點（學業＝舒芙蕾鬆餅、人際＝原宿可麗餅、自我＝布丁）
              鬆餅／布丁：呼吸等它做好 → 加一點甜，顏色變柔和 → 最後一步（按鬆餅／倒出布丁）→ 吃掉它
              可麗餅：呼吸把餅皮煎好、抹奶油 → 捲起來 → 放料（冰淇淋 = 心情的顏色）→ 自己淋巧克力醬、撒糖 → 吃掉它
              （中間都會寫一句話給自己、聽 Rabumi 的安慰和建議）
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
   - 原宿可麗餅（人際）：img/crepe/（餅皮、架子、蕾絲紙、鮮奶油／水果／冰淇淋三層、sprinkles/ 星星糖和彩色糖），冰淇淋會染上心情的顏色
           配料：honey.png、cream.png、candy.png
   - 其他：img/house/fortune.png、fortune-open.png（幸運餅乾）、teacup.png（茶杯）
   - 色粉櫃：img/house/cabinet.png（櫃子）、jar.png + jar-powder.png（色粉罐 + 換色範圍）、bowl-top.png（俯視的鮮奶油碗）
   - 對話框：img/ui/name-rabumi.png（餅乾名牌）、img/lace-ribbon.png（框裡的蕾絲）；上面的荷葉邊 img/ui/lace-tile.png
   =================================================================== */

// 對話框上的人：莓露露（茶會主人：歡迎你、問名字、說明玩法）、Rabumi（陪你走完全部房間）
const SPEAKERS = {
  maid:   { name: 'メルル｜莓露露',   img: 'img/maid.png',   light: '#FFF1F4', main: '#F6C9D4' },
  rabumi: { name: 'Rabumi｜ラブミー', img: 'img/rabumi.png', light: '#FAE6F6', main: '#F1C5C8' }
};
// 說話者 → 餅乾名牌圖：有圖的用圖，沒有的沿用白色文字名牌（之後做好莓露露的名牌，加一行就好）
const SPEAKER_TAG = {
  rabumi: { src: 'img/ui/name-rabumi@1x.png', src2x: 'img/ui/name-rabumi.png', alt: 'Rabumi' },
  // maid: { src: 'img/ui/name-meruru@1x.png', src2x: 'img/ui/name-meruru.png', alt: 'メルル 莓露露' },  之後補
};
// 莓露露的表情（和客廳 page3 一樣的三張圖）
const MAID_FACES = { 一般: 'img/maid.png', 笑臉: 'img/maid-smile.png', 眨眼: 'img/maid-wink.png' };
const DEFAULT_NAME = '客人';   // 玩家不想說名字時的稱呼

// Rabumi 的表情：img = 畫好的圖放在 img/rabumi/ 裡的檔名（幾個表情可以共用同一張）；mark = 頭上跳出來的漫畫符號
// fx = 特別動作（有 fx 的表情身體會一直抖；jump：帽子再跳起來一下）；有 fx 的圖沒畫帽子，帽子用 hat.png 另外疊上去
// 還沒畫的表情先用 basic.png（基本），連 basic 都沒有才用 rabumi.png
const FACE_DIR = 'img/rabumi/';
const SHOW_FACE_TAG = false;   // 對話框名字旁邊顯示［表情］小標籤（測試用；改成 true 會顯示）
const FACES = {
  微笑: { img: 'smile',     mark: '' },      // 瞇眼笑、臉紅
  好奇: { img: 'curious',   mark: '？' },    // 歪頭、一邊耳朵翹起來
  驚訝: { img: 'surprised', mark: '！', fx: 'jump' },    // 耳朵豎起來、眼睛圓圓；身體一直抖＋帽子跳起來一下
  傾聽: { img: 'basic',     mark: '…' },     // 基本
  心疼: { img: 'sad',       mark: '💧' },    // 眼眶含淚
  思考: { img: 'think',     mark: '💭' },    // 雙手抱胸、閉眼
  慌張: { img: 'surprised', mark: '💦', fx: 'shake' },   // 和驚訝同一張；身體一直抖抖抖，帽子跟著抖
  明白: { img: 'basic',     mark: '💡' },    // 基本
  溫柔: { img: 'smile',     mark: '♡' },     // 和微笑同一張
  害羞: { img: 'shy',       mark: '///' },   // 雙手遮臉
  開心: { img: 'happy',     mark: '♪' },     // > < 舉起手套和鍋鏟
  幹勁: { img: 'happy',     mark: '✦' },     // 和開心同一張
  擔心: { img: 'worry',     mark: '' }       // 皺眉、耳朵捲起來；玩家提到想傷害自己時用：不要可愛的符號
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
      '[笑臉]你們會一個房間一個房間走——\n先找到心情的顏色；再把碗裡的結塊拌開；最後一起把煩惱做成甜點。',
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
    intro: [
      '[思考]跟你說，我做甜點的時候，很喜歡用天然的色粉。\n草莓粉、焙茶粉、蝶豆花……每一種都是食物做的顏色。',
      '[害羞]我覺得心情好像也有顏色。\n像我今天，大概是焦糖色吧……一直在小火上煮著，靜不下來。',
      '[好奇]那今天的你，是什麼顏色呢？'
    ],
    pick: '[微笑]今天的心情，是哪一罐呢？\n點一罐色粉，倒進鮮奶油裡吧。',
    again: '[微笑]好呀，那換一罐看看。\n今天的心情，是哪一罐呢？',
    stir:    '[微笑]我幫你把色粉拌進鮮奶油裡——\n刷刷、刷刷♪',   // Rabumi 捧著碗攪拌（拌不勻，色粉結成 3 顆結塊）
    lumpy:   '[驚訝]咦？怎麼拌都拌不勻……\n色粉結成一顆一顆的了。',
    reflect: '[心疼]你的鮮奶油裡，撒進了{MAINCN}的「{MAIN}」。\n心裡裝著這個顏色，一定不輕鬆吧。',
    named:   '[明白]不過你看，顏色被說出名字之後，\n就看得清清楚楚了。',
    brave:   '[溫柔]能看見自己是什麼顏色，已經很了不起了喔。',
    later:   '[微笑]那些結塊，我們等一下去攪拌檯，\n一顆一顆慢慢拌開吧。'
  },

  /* ② 攪拌檯：知道在煩什麼、釐清它（聊一輪，就拌開一顆結塊；一共 3 輪） */
  bench: {
    hello: [
      '[微笑]我把剛剛那碗鮮奶油端過來了。',
      '[驚訝]哎呀，色粉結塊了……\n就像心裡有個結一樣。'
    ],
    // 第一輪：發生了什麼事？（找出情境：先選大類，再選細的）
    askTopic: '[好奇]你的結是什麼呢？\n最近有沒有什麼事，一直掛在心上？',
    topicFree: ['[傾聽]「{TYPE}」……嗯，我聽到了。'],
    subFree: ['[傾聽]「{TYPE}」……嗯，我記住了。'],
    // 第二輪：你最在意的是什麼？（找出核心）
    askCore: '[好奇]在「{TYPE}」這件事裡，\n你最在意的是哪一個呢？',
    coreFree: ['[傾聽]「{CORE}」……嗯。'],
    coreSay: '[明白]原來你最在意的，是「{CORE}」。\n謝謝你，願意看得這麼仔細。',
    // 第三輪：這是真的發生的，還是心裡擔心的？（分辨事實和擔心 → 換個說法）
    askThought: '[好奇]想到這件事的時候，\n心裡最常冒出來的，是哪一句話呢？',
    real: '[思考]我們一起看看這句話——\n「{KNOT}」，這是真的發生了，還是心裡擔心會發生的呢？',
    realSay: {
      fact:   ['[傾聽]嗯，是真的發生了，難怪你會這麼在意。', '[思考]可是發生了這件事，\n不代表後面想像的那些，也一定會成真喔。'],
      worry:  ['[明白]原來是心裡擔心的。', '[溫柔]擔心很正常，可是它現在還沒有發生喔。'],
      unsure: ['[傾聽]分不清楚也沒關係。', '[思考]很多時候，事情和想像本來就混在一起，\n就像這碗還沒拌勻的鮮奶油一樣。']
    },
    rewrite: '[微笑]那我們試著換個說法？\n選一個你比較願意相信的就好。',
    customRewrite: '[好奇]如果換個溫柔一點的說法，你會怎麼對自己說呢？',
    // 拌開結塊（每一輪聊完）
    stirHow: '[微笑]來，在碗裡按住、畫圈圈攪拌——\n把一顆結塊拌開吧！',
    stirAgain: '[微笑]再拌開一顆吧！',
    mixed: ['[開心]拌開一顆了！', '[開心]又拌開一顆！\n只剩最後一顆了。'],
    done: [
      '[驚訝]啊，你看碗裡——\n結塊都拌開了，變成均勻的{MAINCN}！',
      '[溫柔]煩惱還在，可是結拌開之後，\n它就不會一直卡在那裡了。',
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
    // 跟著呼吸（延長吐氣：吸 4 秒、吐 6 秒，做 3 次共 30 秒；秒數在下面的 INHALE、EXHALE）
    breatheStart: '[溫柔]接下來，跟著甜點的起伏，慢慢吸氣、慢慢吐氣，\n我們一起做三次深呼吸吧！',
    breatheHow: '[微笑]按住右邊的按鈕，吸氣 4 秒；\n圈圈滿了就放開，慢慢吐氣 6 秒。',
    breatheEnd: '[溫柔]現在，有沒有覺得稍微輕鬆一點了呢？\n就算煩惱還在也沒關係喔。',
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

// 最近發生的事（攪拌檯第一輪）：dessert = 做哪一種甜點（DESSERTS）；re = 選了之後 Rabumi 的回應
// cores = 攪拌檯第二輪問「最在意的是哪一個」的選項，每個也有自己的回應
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

// 心情色粉（色粉櫃）：name = 心情、src = 罐子上的短名字、cn = 顏色的名字、col = 顏色、say = 點了之後 Rabumi 介紹這個口味
const FEELS = [
  { name: '孤單',     src: '藍莓',     cn: '藍莓藍',       col: '#A9C4F5', say: '[心疼]接骨木莓藍莓粉，深深的紫藍色，酸酸甜甜的。\n就像孤單時，身邊明明有人，卻還是覺得有點遠。' },
  { name: '難過',     src: '蝶豆花',   cn: '蝶豆花蘇打藍', col: '#C9E2EE', say: '[心疼]蝶豆花蘇打粉，藍藍的蘇打一直冒小氣泡，\n就像難過時，一顆一顆浮上來的眼淚。' },
  { name: '委屈',     src: '黑醋栗',   cn: '黑醋栗紫',     col: '#E9C8DA', say: '[心疼]薰衣草黑醋栗粉，淡淡花香底下藏著酸。\n就像委屈時，表面上沒事，心裡卻很難受。' },
  { name: '焦慮',     src: '焦糖',     cn: '焦糖黃',       col: '#FDE5A7', say: '[思考]香草焦糖粉，焦糖加熱時會一直冒泡、翻滾，\n就像焦慮時，腦袋裡停不下來的擔心。' },
  { name: '生氣',     src: '草莓',     cn: '草莓粉',       col: '#FDD8DD', say: '[傾聽]草莓覆盆子粉，顏色鮮明，酸甜很直接，\n就像生氣時，一下子湧上來、藏不住的情緒。' },
  { name: '煩躁',     src: '血橙',     cn: '血橙橘',       col: '#FEC6AE', say: '[思考]西柚血橙粉，酸酸澀澀的，\n就像煩躁時，什麼小事都看不順眼。' },
  { name: '忌妒',     src: '薄荷萊姆', cn: '薄荷萊姆綠',   col: '#E6F3A8', say: '[害羞]薄荷萊姆粉，涼涼的，又帶點酸，\n就像忌妒時，裝作不在意，心裡卻酸酸的。' },
  { name: '疲憊',     src: '焙茶',     cn: '焙茶色',       col: '#BA9E6C', say: '[溫柔]蜂蜜焙茶粉，暖暖的茶香，微苦又有一點甜，\n就像疲憊時，提不起精神，只想好好休息。' },
  { name: '五味雜陳', src: '巧克力',   cn: '巧克力色',     col: '#C89C87', say: '[思考]巧克力粉，有苦也有甜，\n就像五味雜陳時，好多心情混在一起，說不清楚。' }
];
const MARBLE = ['#F4A3B8', '#F2A93B', '#7FA8E0', '#8DB86B', '#CDA6DE'];   // 大理石紋用的顏色

// 心裡冒出來的那句話（攪拌檯第三輪）：t = 那句話、re = 可以換成的說法
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
  pancake: {   // 學業：被壓著、喘不過氣、負擔一層層疊上來 → 喘口氣，就有空間了（流程在 makePancake：煎鍋＋呼吸 → 疊起來、膨起來 → 放配料）
    name: '舒芙蕾鬆餅',
    intro: ['[思考]你的煩惱，讓我想到舒芙蕾鬆餅。', '[傾聽]事情一件一件疊上來，壓得喘不過氣，\n鬆餅也會塌成扁扁的……'],
    color: '[微笑]你那碗有顏色的鮮奶油，\n等一下會變成一球冰淇淋，放在鬆餅最上面喔。',
    pour: '[微笑]麵糊倒進鍋子裡了。\n我們一起慢慢呼吸，等它煎好吧。',
    startAct: '開始呼吸',
    breathing: '[溫柔]跟著鍋子的節奏——\n吸氣的時候麵糊慢慢擴開，吐氣的時候看它冒泡泡。',
    cooked: '[開心]做得很好。鬆餅煎好了，翻面囉！',
    stackAct: '把鬆餅疊起來',
    flat: '[傾聽]一開始扁扁的，就像被壓著的心情……\n再深呼吸一次。',
    puffed: '[開心]你看，它慢慢膨起來了。\n喘口氣，就有空間了。',
    ice: '[微笑]最上面這球冰淇淋，\n就是你那碗{MAINCN}的鮮奶油做的。',
    deco: '[幹勁]最後，放上你想要的配料吧！\n選一個配料，點最上面那片鬆餅放上去；點放好的會拿掉。',
    decoDone: '✓ 裝飾好了',
    decoSay: '[開心]好可愛！這是只屬於你的鬆餅。', decoNone: '[微笑]原本的樣子也很好看呢。',
    desc: '[溫柔]蓬蓬的舒芙蕾鬆餅，要小火慢慢煎才好吃。\n努力也是，不用一次做完全部。'
  },
  crepe: {     // 人際：捲起來、包住、分不開，熱餅皮包冰淇淋＝忽冷忽熱（流程在 makeCrepe：攤開 → 捲起來 → 放料 → 裝飾）
    name: '原宿可麗餅',
    intro: ['[思考]你的煩惱，讓我想到原宿的可麗餅。', '[傾聽]好多人、好多事，全部捲在一起，\n分也分不開……'],
    color: '[微笑]你那碗有顏色的鮮奶油，\n等一下會變成一球冰淇淋喔。',
    breathe: '[微笑]先來煎餅皮，要用小火，慢慢煎到金黃色。',
    formed: '[開心]餅皮煎得金金黃黃的了！',
    spread: '[微笑]餅皮抹好奶油了，我們把它捲起來吧！', act: '🌀 捲起來',
    rolled: '[開心]捲好了！現在還空空的，來放料吧。', fillAct: '🍓 放料',
    fill: ['[微笑]先擠一圈鮮奶油……', '[開心]再擺上草莓和香蕉……', '[驚訝]最後，冰淇淋！'],
    filled: ['[微笑]這球冰淇淋，就是你那碗{MAINCN}的鮮奶油做的。', '[溫柔]熱熱的餅皮，包著冰冰的冰淇淋……\n關係也是，一冷一熱都沒關係，有好好包住就好。'],
    deco: '[幹勁]最後換你來裝飾，淋醬、撒糖都可以喔！\n選一個工具，在餡料上按住拖拖看。', decoDone: '✓ 裝飾好了',
    decoSay: '[開心]好可愛！這是只屬於你的可麗餅。', decoNone: '[微笑]原本的樣子也很好看呢。',
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
  advice:  '下次心裡又亂成一團的時候，先深呼吸，再分清楚「真的發生的事」和「心裡擔心的事」。\n不管怎麼樣，我的廚房永遠幫你留一個位子♡'
};
// 玩家打的字裡有這些詞，就馬上溫柔地提醒求助資訊
const CRISIS_WORDS = ['想死', '去死', '自殺', '不想活', '活不下去', '傷害自己', '割腕', '結束生命', '消失就好'];
const CRISIS_REPLY = '[擔心]{NAME}……謝謝你願意把這麼重的話說出來。\n你現在的感受很重要，請不要一個人撐著——現在就找一個信任的人陪著你，或打 1925 安心專線、1995 生命線（24 小時），會有人好好聽你說。';
const CRISIS_AGAIN = '{NAME}，甜點快好了，我想再跟你說一次：\n你不用一個人撐著。1925 和 1995 都 24 小時有人在，我也會一直在這裡等你回來。';   // 說過求助資訊之後，做甜點時的話

const TYPE_SPEED = 38;   // 打字速度：每個字幾毫秒
const BREATHS = 3;       // 要跟著呼吸幾次
const INHALE = 4000;     // ★ 吸氣要按住幾毫秒（4 秒）
const EXHALE = 6000;     // ★ 吐氣幾毫秒（6 秒；吐得比吸得長 = 延長吐氣，比較放鬆；3 次共 30 秒）
const AI_URL = 'https://tea-time.spcp94523.workers.dev';
const WALL_URL = AI_URL + '/wall';
/* ===== 設定到這裡為止，下面是程式 ===== */

const $ = id => document.getElementById(id);
const wait = ms => new Promise(r => setTimeout(r, ms));
// 「↩ 上一步」：按了之後，現在在等的那句話／選項會停下來（丟出 BACK），由 11. 的 STEPS 決定回到哪一步
// guard(p) = 等 p，可是按了上一步就不等了；answered(p) = 這一步已經回答過東西了（再按上一步 = 重做這一步）
const BACK = 'back';
let gate = null, onBack = [], stepMoved = false;
function newGate(){ let r; gate = new Promise((_, rej) => { r = rej; }); gate.catch(() => {}); gate.back = r; onBack = []; }
const guard = p => gate ? Promise.race([p, gate]) : p;
const answered = p => p.then(v => { stepMoved = true; return v; });

/* ---------- 0. 畫好的圖：有放進資料夾就用，沒有就用程式畫的 ---------- */
const ART = {};
function probe(key, url){ const im = new Image(); im.onload = () => { ART[key] = url; }; im.src = url; }
['pancake', 'pudding'].forEach(t => { probe(t + '-line', `img/desserts/${t}-line.png`); probe(t + '-fill', `img/desserts/${t}-fill.png`); });
['pancake-flat', 'pudding-cup', 'honey', 'cream', 'candy'].forEach(k => probe(k, `img/desserts/${k}.png`));
['fortune', 'fortune-open', 'teacup'].forEach(k => probe(k, `img/house/${k}.png`));

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

const memo = { topic: FREE_TOPIC, sub: null, type: '', core: '', feels: [], feel: '', colors: '', main: null, free: [],
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

/* ---------- 2. 誰在說話、表情：換對話框左邊的大角色、房間裡的圖，頭上跳出漫畫符號 ---------- */
// avatar = 對話框左邊的大角色（Rabumi／莓露露）；它也是一個 .dh-chara，所以帽子、攪拌碗、漫畫符號都跟房間裡的一樣
const avatar = $('avatarImg'), avatarChara = avatar.closest('.dh-chara'), host = document.querySelector('.dh-host');
let speaker = 'maid', face = '';
function setSpeaker(who){
  speaker = who; face = '';
  const S = SPEAKERS[who], tag = SPEAKER_TAG[who], nameEl = $('chatName');
  document.body.style.setProperty('--pc-light', S.light);
  document.body.style.setProperty('--pc-main', S.main);
  avatarChara.classList.toggle('is-maid', who === 'maid');
  nameEl.parentElement.classList.toggle('is-img', !!tag);
  $('chatBox').classList.toggle('tag-img', !!tag);
  if (!tag){ nameEl.textContent = S.name; return; }
  const im = document.createElement('img');
  im.className = 'speaker-tag'; im.src = tag.src; im.srcset = tag.src + ' 1x, ' + tag.src2x + ' 2x'; im.alt = tag.alt;
  nameEl.replaceChildren(im);
}
const faceOk = {};   // 這張表情圖畫好了沒（有放進 img/rabumi/ 就會用）
['basic', 'surprised-full', ...Object.values(FACES).map(f => f.img)].forEach(n => { const im = new Image(); im.onload = () => { faceOk[n] = true; }; im.src = FACE_DIR + n + '.png'; });
document.querySelectorAll('.dh-chara').forEach(c => {
  const m = document.createElement('span'); m.className = 'dh-mark'; m.setAttribute('aria-hidden', 'true'); c.appendChild(m);
  // 分開的帽子（驚訝/慌張的圖沒有畫帽子，帽子另外疊上去才能跳起來）
  const h = document.createElement('span'); h.className = 'dh-hat'; h.setAttribute('aria-hidden', 'true'); h.innerHTML = '<span></span>';
  c.querySelector('.chat-chara-bob').appendChild(h);
  // 捧著碗攪拌的樣子：身體＋碗（鮮奶油會變色）＋捧碗的手＋拿打蛋器的手（左右攪）疊在一起
  const s = document.createElement('span'); s.className = 'dh-stir'; s.setAttribute('aria-hidden', 'true');
  s.innerHTML = `<img src="${FACE_DIR}stir-body.png" alt=""><span class="dh-stir-bowl"></span>` +
                `<img src="${FACE_DIR}stir-hold.png" alt=""><img class="dh-stir-hand" src="${FACE_DIR}stir-hand.png" alt="">`;
  c.querySelector('.chat-chara-bob').appendChild(s);
});
// Rabumi 捧著碗攪拌：cols = 碗裡鮮奶油的顏色；setStir(false) 變回一般的樣子
function setStir(on, cols = []){
  document.querySelectorAll('.dh-chara').forEach((c, i) => {
    if (on) c.querySelector('.dh-stir-bowl').innerHTML = bowlSvg(cols, 's' + i);
    c.classList.toggle('stirring', on);
  });
}
function setFace(name){
  $('faceTag').textContent = SHOW_FACE_TAG ? '［' + name + '］' : '';
  if (speaker === 'maid'){
    avatar.src = host.querySelector('img').src = MAID_FACES[name] || SPEAKERS.maid.img;
    avatarChara.classList.remove('has-hat', 'fx-jump', 'fx-shake');
    return;
  }
  const f = FACES[name] || FACES.微笑;
  const drawn = faceOk[f.img];
  const src = drawn ? FACE_DIR + f.img + '.png' : faceOk.basic ? FACE_DIR + 'basic.png' : SPEAKERS.rabumi.img;
  avatar.src = src;   // 對話框左邊的大 Rabumi（驚訝／慌張的帽子另外疊上去，和房間裡的一樣）
  // 房間裡的 Rabumi（看整間娃娃屋的遠景時一律用 basic）
  const roomSrc = where === 'all' && faceOk.basic ? FACE_DIR + 'basic.png' : src;
  document.querySelectorAll('.dh-room .dh-chara .chat-chara-bob > img').forEach(im => { im.src = roomSrc; });
  document.querySelectorAll('.dh-chara').forEach(c => c.classList.toggle('has-hat', !!(drawn && f.fx)));
  if (name === face) return;
  face = name;
  // 驚訝：帽子跳起來一下（身體一直抖是 style.css 的 .has-hat）
  document.querySelectorAll('.dh-chara').forEach(c => c.classList.remove('fx-jump', 'fx-shake'));
  const who = avatarChara;
  if (who && drawn && f.fx){ void who.offsetWidth; who.classList.add('fx-' + f.fx); }
  const m = avatarChara.querySelector('.dh-mark');
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
  return guard(new Promise(done => {
    if (typing){ clearInterval(typing); typing = null; finishTyping = null; }   // 上一句還在打：直接換成這句
    const [f, line] = splitFace(text);
    const full = fill(line);
    setFace(f);
    box.classList.remove('next'); void box.offsetWidth; box.classList.add('next');
    const who = avatarChara;   // 說話的人（對話框左邊的大角色）跳一下
    if (who){ who.classList.remove('talk'); void who.offsetWidth; who.classList.add('talk'); }
    nextBtn.hidden = true;
    textEl.classList.remove('thinking');
    let i = 0;
    textEl.textContent = '';
    finishTyping = () => { clearInterval(typing); typing = null; finishTyping = null; textEl.textContent = full; done(); };
    typing = setInterval(() => { textEl.textContent = full.slice(0, ++i); if (i >= full.length) finishTyping(); }, TYPE_SPEED);
  }));
}
async function say(text){
  await type(text);
  nextBtn.hidden = false;
  return guard(new Promise(done => { waitNext = done; }));
}
// 按了上一步：正在打的字、等著按 ▼ 的、選項都收掉
function stopTalk(){
  if (typing) clearInterval(typing);
  typing = finishTyping = waitNext = null;
  nextBtn.hidden = true;
  clearPanel();
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
  return guard(answered(new Promise(done => {
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
  })));
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
  return type(question).then(() => guard(answered(new Promise(done =>
    inputPanel({ placeholder, send: single ? '好了' : '送出 ♡', back, single, ...more }, v => done(v || ''))))));
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
  // Rabumi 只出現在她現在待的房間（一開始在色粉櫃；看整間的時候留在原本的房間）
  if (w !== 'all') document.querySelectorAll('.dh-room').forEach(r => r.classList.toggle('here', r.dataset.room === w));
  layout();
  return guard(wait(1700));
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
  removeCharm(){ const t = this.charms.pop(); if (t) t.remove(); }   // 按「上一步」回到上一個房間時拿掉
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
  onBack.push(() => { pullDone = null; pullBtn.classList.remove('armed'); pullHint.classList.remove('show'); });
  return guard(new Promise(r => { pullDone = r; }));
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

// 一碗鮮奶油（img/house/bowl.png，碗裡是白色鮮奶油）：cols[0] = 鮮奶油的顏色；lump = 拌不開的那一團
// 換色：在白色鮮奶油上疊一層顏色（multiply），只染 bowl-cream.png 的範圍（style.css 的 .dh-cream）
// grow = 顏色從中間慢慢暈開；座標用原圖的 884×606（圖有縮小過，用比例對齊）
const BOWL_W = 884, BOWL_H = 606;
function bowlSvg(cols, id, lump, grow){
  const W = BOWL_W, H = BOWL_H, c = cols[0];
  const cream = c ? `<mask id="${id}-cm" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}" style="mask-type:alpha"><image href="img/house/bowl-cream.png" width="${W}" height="${H}"/></mask>
    <rect class="dh-cream${grow ? '' : ' on'}" width="${W}" height="${H}" fill="${c}" mask="url(#${id}-cm)"/>` : '';
  const lumpEl = lump ? `<g transform="translate(560 150) scale(3.4) translate(-146 -50)"><g class="dh-lump"><path d="M132 50 Q134 36 148 38 Q162 38 160 50 Q162 60 146 61 Q130 61 132 50Z" fill="${lump}"/><circle cx="141" cy="44" r="3.5" fill="#fff" opacity=".6"/></g></g>` : '';
  return `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><image href="img/house/bowl.png" width="${W}" height="${H}"/>${cream}${lumpEl}</svg>`;
}

/* ---------- 7. ① 色粉櫃：點一罐色粉 → 飛到碗上倒進去 → 色粉結成 3 顆結塊（拌不勻） ---------- */
// 罐子擺在 cabinet.png 上的位置（原圖 663×1153 的單位）：三層架子的地板 y、每層三罐的中心 x、罐子寬（高照 jar.png 240×318 的比例）
const CAB_W = 663, CAB_H = 1153, SHELF_Y = [486, 704, 920], SHELF_X = [165, 331, 497], JAR_W = 160, JAR_H = JAR_W * 318 / 240;
const jarsEl = $('jars'), bowlEl = $('bowl');
let picked = [];          // 選的心情（只有一罐）
let pickedJar = null, pouring = false, finishColors = null;
// 一罐色粉：白色色粉疊上心情的顏色（只染 jar-powder.png 的範圍），標籤寫心情
const jarHTML = f => `<span class="dh-tint" style="--c:${f.col}"><img src="img/house/jar.png" alt=""><i></i></span>` +
  `<span class="dh-jar-lbl${f.name.length > 2 ? ' long' : ''}">${f.name}</span>`;
FEELS.forEach((f, i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'dh-jar'; b.innerHTML = jarHTML(f);
  b.setAttribute('aria-label', f.name + '（' + f.src + '）');
  // 罐子在架子上的位置（% ；style.css 的 .dh-jar 用；手機版櫃子收起來時改成排兩排）
  b.style.setProperty('--w', JAR_W / CAB_W * 100 + '%');
  b.style.setProperty('--x', (SHELF_X[i % 3] - JAR_W / 2) / CAB_W * 100 + '%');
  b.style.setProperty('--y', (SHELF_Y[Math.floor(i / 3)] - JAR_H) / CAB_H * 100 + '%');
  b.addEventListener('click', () => pour(f, b));
  jarsEl.appendChild(b);
});
// 俯視的鮮奶油碗（色粉櫃的 #bowl、攪拌檯的 #mixBowl）
// col = 心情色（沒有 = 白色）；t = 鮮奶油染了幾成（0 = 白、1 = 整碗心情色）；grow = 從中間暈開、一邊轉一下（像被攪過）
const LUMPY_TINT = .18;   // ★ 拌不勻的時候，鮮奶油只染到幾成（其他的色粉都結成結塊了）
function drawBowl(bowl, col, t = 1, grow){
  const cream = bowl.querySelector('.dh-topcream');
  cream.classList.remove('on', 'swirl', 'now');
  if (!col){ cream.style.removeProperty('--c'); return; }
  cream.style.setProperty('--c', mix('#FFFFFF', col, t));
  void cream.offsetWidth;
  cream.classList.add('on', grow ? 'swirl' : 'now');
}
// 碗裡的 3 顆色粉結塊：col = 結塊的顏色（沒有 = 收起來）
function setLumps(bowl, col){
  bowl.querySelectorAll('.dh-lump').forEach(l => { l.classList.remove('gone'); l.style.removeProperty('--p'); });
  if (col) bowl.style.setProperty('--lc', col);
  bowl.classList.toggle('lumpy', !!col);
}
async function pour(f, b){
  if (!jarsEl.classList.contains('live') || pouring) return;
  pouring = true; stepMoved = true; clearPanel();   // 倒過色粉了：這時按「上一步」= 重選色粉
  if (pickedJar) pickedJar.classList.remove('used');   // 換一罐：前一罐放回架上
  pickedJar = b; picked = [f];
  drawBowl(bowlEl); setLumps(bowlEl);
  // 複製一罐，從架上飛到碗的上方（原本那罐變半透明 = 被拿走了）
  const jr = b.getBoundingClientRect(), br = bowlEl.getBoundingClientRect();
  const w = br.width * .22, h = w * JAR_H / JAR_W;
  const fly = document.createElement('div');
  fly.className = 'dh-fly'; fly.innerHTML = jarHTML(f);
  Object.assign(fly.style, { left: jr.left + 'px', top: jr.top + 'px', width: jr.width + 'px' });
  document.body.appendChild(fly);
  b.classList.add('used');
  requestAnimationFrame(() => requestAnimationFrame(() =>
    Object.assign(fly.style, { left: br.left + br.width * .52 + 'px', top: br.top + br.height * .12 - h * .5 + 'px', width: w + 'px' })));
  await wait(750);
  fly.style.transform = 'rotate(-120deg)';   // 倒過來
  await wait(300);
  for (let k = 0; k < 34; k++){              // 色粉灑進碗的中間
    const s = document.createElement('i');
    s.className = 'dh-dust';
    Object.assign(s.style, { left: br.left + br.width * (.44 + Math.random() * .14) + 'px', top: br.top + br.height * (.18 + Math.random() * .06) + 'px',
      background: f.col, boxShadow: '0 0 0 1px rgba(255,255,255,.6)', animationDelay: k * .025 + 's' });
    s.style.setProperty('--fall', br.height * (.22 + Math.random() * .12) + 'px');
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1800);
  }
  await wait(250);
  drawBowl(bowlEl, f.col, LUMPY_TINT / 2, true);   // 只有一點點顏色暈開
  setLumps(bowlEl, f.col);                         // 大部分的色粉浮在上面，結成 3 顆結塊
  await wait(450);
  fly.classList.add('gone');
  await wait(500);
  fly.remove();
  type(f.say);                               // Rabumi 介紹這罐色粉
  pouring = false;
  showColorChoices();
}
// 倒好之後：「就是這罐」或「換一罐」（按鈕在對話框右邊）
function showColorChoices(){
  panelButtons([
    { t: '就是這罐 ♡', on: () => {
        if (pouring) return;
        jarsEl.classList.remove('live'); clearPanel(); finishColors();
      } },
    { t: '換一罐', free: true, on: () => {
        if (pouring) return;
        pickedJar.classList.remove('used'); pickedJar = null; picked = [];
        drawBowl(bowlEl); setLumps(bowlEl); clearPanel(); type(LINES.color.again);
      } }
  ]);
}
function chooseColors(){
  jarsEl.classList.add('live');
  onBack.push(() => jarsEl.classList.remove('live'));
  return guard(answered(new Promise(done => { finishColors = done; })));
}

// 色粉櫃分成兩步（11. 的 STEPS）：閒聊 → 選色粉、攪拌（拌不勻）；按「上一步」可以回來重選色粉
async function colorChat(){
  await view('color');
  setSpeaker('rabumi');
  await sayAll(LINES.open);
  await sayAll(LINES.color.hello);

  // 閒聊：最近好嗎？（掛心的事到攪拌檯再問）
  memo.free = memo.free.filter(f => f.r !== 'how');
  const a = await ask(LINES.color.askHow, LINES.color.how, '✎ 我想自己說');
  noteFree('how', '最近過得怎麼樣', a);
  await react(a);
}
let colorSeen = false;   // 介紹色粉的話說過了沒（重選的時候不用再說一次）
async function colorPick(){
  // 重來：罐子都放回架上、碗變回白色、Rabumi 放下攪拌碗
  jarsEl.querySelectorAll('.dh-jar').forEach(j => j.classList.remove('used'));
  pickedJar = null; picked = [];
  drawBowl(bowlEl); setLumps(bowlEl); bowlEl.classList.remove('swirl'); setStir(false);
  await view('color');
  if (!colorSeen){ await sayAll(LINES.color.intro); colorSeen = true; await type(LINES.color.pick); }
  else await type(LINES.color.again);
  await chooseColors();
  memo.feels = [...picked];
  memo.main = picked[0];
  memo.feel = picked.map(f => f.name).join('、');
  memo.colors = picked.map(f => f.cn + '的「' + f.name + '」').join('、');
  // Rabumi 攪拌，可是拌不勻：鮮奶油只淡淡染一點，3 顆結塊還在（跟著轉一下）
  setStir(true, [mix('#FFFFFF', memo.main.col, LUMPY_TINT)]);
  onBack.push(() => setStir(false));
  drawBowl(bowlEl, memo.main.col, LUMPY_TINT, true);
  bowlEl.classList.remove('swirl'); void bowlEl.offsetWidth; bowlEl.classList.add('swirl');
  await say(LINES.color.stir);
  setStir(false);
  await say(LINES.color.lumpy);
  await say(LINES.color.reflect);
  await say(LINES.color.named);
  await say(LINES.color.brave);
  await say(LINES.color.later);
  await nextRoom('🎨');
}

/* ---------- 8. ② 攪拌檯：聊一輪 → 拌開一顆結塊（一共 3 顆）→ 鮮奶油變成均勻的心情色 ---------- */
const mixBowl = $('mixBowl'), whisk = $('whisk'), spinEl = mixBowl.querySelector('.dh-spin');
const STIR_TURNS = 2;   // ★ 在碗裡畫幾圈可以拌開一顆結塊（改大 = 要拌比較久）
let creamTurn = 0;      // 碗裡的鮮奶油現在轉到哪裡（弧度）
// 碗下面的蕾絲杯墊：外圈波浪邊 + 兩圈小洞（N = 幾個波浪）
(function doily(){
  const N = 30, R = 100, xy = (a, r) => `cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r).toFixed(1)}"`;
  let edge = '', holes = '';
  for (let k = 0; k < N; k++){
    const a = k / N * Math.PI * 2;
    edge += `<circle ${xy(a, R)} r="11.5" fill="#fff"/>`;
    holes += `<circle ${xy(a, R + 2)} r="2.4"/><circle ${xy(a + Math.PI / N, R - 7)} r="2.6"/>`;   // 每個波浪上一個小洞 + 裡面一圈小洞
  }
  $('doily').innerHTML = `<defs><mask id="doilyHoles"><g>${edge}<circle r="${R}" fill="#fff"/></g><g fill="#000">${holes}</g></mask></defs>
    <circle r="${R + 12}" fill="#FFFDF9" mask="url(#doilyHoles)"/>
    <circle r="${R - 14}" fill="none" stroke="#EFE3D8" stroke-width="1.5" stroke-dasharray="2 5" stroke-linecap="round"/>`;
})();
// 拌開了 n 顆的樣子（重做這一輪的時候用）
function resetBench(n){
  drawBowl(mixBowl, memo.main.col, LUMPY_TINT + (1 - LUMPY_TINT) * n / 3);
  setLumps(mixBowl, memo.main.col);
  mixBowl.querySelectorAll('.dh-lump').forEach((l, k) => l.classList.toggle('gone', k < n));
}
// 攪拌棒：還沒碰碗時，停在碗中間畫圈示範（.hint）；滑鼠移到碗上 / 手指按下去，攪拌棒就跟著走（取代滑鼠游標）
function whiskHint(){
  const r = mixBowl.getBoundingClientRect();
  whisk.classList.add('hint');
  Object.assign(whisk.style, { left: r.left + r.width / 2 + 'px', top: r.top + r.height / 2 + 'px' });
}
// 拌開第 i 顆結塊（0、1、2）：在碗裡按住畫圈，碗不動、裡面的鮮奶油跟著你畫的方向轉，結塊慢慢化開，鮮奶油也多染一點顏色
function stirLump(i){
  const lump = mixBowl.querySelectorAll('.dh-lump')[i], cream = mixBowl.querySelector('.dh-topcream'), col = memo.main.col;
  let p = 0, down = false, lastA = 0, keyHold = false, stopped = false;
  mixBowl.classList.add('live'); mixBowl.tabIndex = 0;
  whisk.style.width = mixBowl.offsetWidth * .72 + 'px';
  whisk.hidden = false; whiskHint();
  return guard(new Promise(done => {
    const set = v => {
      if (p >= 1) return;
      p = Math.min(1, v);
      lump.style.setProperty('--p', p);
      cream.style.setProperty('--c', mix('#FFFFFF', col, LUMPY_TINT + (1 - LUMPY_TINT) * (i + p) / 3));
      if (p >= 1){ stop(); lump.classList.add('gone'); done(); }
    };
    // 轉 d 弧度：鮮奶油跟著轉；轉滿 STIR_TURNS 圈 = 拌開一顆
    const turn = d => { creamTurn += d; spinEl.style.rotate = creamTurn + 'rad'; set(p + Math.abs(d) / (STIR_TURNS * 2 * Math.PI)); };
    const angle = e => { const r = mixBowl.getBoundingClientRect(); return Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2); };
    const follow = e => { whisk.classList.remove('hint'); whisk.style.left = e.clientX + 'px'; whisk.style.top = e.clientY + 'px'; };
    const pdown = e => {
      e.preventDefault(); down = true; lastA = angle(e); follow(e);
      try { mixBowl.setPointerCapture(e.pointerId); } catch (_) {}   // 畫到碗外面也還算在攪
      mixBowl.classList.add('stirring');
    };
    const pmove = e => {
      follow(e);
      if (!down) return;
      const a = angle(e);
      let d = a - lastA;
      if (d > Math.PI) d -= 2 * Math.PI; else if (d < -Math.PI) d += 2 * Math.PI;   // 跨過 180° 的那一下
      lastA = a;
      turn(Math.max(-.6, Math.min(.6, d)));   // 太靠近中心時角度會亂跳：一次最多算 0.6
    };
    const pup = () => { down = false; mixBowl.classList.remove('stirring'); };
    const pleave = () => { if (!down) whiskHint(); };
    // 鍵盤：碗選到之後按住空白鍵，鮮奶油自己慢慢轉
    const key = e => { if (e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); keyHold = e.type === 'keydown'; mixBowl.classList.toggle('stirring', keyHold); } };
    const loop = () => { if (stopped) return; if (keyHold) turn(.08); requestAnimationFrame(loop); };
    const on = [[mixBowl, 'pointerdown', pdown], [mixBowl, 'pointermove', pmove], [mixBowl, 'pointerup', pup], [mixBowl, 'pointercancel', pup],
                [mixBowl, 'pointerleave', pleave], [mixBowl, 'keydown', key], [mixBowl, 'keyup', key], [window, 'resize', whiskHint]];
    on.forEach(([el, ev, fn]) => el.addEventListener(ev, fn));
    function stop(){   // 拌完了，或按了上一步
      stopped = true;
      on.forEach(([el, ev, fn]) => el.removeEventListener(ev, fn));
      mixBowl.classList.remove('live', 'stirring'); mixBowl.removeAttribute('tabindex');
      whisk.hidden = true;
    }
    onBack.push(stop);
    requestAnimationFrame(loop);
  }));
}
async function stirRound(i){
  await type(i ? LINES.bench.stirAgain : LINES.bench.stirHow);
  await stirLump(i);
  if (i < 2) await say(LINES.bench.mixed[i]);
}
// 自己打字的回答記下來（第三輪聊完，Rabumi 會把它們串起來安慰你）；r = 第幾輪
function noteFree(r, q, a){ if (a.free) memo.free.push({ r, q, a: a.t }); }

// 三輪各是一步（11. 的 STEPS），按「上一步」可以重做這一輪，或回到上一輪
async function benchRound(n){
  memo.free = memo.free.filter(f => f.r !== n);
  resetBench(n);
  if (where !== 'bench'){ await view('bench'); await sayAll(LINES.bench.hello); }

  if (n === 0){
    // 第一輪：發生了什麼事？（先選大類，再選細的），每一步 Rabumi 都先回應
    memo.sub = null;
    const a = await ask(LINES.bench.askTopic, TOPICS.map(t => ({ t: t.t, id: t.id })));
    noteFree(0, '最近發生的事', a);
    if (a.free){ memo.topic = FREE_TOPIC; memo.type = a.memo; await react(a, LINES.bench.topicFree); }
    else {
      memo.topic = TOPICS.find(t => t.id === a.id);
      await sayAll(memo.topic.re);
      const b = await ask(memo.topic.ask, memo.topic.subs);
      noteFree(0, '最近發生的事', b);
      memo.sub = b.free ? null : memo.topic.subs.find(s => s.id === b.id);
      memo.type = b.memo;
      await react(b, LINES.bench.subFree);
    }
    await stirRound(0);
  }

  if (n === 1){
    // 第二輪：你最在意的是什麼？
    const c = await ask(LINES.bench.askCore, memo.sub ? memo.sub.cores : FREE_CORES);
    noteFree(1, '最在意的', c);
    memo.core = c.memo;
    await react(c, LINES.bench.coreFree);
    await say(LINES.bench.coreSay);
    await stirRound(1);
  }

  if (n === 2){
    // 第三輪：心裡冒出來的那句話，是真的發生的，還是擔心的？→ 換個說法
    memo.knots = [];
    const k = await ask(LINES.bench.askThought, KNOTS[memo.topic.id] || KNOTS.free, '✎ 我心裡的話不一樣');
    noteFree(2, '心裡冒出來的話', k);
    extra.knot = k.memo;
    if (!(k.free && await checkCrisis(k.t))){
      const r = await ask(LINES.bench.real, [ { t: '真的發生了', id: 'fact' }, { t: '是我擔心會發生的', id: 'worry' }, { t: '我也分不清楚', id: 'unsure' } ], null);
      await sayAll(LINES.bench.realSay[r.id]);
      let to;
      if (k.re){ const w = await ask(LINES.bench.rewrite, k.re.map(t => ({ t })), '✎ 我想自己寫'); noteFree(2, '換個說法', w); to = w.memo; }
      else { to = await askInput(LINES.bench.customRewrite, '例如：搞砸了也可以再試一次'); if (to) memo.free.push({ r: 2, q: '換個說法', a: to }); }
      memo.knots.push({ from: k.memo, to: to || '先不急著下結論' });
    }
    // 前面有自己打字說煩惱的話：Rabumi 把它們串起來，說一段更貼近你的安慰（AI）
    if (memo.free.some(f => f.r !== 'how') && !crisis){
      thinking();
      const pages = toPages(await guard(getBenchReply()));
      for (let i = 0; i < pages.length; i++) await say((i ? '[溫柔]' : '[傾聽]') + pages[i]);
    }
    await stirRound(2);
    await sayAll(LINES.bench.done);
    await nextRoom('🎀');
  }
}

/* ---------- 9. ③ 廚房：用有顏色的鮮奶油做甜點 → 呼吸 → 加甜變柔和 → 最後一步 → 吃掉它 ---------- */
const kitchen = $('kitchen'), breathBtn = $('breath'), dessertEl = $('dessert'), eatBtn = $('eat'), actBtn = $('act'), spoon = $('spoon');
// 跟著呼吸：按住吸氣（圈圈填滿）→ 放開吐氣；做 times 次，每做完一次叫 onStep(做了幾次)
function breathe(times, onStep){
  return new Promise(done => {
    let left = times, holding = false, phase = 'in', start = 0;
    const label = t => { $('breathLabel').textContent = t; };
    const setP = p => breathBtn.style.setProperty('--p', p);
    const sec = (ms, p) => Math.max(1, Math.ceil(ms * (1 - p) / 1000));   // 還剩幾秒
    breathBtn.hidden = false; label('按住・吸氣\n4 秒');
    let timer = null;
    const down = () => {
      if (phase !== 'in' || holding) return;
      holding = true; start = performance.now(); label('吸——\n4');
      timer = setInterval(() => {   // 吸氣：圈圈一點一點填滿（倒數秒數）
        const p = Math.min(1, (performance.now() - start) / INHALE);
        setP(p); label('吸——\n' + sec(INHALE, p));
        if (p >= 1){ clearInterval(timer); exhale(); }
      }, 30);
    };
    const up = () => {
      if (!holding) return;
      holding = false;
      if (phase === 'in'){ clearInterval(timer); setP(0); label('再按久一點點～'); }
    };
    const exhale = () => {
      phase = 'out'; label('放開・慢慢吐——\n6');
      left--;
      onStep(times - left);
      const s = performance.now();
      timer = setInterval(() => {   // 吐氣：圈圈慢慢退回去（倒數秒數）
        const p = 1 - (performance.now() - s) / EXHALE;
        setP(Math.max(0, p));
        if (p > 0){ label('放開・慢慢吐——\n' + sec(EXHALE, 1 - p)); return; }
        clearInterval(timer);
        if (!left){ cleanup(); breathBtn.hidden = true; done(); return; }
        phase = 'in'; holding = false; label(`按住・吸氣 4 秒\n（還有 ${left} 次）`);
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

// 一起做三次深呼吸：開始前說明 → 跟著按鈕呼吸（甜點跟著起伏）→ 做好了 → 問問現在的感覺
async function breatheTogether(T, onStep){
  await say(T.breathe);
  await say(LINES.bake.breatheStart);
  await type(LINES.bake.breatheHow);
  await breathe(BREATHS, onStep);
  await say(T.formed);
  await say(LINES.bake.breatheEnd);
}

function presetReply(){ return { comfort: fill(PRESET.comfort), advice: fill(PRESET.advice) }; }
// 攪拌檯第三輪後：玩家有自己打字的話，Rabumi 把前面打的話串起來，說幾句更貼近他煩惱的安慰（AI；不能用就用寫好的句子拼）
function presetBench(){
  const said = memo.free.filter(f => f.r !== 'how' && f.q !== '換個說法').map(f => '「' + f.a + '」');
  const to = memo.knots[0] && memo.knots[0].to;
  return fill((said.length ? `{NAME}，你跟我說了${said.join('、')}……\n` : '{NAME}，謝謝你用自己的話告訴我這些。\n') +
    '一件事牽著另一件事，難怪心裡會這麼滿。' + (to ? `\n不過你也找到了「${to}」這句話，真的很棒。` : '') +
    '\n謝謝你一句一句說出來，我都有好好聽到喔♡');
}
async function getBenchReply(){
  if (!AI_URL) return presetBench();
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    const res = await fetch(AI_URL, {
      method: 'POST', signal: ctrl.signal, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chara: 'house', stage: 'bench', name: nameQ ? playerName : '', topic: memo.topic.t || '自己說的煩惱', type: memo.type,
                             colors: memo.colors, core: memo.core, knots: memo.knots.map(k => `「${k.from}」→「${k.to}」`).join('；'),
                             free: memo.free.map(f => f.q + '：' + f.a).join('\n') })
    });
    clearTimeout(timer);
    const data = await res.json();
    if (!res.ok || !data.comfort){ console.warn('AI 沒有回應（改用寫好的話）：', data.error || res.status); return presetBench(); }
    return data.comfort;
  } catch (e){ console.warn('AI 連不上（改用寫好的話）：', e); return presetBench(); }
}
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
    if (!res.ok || !(data.comfort || data.reply)){ console.warn('AI 沒有回應（改用寫好的話）：', data.error || res.status); return presetReply(); }
    return { comfort: data.comfort || data.reply, advice: data.advice || '' };
  } catch (e){ console.warn('AI 連不上（改用寫好的話）：', e); return presetReply(); }
}
// 長的回應：按句號切成幾段，一段一段說
function toPages(text){
  const parts = text.split(/(?<=[。！？!?♡])(?![」』）])\s*|\n/).map(s => s.trim()).filter(Boolean);
  const pages = [];
  parts.forEach(p => { const last = pages[pages.length - 1]; if (last && (last + p).length <= 46) pages[pages.length - 1] = last + p; else pages.push(p); });
  return pages;
}

// 甜點的樣子：type = 哪一種、cols = 心情的顏色、colored = 加了鮮奶油沒、form = 呼吸了幾次、top = 加的甜、done = 做完最後一步
const D = { type: 'pancake', cols: [], colored: false, form: 0, top: null, done: false };
const img = (key, x, y, w, h, extraAttr = '') => `<image href="${ART[key]}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMax meet" ${extraAttr}/>`;
// 畫好的甜點圖：fill 那張染上心情的顏色，再疊上 line 那張
let tintN = 0;
function imgTint(name, x, y, w, h, c){
  const id = 'd-tf' + (tintN++), col = c === 'marble' ? MARBLE[0] : c;
  return `<filter id="${id}" color-interpolation-filters="sRGB"><feFlood ${tint(col, 'd', 'flood-color')} result="f"/><feComposite in="f" in2="SourceGraphic" operator="in" result="a"/><feBlend in="a" in2="SourceGraphic" mode="multiply"/></filter>` +
    img(name + '-fill', x, y, w, h, `filter="url(#${id})"`) + img(name + '-line', x, y, w, h);
}
const hasArt = name => ART[name + '-line'] && ART[name + '-fill'];
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
// 最後一步：按鬆餅、倒出布丁（點甜點或按鈕都可以）
function finishStep(T){
  return new Promise(done => {
    const go = () => {
      dessertEl.onclick = actBtn.onclick = null; actBtn.hidden = true; dessertEl.disabled = true; kitchen.classList.remove('acting');
      if (D.type === 'pancake'){ dessertEl.classList.add('squish'); }
      else { D.done = true; render(); dessertEl.classList.add('flip'); }
      setTimeout(done, 1300);
    };
    actBtn.textContent = T.act; actBtn.hidden = false; dessertEl.disabled = false; kitchen.classList.add('acting');
    dessertEl.onclick = actBtn.onclick = go;
  });
}
// 顯示右下角的按鈕，等玩家按下去
function press(label){
  return new Promise(done => {
    actBtn.textContent = label; actBtn.hidden = false; actBtn.focus({ preventScroll: true });
    actBtn.onclick = () => { actBtn.onclick = null; actBtn.hidden = true; done(); };
  });
}

/* ---------- 舒芙蕾鬆餅（課業）：① 煎鍋＋跟著呼吸 → ② 疊起來、膨起來 → ③ 自己放配料 ---------- */
// 圖層在 index.html 的 #pancake；位置照示範頁的 360×420 座標（PK_W、PK_H）換成 %；只有冰淇淋會染上心情的顏色
const pkEl = $('pancake'), pkBatter = $('pkBatter'), pkCake = $('pkCake'), pkTools = $('pancakeTools'), pkHit = $('pkHit');
const PK_W = 360, PK_H = 420;
const PK_PW = 330, PK_PH = PK_PW * 615 / 1123, PK_FH = PK_PW * 530 / 1163;   // 一片鬆餅的寬、膨起來的高、扁扁的高
// 配料：f = 圖檔、w = 寬、z = 前後（奶油永遠在水果後面）、n = 名字
const PK_TOPS = {
  cream: { f: 'cream-dollop', w: 56, z: 300, n: '奶油' },
  berry: { f: 'strawberry', w: 40, z: 1300, n: '草莓' },
  half:  { f: 'strawberry-half', w: 42, z: 1300, n: '半顆草莓' },
  blue:  { f: 'blueberry', w: 28, z: 1300, n: '藍莓' }
};
const PK_MAX = 16;   // ★ 最多放幾個配料
const PK_BITES = [[[50, 30, 13], [62, 37, 10]], [[30, 48, 14], [41, 58, 12]], [[70, 50, 14], [59, 64, 12]]];   // 吃一口咬掉的地方 [x%, y%, 半徑%]
const pkX = v => v / PK_W * 100 + '%', pkY = v => v / PK_H * 100 + '%';
let pkTool = 'cream', pkPcs = [], pkSheets = [], pkIce = null;
function pkLayer(cls, src, x, w, z){
  const d = document.createElement('div');
  d.className = cls; d.innerHTML = `<img src="img/pancake/${src}.png" alt="">`;
  Object.assign(d.style, { left: pkX(x), width: pkX(w), zIndex: z });
  pkCake.appendChild(d);
  return d;
}
// 重來：回到煎鍋，三片扁扁的鬆餅 + 兩層鮮奶油 + 冰淇淋（先藏著）
function pancakeReset(){
  pkEl.className = 'pk';
  pkCake.innerHTML = ''; pkPcs = []; pkSheets = [];
  pkCake.style.maskImage = pkCake.style.webkitMaskImage = '';
  for (let i = 0; i < 3; i++){
    pkPcs.push(pkLayer('pk-pc', 'pancake-flat', 15, PK_PW, 10 + i * 10));
    if (i < 2) pkSheets.push(pkLayer('pk-sheet', 'cream-sheet', 45, 270, 15 + i * 10));   // 鮮奶油比鬆餅窄一點，從中間露出一圈
  }
  pkIce = pkLayer('pk-ice', 'icecream', 122, 116, 200);
  pkIce.insertAdjacentHTML('beforeend', '<i></i>');
  pkIce.style.setProperty('--c', memo.main.col);
  pkLayout(false);
  pkBatter.style.transitionDuration = '0s'; pkBatter.style.transform = 'translate(-50%, -50%) scale(.35)';
}
// 疊起來的位置：puff = 膨起來了沒（膨起來：換圖、間距拉開）
function pkLayout(puff){
  const st = puff ? 62 : 30, ph = puff ? PK_PH : PK_FH;
  pkPcs.forEach((p, i) => { p.style.bottom = pkY(20 + i * st); p.querySelector('img').src = 'img/pancake/' + (puff ? 'pancake-puff' : 'pancake-flat') + '.png'; });
  pkSheets.forEach((s, i) => { s.style.bottom = pkY(20 + i * st + ph * (puff ? .30 : .28)); });
  pkIce.style.bottom = pkY(20 + 2 * st + ph * .42);
}
// 吐氣時麵糊冒泡泡：每 0.4 秒冒一顆
function pkBubbles(){
  for (let k = 0; k < 14; k++) setTimeout(() => {
    const b = document.createElement('i'), a = Math.random() * 6.28, r = Math.random() * 25;   // r = 離麵糊中心幾 %（鍋子寬的 %）
    b.className = 'pk-bub';
    Object.assign(b.style, { left: 50 + Math.cos(a) * r + '%', top: 69.5 + Math.sin(a) * r * 240 / 384 + '%' });
    $('pkPan').appendChild(b);
    setTimeout(() => b.remove(), 1500);
  }, k * 400);
}
// 跟著畫面呼吸（不用按住）：吸氣 INHALE、吐氣 EXHALE，做 times 次；畫面倒數秒數；可以按「跳過」
async function guidedBreath(times, onIn, onOut){
  const label = t => { $('pkBreath').textContent = t; }, skip = $('pkSkip');
  let skipped = false;
  skip.hidden = false; skip.onclick = () => { skipped = true; };
  for (let i = 0; i < times && !skipped; i++){
    onIn(i);
    for (let s = INHALE / 1000; s > 0 && !skipped; s--){ label(`吸氣…… ${s}`); await wait(1000); }
    if (skipped) break;
    onOut(i);
    for (let s = EXHALE / 1000; s > 0 && !skipped; s--){ label(`吐氣…… ${s}`); await wait(1000); }
  }
  label(''); skip.hidden = true; skip.onclick = null;
  if (skipped) onIn(times - 1);   // 跳過：麵糊直接變成煎好的大小
}
async function makePancake(T){
  // ① 煎鍋（俯視）：吸氣麵糊慢慢擴開、吐氣冒泡泡，3 輪
  await say(T.color);
  await say(T.pour);
  await say(LINES.bake.breatheStart);
  await press(T.startAct);
  type(T.breathing);
  await guidedBreath(BREATHS, i => {
    pkBatter.style.transitionDuration = INHALE / 1000 + 's';
    pkBatter.style.transform = `translate(-50%, -50%) scale(${.55 + .15 * (i + 1)})`;
  }, pkBubbles);
  await say(LINES.bake.breatheEnd);
  await type(T.cooked);
  await press(T.stackAct);
  // ② 側面：三片扁扁的鬆餅疊在一起 → 再吸一口氣 → 膨起來 → 冰淇淋掉到最上面
  pkEl.classList.add('stack');
  type(T.flat);
  await wait(800);
  for (let s = INHALE / 1000; s > 0; s--){ $('pkBreath').textContent = `吸氣…… ${s}`; await wait(1000); }
  $('pkBreath').textContent = '';
  pkLayout(true);
  await wait(1200);
  pkIce.classList.add('show');
  await say(T.puffed);
  await say(T.ice);
  // ③ 裝飾：玩家自己放配料
  pkSetTool('cream');
  pkTools.hidden = false;
  pkEl.classList.add('decorating');
  type(T.deco);
  await press(T.decoDone);
  pkTools.hidden = true;
  pkEl.classList.remove('decorating');
  const used = Object.keys(PK_TOPS).filter(k => pkCake.querySelector(`.pk-item[data-t="${k}"]`)).map(k => PK_TOPS[k].n).join('、');
  memo.sweet = { t: used || '原味', sweet: used || '冰淇淋' };   // 鬆餅的「加進去的甜」= 玩家放的配料
  await say(used ? T.decoSay : T.decoNone);
}
function pkSetTool(t){
  pkTool = t;
  pkTools.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === t));
}
pkTools.querySelectorAll('button').forEach(b => { b.onclick = () => pkSetTool(b.dataset.t); });
// 點最上面那片鬆餅的頂面：放一個配料；點到已經放好的：拿掉
pkHit.addEventListener('pointerdown', e => {
  const r = pkEl.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * PK_W, y = (e.clientY - r.top) / r.height * PK_H;
  for (const it of [...pkCake.querySelectorAll('.pk-item')].reverse()){
    const b = it.getBoundingClientRect();
    if (e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom){ it.remove(); return; }
  }
  const cy = PK_H - (20 + 2 * 62 + PK_PH) + PK_PH * .40;   // 頂面（橢圓）的中心
  if (((x - PK_W / 2) / 110) ** 2 + ((y - cy) / 34) ** 2 > 1) return;
  if (pkCake.querySelectorAll('.pk-item').length >= PK_MAX) return;
  const t = PK_TOPS[pkTool];
  const d = pkLayer('pk-item', t.f, x - t.w / 2, t.w, t.z + Math.round(y));
  d.dataset.t = pkTool; d.style.top = pkY(y - t.w * .9);
});
// 吃掉鬆餅：一口一個洞（radial-gradient 疊起來當遮罩），最後一口整個不見
function pancakeBite(n){
  if (n >= PK_BITES.length){ pkEl.classList.add('gone'); return; }
  const holes = PK_BITES.slice(0, n + 1).flat().map(([x, y, r]) => `radial-gradient(${r}% ${r * PK_W / PK_H}% at ${x}% ${y}%, transparent 97%, #000 100%)`).join(', ');
  Object.assign(pkCake.style, { maskImage: holes, webkitMaskImage: holes, maskComposite: 'intersect', webkitMaskComposite: 'source-in' });
}

/* ---------- 原宿可麗餅（人際）：① 攤開 → ② 捲起來 → ③ 放料 → ④ 裝飾 ---------- */
// 圖層在 index.html 的 #crepe；只有冰淇淋會染上心情的顏色，其他都是原本的顏色
const crepeEl = $('crepe'), crepeRolled = $('crepeRolled'), crepeBase = $('crepeBase'), crepeTools = $('crepeTools'), crepeHit = $('crepeHit'), crepeSpr = $('crepeSpr');
const choco = $('crepeChoco').getContext('2d');
const CP_W = 882, CP_H = 639;   // 捲好的可麗餅圖的大小：巧克力醬和糖的位置都用這張圖的像素來算
// 巧克力醬和糖只能在開口的餡料上（不能跑到餅皮外面或折起來的那片上）
const CP_FILL = new Path2D();
[[38, 274], [73, 149], [153, 69], [293, 19], [463, 4], [643, 39], [723, 79], [653, 169], [563, 339], [473, 529], [383, 489], [243, 419], [103, 359]]
  .forEach(([x, y], i) => i ? CP_FILL.lineTo(x, y) : CP_FILL.moveTo(x, y));
CP_FILL.closePath();
// 糖：list = sprinkles/ 裡的檔名、n = 一次撒幾顆、size = 大小（原圖像素）
const SPRINKLES = {
  star: { list: ['star0', 'star1', 'star2', 'star3', 'star4', 'star5'], n: 2, size: [37, 51] },
  rod:  { list: ['rod6', 'rod7', 'rod8', 'rod9', 'rod10', 'rod11', 'rod12', 'rod13'], n: 4, size: [32, 43] }
};
const SPRINKLE_MAX = 220;
// 吃一口：每一口咬掉的地方 [x, y, 半徑]（都是捲好的可麗餅寬度的 %）；最後一口吃光光
const CREPE_BITES = [[[46, 4, 14], [64, 7, 13]], [[80, 24, 12], [93, 42, 17]], [[10, 38, 14], [24, 62, 15]]];
let cpTool = 'choco', cpUsed = {}, cpDown = false, cpLast = null, cpDrop = null;
new Image().src = 'img/crepe/crepe-full.png';   // 先載好，放料完換圖的時候才不會閃一下

function crepeReset(){
  crepeEl.className = 'cp';
  crepeEl.style.removeProperty('--g');
  crepeBase.src = 'img/crepe/crepe-empty.png';
  crepeEl.querySelectorAll('.cp-cream, .cp-fruit, .cp-ice').forEach(e => e.classList.remove('show', 'away'));
  crepeEl.querySelector('.cp-ice').style.setProperty('--c', memo.main ? memo.main.col : '#fff');
  choco.clearRect(0, 0, CP_W, CP_H);
  crepeSpr.innerHTML = '';
  crepeRolled.style.maskImage = crepeRolled.style.webkitMaskImage = '';
  cpUsed = {};
}
async function makeCrepe(T){
  // ① 攤開：跟著呼吸把餅皮煎到金黃 → 抹上奶油
  await say(T.color);
  await breatheTogether(T, k => crepeEl.style.setProperty('--g', k / BREATHS));
  crepeEl.classList.add('spread');
  await type(T.spread);
  await press(T.act);
  // ② 捲起來：攤開的餅皮往中間收，架子和空的可麗餅浮上來
  crepeEl.classList.add('rolling');
  await wait(350);
  crepeEl.classList.add('rolled');
  await wait(750);
  await type(T.rolled);
  await press(T.fillAct);
  // ③ 放料：鮮奶油 → 草莓和香蕉 → 冰淇淋，自動一層一層放（不讓玩家自己擺，畫面才不會亂掉）
  for (const [i, cls] of ['.cp-cream', '.cp-fruit', '.cp-ice'].entries()){
    crepeEl.querySelector(cls).classList.add('show');
    await Promise.all([type(T.fill[i]), wait(900)]);
  }
  crepeBase.src = 'img/crepe/crepe-full.png';   // 換成料都放好的圖；冰淇淋那層留著，因為要換色
  crepeEl.querySelectorAll('.cp-cream, .cp-fruit').forEach(e => e.classList.add('away'));
  await sayAll(T.filled);
  // ④ 裝飾：玩家自由淋巧克力醬、撒糖
  setTool('choco');
  crepeTools.hidden = false;
  crepeEl.classList.add('decorating');
  type(T.deco);
  await press(T.decoDone);
  crepeTools.hidden = true;
  crepeEl.classList.remove('decorating');
  const used = [cpUsed.choco && '巧克力醬', cpUsed.star && '星星糖', cpUsed.rod && '彩色糖'].filter(Boolean).join('、');
  memo.sweet = { t: used || '原味', sweet: used || '冰淇淋' };   // 可麗餅的「加進去的甜」= 玩家加的裝飾
  await say(used ? T.decoSay : T.decoNone);
}
function setTool(t){
  cpTool = t;
  crepeTools.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === t));
}
crepeTools.querySelectorAll('button').forEach(b => { b.onclick = () => setTool(b.dataset.t); });
// 巧克力醬：深咖啡色的線，上面再疊一條細細的亮線當反光
function chocoLine(a, b){
  choco.save();
  choco.clip(CP_FILL);
  choco.lineCap = choco.lineJoin = 'round';
  [['#4a2a1d', 14, 0, 0], ['rgba(140,90,66,.55)', 4.3, -2.7, -3.7]].forEach(([c, w, dx, dy]) => {
    choco.strokeStyle = c; choco.lineWidth = w;
    choco.beginPath(); choco.moveTo(a[0] + dx, a[1] + dy); choco.lineTo(b[0] + dx, b[1] + dy); choco.stroke();
  });
  choco.restore();
  if (choco.isPointInPath(CP_FILL, b[0], b[1])) cpUsed.choco = true;
}
// 星星糖／彩色糖：在手指附近隨機撒幾顆
function cpSprinkle([x, y]){
  const S = SPRINKLES[cpTool];
  for (let j = 0; j < S.n && crepeSpr.children.length < SPRINKLE_MAX; j++){
    const ox = x + (Math.random() - .5) * 70, oy = y + (Math.random() - .5) * 48;
    if (!choco.isPointInPath(CP_FILL, ox, oy)) continue;
    const w = S.size[0] + Math.random() * (S.size[1] - S.size[0]);
    const im = document.createElement('img');
    im.src = `img/crepe/sprinkles/${S.list[Math.floor(Math.random() * S.list.length)]}.png`;
    im.className = 'cp-sp'; im.alt = '';
    Object.assign(im.style, { width: w / CP_W * 100 + '%', left: (ox - w / 2) / CP_W * 100 + '%', top: (oy - w / 2) / CP_H * 100 + '%' });
    im.style.setProperty('--r', Math.random() * 360 + 'deg');
    crepeSpr.appendChild(im);
    cpUsed[cpTool] = true;
  }
}
const cpAt = e => { const r = crepeRolled.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * CP_W, (e.clientY - r.top) / r.height * CP_H]; };
crepeHit.addEventListener('pointerdown', e => {
  cpDown = true;
  crepeHit.setPointerCapture(e.pointerId);
  const p = cpAt(e);
  cpLast = cpDrop = p;
  if (cpTool === 'choco') chocoLine(p, [p[0] + .1, p[1] + .1]); else cpSprinkle(p);
});
crepeHit.addEventListener('pointermove', e => {
  if (!cpDown) return;
  const p = cpAt(e);
  if (cpTool === 'choco'){ chocoLine(cpLast, p); cpLast = p; }
  else if (Math.hypot(p[0] - cpDrop[0], p[1] - cpDrop[1]) > 37){ cpSprinkle(p); cpDrop = p; }   // 每移動一小段撒一次
});
['pointerup', 'pointercancel'].forEach(v => crepeHit.addEventListener(v, () => { cpDown = false; }));
// 可麗餅被咬掉的地方：一個洞一個 radial-gradient，疊起來當遮罩
function crepeBite(n){
  if (n >= CREPE_BITES.length){ crepeEl.classList.add('gone'); return; }
  const holes = CREPE_BITES.slice(0, n + 1).flat().map(([x, y, r]) => `radial-gradient(${r}% ${r * CP_W / CP_H}% at ${x}% ${y}%, transparent 97%, #000 100%)`).join(', ');
  Object.assign(crepeRolled.style, { maskImage: holes, webkitMaskImage: holes, maskComposite: 'intersect', webkitMaskComposite: 'source-in' });
}

// 吃一口：每一口咬掉的地方 [x, y, 半徑]
const BITES = [
  [[120, 64, 30], [146, 84, 22], [98, 84, 20]],
  [[172, 110, 34], [176, 150, 32], [150, 96, 26]],
  [[68, 110, 34], [70, 150, 30], [100, 92, 28], [124, 80, 30]],
  [[120, 120, 90]]
];
function eatAll(){
  const isCrepe = D.type === 'crepe', isPk = D.type === 'pancake', target = isCrepe ? crepeEl : isPk ? pkEl : dessertEl;
  return new Promise(done => {
    let bites = 0, chewing = false;
    const bite = async () => {
      if (chewing || bites >= BITES.length) return;
      chewing = true;
      spoon.classList.remove('scoop'); void spoon.offsetWidth; spoon.classList.add('scoop');
      await wait(420);
      if (isCrepe) crepeBite(bites);
      else if (isPk) pancakeBite(bites);
      else {
        const mask = $('dhBite');
        BITES[bites].forEach(([x, y, r]) => svg('circle', { cx: x, cy: y, r, fill: '#000' }, mask));
        const crumbs = dessertEl.querySelector('.ds-crumbs');
        const c = memo.main.col === 'marble' ? MARBLE[0] : memo.main.col;
        for (let i = 0; i < 3; i++) svg('circle', { cx: 70 + Math.random() * 100, cy: 164 + Math.random() * 10, r: 1.5 + Math.random() * 2, fill: soften(c) }, crumbs);
      }
      target.classList.remove('chomp'); void target.offsetWidth; target.classList.add('chomp');
      const line = LINES.bake.bites[bites];
      bites++;
      if (bites >= BITES.length){ dessertEl.disabled = true; target.onclick = null; eatBtn.hidden = true; kitchen.classList.remove('eating'); }
      if (bites < BITES.length){ await type(line); chewing = false; return; }
      await say(line);   // 最後一口：等玩家按 ▸
      done();
    };
    target.onclick = bite; eatBtn.onclick = bite;
    kitchen.classList.add('eating'); dessertEl.disabled = false; eatBtn.hidden = false;
  });
}

let reply = null;
async function roomBake(){
  const T = DESSERTS[memo.topic.dessert] || DESSERTS.crepe;
  Object.assign(D, { type: memo.topic.dessert || 'crepe', cols: memo.feels.map(f => f.col), colored: false, form: 0, top: null, done: false });
  const isCrepe = D.type === 'crepe', isPk = D.type === 'pancake';   // 可麗餅、鬆餅用畫好的圖層（makeCrepe、makePancake），布丁還是原本的做法
  extra.dessert = isCrepe ? T.name : memo.main.src + T.name;
  dessertEl.hidden = isCrepe || isPk; crepeEl.hidden = !isCrepe; pkEl.hidden = !isPk;
  if (isCrepe) crepeReset(); else if (isPk) pancakeReset(); else render();
  await view('bake');
  await sayAll(LINES.bake.invite);
  await react(await ask(LINES.bake.inviteAsk, LINES.bake.inviteOpts, null));

  // 這個甜點為什麼像你的煩惱
  await sayAll(T.intro);
  if (isCrepe) await makeCrepe(T);
  else if (isPk) await makePancake(T);
  else {
    // 把有顏色的鮮奶油加進去
    await say(T.color);
    D.colored = true; render();
    await wait(400);

    // 呼吸：等它做好（鬆餅膨起來／布丁凝固）
    await breatheTogether(T, k => { D.form = k; render(); });

    // 加一點甜（= 現在需要的東西）→ 顏色變柔和
    const s = await ask(LINES.bake.sweetAsk, LINES.bake.sweets, '✎ 我想要別的甜');
    memo.sweet = s.free ? { t: s.t, sweet: '一匙糖' } : { t: s.t, sweet: s.sweet };
    D.top = s.free ? 'sugar' : s.id;
    render();
    await react(s, LINES.bake.sweetFree);
    softenAll();
    await sayAll(LINES.bake.soften);
  }

  // 寫一句話給自己
  memo.words = await askInput(LINES.bake.askCard, LINES.bake.cardPh, false, '不寫了，就這樣');
  if (!await checkCrisis(memo.words)) await say(memo.words ? LINES.bake.cardSay : LINES.bake.cardSkip);

  // 最後一步（等的時候，AI 在後面想要說的話）；可麗餅、鬆餅已經做好了，直接等 AI
  const replyP = crisis ? Promise.resolve({ comfort: fill(CRISIS_AGAIN), advice: '' }) : getReply();
  if (!isCrepe && !isPk){
    await type(T.actAsk);
    await finishStep(T);
    await sayAll(T.acted);
  }
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
    D.type === 'crepe' ? ['可麗餅的裝飾', memo.sweet ? memo.sweet.t : '']
                       : ['加進去的甜', memo.sweet ? memo.sweet.t + '（' + memo.sweet.sweet + '）' : ''],
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
  await runSteps();
}
// 茶會的每一步：back = 這一步可以按「↩ 上一步」（廚房、茶桌有動畫在跑，先不給回去）
const STEPS = [
  { run: colorChat },
  { run: colorPick, back: true },
  { run: () => benchRound(0), back: true },
  { run: () => benchRound(1), back: true },
  { run: () => benchRound(2), back: true },
  { run: roomBake },
  { run: roomTable }
];
const backBtn = $('chatBack');
// 按「上一步」：這一步已經回答過東西 → 重做這一步；還沒回答 → 回到上一步
backBtn.addEventListener('click', e => {
  e.stopPropagation();   // 不要順便翻到下一句
  if (!gate || pouring) return;
  const g = gate; gate = null;
  onBack.forEach(f => f());
  stopTalk();
  g.back(BACK);
});
async function runSteps(){
  const charmsAt = [];   // 每一步開始時，緞帶上有幾個小掛飾（回到那一步時拿掉多的）
  for (let i = 0; i < STEPS.length;){
    newGate(); stepMoved = false;
    charmsAt[i] = bell.charms.length;
    backBtn.hidden = !STEPS[i].back;
    try { await STEPS[i].run(); i++; }
    catch (err){
      if (err !== BACK) throw err;
      if (!stepMoved && i > 0) i--;
      while (bell.charms.length > charmsAt[i]) bell.removeCharm();
    }
  }
  gate = null; backBtn.hidden = true;
}
// 收下邀請卡之後（invite.js）才開始：娃娃屋出現 → 莓露露出場
function startHouse(){
  house.style.transition = 'none'; layout(); void house.offsetWidth; house.style.transition = '';
  setTimeout(() => { box.classList.add('in'); run(); }, 1600);
}
