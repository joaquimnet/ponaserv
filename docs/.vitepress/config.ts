import type { SiteData } from 'vitepress';
import { version } from '../../package.json';

const config: Partial<SiteData<any>> = {
  title: 'Ponaserv',
  description: 'An awesome docs template built by me',
  // @ts-expect-error
  lastUpdated: true,
  cleanUrls: 'without-subfolders',
  head: [['meta', { name: 'theme-color', content: '#ff5719' }]],

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
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2020-present Ponaserv',
    },
  },
};

export default config;