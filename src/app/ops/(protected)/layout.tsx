import { OpsNav } from "@/features/ops/OpsNav";

export default function OpsProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh px-4 py-6 sm:px-8">
      <OpsNav />
      <div className="mt-6">{children}</div>
    </div>
  );
}
