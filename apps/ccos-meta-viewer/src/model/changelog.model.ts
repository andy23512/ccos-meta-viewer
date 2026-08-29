export interface ChangelogItem {
  summary: string;
  description?: string;
}

export interface Changelog {
  features: ChangelogItem[];
  fixes: ChangelogItem[];
}
