(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const menuButton = document.getElementById('menu-toggle');
  const navPanel = document.getElementById('primary-nav');
  const form = document.getElementById('contact-form');
  const formNote = document.getElementById('form-note');

  // Theme: dark is the default; remember the visitor's choice when storage is available.
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('kelvin-portfolio-theme'); } catch (_) { /* Storage may be unavailable. */ }
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;

  function updateThemeButton() {
    const isDark = root.dataset.theme !== 'light';
    themeButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeButton.innerHTML = isDark
      ? '<span class="theme-icon" aria-hidden="true">☼</span><span class="theme-label">Light mode</span>'
      : '<span class="theme-icon" aria-hidden="true">☾</span><span class="theme-label">Dark mode</span>';
  }
  updateThemeButton();

  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('kelvin-portfolio-theme', root.dataset.theme); } catch (_) { /* Theme still works for this visit. */ }
    updateThemeButton();
  });

  function closeMenu() {
    navPanel.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navPanel.classList.toggle('is-open', !isOpen);
  });
  navPanel.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 680) closeMenu(); });


  // Reading progress indicator.
  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    let progressTicking = false;
    function updateScrollProgress() {
      if (progressTicking) return;
      progressTicking = true;
      window.requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        progressTicking = false;
      });
    }
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
  }

  // Reveal-on-scroll with a graceful fallback for browsers without IntersectionObserver.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // This uses the visitor's email app; it does not send or store messages on a server.
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = `Portfolio message from ${data.get('name')}`;
    const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`;
    const mailto = `mailto:kelvingordian9@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    formNote.textContent = 'Opening your email app with the message details…';
    window.location.href = mailto;
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
