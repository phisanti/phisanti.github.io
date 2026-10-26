import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { figures } from './src/lib/figures.ts';
import { creamLight } from './src/lib/shiki-cream-light.ts';

export default defineConfig({
  site: 'https://phisanti.github.io',
  trailingSlash: 'ignore',
  output: 'static',
  build: { format: 'directory' },
  redirects: {
    '/year-archive': '/writing/',
    '/tags': '/writing/tags/',
    '/categories': '/writing/tags/',
    '/portfolio': '/projects/',
    '/portfolio/portfolio-1': '/posts/2023/03/twitter-sentiment-analysis/',
    '/portfolio/portfolio-2': '/posts/2023/02/gpu-cloud-paperspace/',
    '/portfolio/portofolio-3': '/posts/2023/04/shiny-milestone/',
    '/portfolio/portofolio-4': '/posts/2023/04/shiny-strikes-back/',
    '/portfolio/portfolio-5': '/posts/2024/12/rmarkdown-reports-cli/',
    '/portfolio/portfolio-6': '/posts/2025/05/focus-restoration-restormer/',
    '/portfolio/portfolio-7': '/posts/2025/07/accidental-journey-pypi/',
    '/portfolio/portfolio-8': '/posts/2025/07/codedjinn/',
    '/publication/2015-10-01-paper-title-number-3': '/publications/#2015-10-01-paper-title-number-3',
    '/publication/indole_and_bacteria': '/publications/#indole_and_bacteria',
    '/publication/indole_redirects_metabolism': '/publications/#indole_redirects_metabolism',
    '/publication/ionic_control_porin': '/publications/#ionic_control_porin',
    '/publication/persisters_and_pH': '/publications/#persisters_and_pH',
    '/publication/porin_permeability_control': '/publications/#porin_permeability_control',
    '/about.html': '/about/',
    '/cv': '/about/',
    '/resume': '/about/',
    '/talks': '/about/',
    '/teaching': '/about/',
    '/teaching/2014-spring-teaching-1': '/about/',
    '/teaching/2020-R-in-lockdown': '/about/',
    '/talkmap.html': '/about/',
    '/talkmap/map.html': '/about/',
    '/collection-archive': '/about/',
    '/page-archive': '/about/',
    '/markdown': '/about/',
    '/non-menu-page': '/about/',
    '/terms': '/about/',
    '/sitemap': '/sitemap-index.xml',
  },
  integrations: [sitemap()],
  markdown: {
    processor: satteri({ hastPlugins: [figures] }),
    // Both palettes ship as CSS variables; site.css picks one per data-theme.
    shikiConfig: { themes: { light: creamLight, dark: 'everforest-dark' }, defaultColor: false, langAlias: { R: 'r' } },
  },
});
