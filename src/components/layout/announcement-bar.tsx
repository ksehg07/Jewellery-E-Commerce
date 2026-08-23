import { Sparkles } from "lucide-react";

import { Container } from "./container";

export function AnnouncementBar() {
  return (
    <div className="border-b border-border bg-secondary">
      <Container>
        <div className="flex h-9 items-center justify-center gap-2 text-center text-xs tracking-wide text-muted-foreground sm:text-sm">
          <Sparkles className="size-3.5 text-accent" />

          <span>
            Timeless jewellery crafted for every celebration
          </span>
        </div>
      </Container>
    </div>
  );
}