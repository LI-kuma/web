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

function closeNote(){ note.classList.remove('show'); }
noteClose.addEventListener('click', closeNote);
addEventListener('keydown', e => { if (e.key === 'Escape') closeNote(); });
