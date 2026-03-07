// ============================================================
// AUTHOR DATA — E-E-A-T signals for Google
// Individual author profiles with bios, social links, expertise
// Used in blog posts, team page, and Person schema
// ============================================================

import { SITE_URL, SITE_NAME } from './constants';

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  shortBio: string;
  initials: string;
  gradient: string;
  expertise: string[];
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  articles: number;
  reviews: number;
  /** Schema.org sameAs URLs for structured data */
  sameAs: string[];
  /** What the person knows about (for schema.org knowsAbout) */
  knowsAbout: string[];
}

export const AUTHORS: Record<string, Author> = {
  'Alex Chen': {
    slug: 'alex-chen',
    name: 'Alex Chen',
    role: 'Lead Software Analyst',
    bio: 'Former engineering lead at a Fortune 500 tech company. Alex brings 12+ years of hands-on experience evaluating enterprise software, SaaS platforms, and AI tools. He leads our methodology and scoring framework.',
    shortBio: 'Lead analyst with 12+ years in enterprise software and AI. Leads our review methodology.',
    initials: 'AC',
    gradient: 'from-blue-500 to-indigo-600',
    expertise: ['AI Tools', 'SaaS', 'Enterprise Software'],
    social: {
      twitter: 'https://twitter.com/alexchen_tech',
      linkedin: 'https://linkedin.com/in/alexchen-analyst',
    },
    articles: 45,
    reviews: 120,
    sameAs: [
      'https://twitter.com/alexchen_tech',
      'https://linkedin.com/in/alexchen-analyst',
    ],
    knowsAbout: [
      'Artificial Intelligence', 'SaaS', 'Enterprise Software',
      'Software Architecture', 'Machine Learning', 'Cloud Computing',
    ],
  },
  'Sarah Mitchell': {
    slug: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    role: 'E-commerce & Marketing Editor',
    bio: 'Digital marketing strategist with 8 years of experience managing e-commerce brands. Sarah specializes in marketing automation, SEO tools, and e-commerce platform comparisons.',
    shortBio: 'Marketing strategist specializing in e-commerce, SEO, and marketing automation tools.',
    initials: 'SM',
    gradient: 'from-purple-500 to-pink-600',
    expertise: ['Marketing', 'E-commerce', 'SEO Tools'],
    social: {
      twitter: 'https://twitter.com/sarahmitchell_mkt',
      linkedin: 'https://linkedin.com/in/sarah-mitchell-marketing',
    },
    articles: 38,
    reviews: 95,
    sameAs: [
      'https://twitter.com/sarahmitchell_mkt',
      'https://linkedin.com/in/sarah-mitchell-marketing',
    ],
    knowsAbout: [
      'Digital Marketing', 'E-commerce', 'SEO',
      'Email Marketing', 'Social Media Marketing', 'Content Strategy',
    ],
  },
  'James Rodriguez': {
    slug: 'james-rodriguez',
    name: 'James Rodriguez',
    role: 'Cloud & Infrastructure Analyst',
    bio: 'Certified cloud architect (AWS, Azure, GCP) with deep expertise in hosting, DevOps tools, and infrastructure software. James evaluates performance, security, and scalability.',
    shortBio: 'Cloud architect evaluating hosting, DevOps, and infrastructure tools.',
    initials: 'JR',
    gradient: 'from-green-500 to-teal-600',
    expertise: ['Hosting', 'Cloud', 'DevOps'],
    social: {
      twitter: 'https://twitter.com/jamesrodriguez_dev',
      linkedin: 'https://linkedin.com/in/james-rodriguez-cloud',
      github: 'https://github.com/jamesrodriguez-cloud',
    },
    articles: 32,
    reviews: 85,
    sameAs: [
      'https://twitter.com/jamesrodriguez_dev',
      'https://linkedin.com/in/james-rodriguez-cloud',
      'https://github.com/jamesrodriguez-cloud',
    ],
    knowsAbout: [
      'Cloud Computing', 'Web Hosting', 'DevOps',
      'AWS', 'Kubernetes', 'Infrastructure as Code',
    ],
  },
  'Emily Nakamura': {
    slug: 'emily-nakamura',
    name: 'Emily Nakamura',
    role: 'Business Tools Researcher',
    bio: 'Business operations consultant who has helped 200+ companies optimize their software stack. Emily focuses on productivity, collaboration, accounting, and business management tools.',
    shortBio: 'Operations consultant specializing in productivity and business management tools.',
    initials: 'EN',
    gradient: 'from-orange-500 to-red-600',
    expertise: ['Business', 'Productivity', 'Collaboration'],
    social: {
      twitter: 'https://twitter.com/emilynakamura_biz',
      linkedin: 'https://linkedin.com/in/emily-nakamura-ops',
    },
    articles: 28,
    reviews: 75,
    sameAs: [
      'https://twitter.com/emilynakamura_biz',
      'https://linkedin.com/in/emily-nakamura-ops',
    ],
    knowsAbout: [
      'Business Operations', 'Productivity Software', 'Collaboration Tools',
      'Accounting Software', 'Project Management', 'Team Communication',
    ],
  },
  'ToolPilot Editorial Team': {
    slug: 'editorial-team',
    name: 'ToolPilot Editorial Team',
    role: 'Editorial Team',
    bio: `The ${SITE_NAME} editorial team combines decades of industry experience to deliver honest, data-driven reviews. Every tool gets the same rigorous evaluation process.`,
    shortBio: 'Our team rigorously tests tools to provide unbiased, data-driven recommendations.',
    initials: 'TP',
    gradient: 'from-blue-500 to-purple-600',
    expertise: ['AI Tools', 'SaaS', 'E-commerce', 'Marketing', 'Hosting', 'Business'],
    social: {
      twitter: 'https://twitter.com/toolpilot',
      linkedin: 'https://linkedin.com/company/toolpilot',
    },
    articles: 140,
    reviews: 400,
    sameAs: [
      'https://twitter.com/toolpilot',
      'https://linkedin.com/company/toolpilot',
    ],
    knowsAbout: [
      'Software Reviews', 'Technology Comparison', 'Digital Tools',
    ],
  },
};

/**
 * Get author data by name. Falls back to editorial team.
 */
export function getAuthor(name: string): Author {
  return AUTHORS[name] || AUTHORS['ToolPilot Editorial Team'];
}

/**
 * Get author URL for schema.org
 */
export function getAuthorUrl(name: string): string {
  const author = getAuthor(name);
  return `${SITE_URL}/about/team#${author.slug}`;
}

/**
 * Get all individual team members (excludes editorial team)
 */
export function getTeamMembers(): Author[] {
  return Object.values(AUTHORS).filter(a => a.slug !== 'editorial-team');
}
