// It's Tea Time 每一頁共用的效果（顆粒、右上角選單）

/* ---------- 全頁復古顆粒：用 canvas 產生一張雜訊圖 ---------- */
(function makeGrain(){
  const c = document.createElement('canvas'); c.width = c.height = 180;
  const g = c.getContext('2d'); const d = g.createImageData(180,180);
  for (let i=0;i<d.data.length;i+=4){
    const v = Math.random()*255;
    d.data[i]=v; d.data[i+1]=v*0.50; d.data[i+2]=v*0.50; d.data[i+3]=255;
  }
  g.putImageData(d,0,0);
  const url = `url(${c.toDataURL()})`;
  document.querySelectorAll('.grain').forEach(el => el.style.backgroundImage = url);
})();

/* ---------- 換頁：畫面先淡成白色，再換到下一頁（下一頁的 body 加 class="arriving" 就會從白色淡入） ---------- */
const LEAVE_TIME = 1000;   // 淡成白色花的時間（毫秒），要和 style.css 的 .leave-fast 一樣
function goTo(url){
  document.body.classList.remove('arriving');
  document.body.classList.add('leaving', 'leave-fast');
  setTimeout(() => { location.href = url; }, LEAVE_TIME);
}
// 按瀏覽器「上一頁」回來時，有些瀏覽器會直接拿出離開前的畫面（還是全白的），重新載入一次就正常了
addEventListener('pageshow', e => { if (e.persisted) location.reload(); });

// 點任何換到別頁的連結（選單、按鈕…）：都先淡成白色再換頁；同一頁裡的 #錨點 就直接捲過去
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a || a.target || e.ctrlKey || e.metaKey || e.shiftKey) return;
  const href = a.getAttribute('href');
  if (href.startsWith('#') || !/\.html/.test(href)) return;
  if (document.body.classList.contains('leaving') || !document.querySelector('.fade-white')) return;   // 沒有白幕的頁面（首頁）就直接換頁
  e.preventDefault();
  goTo(href);
});

/* ---------- 捲到才浮上來：class="reveal" 的東西捲進畫面時加上 .seen ---------- */
(function setupReveal(){
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('seen')); return; }
  const io = new IntersectionObserver(list => list.forEach(en => {
    if (en.isIntersecting){ en.target.classList.add('seen'); io.unobserve(en.target); }
  }), { threshold: .12 });
  items.forEach(el => io.observe(el));
})();

/* ---------- 右上角選單展開 ---------- */
(function setupMenu(){
  const menu = document.getElementById('menu');
  const menuToggle = document.getElementById('menuToggle');
  menuToggle.addEventListener('click', e => {
    e.stopPropagation();
    const open = menu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
    menuToggle.setAttribute('aria-label', open ? '收起選單' : '打開選單');
  });
  document.addEventListener('click', e => { if (!menu.contains(e.target)) { menu.classList.remove('open'); menuToggle.setAttribute('aria-expanded', false); } });
})();
