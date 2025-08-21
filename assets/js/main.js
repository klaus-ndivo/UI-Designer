/* Theme toggle with persistence */
(function setupThemeToggle() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) root.classList.add('dark');
  toggle?.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
  });
})();

/* Mobile menu */
(function setupMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  btn?.addEventListener('click', () => menu?.classList.toggle('hidden'));
  menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => menu.classList.add('hidden')));
})();

/* Preloader */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  pre.style.opacity = '0';
  setTimeout(() => (pre.style.display = 'none'), 350);
});

/* Year */
document.getElementById('year').textContent = new Date().getFullYear();

/* Smooth counters on intersection */
(function setupCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  const animate = (el) => {
    const target = Number(el.getAttribute('data-target') || '0');
    const duration = 1000;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target).toString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
  }, { threshold: 0.6 });
  counters.forEach((c) => io.observe(c));
})();

/* Scroll reveals */
(function setupReveal() {
  const sections = document.querySelectorAll('.section, .skill-card, .portfolio-item');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('animate-fadeUp');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.15 });
  sections.forEach((s) => io.observe(s));
})();





/* See All Button Functionality */
(function setupSeeAllButton() {
  const seeAllBtn = document.getElementById('seeAllBtn');
  const hiddenItems = document.querySelectorAll('.portfolio-item.hidden-more');
  const seeAllText = seeAllBtn?.querySelector('.see-all-text');
  
  if (!seeAllBtn || !hiddenItems.length) return;
  
  let isExpanded = false;
  
  seeAllBtn.addEventListener('click', () => {
    isExpanded = !isExpanded;
    
    if (isExpanded) {
      // Show all items
      hiddenItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('show');
        }, index * 100); // Staggered animation
      });
      
      // Update button text and icon
      if (seeAllText) seeAllText.textContent = 'Show Less';
      seeAllBtn.classList.add('expanded');
      
      // Smooth scroll to show new items
      setTimeout(() => {
        hiddenItems[0]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);
      
    } else {
      // Hide additional items
      hiddenItems.forEach((item) => {
        item.classList.remove('show');
      });
      
      // Update button text and icon
      if (seeAllText) seeAllText.textContent = 'See All Projects';
      seeAllBtn.classList.remove('expanded');
      
      // Scroll back to top of portfolio
      document.getElementById('portfolio')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  });
})();

/* More Designs Click Functionality */
(function setupMoreDesigns() {
  const moreDesignsContainer = document.querySelector('.more-designs-container');
  
  if (!moreDesignsContainer) return;
  
  moreDesignsContainer.addEventListener('click', () => {
    // Redirect to external portfolio
    window.open('https://charles-portfolio-seven.vercel.app/Ui.html', '_blank');
  });
})();

/* Testimonials carousel */
(function setupCarousel() {
  const track = document.getElementById('carousel');
  const dots = Array.from(document.querySelectorAll('.dot'));
  if (!track || !dots.length) return;
  let index = 0; let timer;
  const setIndex = (i) => {
    index = (i + dots.length) % dots.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
  };
  const play = () => { clearInterval(timer); timer = setInterval(() => setIndex(index + 1), 4000); };
  dots.forEach((d) => d.addEventListener('click', () => { setIndex(Number(d.getAttribute('data-index'))); play(); }));
  setIndex(0); play();
})();

/* Portfolio tabs filter */
(function setupFilters() {
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const cards = Array.from(document.querySelectorAll('.portfolio-item'));
  const seeAllBtn = document.getElementById('seeAllBtn');
  const seeAllContainer = document.getElementById('seeAllContainer');
  const seeAllText = seeAllBtn?.querySelector('.see-all-text');
  const hiddenItems = document.querySelectorAll('.portfolio-item.hidden-more');
  
  if (!tabs.length) return;
  
  const apply = (category) => {
    let visibleCount = 0;
    
    cards.forEach((c) => {
      const cat = c.getAttribute('data-category') || 'all';
      const show = category === 'all' || category === cat;
      c.style.display = show ? '' : 'none';
      
      // Count visible items in current category
      if (show && !c.classList.contains('hidden-more')) {
        visibleCount++;
      }
    });
    
    // Reset see all button state when filtering
    if (seeAllBtn && seeAllText) {
      seeAllBtn.classList.remove('expanded');
      seeAllText.textContent = 'See All Projects';
      
      // Hide all hidden items when filtering
      hiddenItems.forEach((item) => {
        item.classList.remove('show');
      });
    }
    
    // Show/hide See All button based on category item count
    if (seeAllContainer) {
      const totalItemsInCategory = cards.filter(c => {
        const cat = c.getAttribute('data-category') || 'all';
        return category === 'all' || category === cat;
      }).length;
      
      // Only show See All button if there are more than 4 items in the category
      if (totalItemsInCategory > 4) {
        seeAllContainer.classList.remove('hidden');
      } else {
        seeAllContainer.classList.add('hidden');
      }
    }
  };
  
  tabs.forEach((t) => t.addEventListener('click', () => {
    tabs.forEach((x) => x.classList.remove('active'));
    t.classList.add('active');
    apply(t.getAttribute('data-filter'));
  }));
  
  apply('all');
})();

/* Contact form fake submit */
(function setupForm() {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('sendBtn');
  const label = btn?.querySelector('.send-label');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!btn || !label) return;
    const defaultText = label.textContent;
    btn.disabled = true; btn.classList.add('opacity-70');
    label.textContent = 'Sending…';
    setTimeout(() => {
      label.textContent = 'Sent!';
      btn.classList.add('!bg-emerald-500', '!shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_8px_30px_rgba(16,185,129,0.35)]');
      setTimeout(() => {
        btn.disabled = false; btn.classList.remove('opacity-70');
        btn.classList.remove('!bg-emerald-500');
        btn.classList.remove('!shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_8px_30px_rgba(16,185,129,0.35)]');
        label.textContent = defaultText;
        form.reset();
      }, 1200);
    }, 900);
  });
})();

/* Custom cursor */
(function setupCursor() {
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;
  let visible = false;
  const show = () => { if (!visible) { cursor.style.opacity = '1'; trail.style.opacity = '1'; visible = true; } };
  const hide = () => { cursor.style.opacity = '0'; trail.style.opacity = '0'; visible = false; };
  window.addEventListener('mousemove', (e) => {
    show();
    const { clientX: x, clientY: y } = e;
    cursor.style.transform = `translate(${x - 10}px, ${y - 10}px)`;
    trail.style.transform = `translate(${x}px, ${y}px)`;
  });
  window.addEventListener('mouseleave', hide);
})();

/* Simple parallax for background blobs (if needed later) */
(function setupParallax() {
  const heroes = document.querySelectorAll('#home [class*="animate-blob"]');
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.04;
    heroes.forEach((el, i) => { el.style.transform = `translateY(${y * (i + 1)}px)`; });
  });
})();

