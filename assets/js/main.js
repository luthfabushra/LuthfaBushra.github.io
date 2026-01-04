(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
