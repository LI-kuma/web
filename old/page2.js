// It's Tea Time 第二頁互動
/* ===== 可以自己調的設定 ===== */
const NOTE_DELAY = 1000;   // 進來後停幾毫秒才跳出紙條（1000 = 1 秒）

/* ---------- 主人的紙條：停一下跳出來，按 X 或 Esc 關閉 ---------- */
const note = document.getElementById('note');
const noteClose = document.getElementById('noteClose');

setTimeout(() => {
  note.classList.add('show');
  noteClose.focus({ focusVisible: false });   // 讓鍵盤可以直接按 Enter 關閉，但不畫出虛線框
}, NOTE_DELAY);

function closeNote(){
  if (!note.classList.contains('show')) return;
  note.classList.remove('show');
  document.body.classList.add('leaving');   // 開始轉場白幕（style.css 的 .fade-white）
}

// 白幕變到全白之後要做的事（例如換到下一頁）寫在這裡
const fadeWhite = document.getElementById('fadeWhite');
fadeWhite.addEventListener('animationend', e => {
  if (e.target === fadeWhite) location.href = 'page3.html';
});
noteClose.addEventListener('click', closeNote);
addEventListener('keydown', e => { if (e.key === 'Escape') closeNote(); });
