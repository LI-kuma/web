// It's Tea Time 新流程開頭：標準字 → 莓露露的邀請卡 → 收下 → 同一頁換成娃娃屋（house.js）
// 整個檔案包在 (() => { … })() 裡面，名字才不會和 house.js 的撞在一起
(() => {
/* ===== 可以自己調的設定 ===== */
const PULL_OUT = .55;             // 卡片要抽出多少（卡片高度的幾倍）才算抽出來，放開就會整張拿出來
const WHITE_TIME = 1000;          // 收下邀請後，淡成白色花幾毫秒（和 style.css 的 fadeWhiteIn 1s 一樣）
const HINTS = {
  seal: '點愛心，拆開信封',
  pull: '把卡片往上抽出來 ↑',
  read: ''
};
/* ===== 設定到這裡為止，下面是程式 ===== */

const $ = id => document.getElementById(id);
const logo = $('logo'), fog = $('fog'), stage = $('stage'), fogHint = document.querySelector('.fog-hint');
const invite = $('invite'), env = $('env'), card = $('card'), seal = $('seal'), hint = $('invHint'), accept = $('accept');

/* ---------- 1. 標準字：先在中間，點一下滑到左上角（和首頁一樣） ---------- */
let entered = false;
const LOGO_W = 0.5, LOGO_H = 0.62;   // 中間的標準字：最多佔畫面寬的 50%、高的 62%
function placeLogo(){
  if (!entered){
    const r = stage.getBoundingClientRect();
    const ratio = 1362 / 2213;
    const w = Math.min(r.width * LOGO_W, r.height * LOGO_H / ratio);
    const h = w * ratio;
    logo.style.width = w + 'px';
    logo.style.left = (r.left + r.width / 2 - w / 2) + 'px';
    const top = r.top + r.height / 2 - h / 2 - r.height * 0.04;
    logo.style.top = top + 'px';
    fogHint.style.top = Math.min(top + h + 28, innerHeight - 90) + 'px';
    fogHint.style.bottom = 'auto';
  } else {
    logo.style.width = logo.style.left = logo.style.top = '';
    logo.classList.add('logo-corner');
  }
}
placeLogo();
addEventListener('resize', () => { logo.classList.remove('animate'); placeLogo(); });

function enter(){
  if (entered) return;
  entered = true;
  document.body.classList.add('inviting');   // 遮罩留著當背景，提示字收起來（style.css）
  logo.classList.add('animate');
  placeLogo();
  setTimeout(() => { invite.classList.add('show'); invite.setAttribute('aria-hidden', 'false'); setHint('seal'); seal.focus(); }, 650);
}
fog.addEventListener('click', enter);
logo.addEventListener('click', enter);
fog.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enter(); } });

function setHint(k){ hint.textContent = HINTS[k]; hint.classList.toggle('on', !!HINTS[k]); }

/* ---------- 2. 卡片的花邊：一圈小圓 = 波浪邊（之後可以換成畫好的圖） ---------- */
(function scallop(){
  const W = 400, H = 300, r = 9, gap = 15;
  let s = `<rect x="${r}" y="${r}" width="${W - 2 * r}" height="${H - 2 * r}" fill="#E9B9B6"/>`;
  const edge = (x1, y1, x2, y2) => {
    const n = Math.round(Math.hypot(x2 - x1, y2 - y1) / gap);
    for (let i = 0; i < n; i++){
      const t = i / n;
      s += `<circle cx="${(x1 + (x2 - x1) * t).toFixed(1)}" cy="${(y1 + (y2 - y1) * t).toFixed(1)}" r="${r}" fill="#E9B9B6"/>`;
    }
  };
  edge(r, r, W - r, r); edge(W - r, r, W - r, H - r); edge(W - r, H - r, r, H - r); edge(r, H - r, r, r);
  $('scallop').innerHTML = s;
})();

/* ---------- 3. 拆信封：點愛心封蠟 → 信封蓋打開 ---------- */
let state = 'sealed';   // sealed → ready（可以抽）→ out（拿出來了）
seal.addEventListener('click', () => {
  if (state !== 'sealed') return;
  env.classList.add('open');
  seal.tabIndex = -1;
  setTimeout(() => { state = 'ready'; env.classList.add('ready'); card.tabIndex = 0; card.focus(); setHint('pull'); }, 750);
});

/* ---------- 4. 抽卡片：按住往上拉，拉夠了放開就整張拿出來；拉不夠會滑回去 ---------- */
let startY = 0, pull = 0, dragging = false, moved = 0;
const cardH = () => card.offsetHeight;
const setPull = v => { pull = v; card.style.setProperty('--pull', v + 'px'); };
card.addEventListener('pointerdown', e => {
  if (state !== 'ready') return;
  dragging = true; moved = 0; startY = e.clientY + pull;
  card.setPointerCapture(e.pointerId);
  card.classList.add('drag');
});
card.addEventListener('pointermove', e => {
  if (!dragging) return;
  const v = Math.max(0, Math.min(cardH() * 1.05, startY - e.clientY));
  moved = Math.max(moved, Math.abs(v - pull));
  setPull(v);
});
function letGo(){
  if (!dragging) return;
  dragging = false;
  card.classList.remove('drag');
  if (pull > cardH() * PULL_OUT) return takeOut();
  setPull(0);
  if (moved < 4){ card.classList.remove('nudge'); void card.offsetWidth; card.classList.add('nudge'); }   // 只是點一下：卡片跳一下提示可以拉
}
card.addEventListener('pointerup', letGo);
card.addEventListener('pointercancel', letGo);
card.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && state === 'ready'){ e.preventDefault(); takeOut(); } });   // 鍵盤：直接拿出來

// 整張拿出來：卡片移到畫面正中間放大，信封往下掉走
function takeOut(){
  state = 'out';
  const r = card.getBoundingClientRect();
  const w = card.offsetWidth, h = card.offsetHeight;
  const s = Math.min(innerWidth * .92 / w, (innerHeight - 220) / (h * 1.18), 1.5);   // 1.18 = 卡片 + 下面的按鈕
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2 + pull;   // 卡片沒被拉的時候的中心
  card.style.setProperty('--tx', (innerWidth / 2 - cx) + 'px');
  card.style.setProperty('--ty', (innerHeight / 2 - 20 - cy) + 'px');
  card.style.setProperty('--s', s);
  invite.classList.add('out');
  setHint('read');
  card.tabIndex = -1;
  setTimeout(() => { accept.tabIndex = 0; accept.focus({ preventScroll: true }); }, 900);
}

/* ---------- 5. 收下邀請 → 淡成白色 → 背景換成娃娃屋（不換頁） ---------- */
accept.addEventListener('click', () => {
  if (state !== 'out') return;
  state = 'accepted';
  invite.classList.add('accepted');   // 蓋上「收下了」的印章
  setTimeout(() => {
    document.body.classList.add('leaving', 'leave-fast');   // 淡成白色（style.css 的 .fade-white）
    setTimeout(() => {
      // 換成娃娃屋：邀請卡那些收起來，娃娃屋那些出現（style.css 的 body.house-page）
      document.body.classList.remove('invite-page', 'inviting', 'leaving', 'leave-fast');
      document.body.classList.add('house-page', 'chat-page', 'arriving');
      startHouse();   // house.js：莓露露出場
    }, WHITE_TIME);
  }, 900);
});
})();
