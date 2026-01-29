import './style.css';
import { getLang, setLang, t } from './i18n.js';
import { renderContent } from './loader.js';

const app = document.querySelector('#app');

function renderUI() {
  const lang = getLang();
  const currentHash = window.location.hash || '#home';

  const flags = {
    es: `<svg class="w-4 h-3 inline-block mr-1.5 rounded-[1px] shadow-sm" viewBox="0 0 750 500"><rect width="750" height="500" fill="#c60b1e"/><rect width="750" height="250" y="125" fill="#ffc400"/></svg>`,
    en: `<svg class="w-4 h-3 inline-block mr-1.5 rounded-[1px] shadow-sm" viewBox="0 0 60 30"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6" clip-path="url(#s)"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="4" clip-path="url(#s)"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></svg>`
  };

  app.innerHTML = `
    <div class="min-h-screen flex flex-col">
      <!-- Navbar -->
      <nav class="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
        <div class="glass flex items-center gap-2 p-1.5 rounded-full">
          <a href="#home" class="nav-item ${currentHash === '#home' ? 'active' : ''}">${t('home')}</a>
          <a href="#cv" class="nav-item ${currentHash === '#cv' ? 'active' : ''}">${t('cv')}</a>
          <button id="lang-toggle" class="nav-item flex items-center opacity-80 hover:opacity-100 uppercase text-[10px] tracking-widest pl-4 border-l border-white/10 group">
            ${lang === 'es' ? flags.en : flags.es}
            <span>${t('switchLang')}</span>
          </button>
        </div>
      </nav>

      <!-- Hero Section -->
      <header class="pt-28 pb-12 px-6 max-w-6xl mx-auto w-full">
        <div class="fade-in flex flex-col md:flex-row items-center md:items-start md:text-left gap-8 md:gap-12">
          <div class="relative shrink-0 group">
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src="./images/profile.jpeg" 
              alt="Samuel Rodríguez" 
              class="relative w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-2 border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div class="flex flex-col items-center md:items-start">
            <h1 class="text-5xl md:text-7xl font-bold gradient-text tracking-tight leading-tight mb-2">
              Samuel Rodríguez
            </h1>
            <p class="text-xl md:text-2xl text-white/50 font-medium mb-8">
              ${t('subTitle')}
            </p>
            <div class="flex flex-wrap justify-center md:justify-start gap-4">
              <a href="#cv" class="btn-primary">${t('viewCV')}</a>
              <a href="https://www.linkedin.com/in/samuel-rodríguez-ramírez-9175a4150" target="_blank" class="btn-secondary flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-grow px-6 pb-16 max-w-6xl mx-auto w-full">
        <div id="content" class="glass-card fade-in min-h-[400px]">
          <div class="animate-pulse flex flex-col gap-4">
            <div class="h-6 bg-white/5 rounded w-1/4"></div>
            <div class="h-4 bg-white/5 rounded w-3/4"></div>
            <div class="h-4 bg-white/5 rounded w-1/2"></div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="p-8 text-center text-white/30 text-xs font-medium border-t border-white/5 bg-black/10 backdrop-blur-md">
        <p>© 2026 Samuel Rodríguez Ramírez.</p>
      </footer>
    </div>
  `;

  setupEventListeners();
  handleRouting();
}

function setupEventListeners() {
  const langBtn = document.querySelector('#lang-toggle');
  langBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const newLang = getLang() === 'es' ? 'en' : 'es';
    setLang(newLang);
    renderUI();
  });

  window.addEventListener('hashchange', () => {
    renderUI();
  }, { once: true }); // Avoid multiple listeners if rerendering
}

function handleRouting() {
  const hash = window.location.hash || '#home';
  const contentArea = document.querySelector('#content');
  if (!contentArea) return;

  if (hash === '#cv') {
    contentArea.className = 'fade-in min-h-[400px] w-full'; // Remove glass-card
    renderContent('cv', contentArea);
  } else {
    contentArea.className = 'glass-card fade-in min-h-[400px] w-full';
    contentArea.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-6">
          <div class="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
            ${t('aboutMe')}
          </div>
          <h3 class="text-3xl font-semibold">${t('homeSummaryTitle')}</h3>
          <p class="text-white/60 leading-relaxed">
            ${t('homeSummaryText1')}
          </p>
          <p class="text-white/60 leading-relaxed">
            ${t('homeSummaryText2')}
          </p>
        </div>
        <div class="glass-dark rounded-xl p-8 space-y-6">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold uppercase tracking-widest text-white/40">${t('currentStatus')}</h4>
            <span class="flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
          
          <ul class="space-y-6">
            <!-- SOC Path -->
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <div class="flex-grow">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-semibold text-white/90">${t('statusSOC')}</span>
                  <span class="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">${t('statusFinished')}</span>
                </div>
                <p class="text-xs text-white/40">TryHackMe Path</p>
              </div>
            </li>

            <!-- Web Pen -->
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div class="flex-grow">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-semibold text-white/90">${t('statusWebPen')}</span>
                  <span class="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">${t('statusOngoing')}</span>
                </div>
                <p class="text-xs text-white/40">TryHackMe Path</p>
              </div>
            </li>

            <!-- CTFs -->
            <li class="flex items-start gap-4">
              <div class="mt-1 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <div class="flex-grow">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-semibold text-white/90">${t('statusCTF')}</span>
                  <span class="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">${t('statusOngoing')}</span>
                </div>
                <p class="text-xs text-white/40">HackTheBox / TryHackMe</p>
              </div>
            </li>

            <!-- Location & Available -->
            <li class="pt-4 border-t border-white/5 space-y-3">
              <div class="flex items-center gap-3 pl-1.5">
                <div class="relative flex h-2 w-2">
                  <div class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></div>
                  <div class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
                </div>
                <span class="text-xs text-white/70 font-medium">${t('statusAvailable')}</span>
              </div>
              <div class="flex items-center gap-2 opacity-50 pl-0.75">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span class="text-xs">${t('location')}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    `;
  }
}

// Ensure hashchange listener is centralized and not duplicated
window.onhashchange = () => {
  renderUI();
};

window.addEventListener('languageChanged', () => {
  renderUI();
});

renderUI();
