"use client";

import { useState } from "react";
import Link from "next/link";

export default function InviteLinksAdminPage() {
  const [expiresInHours, setExpiresInHours] = useState(24);
  const [note, setNote] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const createLink = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    setGeneratedLink("");

    try {
      const response = await fetch("/api/private-links/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expiresInMinutes: Math.max(1, Number(expiresInHours || 1)) * 60,
          note,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(data?.error || "Failed to create link. Please login again.");
        return;
      }

      setGeneratedLink(data.link);
      setStatus(`Link created. Expires at ${new Date(data.expiresAt).toLocaleString()}`);
    } catch (error) {
      setStatus(`Failed to create link: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50 to-cyan-100 text-gray-900 px-6 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-teal-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-teal-900">Private Link Generator</h1>
          <Link
            href="/admin"
            className="text-sm bg-teal-700 text-white px-3 py-2 rounded-md hover:bg-teal-800 transition-colors"
          >
            Back to Admin
          </Link>
        </div>

        <form onSubmit={createLink} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Expires in hours</span>
            <input
              type="number"
              min="1"
              max="336"
              value={expiresInHours}
              onChange={(e) => setExpiresInHours(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Note (optional)</span>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Recipient name or purpose"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-white py-2.5 rounded-md hover:bg-teal-800 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create One-User Link"}
          </button>
        </form>

        {status ? <p className="mt-4 text-sm text-gray-700">{status}</p> : null}
        {generatedLink ? (
          <div className="mt-4 rounded-md border border-teal-200 bg-teal-50 p-3">
            <p className="text-xs text-gray-600 mb-1">Share this URL:</p>
            <p className="break-all text-sm font-medium">{generatedLink}</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
