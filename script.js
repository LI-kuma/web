// It's Tea Time 首頁互動
/* ===== 可以自己調的設定 ===== */
const KNOCK_COLOR = '#FF97E9';
const NEXT_PAGE = '';   // 點門之後要去的下一頁，例如 'living-room.html'；留空就停在這頁

/* ---------- 1. 全頁復古顆粒：用 canvas 產生一張雜訊圖 ---------- */
(function makeGrain(){
  const c = document.createElement('canvas'); c.width = c.height = 180;
  const g = c.getContext('2d'); const d = g.createImageData(180,180);
  for (let i=0;i<d.data.length;i+=4){
    const v = Math.random()*255;
    d.data[i]=v; d.data[i+1]=v*0.96; d.data[i+2]=v*0.88; d.data[i+3]=255;
  }
  g.putImageData(d,0,0);
  document.getElementById('grain').style.backgroundImage = `url(${c.toDataURL()})`;
})();

/* ---------- 2. 標準字：中間 → 左上角 ---------- */
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
    const small = innerWidth < 560;
    logo.style.width = (small ? 140 : Math.min(240, Math.max(170, innerWidth*0.17))) + 'px';
    logo.style.left = Math.max(16, 22) + 'px';
    logo.style.top = (small ? 18 : 22) + 'px';
  }
}
placeLogo();
addEventListener('resize', () => { logo.classList.remove('animate'); placeLogo(); resizeCanvas(); });

function enter(){
  if (entered) return;
  entered = true;
  document.body.classList.add('entered');
  logo.classList.add('animate');
  placeLogo();
  setTimeout(() => document.body.classList.add('in-house'), 700);
}
fog.addEventListener('click', enter);
fog.addEventListener('keydown', e => { if (e.key==='Enter' || e.key===' ') { e.preventDefault(); enter(); } });

/* ---------- 3. 選單展開 ---------- */
const menu = document.getElementById('menu');
const menuToggle = document.getElementById('menuToggle');
menuToggle.addEventListener('click', e => {
  e.stopPropagation();
  const open = menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
  menuToggle.setAttribute('aria-label', open ? '收起選單' : '打開選單');
});
document.addEventListener('click', e => { if (!menu.contains(e.target)) { menu.classList.remove('open'); menuToggle.setAttribute('aria-expanded', false); } });

/* ---------- 4. knock! 粒子 ---------- */
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

/* ---------- 5. 點門：敲門、停止粒子 ---------- */
const door = document.getElementById('door');
const knockLabel = document.getElementById('knockLabel');
door.addEventListener('click', () => {
  if (document.body.classList.contains('opened')) return;
  const r = door.getBoundingClientRect();
  for (let i=0;i<28;i++) spawn(r.left + r.width/2, r.top + r.height/2, true);
  knockLabel.textContent = 'knock! knock!';
  stage.classList.add('knocking');
  document.body.classList.add('opened');   // 加上這個 class 之後，滑鼠就不會再冒 knock!
  setTimeout(() => { stage.classList.remove('knocking'); knockLabel.textContent = 'come in~'; }, 1100);
  if (NEXT_PAGE) setTimeout(() => { location.href = NEXT_PAGE; }, 1800);
});
