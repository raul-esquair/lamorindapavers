"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/actions/dashboard-auth";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await login(password);

    if (result.ok) {
      // Refresh so the layout gate re-runs with the new cookie.
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    setSubmitting(false);
    setPassword("");
    setError(result.error);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg border border-warm-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-sans text-warm-gray-800 placeholder:text-warm-gray-400 bg-white"
        />
      </div>

      {error && <p className="text-brand-red text-sm font-sans">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center rounded-lg bg-brand-blue px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-brand-blue-dark disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Checking…" : "Sign In"}
      </button>
    </form>
  );
}
