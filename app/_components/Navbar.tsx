"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "public/logo.png";
import {
  Wallet,
  LogOut,
  User,
  ChevronDown,
  LayoutDashboard,
  ListTodo,
} from "lucide-react";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    fetch("/api/wallet")
      .then((res) => res.json())
      .then((data) => setCredits(data.user.credits));
  }, []);
  if (!session) return null;
  return (
    <nav
      className="fixed top-0 w-full z-50 border-b border-white/5 backdrop-blur-xl bg-[#0a0a0f]/80"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700&display=swap');
        .dropdown { background: #111118; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .dropdown-item { transition: all 0.15s; }
        .dropdown-item:hover { background: rgba(255,255,255,0.05); }
        .nav-link { transition: color 0.2s; }
        .nav-link:hover { color: white; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          {/* <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
            T
          </div> */}
          <Image
            src={logo}
            alt="BroHelp Logo"
            width={100}
            height={100}
            priority
          />
          <span
            style={{ fontFamily: "'Syne', sans-serif" }}
            className="font-bold text-lg text-white"
          >
            BroHelp
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-white/40">
          <Link
            href="/dashboard"
            className="nav-link flex items-center gap-1.5"
          >
            <LayoutDashboard size={14} /> Dashboard
          </Link>

          <Link href="/tasks" className="nav-link flex items-center gap-1.5">
            <ListTodo size={14} /> Browse Tasks
          </Link>

          <Link href="/wallet" className="nav-link flex items-center gap-1.5">
            <Wallet size={14} />
            <span className="text-white font-medium">{credits}</span> credits
          </Link>
        </div>

        {/* User Menu */}
        <div className="relative z-50">
          <div className="flex gap-2">
            <NotificationBell />

            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 rounded-full border border-white/8 bg-white/3 px-3 py-1.5 hover:border-white/15 transition-all"
            >
              <div className="h-6 w-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>

              <span className="text-sm text-white/70 hidden sm:block">
                {user?.name ?? "Account"}
              </span>

              <ChevronDown
                size={13}
                className={`text-white/30 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />

                {/* Dropdown */}
                <div className="dropdown absolute right-0 top-12 w-56 rounded-2xl p-1.5 z-50">
                  <div className="px-3 py-2.5 border-b border-white/6 mb-1">
                    <p className="text-sm font-medium text-white">
                      {user?.name ?? "User"}
                    </p>
                    <p className="text-xs text-white/30 truncate">
                      {user?.email}
                    </p>
                  </div>

                  {/* ✅ Dynamic Profile Link */}
                  <Link
                    href={user?.id ? `/profiles/${user.id}` : "#"}
                    onClick={() => setDropdownOpen(false)}
                    className="dropdown-item flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:text-white"
                  >
                    <User size={14} /> Profile
                  </Link>

                  <Link
                    href="/wallet"
                    onClick={() => setDropdownOpen(false)}
                    className="dropdown-item flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:text-white"
                  >
                    <Wallet size={14} />
                    Wallet ·{" "}
                    <span className="text-indigo-400 font-medium">
                      {credits}
                    </span>
                  </Link>

                  <div className="border-t border-white/6 mt-1 pt-1">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="dropdown-item w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
