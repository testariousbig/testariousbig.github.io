import { marked } from 'marked';
import fm from 'front-matter';
import { getLang } from './i18n.js';

// Configuración de marked para resaltado de sintaxis
marked.setOptions({
    headerIds: true,
    mangle: false
});

// Función para renderizar el contenido de un writeup (igual que el CV)
export async function renderWriteupContent(platform, writeupId, container) {
    const lang = getLang();
    try {
        const response = await fetch(`/content/${lang}/writeups/${platform}/${writeupId}.md`);
        if (!response.ok) throw new Error('File not found');

        const text = await response.text();
        const { body } = fm(text);

        const htmlContent = marked.parse(body);

        container.innerHTML = `
        <div class="prose prose-invert max-w-none">
            <style>
            .prose { color: rgba(255, 255, 255, 0.7); line-height: 1.75; }
            .prose h1 { color: #fff; font-size: 2.25rem; font-weight: 800; margin-bottom: 2rem; letter-spacing: -0.025em; }
            .prose h2 { color: #fff; font-size: 1.5rem; font-weight: 700; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.5rem; }
            .prose h3 { color: rgba(255, 255, 255, 0.9); font-size: 1.25rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem; }
            .prose p { margin-bottom: 1rem; }
            .prose ul { list-style-type: none; margin-bottom: 1.5rem; padding-left: 0; }
            .prose li { margin-bottom: 0.4rem; position: relative; padding-left: 1.5rem; }
            .prose li::before { content: "•"; position: absolute; left: 0; color: #3b82f6; font-weight: bold; }
            .prose a { color: #3b82f6; text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.2s; }
            .prose a:hover { border-color: #3b82f6; }
            .prose strong { color: #fff; font-weight: 600; }
            .prose code { background: rgba(255, 255, 255, 0.1); padding: 0.2rem 0.4rem; border-radius: 0.4rem; color: #fff; font-size: 0.85em; }
            .prose pre { background: rgba(0, 0, 0, 0.3); padding: 1.5rem; border-radius: 1rem; border: 1px solid rgba(255, 255, 255, 0.05); margin: 2rem 0; overflow-x: auto; }
            .prose table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; background: rgba(255, 255, 255, 0.02); border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1); }
            .prose th { background: rgba(255, 255, 255, 0.05); color: #fff; font-weight: 600; padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
            .prose td { color: rgba(255, 255, 255, 0.8); padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
            .prose tr:last-child td { border-bottom: none; }
            .prose tr:hover { background: rgba(255, 255, 255, 0.03); }
            </style>
            ${htmlContent}
        </div>
        `;
    } catch (error) {
        container.innerHTML = `<div class="p-12 text-center text-white/20 italic font-medium">Contenido no disponible temporalmente.</div>`;
    }
}

// Función para cargar writeups desde una plataforma
export async function loadWriteups(platform) {
  try {
    // Cargar writeups desde archivo JSON central
    const response = await fetch('/content/writeups.json');
    if (!response.ok) {
      console.error('No se pudo cargar writeups.json');
      return [];
    }

    const writeupsData = await response.json();
    return writeupsData[platform] || [];
  } catch (error) {
    console.error('Error loading writeups from JSON:', error);
    return [];
  }
}

