// It's Tea Time 第三頁互動
/* ===== 可以自己調的設定 ===== */
const DIALOG_DELAY = 2000;   // 白幕淡出後停幾毫秒才跳出對話框
// 對話內容：{NAME} 會換成輸入的名字；換行直接用 \n
const LINES = {
  ask:     { text: '哈囉! 可以告訴我你叫什麼名字嗎~~', btn: '好呀~我告訴你' },
  welcome: { text: '{NAME}這名字真適合你!\n那接下來請選擇你最近的煩惱，每隻角色皆為一種煩惱!\n可點選每隻角色查看煩惱~~', btn: '了解!我試試看' }
};

const dialog = document.getElementById('dialog');
const dialogText = document.getElementById('dialogText');
const dialogBtn = document.getElementById('dialogBtn');
const nameDim = document.getElementById('nameDim');
const nameForm = document.getElementById('nameForm');
const nameInput = document.getElementById('nameInput');
let step = 'ask';
let userName = '';

// 圖還沒放進來的時候先藏起來，不會出現破圖
document.querySelectorAll('.chara img, .owner').forEach(img => img.addEventListener('error', () => img.style.visibility = 'hidden'));

function say(key){
  step = key;
  dialogText.textContent = LINES[key].text.replace('{NAME}', userName);
  dialogBtn.textContent = LINES[key].btn;
}

/* ---------- 1. 進場：白幕淡出後跳出對話框 ---------- */
say('ask');
dialog.classList.add('hide');
setTimeout(() => dialog.classList.remove('hide'), DIALOG_DELAY);

/* ---------- 2. 按對話框按鈕 ---------- */
dialogBtn.addEventListener('click', () => {
  if (step === 'ask'){
    nameDim.classList.add('show');
    setTimeout(() => nameInput.focus(), 300);
  } else if (step === 'welcome'){
    dialog.classList.add('hide');   // 收起對話框，讓使用者去點角色
  }
});

/* ---------- 3. 輸入名字 ---------- */
nameForm.addEventListener('submit', e => {
  e.preventDefault();
  const v = nameInput.value.trim();
  if (!v){
    nameInput.classList.remove('shake'); void nameInput.offsetWidth; nameInput.classList.add('shake');
    nameInput.focus();
    return;
  }
  userName = v;
  try { sessionStorage.setItem('teaName', v); } catch (_) {}   // 之後的頁面也可以叫出名字
  nameDim.classList.remove('show');
  say('welcome');
});

/* ---------- 4. 點角色（之後要做的事寫在這裡） ---------- */
document.querySelectorAll('.chara').forEach(btn => btn.addEventListener('click', () => {
  // btn.dataset.chara 是 1 / 2 / 3
}));
