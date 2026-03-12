"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 3000);
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-green-400">
              <polyline points="20,6 9,17 4,12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-3">Check your email</h2>
          <p className="text-surface-400 text-sm leading-relaxed">
            We sent a confirmation link to <span className="text-foreground">{email}</span>. Click it to activate your account.
          </p>
          <p className="text-surface-500 text-xs mt-4">Redirecting to login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-purple/10 border border-accent-purple/20 mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-purple">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14" strokeLinecap="round"/>
              <line x1="22" y1="11" x2="16" y2="11" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Create account</h1>
          <p className="text-surface-400 text-sm">Track your results across all tests</p>
        </div>

        {/* Form */}
        <div className="bg-surface-900 border border-surface-800 rounded-2xl p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-foreground placeholder-surface-500 text-sm focus:outline-none focus:border-accent-purple/60 focus:ring-1 focus:ring-accent-purple/30 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-foreground placeholder-surface-500 text-sm focus:outline-none focus:border-accent-purple/60 focus:ring-1 focus:ring-accent-purple/30 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Confirm password</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-foreground placeholder-surface-500 text-sm focus:outline-none focus:border-accent-purple/60 focus:ring-1 focus:ring-accent-purple/30 transition-colors"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-purple hover:bg-accent-purple/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors text-sm"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-surface-700 text-center">
            <p className="text-surface-400 text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-accent-purple hover:text-accent-purple/80 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
