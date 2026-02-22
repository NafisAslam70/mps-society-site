"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  const invite = useMemo(() => searchParams.get("invite") || "", [searchParams]);
  const nextPath = useMemo(() => searchParams.get("next") || "/", [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const consumeInvite = async () => {
      if (!invite) {
        setError("Missing invite link token.");
        return;
      }

      const response = await fetch("/api/private-links/consume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite, nextPath }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (!cancelled) setError(data?.error || "This private link is invalid or already used.");
        return;
      }

      if (!cancelled) {
        router.replace(data?.redirectTo || "/");
      }
    };

    consumeInvite().catch(() => {
      if (!cancelled) setError("Unable to verify this link right now.");
    });

    return () => {
      cancelled = true;
    };
  }, [invite, nextPath, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-6">
      <div className="max-w-md w-full rounded-xl bg-gray-900 border border-gray-700 p-6 text-center">
        <h1 className="text-xl font-semibold mb-2">Verifying private link</h1>
        {!error ? (
          <p className="text-gray-300 text-sm">Please wait while your access is being verified.</p>
        ) : (
          <p className="text-red-300 text-sm">{error}</p>
        )}
      </div>
    </main>
  );
}
