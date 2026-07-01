"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Users, Star, CheckCircle } from "lucide-react";
import Image from "next/image";
import logo from "public/logo.png";


export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

        .hero-glow {
          background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.35) 0%, transparent 70%);
        }
        .card-glow:hover {
          box-shadow: 0 0 40px rgba(99,102,241,0.15);
        }
        .text-gradient {
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .badge-glow {
          box-shadow: 0 0 20px rgba(99,102,241,0.3);
        }
        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #818cf8, #a78bfa);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .btn-primary:hover::before { opacity: 1; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 20px 40px rgba(99,102,241,0.4); }
        .btn-primary span { position: relative; z-index: 1; }
        .grid-bg {
          background-image: linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .fade-up {
          animation: fadeUp 0.8s ease forwards;
          opacity: 0;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .stat-card {
          background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05));
          border: 1px solid rgba(99,102,241,0.2);
        }
        .feature-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(99,102,241,0.3);
          transform: translateY(-4px);
        }
        .noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          z-index: 100;
        }
      `}</style>

      <div className="noise" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 backdrop-blur-xl bg-[#0a0a0f]/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center ">
            {/* <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">T</div> */}
            {/* <img src="public\test.jpg" alt="BroHelp Logo" className="h-8 w-8 object-contain" /> */}
            {/* <Link href="/dashboard" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Logo" width={32} height={32} />
            </Link> */}
            <Image
              src= {logo}
              alt="BroHelp Logo"
              width={100}
              height={100}
              priority
            />
            <span
              style={{ fontFamily: "'Syne', sans-serif" }}
              className="font-bold text-lg"
            >
              BroHelp
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="btn-primary rounded-full px-5 py-2 text-sm font-medium"
            >
              <span>Get started</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-32 grid-bg">
        <div className="hero-glow absolute inset-0 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative">
          {/* Badge */}
          <div className="fade-up inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 mb-8 badge-glow">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Task marketplace for everyone
          </div>

          {/* Heading */}
          <h1
            style={{ fontFamily: "'Syne', sans-serif" }}
            className="fade-up delay-1 text-6xl md:text-8xl font-extrabold leading-none tracking-tight mb-6"
          >
            Help others.
            <br />
            <span className="text-gradient">Earn credits.</span>
            <br />
            Get things done.
          </h1>

          <p className="fade-up delay-2 text-lg text-white/40 max-w-xl mx-auto leading-relaxed mb-10">
            Post tasks, find helpers, transfer credits securely. A peer-to-peer
            platform built on trust, ratings, and real results.
          </p>

          {/* CTA */}
          <div className="fade-up delay-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="btn-primary rounded-full px-8 py-3.5 text-base font-semibold flex items-center gap-2"
            >
              <span>Start for free</span>
              <ArrowRight size={16} className="relative z-10" />
            </Link>
            <Link
              href="/tasks"
              className="rounded-full px-8 py-3.5 text-base font-medium border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
            >
              Browse tasks
            </Link>
          </div>

          {/* Stats */}
          <div className="fade-up delay-4 grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16">
            {[
              { value: "2.4k+", label: "Active users" },
              { value: "98%", label: "Satisfaction" },
              { value: "₹0", label: "Signup fee" },
            ].map((s) => (
              <div key={s.label} className="stat-card rounded-2xl py-4 px-3">
                <div
                  style={{ fontFamily: "'Syne', sans-serif" }}
                  className="text-2xl font-bold text-white"
                >
                  {s.value}
                </div>
                <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2
              style={{ fontFamily: "'Syne', sans-serif" }}
              className="text-4xl font-bold"
            >
              Three steps to get started
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Post a task",
                desc: "Describe what you need done, set your credit budget and estimated time.",
                icon: <CheckCircle size={20} />,
              },
              {
                step: "02",
                title: "Get matched",
                desc: "Browse helpers or let them come to you. Chat before accepting.",
                icon: <Users size={20} />,
              },
              {
                step: "03",
                title: "Pay securely",
                desc: "Credits transfer only when you approve the completed task.",
                icon: <ShieldCheck size={20} />,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="feature-card card-glow rounded-3xl p-7"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span
                    style={{ fontFamily: "'Syne', sans-serif" }}
                    className="text-4xl font-extrabold text-white/5"
                  >
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-purple-400 text-sm font-medium uppercase tracking-widest mb-3">
              Features
            </p>
            <h2
              style={{ fontFamily: "'Syne', sans-serif" }}
              className="text-4xl font-bold"
            >
              Built for trust & speed
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <ShieldCheck size={18} />,
                title: "Secure escrow",
                desc: "Credits held safely until task completion is approved.",
                color: "indigo",
              },
              {
                icon: <Star size={18} />,
                title: "Ratings system",
                desc: "Build your reputation with verified reviews after every task.",
                color: "yellow",
              },
              {
                icon: <Zap size={18} />,
                title: "Instant chat",
                desc: "Negotiate and clarify task details before committing.",
                color: "purple",
              },
              {
                icon: <Users size={18} />,
                title: "Community driven",
                desc: "Real people helping real people with real tasks.",
                color: "pink",
              },
              {
                icon: <CheckCircle size={18} />,
                title: "Audit trail",
                desc: "Every transaction and action is logged transparently.",
                color: "green",
              },
              {
                icon: <ArrowRight size={18} />,
                title: "Fast transfers",
                desc: "Credit transfers happen instantly on task approval.",
                color: "blue",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="feature-card card-glow rounded-2xl p-6"
              >
                <div
                  className={`h-9 w-9 rounded-xl mb-4 flex items-center justify-center bg-${f.color}-500/10 text-${f.color}-400`}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-12">
            <h2
              style={{ fontFamily: "'Syne', sans-serif" }}
              className="text-4xl md:text-5xl font-extrabold mb-4"
            >
              Ready to <span className="text-gradient">get started?</span>
            </h2>
            <p className="text-white/40 mb-8">
              Join thousands already helping each other every day.
            </p>
            <Link
              href="/register"
              className="btn-primary inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold"
            >
              <span>Create free account</span>
              <ArrowRight size={16} className="relative z-10" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-sm text-white/20">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
              T
            </div>
            <span>TaskHelper</span>
          </div>
          <span>
            © {new Date().getFullYear()} TaskHelper. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}