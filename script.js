// It's Tea Time 首頁互動
/* ===== 可以自己調的設定 ===== */
const KNOCK_COLOR = '#FF97E9';
const NEXT_PAGE = 'page2.html';   // 點門之後要去的下一頁；留空就停在這頁
const OPEN_HOUSE = 'img/house-open.jpg';   // 敲門後換成的開門房子圖
const NEXT_PAGE_DELAY = 1000;   // 門打開後停幾毫秒再換頁（1000 = 1 秒）
// 復古顆粒和右上角選單在 common.js

/* ---------- 1. 標準字 ---------- */
const logo = document.getElementById('logo');
const fog = document.getElementById('fog');
const stage = document.getElementById('stage');
let entered = false;

function placeLogo(){
  if (!entered){
    const r = stage.getBoundingClientRect();
    const w = r.width * 0.68;
    const h = w * (220/1083);
    logo.style.width = w + 'px';
    logo.style.left = (r.left + r.width/2 - w/2) + 'px';
    logo.style.top  = (r.top + r.height/2 - h/2 - r.height*0.04) + 'px';
  } else {
    // 清掉上面算的位置，改用 style.css 的 .logo-corner（和 page2 同一個左上角位置）
    logo.style.width = logo.style.left = logo.style.top = '';
    logo.classList.add('logo-corner');
  }
}
placeLogo();
addEventListener('resize', () => { logo.classList.remove('animate'); placeLogo(); resizeCanvas(); });

function enter(){
  if (entered) return;
  entered = true;
  document.body.classList.add('entered');   // 遮罩淡出（style.css）
  logo.classList.add('animate');            // 標準字滑到左上角
  placeLogo();
  setTimeout(() => document.body.classList.add('in-house'), 700);
}
fog.addEventListener('click', enter);
fog.addEventListener('keydown', e => { if (e.key==='Enter' || e.key===' ') { e.preventDefault(); enter(); } });

/* ---------- 2. knock! 粒子 ---------- */
const cv = document.getElementById('particles');
const ctx = cv.getContext('2d');
let dpr = 1;
function resizeCanvas(){
  dpr = Math.min(devicePixelRatio || 1, 2);
  cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
}
resizeCanvas();

const parts = [];
const pointer = { x:0, y:0, inside:false, lastX:null, lastY:null };
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const spawning = () => document.body.classList.contains('in-house') && !document.body.classList.contains('opened');

function spawn(x, y, burst){
  if (parts.length > 260) parts.shift();
  const a = Math.random() * Math.PI * 2;
  const sp = burst ? 2 + Math.random()*4 : 0.5 + Math.random()*1.8;
  parts.push({
    x, y,
    vx: Math.cos(a)*sp, vy: Math.sin(a)*sp - (burst ? 1 : 0.6),
    rot: (Math.random()-.5)*0.8, vr: (Math.random()-.5)*0.06,
    size: burst ? 16 + Math.random()*16 : 11 + Math.random()*12,
    born: performance.now(), life: 900 + Math.random()*700
  });
}

addEventListener('pointermove', e => {
  pointer.x = e.clientX; pointer.y = e.clientY; pointer.inside = true;
  if (!spawning() || reduce) return;
  const dx = pointer.lastX==null ? 0 : e.clientX - pointer.lastX;
  const dy = pointer.lastY==null ? 0 : e.clientY - pointer.lastY;
  const n = Math.min(4, Math.floor(Math.hypot(dx,dy) / 16)) + (Math.random() < .5 ? 1 : 0);
  for (let i=0;i<n;i++) spawn(e.clientX, e.clientY);
  pointer.lastX = e.clientX; pointer.lastY = e.clientY;
});
document.addEventListener('pointerleave', () => pointer.inside = false);
addEventListener('blur', () => pointer.inside = false);

let lastIdle = 0;
function tick(now){
  // 滑鼠停著不動時也持續冒出 knock!
  if (spawning() && pointer.inside && !reduce && now - lastIdle > 130){ spawn(pointer.x, pointer.y); lastIdle = now; }

  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,innerWidth,innerHeight);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  for (let i = parts.length-1; i >= 0; i--){
    const p = parts[i];
    const t = (now - p.born) / p.life;
    if (t >= 1){ parts.splice(i,1); continue; }
    p.x += p.vx; p.y += p.vy; p.vy += 0.015; p.vx *= 0.985; p.rot += p.vr;
    const scale = t < .15 ? t/.15 : 1 - (t-.15)*0.35;
    ctx.save();
    ctx.globalAlpha = t < .6 ? 1 : 1 - (t-.6)/.4;
    ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(scale, scale);
    ctx.font = `${p.size}px "Mochiy Pop One", "Zen Maru Gothic", sans-serif`;
    ctx.lineWidth = p.size * 0.28; ctx.strokeStyle = 'rgba(255,255,255,.95)';
    ctx.strokeText('knock!', 0, 0);
    ctx.fillStyle = KNOCK_COLOR; ctx.fillText('knock!', 0, 0);
    ctx.restore();
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* ---------- 3. 點門：敲門 → 換成開門的房子 → 進第二頁 ---------- */
const door = document.getElementById('door');
const knockLabel = document.getElementById('knockLabel');
const houseImg = document.getElementById('houseImg');
new Image().src = OPEN_HOUSE;   // 先偷偷載好開門圖，換圖時才不會閃
door.addEventListener('click', () => {
  if (document.body.classList.contains('opened')) return;
  const r = door.getBoundingClientRect();
  for (let i=0;i<28;i++) spawn(r.left + r.width/2, r.top + r.height/2, true);
  knockLabel.textContent = 'knock! knock!';
  stage.classList.add('knocking');
  document.body.classList.add('opened');   // 加上這個 class 之後，滑鼠就不會再冒 knock!
  setTimeout(() => {
    stage.classList.remove('knocking');
    houseImg.src = OPEN_HOUSE;
    document.body.classList.add('door-open');   // 收起 knock! 字樣（style.css）
    if (NEXT_PAGE) setTimeout(() => { location.href = NEXT_PAGE; }, NEXT_PAGE_DELAY);
  }, 1100);
});
