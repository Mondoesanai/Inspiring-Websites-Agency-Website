/* ═══════════════════════════════════════════════════════════
   LUMIÈRE — Theme JavaScript
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Nav scroll effect ──────────────────────────────────
  const nav = document.getElementById('main-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load
  }

  // ── Mobile menu ────────────────────────────────────────
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
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menuOpen) window.closeMenu();
    });
  }

  window.closeMenu = () => {
    menuOpen = false;
    if (mMenu) mMenu.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  // ── Fade-up intersection observer ─────────────────────
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

  // Hero elements: show immediately
  document.querySelectorAll('#hero .fade-up').forEach(el => el.classList.add('in'));

  // ── Collection tabs ────────────────────────────────────
  window.setTab = (el) => {
    document.querySelectorAll('.tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    el.classList.add('active');
    el.setAttribute('aria-selected', 'true');
    // TODO: When Shopify is connected, filter collection by handle:
    // const handle = el.dataset.collection;
    // fetch(`/collections/${handle}?view=ajax`).then(...)
  };

  // ── Product card keyboard & click ─────────────────────
  document.querySelectorAll('.product-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    const activate = () => {
      const handle = card.dataset.productId;
      if (handle && !handle.startsWith('placeholder')) {
        window.location.href = `/products/${handle}`;
      }
    };
    card.addEventListener('click', (e) => {
      // Don't navigate if clicking the quick-add button
      if (e.target.closest('.quick-add')) return;
      activate();
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  });

  // ── Hero parallax ──────────────────────────────────────
  const heroMedia = document.querySelector('.hero-media');
  if (heroMedia) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroMedia.style.transform = `translateY(${y * 0.18}px)`;
      }
    }, { passive: true });
  }

  // ── Variant selector (product page) ───────────────────
  const variantBtns = document.querySelectorAll('.variant-btn');
  const variantInput = document.getElementById('variant-id');

  if (variantBtns.length && variantInput) {
    variantBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active from same option group
        const opt = btn.dataset.option;
        document.querySelectorAll(`.variant-btn[data-option="${opt}"]`)
          .forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // TODO: Match selected options to variant ID and update variantInput.value
        // This requires the Shopify product JSON to be available:
        // const productData = {{ product | json }};
      });
    });
  }

  // ── Newsletter form ────────────────────────────────────
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('.email-input').value;
      if (!email) return;
      // TODO: Wire to Shopify Customer API or Klaviyo
      // fetch('/contact', { method: 'POST', body: ... })
      console.info('[Lumière] Newsletter signup:', email);
    });
  }

});
