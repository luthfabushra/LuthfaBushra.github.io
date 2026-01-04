(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const nodes = document.querySelectorAll('[data-reveal]');
  if (!nodes.length) return;

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
})();
