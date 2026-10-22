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
