function gFavicon(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
}

export const RSS_SOURCES = [
  {
    name: 'Designer News',
    url: 'https://www.designernews.co/?format=rss',
    favicon: gFavicon('designernews.co'),
    defaultTags: ['design', 'news'],
  },
  {
    name: 'Sidebar.io',
    url: 'https://sidebar.io/feed.xml',
    favicon: gFavicon('sidebar.io'),
    defaultTags: ['design', 'curated'],
  },
  {
    name: 'UX Collective',
    url: 'https://uxdesign.cc/feed',
    favicon: gFavicon('uxdesign.cc'),
    defaultTags: ['ux', 'article'],
  },
  {
    name: 'Smashing Magazine',
    url: 'https://www.smashingmagazine.com/feed/',
    favicon: gFavicon('smashingmagazine.com'),
    defaultTags: ['design', 'development'],
  },
]
