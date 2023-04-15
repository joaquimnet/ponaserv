import type { SiteData } from 'vitepress';
import { version } from '../../package.json';

const config: Partial<SiteData<any>> = {
  title: 'Ponaserv',
  description: 'Node library that lets you easily map routes to request handlers in express.',
  // @ts-expect-error
  lastUpdated: true,
  cleanUrls: true,
  head: [
    ['meta', { name: 'theme-color', content: '#ff5719' }],
    ['meta', { name: 'og:image', content: 'https://ponaserv.vercel.app/code.png' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Ponaserv',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/introduction' },
      { text: 'Issues', link: 'https://github.com/joaquimnet/ponaserv/issues' },
      {
        text: version,
        items: [
          {
            text: 'Changelog',
            link: 'https://github.com/joaquimnet/ponaserv/blob/main/CHANGELOG.md',
          },
          {
            text: 'Contributing',
            link: 'https://github.com/joaquimnet/ponaserv/blob/main/CODE_OF_CONDUCT.md',
          },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/joaquimnet/ponaserv' },
      { icon: 'twitter', link: 'https://twitter.com/joaquimnet_' },
      // { icon: 'discord', link: 'https://discord.com/invite/codekaffe' }, // soon
    ],
    editLink: {
      pattern: 'https://github.com/joaquimnet/ponaserv/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    sidebar: [
      {
        text: 'About',
        collapsible: false,
        items: [
          { text: 'Introduction', link: '/introduction' },
          // { text: 'Basic Concepts', link: '/basic-concepts' },
          { text: 'Changelog', link: '/changelog' },
        ],
      },
      {
        text: 'Usage',
        collapsible: false,
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          // { text: 'Configuration', link: '/configuration' }, // soon
          { text: 'Routes', link: '/routes' },
          { text: 'Validation', link: '/validation' },
          { text: 'Middleware', link: '/middleware' },
        ],
      },
      {
        text: 'More',
        collapsible: false,
        items: [
          {
            text: 'Contributing',
            link: 'https://github.com/joaquimnet/ponaserv/blob/main/CONTRIBUTING.md',
          },
          { text: 'License', link: 'https://github.com/joaquimnet/ponaserv/blob/main/LICENSE.md' },
          {
            text: 'Changelog',
            link: 'https://github.com/joaquimnet/ponaserv/blob/main/CHANGELOG.md',
          },
        ],
      },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2020-present Ponaserv',
    },
  },
};

export default config;
