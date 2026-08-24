/* ============================================================
   현대엔지비 바이브 코딩 플랫폼 — 공용 스크립트
   ============================================================ */

// 모바일 내비 토글
function toggleNav() {
  const links = document.querySelector('.nav-links');
  if (links) links.classList.toggle('open');
}

// 토스트 알림
function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// 클립보드 복사
async function copyText(text, okMsg) {
  try {
    await navigator.clipboard.writeText(text);
    toast(okMsg || '복사했습니다');
  } catch (e) {
    // 폴백
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove();
    toast(okMsg || '복사했습니다');
  }
}

// 숫자 카운트업 (data-count 속성 사용)
function animateCounters(root = document) {
  const els = root.querySelectorAll('[data-count]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const target = parseFloat(el.dataset.count);
      const decimals = (el.dataset.decimals ? parseInt(el.dataset.decimals) : 0);
      const dur = 1400; const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = target * eased;
        el.textContent = v.toLocaleString('ko-KR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  els.forEach(el => io.observe(el));
}

// 막대 애니메이션 (data-w 속성 → width)
function animateBars(root = document) {
  const bars = root.querySelectorAll('.bseg[data-w]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      setTimeout(() => { entry.target.style.width = entry.target.dataset.w + '%'; }, 80);
    });
  }, { threshold: 0.3 });
  bars.forEach(b => { b.style.width = '0%'; io.observe(b); });
}

// localStorage 헬퍼
const Store = {
  key: 'ngv_vibe_community',
  read() {
    try { return JSON.parse(localStorage.getItem(this.key)) || null; }
    catch (e) { return null; }
  },
  write(data) { localStorage.setItem(this.key, JSON.stringify(data)); }
};

// 현재 연도
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  animateCounters();
  animateBars();
});
