import { Star, GitFork } from 'lucide-react';

interface GitHubStatsProps {
  repo: string;
}

async function getRepoStats(repo: string) {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function GitHubStats({ repo }: GitHubStatsProps) {
  const data = await getRepoStats(repo);

  if (!data) {
    return (
      <a
        href={`https://github.com/${repo}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
      >
        <span className="font-medium font-mono text-sm">{repo}</span>
      </a>
    );
  }

  return (
    <a
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-4 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
    >
      <span className="font-medium font-mono text-sm">{repo}</span>
      <span className="flex items-center gap-1 text-sm text-muted-foreground">
        <Star className="w-4 h-4" fill="currentColor" />
        {data.stargazers_count?.toLocaleString() ?? 0}
      </span>
      <span className="flex items-center gap-1 text-sm text-muted-foreground">
        <GitFork className="w-4 h-4" />
        {data.forks_count?.toLocaleString() ?? 0}
      </span>
    </a>
  );
}
