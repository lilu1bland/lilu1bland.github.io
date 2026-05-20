const FLOATIE_DIR = 'Public/floaties/';
const COUNT = 40;
const images = window.FLOATIE_IMAGES || [];
const container = document.getElementById('floaties');

const W = () => container.offsetWidth;
const H = () => container.offsetHeight;

let floaties = [];

function vmin() { return Math.min(W(), H()); }

function spawnFloaties(list) {
  const w = W(), h = H();

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('img');
    el.src = FLOATIE_DIR + list[i % list.length];
    el.alt = '';

    const sizePct   = 0.04 + Math.random() * 0.08;
    const size      = sizePct * vmin();
    const x         = Math.random() * (w - size);
    const y         = Math.random() * (h - size);
    const speedPct  = 0.08 + Math.random() * 0.10;
    const speed     = speedPct * vmin();
    const angle     = Math.random() * Math.PI * 2;
    const spinSpeed = (Math.random() - 0.5) * 120;

    el.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:${x}px;top:${y}px;transform-origin:center;will-change:transform`;
    el.onerror = () => { el.style.display = 'none'; };
    container.appendChild(el);

    floaties.push({
      el, x, y, size,
      sizePct, speedPct,
      vx:  Math.cos(angle) * speed,
      vy:  Math.sin(angle) * speed,
      rot: Math.random() * 360,
      spin: spinSpeed,
    });
  }
}

let last = null;
let lastVmin = vmin();

function loop(ts) {
  if (!last) last = ts;
  const dt = Math.min((ts - last) / 1000, 0.05);
  last = ts;

  const w = W(), h = H();
  const curVmin = vmin();

  if (Math.abs(curVmin - lastVmin) > 1) {
    const ratio = curVmin / lastVmin;
    for (const f of floaties) {
      f.size = f.sizePct * curVmin;
      f.vx *= ratio;
      f.vy *= ratio;
      f.el.style.width  = f.size + 'px';
      f.el.style.height = f.size + 'px';
    }
    lastVmin = curVmin;
  }

  for (let i = 0; i < floaties.length; i++) {
    const f = floaties[i];
    if (f.el.style.display === 'none') continue;

    f.x   += f.vx * dt;
    f.y   += f.vy * dt;
    f.rot += f.spin * dt;

    const maxX = w - f.size, maxY = h - f.size;

    if (f.x < 0)    { f.x = 0;    f.vx =  Math.abs(f.vx); f.spin += f.vy * 0.3; }
    if (f.x > maxX) { f.x = maxX; f.vx = -Math.abs(f.vx); f.spin -= f.vy * 0.3; }
    if (f.y < 0)    { f.y = 0;    f.vy =  Math.abs(f.vy); f.spin -= f.vx * 0.3; }
    if (f.y > maxY) { f.y = maxY; f.vy = -Math.abs(f.vy); f.spin += f.vx * 0.3; }

    f.spin *= 0.998;

    f.el.style.left      = f.x + 'px';
    f.el.style.top       = f.y + 'px';
    f.el.style.transform = `rotate(${f.rot % 360}deg)`;
  }

  requestAnimationFrame(loop);
}

spawnFloaties(images.length ? images : ['terry.png', 'trans.png']);
requestAnimationFrame(loop);