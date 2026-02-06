import { type Metadata } from "next";
import Link from "next/link";
import { BookOpen, GitBranch, Search } from "lucide-react";

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Button } from "@/components/ui/button";

const title = "My Knowledge Base";
const description =
  "A collection of solutions, guides, and insights on topics I've explored and issues I've solved. Reference, learn, and troubleshoot.";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title,
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title,
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
};

const categories = [
  {
    title: "Troubleshooting",
    description:
      "Solutions to problems I've encountered and how I resolved them.",
  },
  {
    title: "Guides & Tutorials",
    description: "Step-by-step guides on topics I've learned and mastered.",
  },
  {
    title: "Notes & Insights",
    description:
      "Documentation, version history, and lessons learned along the way.",
  },
];

export default function IndexPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader>
        <PageHeaderHeading className="max-w-4xl">{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm" className="h-[31px] rounded-lg">
            <Link href="/docs">Explore Docs</Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className="rounded-lg">
            <Link href="/docs/installation">Browse by Topic</Link>
          </Button>
        </PageActions>
      </PageHeader>

      <div className="container-wrapper">
        <div className="container">
          <div className="mx-auto grid gap-8 py-12 md:grid-cols-3 lg:py-16">
            {categories.map((category) => (
              <div
                key={category.title}
                className="flex flex-col gap-3 rounded-lg border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-sm"
              >
                <h3 className="text-lg font-semibold">{category.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-wrapper bg-transparent">
        <div className="container flex justify-center py-12 lg:py-16 bg-transparent">
          <div className="max-w-2xl">
            <h2 className="mb-8 text-2xl font-semibold lg:text-3xl">
              How This Works
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold">Document My Learning</h3>
                  <p className="text-sm text-muted-foreground">
                    I write about problems I solve, issues I debug, and
                    techniques I discover.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <GitBranch className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold">Track Versions & Changes</h3>
                  <p className="text-sm text-muted-foreground">
                    Keep track of how my knowledge evolves as I discover new
                    solutions and updates.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Search className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold">Easy to Search & Reference</h3>
                  <p className="text-sm text-muted-foreground">
                    Find solutions quickly when facing similar issues or when
                    you need a refresher.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button asChild size="lg" className="rounded-lg">
                <Link href="/docs">Start Exploring</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
