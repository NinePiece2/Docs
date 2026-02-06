import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function Announcement() {
  return (
    <Badge asChild variant="secondary" className="bg-muted">
      <Link href="/docs/changelog/2026-01-rtl">
        RTL Support <ArrowRightIcon />
      </Link>
    </Badge>
  );
}
