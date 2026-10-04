"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Incorrect email or password.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <p className="text-center text-xs tracking-widest2 text-stone-light">
          Sactoria Fashion Institute
        </p>
        <h1 className="mt-2 text-center font-display text-2xl text-ivory">
          Admin sign in
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-stone-light">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="focus-ring rounded-sm border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-ivory placeholder:text-stone"
              placeholder="owner@example.com"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-stone-light">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="focus-ring rounded-sm border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-ivory"
              placeholder="••••••••"
            />
          </label>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="focus-ring mt-2 rounded-sm bg-wine px-4 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-wine-dark disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-stone">
          This account is created in Supabase — see the README for setup.
        </p>
      </div>
    </main>
  );
}
