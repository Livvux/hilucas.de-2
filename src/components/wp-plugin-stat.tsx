import { cache } from "react";

interface WPPluginStatProps {
  slugs: string[];
  stat: "plugins" | "active_installs" | "downloads";
  label?: string;
}

interface PluginInfo {
  active_installs?: number;
}

interface PluginDownloads {
  all_time?: string;
}

// Cached per-request to deduplicate calls across "plugins" and "active_installs" stats
const getPluginInfo = cache(
  async (slug: string): Promise<PluginInfo | null> => {
    try {
      const res = await fetch(
        `https://api.wordpress.org/plugins/info/1.2/?action=plugin_information&slug=${slug}`,
        { next: { revalidate: 3600 } },
      );
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },
);

async function getPluginDownloads(slug: string): Promise<number> {
  try {
    const res = await fetch(
      `https://api.wordpress.org/stats/plugin/1.0/downloads.php?slug=${slug}&historical_summary=1`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return 0;
    const data: PluginDownloads = await res.json();
    return parseInt(data.all_time ?? "0", 10);
  } catch {
    return 0;
  }
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

const defaultLabels: Record<WPPluginStatProps["stat"], string> = {
  plugins: "Total plugins",
  active_installs: "Active installations",
  downloads: "Total downloads",
};

export async function WPPluginStat({ slugs, stat, label }: WPPluginStatProps) {
  let value: number;

  switch (stat) {
    case "plugins": {
      const results = await Promise.all(slugs.map(getPluginInfo));
      value = results.filter((r) => r !== null).length;
      break;
    }
    case "active_installs": {
      const results = await Promise.all(slugs.map(getPluginInfo));
      value = results.reduce((sum, r) => sum + (r?.active_installs ?? 0), 0);
      break;
    }
    case "downloads": {
      const results = await Promise.all(slugs.map(getPluginDownloads));
      value = results.reduce((sum, downloads) => sum + downloads, 0);
      break;
    }
  }

  const displayLabel = label ?? defaultLabels[stat];
  const displayValue = formatNumber(value) + (stat !== "plugins" ? "+" : "");

  return (
    <div className="flex items-center justify-between">
      <span className="text-copy">{displayLabel}</span>
      <span className="font-medium tabular-nums">{displayValue}</span>
    </div>
  );
}
