"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { adminLoginAction } from "@/app/actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("shrubsbingo@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await adminLoginAction({ email, password });
      if (res.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setErrorMessage(res.error || "Authentication failed. Check your email and password.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden">
      {/* Subtle botanical background accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--green-50)] rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[var(--orange-50)] rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-md w-full">
        {/* Logo and Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block transition-transform hover:scale-105 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/meenu-logo.png"
              alt="Shrubs Bingo Logo"
              className="h-14 w-auto mx-auto object-contain"
            />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--orange-100)] text-[var(--orange-800)] text-xs font-bold uppercase tracking-wider mb-2">
            <span>🔐</span> Admin Portal
          </div>
          <h1 className="text-2xl font-serif font-bold text-[var(--ink)] tracking-tight">
            Sign In to Dashboard
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Access sessions, payments, inventory &amp; host settings
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2.5">
              <span className="text-base leading-none">⚠️</span>
              <span className="flex-1">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="admin-email" 
                className="text-xs font-semibold uppercase tracking-wider text-[var(--ink)]"
              >
                Admin Email
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shrubsbingo.com"
                  className="w-full px-4 py-3 text-sm rounded-lg border border-[var(--border-control)] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--green-600)] focus:ring-1 focus:ring-[var(--green-600)] transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label 
                  htmlFor="admin-password" 
                  className="text-xs font-semibold uppercase tracking-wider text-[var(--ink)]"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your admin password"
                  className="w-full pl-4 pr-11 py-3 text-sm rounded-lg border border-[var(--border-control)] bg-white text-[var(--ink)] focus:outline-none focus:border-[var(--green-600)] focus:ring-1 focus:ring-[var(--green-600)] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 text-sm focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 uppercase tracking-widest text-sm font-semibold bg-[var(--green-700)] hover:bg-[var(--green-800)] text-white rounded-lg shadow-sm transition-all mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Sign In to Admin"
              )}
            </Button>
          </form>

          {/* Quick Helper Credentials Note */}
          <div className="mt-6 pt-5 border-t border-[var(--border-control)] text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)] p-3.5 rounded-lg">
            <div className="font-semibold text-[var(--ink)] mb-1 flex items-center gap-1.5">
              <span>💡</span> Admin Credentials:
            </div>
            <div className="font-mono text-[11px] text-[var(--text)] space-y-0.5">
              <div>Email: <strong className="text-[var(--green-800)]">shrubsbingo@gmail.com</strong></div>
              <div>Password: <strong className="text-[var(--green-800)]">Shrubsbingo@_02</strong></div>
            </div>
          </div>
        </div>

        {/* Back to Website Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--ink)] transition-colors inline-flex items-center gap-1"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
