import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export type Skill = {
  title: string;
  description: string;
  tags: string[];
  category: string;
  slug: string;
  raw: string;
  body: string;
};

export type Category = {
  name: string;
  displayName: string;
  skills: Skill[];
};

const SKILLS_DIR = path.join(process.cwd(), 'skills');

function toDisplayName(name: string): string {
  return name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function getAllCategories(): Promise<Category[]> {
  const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
  const categories: Category[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const category = entry.name;
    const categoryPath = path.join(SKILLS_DIR, category);
    const files = await fs.readdir(categoryPath);
    const skills: Skill[] = [];

    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const slug = file.replace(/\.md$/, '');
      const raw = await fs.readFile(path.join(categoryPath, file), 'utf-8');
      const { data, content } = matter(raw);
      skills.push({
        title: data.title ?? slug,
        description: data.description ?? '',
        tags: data.tags ?? [],
        category,
        slug,
        raw,
        body: content,
      });
    }

    if (skills.length > 0) {
      categories.push({ name: category, displayName: toDisplayName(category), skills });
    }
  }

  return categories;
}

export async function getSkill(category: string, slug: string): Promise<Skill | null> {
  try {
    const filePath = path.join(SKILLS_DIR, category, `${slug}.md`);
    const raw = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      title: data.title ?? slug,
      description: data.description ?? '',
      tags: data.tags ?? [],
      category,
      slug,
      raw,
      body: content,
    };
  } catch {
    return null;
  }
}

export async function getAllSkillPaths(): Promise<{ category: string; slug: string }[]> {
  const categories = await getAllCategories();
  return categories.flatMap((c) =>
    c.skills.map((s) => ({ category: s.category, slug: s.slug }))
  );
}
