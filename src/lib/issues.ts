import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const issuesDirectory = path.join(process.cwd(), "content/issues");

export interface Buzzword {
  term: string;
  definition: string;
  examples: string[];
}

export interface Issue {
  slug: string;
  title: string;
  date: string;
  issue: number;
  description: string;
  tags: string[];
  buzzword: Buzzword;
  coverImage?: string;
  shortTitle?: string;
  type?: "deep-dive" | "roundup";
  draft?: boolean;
  contentHtml: string;
}

export interface IssueMeta {
  slug: string;
  title: string;
  date: string;
  issue: number;
  description: string;
  tags: string[];
  buzzword: Buzzword;
  coverImage?: string;
  shortTitle?: string;
  type?: "deep-dive" | "roundup";
  draft?: boolean;
}

export function getAllIssues(includeDrafts = false): IssueMeta[] {
  const fileNames = fs.readdirSync(issuesDirectory);
  const allIssues = fileNames
    .filter((f) => f.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(issuesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return {
        slug,
        ...(data as Omit<IssueMeta, "slug">),
      };
    })
    .filter((issue) => includeDrafts || !issue.draft);

  return allIssues.sort((a, b) => b.issue - a.issue);
}

export async function getIssueBySlug(slug: string): Promise<Issue> {
  const fullPath = path.join(issuesDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    contentHtml,
    ...(data as Omit<Issue, "slug" | "contentHtml">),
  };
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(issuesDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .filter((slug) => {
      const fullPath = path.join(issuesDirectory, `${slug}.md`);
      const { data } = matter(fs.readFileSync(fullPath, "utf8"));
      return !data.draft;
    });
}
