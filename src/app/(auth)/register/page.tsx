"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms & Conditions");
      return;
    }

    setLoading(true);
    try {
      // API call backend se wire karenge agle step mein
      console.log("Register attempt:", form);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-10">
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
          Create your account
        </h1>
        <p className="text-muted text-center mt-2 mb-6">
          Set up your patient portal in a few steps
        </p>

        {error && (
          <p className="text-sm text-red-600 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-1.5">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-1.5">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Phone + DOB side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-1.5">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-foreground mb-1.5">
                Date of birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground mb-1.5">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2">
            <input
              id="terms"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="terms" className="text-sm text-foreground">
              I agree to the{" "}
              <Link href="/terms" className="font-semibold text-primary underline">
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-semibold text-primary underline">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <hr className="my-6 border-gray-200" />

        {/* Login link */}
        <p className="text-center text-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary underline">
            Log in
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