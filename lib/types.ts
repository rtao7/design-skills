export type ContentType = 'skill' | 'resource' | 'news' | 'community';

export type Skill = {
  id: string;
  type: 'skill';
  name: string;
  category: 'Product' | 'Design' | 'Handoff' | 'Presentation';
  description: string;
  tags: string[];
  content: string;
  status: 'live' | 'coming-soon';
};

export type Resource = {
  id: string;
  type: 'resource';
  title: string;
  url: string;
  resourceType: 'Tool' | 'Article' | 'Plugin' | 'Inspiration';
  description: string;
  tags: string[];
  thumbnail?: string;
  source?: string;
  publishedAt: string;
  status: 'live' | 'coming-soon';
};

export type NewsItem = {
  id: string;
  type: 'news';
  title: string;
  url: string;
  source: string;
  sourceFavicon?: string;
  description?: string;
  thumbnail?: string;
  publishedAt: string;
  tags: string[];
  origin: 'manual' | 'rss';
};

export type CommunityPost = {
  id: string;
  type: 'community';
  title: string;
  url?: string;
  description: string;
  author: string;
  authorAvatar?: string;
  upvotes: number;
  userHasUpvoted?: boolean;
  tags: string[];
  publishedAt: string;
};

export type FeedItem = Skill | Resource | NewsItem | CommunityPost;
