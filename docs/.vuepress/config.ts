import process from 'node:process';
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom';
import { viteBundler } from '@vuepress/bundler-vite';
import { defineUserConfig } from '@vuepress/cli';
import { mdEnhancePlugin } from 'vuepress-plugin-md-enhance';
import { copyCodePlugin } from 'vuepress-plugin-copy-code2';
import { registerComponentsPlugin } from '@vuepress/plugin-register-components';
import { getDirname, path } from '@vuepress/utils';
import { balancerTheme } from '../../theme/';
import { navbar, sidebar } from './configs/index.js';
import * as dotenv from 'dotenv';

const isProd = process.env.NODE_ENV === 'production';

const __dirname = getDirname(import.meta.url);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default defineUserConfig({
  // set site base to default value
  base: '/',

  // site-level locales config
  locales: {
    '/': {
      lang: 'en-US',
      title: 'ZBU Staking',
      description: 'Learn, integrate, and build on a programmable AMM',
    },
  },

  bundler: viteBundler({
    viteOptions: {
      define: {
        'process.env': process.env,
      },
    },
    vuePluginOptions: {},
  }),

  // configure default theme
  theme: balancerTheme({
    logo: '/images/zeebu-logo.svg',
    logoDark: '/images/zeebu-logo.svg',
    repo: 'balancer-labs/docs',
    docsDir: 'docs',
    lastUpdated: false,

    // theme-level locales config
    locales: {
      /**
       * English locale config
       *
       * As the default locale of @vuepress/theme-default is English,
       * we don't need to set all of the locale fields
       */
      '/': {
        navbar: navbar,
        // sidebar
        sidebar: sidebar,
        sidebarDepth: 0,
        // page meta
        editLinkText: 'Edit page on GitHub',
      },
    },

    themePlugins: {
      // only enable git plugin in production mode
      git: isProd,
      // use shiki plugin in production mode instead
      prismjs: true,
    },
  }),

  // use plugins
  plugins: [
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
    }),
    copyCodePlugin({}),
    mdEnhancePlugin({
      mathjax: true,
      container: true,
      codetabs: true,
      include: true,
      tabs: true,
      chart: true,
      mermaid: true,
    }),
    // @vuepress/plugin-medium-zoom
    mediumZoomPlugin({
      selector:
        '.theme-default-content :not(a, .card-icon-row, .NetworkSelect__button) > img',
      zoomOptions: {},
      // should greater than page transition duration
      delay: 300,
    }),
  ],
});
