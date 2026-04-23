/* ═══════════════════════════════════════════════════════════
   YNG•LIFE — Theme JavaScript v2.0
   Mouse: cursor trail, spotlight, magnetic, tilt, parallax
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const isMobile = !window.matchMedia('(hover: hover)').matches;

  /* ══════════════════════════════════════════════════════════
     CUSTOM CURSOR + TRAIL
     ════════════════════════════════════════════════════════ */
  const dot   = document.getElementById('cursor-dot');
  const ring  = document.getElementById('cursor-ring');
  const label = document.getElementById('cursor-label');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX, ringY = mouseY;
  let labelX = mouseX, labelY = mouseY;
  let trailTimer = null;

  if (dot && ring && !isMobile) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translateZ(0) translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
      if (label) label.style.transform = `translate(${mouseX}px, ${mouseY + 30}px) translate(-50%,-50%)`;

      // Gold trail dots
      if (trailTimer) clearTimeout(trailTimer);
      spawnTrail(mouseX, mouseY);
    });

    // Smooth lagging ring
    (function animRing() {
      ringX += (mouseX - ringX) * 0.10;
      ringY += (mouseY - ringY) * 0.10;
      ring.style.transform = `translateZ(0) translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animRing);
    })();

    // Cursor state changes
    const hoverEls  = 'a, button, .product-card, .collection-card, label, .size-btn, .currency-btn, .gallery-thumb';
    const viewEls   = '.product-card, .collection-card, .ed-feature-img, .split-tile';
    const textEls   = 'input, textarea, .email-input';

    document.addEventListener('mouseover', (e) => {
      const t = e.target;
      if (t.closest(textEls))  { document.body.classList.add('cursor-text');  return; }
      if (t.closest(viewEls))  { document.body.classList.add('cursor-view');  if (label) label.textContent = 'View'; return; }
      if (t.closest(hoverEls)) { document.body.classList.add('cursor-hover'); return; }
    });
    document.addEventListener('mouseout', (e) => {
      const t = e.target;
      if (t.closest(textEls))  document.body.classList.remove('cursor-text');
      if (t.closest(viewEls))  { document.body.classList.remove('cursor-view');  if (label) label.textContent = ''; }
      if (t.closest(hoverEls)) document.body.classList.remove('cursor-hover');
    });
  }

  function spawnTrail(x, y) {
    const d = document.createElement('div');
    d.className = 'trail-dot';
    d.style.left = x + 'px';
    d.style.top  = y + 'px';
    d.style.animationDuration = (0.5 + Math.random() * 0.4) + 's';
    // slight random offset
    const ox = (Math.random() - 0.5) * 12;
    const oy = (Math.random() - 0.5) * 12;
    d.style.transform = `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`;
    document.body.appendChild(d);
    d.addEventListener('animationend', () => d.remove());
  }

  /* ══════════════════════════════════════════════════════════
     HERO MOUSE SPOTLIGHT — multiple layers at different speeds
     ════════════════════════════════════════════════════════ */
  const hero = document.getElementById('hero');
  let slowX = 50, slowY = 50;

  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width)  * 100;
      const y = ((e.clientY - r.top)  / r.height) * 100;
      hero.style.setProperty('--mx', x + '%');
      hero.style.setProperty('--my', y + '%');
    });

    // Slow secondary glow layer
    (function animSlowGlow() {
      slowX += (mouseX / window.innerWidth  * 100 - slowX) * 0.025;
      slowY += (mouseY / window.innerHeight * 100 - slowY) * 0.025;
      hero.style.setProperty('--mx2', slowX + '%');
      hero.style.setProperty('--my2', slowY + '%');
      requestAnimationFrame(animSlowGlow);
    })();

    // Hero image parallax on scroll
    const heroMedia = hero.querySelector('.hero-media');
    if (heroMedia) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroMedia.style.transform = `translateY(${y * 0.15}px)`;
        }
      }, { passive: true });
    }
  }

  /* ══════════════════════════════════════════════════════════
     SECTION SPOTLIGHTS — subtle gold glow on dark sections
     ════════════════════════════════════════════════════════ */
  const darkSections = document.querySelectorAll('.section-collections, .section-italy');
  darkSections.forEach(sec => {
    // Create spotlight element
    const spot = document.createElement('div');
    spot.style.cssText = `
      position:absolute;inset:0;pointer-events:none;z-index:0;
      background:radial-gradient(ellipse 40% 40% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 65%);
      transition:background 0.15s linear;
    `;
    if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
    sec.insertAdjacentElement('afterbegin', spot);

    sec.addEventListener('mousemove', (e) => {
      const r = sec.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width)  * 100;
      const y = ((e.clientY - r.top)  / r.height) * 100;
      spot.style.background = `radial-gradient(ellipse 38% 45% at ${x}% ${y}%, rgba(201,168,76,0.10) 0%, transparent 60%)`;
    });
    sec.addEventListener('mouseleave', () => {
      spot.style.background = `radial-gradient(ellipse 40% 40% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 65%)`;
    });
  });

  /* ══════════════════════════════════════════════════════════
     MAGNETIC BUTTONS
     ════════════════════════════════════════════════════════ */
  function initMagnetic() {
    document.querySelectorAll('.btn-magnetic').forEach(wrap => {
      const inner = wrap.querySelector('a, button') || wrap;
      wrap.addEventListener('mousemove', (e) => {
        const r = wrap.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.32;
        const y = (e.clientY - r.top  - r.height / 2) * 0.32;
        inner.style.transform  = `translate(${x}px, ${y}px)`;
        inner.style.transition = 'transform 0.08s linear';
      });
      wrap.addEventListener('mouseleave', () => {
        inner.style.transform  = 'translate(0,0)';
        inner.style.transition = 'transform 0.65s cubic-bezier(0.16,1,0.3,1)';
      });
    });
  }
  initMagnetic();

  /* ══════════════════════════════════════════════════════════
     3D CARD TILT
     ════════════════════════════════════════════════════════ */
  function initTilt() {
    document.querySelectorAll('.product-card, .collection-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform  = `perspective(800px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateZ(10px) scale(1.02)`;
        card.style.transition = 'transform 0.08s linear, box-shadow 0.45s, z-index 0s';
        card.style.zIndex = '5';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform  = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0) scale(1)';
        card.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s';
        card.style.zIndex     = '';
      });
    });
  }
  initTilt();

  /* ══════════════════════════════════════════════════════════
     PARALLAX on scroll — multi-layer depth
     ════════════════════════════════════════════════════════ */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        const speed  = parseFloat(el.dataset.parallax) || 0.1;
        const offset = scrollY * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════
     RIPPLE on buttons
     ════════════════════════════════════════════════════════ */
  function addRipple(btn) {
    btn.addEventListener('click', (e) => {
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;
        width:${size}px;height:${size}px;
        top:${e.clientY - r.top - size/2}px;
        left:${e.clientX - r.left - size/2}px;
        background:rgba(255,255,255,0.22);
        transform:scale(0);animation:rippleOut 0.6s ease-out forwards;
      `;
      if (getComputedStyle(btn).position === 'static') { btn.style.position = 'relative'; btn.style.overflow = 'hidden'; }
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  }
  if (!document.getElementById('ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = '@keyframes rippleOut{to{transform:scale(2.8);opacity:0}}';
    document.head.appendChild(s);
  }
  document.querySelectorAll('.btn-primary, .btn-dark-outline').forEach(addRipple);

  /* ══════════════════════════════════════════════════════════
     SCROLL FADE-UP
     ════════════════════════════════════════════════════════ */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => io.observe(el));
  document.querySelectorAll('#hero .fade-up').forEach(el => el.classList.add('in'));

  /* ══════════════════════════════════════════════════════════
     NAV scroll + dark/light mode
     ════════════════════════════════════════════════════════ */
  const nav = document.getElementById('main-nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
      nav.classList.toggle('nav-dark', window.scrollY < 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════════════════════════════════════════════════════
     MOBILE MENU
     ════════════════════════════════════════════════════════ */
  const toggle = document.getElementById('nav-toggle');
  const mMenu  = document.getElementById('mobile-menu');
  let menuOpen = false;
  if (toggle && mMenu) {
    toggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mMenu.classList.toggle('open', menuOpen);
      toggle.setAttribute('aria-expanded', String(menuOpen));
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    });
  }
  window.closeMenu = () => {
    menuOpen = false;
    if (mMenu)  mMenu.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) window.closeMenu(); });

  /* ══════════════════════════════════════════════════════════
     GALLERY THUMBNAILS
     ════════════════════════════════════════════════════════ */
  const mainImg = document.getElementById('gallery-main-img');
  document.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.querySelector('img')?.src;
      if (src && mainImg) {
        mainImg.src = src.replace('_64x64', '').replace(/(_\d+x\d+)/, '_1200x1200');
        document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      }
    });
  });

  /* ══════════════════════════════════════════════════════════
     CURRENCY SELECTOR
     ════════════════════════════════════════════════════════ */
  const rates = { USD: 1, EUR: 0.92, GBP: 0.79 };
  let basePriceUSD = null;
  const priceEl = document.getElementById('price-display');
  const convertedEl = document.getElementById('price-converted');

  if (priceEl) {
    basePriceUSD = parseFloat(priceEl.dataset.usd || 0);
  }

  window.setCurrency = (btn, currency) => {
    document.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (!priceEl || basePriceUSD === null) return;
    const rate  = rates[currency] || 1;
    const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
    const converted = (basePriceUSD * rate).toFixed(2);
    priceEl.textContent = converted;
    const currencyLabel = document.getElementById('price-currency-symbol');
    if (currencyLabel) currencyLabel.textContent = symbol;
    if (convertedEl) {
      convertedEl.textContent = currency !== 'USD'
        ? `≈ $${basePriceUSD.toFixed(2)} USD`
        : '';
    }
  };

  /* ══════════════════════════════════════════════════════════
     SIZE TABS
     ════════════════════════════════════════════════════════ */
  window.setSizeTab = (el) => {
    document.querySelectorAll('.size-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
    el.classList.add('active'); el.setAttribute('aria-selected','true');
    const system = el.dataset.system;
    document.querySelectorAll('.size-options-group').forEach(g => {
      g.style.display = g.dataset.system === system ? 'flex' : 'none';
    });
  };

  /* ══════════════════════════════════════════════════════════
     SIZE BUTTON SELECT
     ════════════════════════════════════════════════════════ */
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('unavailable')) return;
      const group = btn.closest('.size-options-group');
      if (group) group.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const variantInput = document.getElementById('variant-id');
      if (variantInput && btn.dataset.variantId) variantInput.value = btn.dataset.variantId;
    });
  });

  /* ══════════════════════════════════════════════════════════
     PRODUCT CARD CLICK
     ════════════════════════════════════════════════════════ */
  document.querySelectorAll('.product-card[data-product-id]').forEach(card => {
    const go = () => {
      const h = card.dataset.productId;
      if (h && !h.startsWith('placeholder')) window.location.href = `/products/${h}`;
    };
    card.addEventListener('click', e => { if (!e.target.closest('.quick-add')) go(); });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });

  /* ══════════════════════════════════════════════════════════
     ADD TO CART FEEDBACK
     ════════════════════════════════════════════════════════ */
  document.querySelectorAll('.quick-add-btn:not(:disabled)').forEach(btn => {
    btn.addEventListener('click', function () {
      const orig = this.textContent;
      this.textContent = 'Added ✓';
      this.style.cssText = 'background:#2A5C2A;color:#fff;';
      setTimeout(() => { this.textContent = orig; this.style.cssText = ''; }, 1800);
    });
  });

  /* ══════════════════════════════════════════════════════════
     NEWSLETTER
     ════════════════════════════════════════════════════════ */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = form.querySelector('.email-input')?.value;
      if (!email) return;
      console.info('[YNG•LIFE] Newsletter:', email);
    });
  });

  /* ══════════════════════════════════════════════════════════
     PHILOSOPHY SECTION — Gold Drawing Canvas
     Move your mouse across the dark section to draw with light.
     Strokes are smooth bezier curves that fade out over ~2s.
     ════════════════════════════════════════════════════════ */
  const philoSection = document.querySelector('.section-philosophy');
  if (philoSection && !isMobile) {

    // Gold spotlight that tracks the mouse
    const philoSpot = philoSection.querySelector('.philosophy-spotlight');
    philoSection.addEventListener('mousemove', (e) => {
      const r = philoSection.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width)  * 100;
      const py = ((e.clientY - r.top)  / r.height) * 100;
      if (philoSpot) {
        philoSpot.style.setProperty('--px', px + '%');
        philoSpot.style.setProperty('--py', py + '%');
      }
    });

    // Create canvas
    const cvs = document.createElement('canvas');
    cvs.className = 'philosophy-canvas';
    philoSection.appendChild(cvs);
    const ctx2 = cvs.getContext('2d');

    const resizeCvs = () => {
      const r = philoSection.getBoundingClientRect();
      cvs.width  = r.width;
      cvs.height = r.height;
    };
    resizeCvs();
    new ResizeObserver(resizeCvs).observe(philoSection);

    // Trail: array of {x, y, t, break}
    const trail = [];
    let philoActive = false;

    philoSection.addEventListener('mouseenter', () => { philoActive = true; });
    philoSection.addEventListener('mouseleave', () => {
      philoActive = false;
      // Push a break so next entry starts fresh
      trail.push({ brk: true, t: Date.now() });
    });
    philoSection.addEventListener('mousemove', (e) => {
      if (!philoActive) return;
      const r = philoSection.getBoundingClientRect();
      trail.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: Date.now() });
    });

    const FADE_MS = 2000; // how long strokes last

    (function drawPhilo() {
      requestAnimationFrame(drawPhilo);
      const now = Date.now();

      // Purge old points
      while (trail.length && now - trail[0].t > FADE_MS) trail.shift();

      ctx2.clearRect(0, 0, cvs.width, cvs.height);
      if (trail.length < 2) return;

      // Draw segment-by-segment so opacity varies per segment
      for (let i = 1; i < trail.length; i++) {
        const p0 = trail[i - 1];
        const p1 = trail[i];
        if (p0.brk || p1.brk) continue; // don't draw across breaks

        const age = (now - p1.t) / FADE_MS; // 0=fresh, 1=gone
        const alpha = Math.pow(1 - age, 1.6) * 0.92;
        const lw    = 2.8 * (1 - age * 0.4);

        ctx2.beginPath();
        ctx2.moveTo(p0.x, p0.y);

        // Smooth via midpoint
        const mx = (p0.x + p1.x) / 2;
        const my = (p0.y + p1.y) / 2;
        ctx2.quadraticCurveTo(p0.x, p0.y, mx, my);

        ctx2.strokeStyle = `rgba(201, 168, 76, ${alpha})`;
        ctx2.lineWidth   = lw;
        ctx2.lineCap     = 'round';
        ctx2.lineJoin    = 'round';
        ctx2.shadowColor = `rgba(220, 185, 90, ${alpha * 0.7})`;
        ctx2.shadowBlur  = 14 * (1 - age);
        ctx2.stroke();
        ctx2.shadowBlur  = 0; // reset so it doesn't bleed
      }
    })();
  }

  /* ══════════════════════════════════════════════════════════
     THE ARCHIVE — Interactive Collection Navigator
     Hovering a row: that row glows, others dim.
     Cursor glow follows mouse. Counter updates.
     ════════════════════════════════════════════════════════ */
  const archiveSection = document.querySelector('.section-archive');
  const archiveGlow    = document.querySelector('.archive-cursor-glow');
  const archiveCounter = document.getElementById('archive-counter');
  const archiveRows    = document.querySelectorAll('.archive-row');

  if (archiveSection && !isMobile) {

    // Cursor spotlight follows mouse
    archiveSection.addEventListener('mousemove', (e) => {
      const r = archiveSection.getBoundingClientRect();
      archiveGlow.style.left = (e.clientX - r.left) + 'px';
      archiveGlow.style.top  = (e.clientY - r.top)  + 'px';
    });
    archiveSection.addEventListener('mouseenter', () => {
      archiveGlow.style.opacity = '1';
    });
    archiveSection.addEventListener('mouseleave', () => {
      archiveGlow.style.opacity = '0';
      // restore all rows
      archiveRows.forEach(r => { r.style.opacity = ''; });
      if (archiveCounter) archiveCounter.textContent = '01 / 05';
    });

    // Per-row hover: others dim further, active row full bright
    archiveRows.forEach((row, idx) => {
      row.addEventListener('mouseenter', () => {
        archiveRows.forEach((r, i) => {
          r.style.opacity = i === idx ? '1' : '0.08';
        });
        if (archiveCounter) {
          const num = row.dataset.num || String(idx + 1).padStart(2, '0');
          archiveCounter.textContent = `${num} / 05`;
        }
      });
      row.addEventListener('mouseleave', () => {
        archiveRows.forEach(r => { r.style.opacity = ''; });
      });
    });
  }

})();
