"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function CreateRedirect() {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    const query = search.toString();
    router.replace(query ? `/?${query}#compose` : "/#compose");
  }, [router, search]);

  return null;
}

export default function CreatePage() {
  return (
    <Suspense>
      <CreateRedirect />
    </Suspense>
  );
}
