import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export type Skill = {
  title: string;
  description: string;
  tags: string[];
  category: string;
  folder?: string;
  slug: string;
  raw: string;
  body: string;
};

export type Folder = {
  name: string;
  displayName: string;
  skills: Skill[];
};

export type Category = {
  name: string;
  displayName: string;
  skills: Skill[];
  folders: Folder[];
};

const SKILLS_DIR = path.join(process.cwd(), 'skills');

function toDisplayName(name: string): string {
  return name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

async function readSkillFile(filePath: string, category: string, slug: string, folder?: string): Promise<Skill> {
  const raw = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    title: data.title ?? slug,
    description: data.description ?? '',
    tags: data.tags ?? [],
    category,
    folder,
    slug,
    raw,
    body: content,
  };
}

export async function getAllCategories(): Promise<Category[]> {
  const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
  const categories: Category[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const category = entry.name;
    const categoryPath = path.join(SKILLS_DIR, category);
    const items = await fs.readdir(categoryPath, { withFileTypes: true });
    const skills: Skill[] = [];
    const folders: Folder[] = [];

    for (const item of items) {
      if (item.isFile() && item.name.endsWith('.md')) {
        const slug = item.name.replace(/\.md$/, '');
        skills.push(await readSkillFile(path.join(categoryPath, item.name), category, slug));
      } else if (item.isDirectory()) {
        const folderName = item.name;
        const folderPath = path.join(categoryPath, folderName);
        const folderFiles = await fs.readdir(folderPath);
        const folderSkills: Skill[] = [];

        for (const file of folderFiles) {
          if (!file.endsWith('.md')) continue;
          const slug = file.replace(/\.md$/, '');
          folderSkills.push(await readSkillFile(path.join(folderPath, file), category, slug, folderName));
        }

        if (folderSkills.length > 0) {
          folders.push({ name: folderName, displayName: toDisplayName(folderName), skills: folderSkills });
        }
      }
    }

    if (skills.length > 0 || folders.length > 0) {
      categories.push({ name: category, displayName: toDisplayName(category), skills, folders });
    }
  }

  return categories;
}
