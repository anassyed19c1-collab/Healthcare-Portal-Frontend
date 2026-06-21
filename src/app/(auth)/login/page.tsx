"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // API call backend se wire karenge agle step mein
      console.log("Login attempt:", { email, password });
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-sm p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-background border border-primary/20 flex items-center justify-center">
            <span className="text-primary text-xs font-semibold tracking-wide">
              LOGO
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-foreground text-center">
          Welcome back
        </h1>
        <p className="text-muted text-center mt-2 mb-6">
          Sign in to access your patient portal
        </p>

        {error && (
          <p className="text-sm text-red-600 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-foreground mb-1.5"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-foreground"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <hr className="my-6 border-gray-200" />

        {/* Create account link */}
        <p className="text-center text-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-primary underline"
          >
            Create an account
          </Link>
        </p>
      </div>

      {/* Provider note */}
      <p className="text-muted text-center mt-6 max-w-sm text-sm">
        Are you a healthcare provider? Contact your administrator to get
        access.
      </p>
    </div>
  );
}