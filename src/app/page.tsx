import Link from "next/link";
import { HeartPulse, CalendarCheck, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
            +
          </div>
          <span className="font-bold text-foreground text-lg">Patient Portal</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-foreground font-semibold text-sm px-4 py-2 hover:text-primary"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-5 py-2.5 rounded-lg"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="w-16 h-16 rounded-2xl bg-card border border-primary/20 flex items-center justify-center mb-6">
          <span className="text-primary text-xs font-semibold tracking-wide">LOGO</span>
        </div>

        <h1 className="text-4xl font-bold text-foreground max-w-2xl mb-4">
          Healthcare made simple for patients and providers
        </h1>
        <p className="text-muted max-w-xl mb-8">
          Book appointments, manage your schedule, and stay connected with your
          care team — all in one secure portal.
        </p>

        <div className="flex items-center gap-4 mb-16">
          <Link
            href="/register"
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg"
          >
            Create an Account
          </Link>
          <Link
            href="/login"
            className="border border-gray-300 text-foreground font-semibold px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            Log In
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
          <div className="bg-card rounded-2xl shadow-sm p-6 text-left">
            <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-3">
              <CalendarCheck size={20} />
            </div>
            <h3 className="font-bold text-foreground mb-1">Easy Booking</h3>
            <p className="text-sm text-muted">
              Schedule appointments with your preferred provider in a few clicks.
            </p>
          </div>
          <div className="bg-card rounded-2xl shadow-sm p-6 text-left">
            <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-3">
              <HeartPulse size={20} />
            </div>
            <h3 className="font-bold text-foreground mb-1">Track Your Care</h3>
            <p className="text-sm text-muted">
              View your appointment history and upcoming visits anytime.
            </p>
          </div>
          <div className="bg-card rounded-2xl shadow-sm p-6 text-left">
            <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-3">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-foreground mb-1">Secure & Private</h3>
            <p className="text-sm text-muted">
              Your health information is protected with industry-standard security.
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center text-sm text-muted py-6">
        Are you a healthcare provider? Contact your administrator to get access.
      </footer>
    </div>
  );
}