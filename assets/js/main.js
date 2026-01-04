(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Dismissible topbar (remembered)
  const topbar = document.querySelector('[data-topbar]');
  if (topbar instanceof HTMLElement) {
    const storageKey = 'fenotypefairy_topbar_dismissed';
    const isDismissed = (() => {
      try {
        return window.localStorage.getItem(storageKey) === '1';
      } catch {
        return false;
      }
    })();

    if (!isDismissed) {
      topbar.removeAttribute('hidden');
    }

    const closeBtn = topbar.querySelector('[data-topbar-close]');
    if (closeBtn instanceof HTMLElement) {
      closeBtn.addEventListener('click', () => {
        topbar.setAttribute('hidden', '');
        try {
          window.localStorage.setItem(storageKey, '1');
        } catch {
          // ignore
        }
      });
    }
  }

  // Reveal-on-scroll (subtle)
  if (!reduceMotion) {
    const nodes = document.querySelectorAll('[data-reveal]');
    if (nodes.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          }
        },
        { root: null, threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      );

      for (const node of nodes) observer.observe(node);
    }
  }

  // Mobile nav drawer
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navDrawer = document.querySelector('[data-nav-drawer]');
  const navBackdrop = document.querySelector('[data-nav-backdrop]');

  // Primary-nav dropdowns (e.g., Journal topics)
  const navDropdowns = Array.from(document.querySelectorAll('.nav-dropdown'))
    .filter((node) => node instanceof HTMLDetailsElement);

  const closeNavDropdowns = () => {
    for (const dropdown of navDropdowns) dropdown.open = false;
  };

  if (navDropdowns.length) {
    for (const dropdown of navDropdowns) {
      dropdown.addEventListener('toggle', () => {
        if (dropdown.open) {
          for (const other of navDropdowns) {
            if (other !== dropdown) other.open = false;
          }
        }
      });
    }

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const clickedInside = navDropdowns.some((dropdown) => dropdown.contains(target));
      if (!clickedInside) closeNavDropdowns();
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNavDropdowns();
    });
  }

  if (navToggle instanceof HTMLButtonElement && navDrawer instanceof HTMLElement) {
    // Add an in-drawer close button (keeps HTML simple across pages)
    let navClose = navDrawer.querySelector('[data-nav-close]');
    if (!(navClose instanceof HTMLButtonElement)) {
      navClose = document.createElement('button');
      navClose.type = 'button';
      navClose.className = 'nav-close';
      navClose.setAttribute('data-nav-close', '');
      navClose.setAttribute('aria-label', 'Close menu');
      navClose.innerHTML = '<span aria-hidden="true">×</span>';
      navDrawer.prepend(navClose);
    }

    const setOpen = (open) => {
      document.body.classList.toggle('nav-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');

      if (navBackdrop instanceof HTMLElement) {
        navBackdrop.toggleAttribute('hidden', !open);
      }

      if (open) {
        const firstLink = navDrawer.querySelector('a');
        if (firstLink instanceof HTMLElement) firstLink.focus();
      }
    };

    const isOpen = () => document.body.classList.contains('nav-open');

    navToggle.addEventListener('click', () => {
      setOpen(!isOpen());
    });

    if (navClose instanceof HTMLButtonElement) {
      navClose.addEventListener('click', () => {
        setOpen(false);
        navToggle.focus();
      });
    }

    if (navBackdrop instanceof HTMLElement) {
      navBackdrop.addEventListener('click', () => setOpen(false));
    }

    navDrawer.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('a')) {
        setOpen(false);
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        navToggle.focus();
      }
    });
  }

  // Home: compact navbar on scroll
  if (document.body.classList.contains('home')) {
    const header = document.querySelector('.site-header');
    if (header instanceof HTMLElement) {
      const enterThreshold = 80;
      const exitThreshold = 40;
      let isScrolled = header.classList.contains('is-scrolled');

      let lastKnownScrollY = window.scrollY;
      let ticking = false;

      const update = () => {
        ticking = false;
        const y = lastKnownScrollY;
        const next = isScrolled ? y > exitThreshold : y > enterThreshold;
        if (next !== isScrolled) {
          isScrolled = next;
          header.classList.toggle('is-scrolled', isScrolled);
        }
      };

      const onScroll = () => {
        lastKnownScrollY = window.scrollY;
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      };

      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  // Scroll-to-top button
  const toTopButton = document.querySelector('[data-to-top]');
  if (toTopButton instanceof HTMLElement) {
    const showAfter = 420;
    const setVisible = () => {
      const shouldShow = window.scrollY > showAfter;
      toTopButton.toggleAttribute('hidden', !shouldShow);
    };

    setVisible();
    window.addEventListener('scroll', setVisible, { passive: true });
    toTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }
})();
