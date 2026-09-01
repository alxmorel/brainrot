import type { ReactNode } from "react";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import { cn } from "@/shared/utils/cn";

export function ArchiveShell({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main
        className={cn(
          "mx-auto w-full flex-1 px-4 py-8 sm:px-6",
          wide ? "max-w-4xl" : "max-w-2xl",
        )}
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
