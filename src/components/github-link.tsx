import * as React from "react";
import Link from "next/link";

import { siteConfig } from "@/lib/config";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function GitHubLink() {
  return (
    <Button asChild size="sm" variant="ghost" className="h-8 shadow-none">
      <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
        <Icons.gitHub />
        <React.Suspense fallback={<Skeleton className="h-4 w-[42px]" />}>
          <StarsCount />
        </React.Suspense>
      </Link>
    </Button>
  );
}

export async function StarsCount() {
  let formattedCount: string | null = null;

  try {
    const data = await fetch("https://api.github.com/repos/ninepiece2/docs", {
      headers: {
        Accept: "application/vnd.github+json",
      },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    });

    if (!data.ok) {
      return null;
    }

    const json: unknown = await data.json();
    if (
      typeof json !== "object" ||
      json === null ||
      !("stargazers_count" in json) ||
      typeof json.stargazers_count !== "number"
    ) {
      return null;
    }

    formattedCount =
      json.stargazers_count >= 1000
        ? `${Math.round(json.stargazers_count / 1000)}k`
        : json.stargazers_count.toLocaleString();
  } catch {
    formattedCount = null;
  }

  if (formattedCount === null) {
    return null;
  }

  return (
    <span className="text-muted-foreground w-fit text-xs tabular-nums">
      {formattedCount}
    </span>
  );
}
