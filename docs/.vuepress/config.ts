// .vuepress/config.ts
import { defineUserConfig } from '@vuepress/cli';
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom';
import { containerPlugin } from '@vuepress/plugin-container';
import { viteBundler } from '@vuepress/bundler-vite';
import { mdEnhancePlugin } from 'vuepress-plugin-md-enhance';
import { copyCodePlugin } from 'vuepress-plugin-copy-code2';
import { registerComponentsPlugin } from '@vuepress/plugin-register-components';
import { getDirname, path } from '@vuepress/utils';
import { balancerTheme } from '../../theme/';
import { navbar, sidebar } from './configs/index';
import * as dotenv from 'dotenv';
import process from 'node:process';

const isProd = process.env.NODE_ENV === 'production';

const __dirname = getDirname(import.meta.url);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default defineUserConfig({
  base: '/',

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

  theme: balancerTheme({
    logo: '/images/zeebu-logo.svg',
    logoDark: '/images/zeebu-logo.svg',
    repo: 'balancer-labs/docs',
    docsDir: 'docs',
    lastUpdated: false,

    enhanceAppFiles: path.resolve(__dirname, './enhanceApp.ts'),

    locales: {
      '/': {
        navbar: navbar,
        sidebar: sidebar,
        sidebarDepth: 0,
        editLinkText: 'Edit page on GitHub',
      },
    },

    themePlugins: {
      git: isProd,
      prismjs: true,
    },
  }),

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
    mediumZoomPlugin({
      selector: '.theme-default-content :not(a, .card-icon-row, .NetworkSelect__button) > img',
      zoomOptions: {},
      delay: 300,
    }),
  ],

  clientConfigFile: path.resolve(__dirname, './enhanceApp.ts'),
});
