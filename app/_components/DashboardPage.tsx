"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Wallet,
  ArrowRight,
  Clock,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";

type Task = {
  id: string;
  title: string;
  status: string;
  credits: number;
  estimatedTime: number;
  category?: string;
  createdAt: string;
  posterId: string;
  acceptorId?: string;
};

const statusStyle: Record<string, string> = {
  OPEN: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  IN_PROGRESS: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  COMPLETED: "bg-green-500/15 text-green-400 border border-green-500/20",
  CANCELLED: "bg-red-500/15 text-red-400 border border-red-500/20",
  DISPUTED: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
};

function TaskCard({ task }: { task: Task }) {
  return (
    <Link href={`/tasks/${task.id}`}>
      <div className="task-card rounded-2xl p-5 flex items-center justify-between cursor-pointer">
        <div>
          <h3 className="font-semibold text-white mb-2">{task.title}</h3>
          <div className="flex items-center gap-3 text-sm text-white/40">
            {task.category && (
              <span className="bg-white/5 border border-white/8 rounded-full px-2.5 py-0.5 text-xs">
                {task.category}
              </span>
            )}
            <span>{task.estimatedTime}m estimated</span>
            <span className="text-indigo-400 font-medium">
              {task.credits} credits
            </span>
          </div>
        </div>
        <span
          className={`text-xs font-medium rounded-full px-3 py-1.5 ${statusStyle[task.status] || statusStyle.OPEN}`}
        >
          {task.status.replace("_", " ")}
        </span>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 bg-white/2 border border-white/5 animate-pulse">
      <div className="h-4 bg-white/8 rounded w-1/2 mb-3" />
      <div className="h-3 bg-white/5 rounded w-1/3" />
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"posted" | "accepted">("posted");
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    fetch("/api/wallet")
      .then((res) => res.json())
      .then((data) => setCredits(data.user.credits));
  }, []);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks/mine");
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch {
        console.error("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const postedTasks = tasks.filter((t) => t.posterId === user?.id);
  const acceptedTasks = tasks.filter((t) => t.acceptorId === user?.id);
  const activeTasks = postedTasks.filter(
    (t) => t.status === "OPEN" || t.status === "IN_PROGRESS",
  );
  const completedTasks = [...postedTasks, ...acceptedTasks].filter(
    (t) => t.status === "COMPLETED",
  );

  const displayTasks = tab === "posted" ? postedTasks : acceptedTasks;

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        .stat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); transition: all 0.2s; }
        .stat-card:hover { border-color: rgba(99,102,241,0.3); background: rgba(99,102,241,0.05); }
        .task-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); transition: all 0.2s; }
        .task-card:hover { border-color: rgba(99,102,241,0.3); background: rgba(99,102,241,0.04); transform: translateY(-1px); }
        .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); transition: all 0.3s ease; position: relative; overflow: hidden; }
        .btn-primary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, #818cf8, #a78bfa); opacity: 0; transition: opacity 0.3s; }
        .btn-primary:hover::before { opacity: 1; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(99,102,241,0.4); }
        .btn-primary span { position: relative; z-index: 1; }
        .tab-active { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.3) !important; color: #818cf8; }
        .noise { position: fixed; inset: 0; pointer-events: none; opacity: 0.025; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); z-index: 100; }
      `}</style>

      <div className="noise" />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1
              style={{ fontFamily: "'Syne', sans-serif" }}
              className="text-4xl font-extrabold mb-1"
            >
              Hey, {user?.name ?? user?.name?.split(" ")[0] ?? "there"} 👋
            </h1>
            <p className="text-white/40">
              Here's what's happening with your tasks today.
            </p>
          </div>
          <Link
            href="/tasks/new"
            className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold flex items-center gap-2"
          >
            <PlusCircle size={15} className="relative z-10" />
            <span>Post a task</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="stat-card rounded-2xl p-6">
            <div className="flex items-center gap-2 text-white/40 text-sm mb-3">
              <Wallet size={14} /> Available Balance
            </div>
            <div className="flex items-end justify-between">
              <span
                style={{ fontFamily: "'Syne', sans-serif" }}
                className="text-4xl font-extrabold"
              >
                {credits}
              </span>
              <Link
                href="/wallet"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                Manage <ArrowRight size={12} />
              </Link>
            </div>
            <p className="text-xs text-white/25 mt-1">credits</p>
          </div>

          <div className="stat-card rounded-2xl p-6">
            <div className="flex items-center gap-2 text-white/40 text-sm mb-3">
              <Clock size={14} /> Active Tasks
            </div>
            {loading ? (
              <div className="h-10 w-16 bg-white/8 rounded animate-pulse" />
            ) : (
              <span
                style={{ fontFamily: "'Syne', sans-serif" }}
                className="text-4xl font-extrabold"
              >
                {activeTasks.length}
              </span>
            )}
          </div>

          <div className="stat-card rounded-2xl p-6">
            <div className="flex items-center gap-2 text-white/40 text-sm mb-3">
              <CheckCircle size={14} /> Completed
            </div>
            {loading ? (
              <div className="h-10 w-16 bg-white/8 rounded animate-pulse" />
            ) : (
              <span
                style={{ fontFamily: "'Syne', sans-serif" }}
                className="text-4xl font-extrabold text-green-400"
              >
                {completedTasks.length}
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {(["posted", "accepted"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-medium border border-white/8 transition-all ${tab === t ? "tab-active" : "text-white/40 hover:text-white hover:border-white/15"}`}
            >
              {t === "posted" ? "Posted by me" : "Accepted by me"}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {loading ? (
            [1, 2, 3].map((i) => <SkeletonCard key={i} />)
          ) : displayTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
              <p className="text-white/30 text-sm mb-4">
                {tab === "posted"
                  ? "You haven't posted any tasks yet."
                  : "You haven't accepted any tasks yet."}
              </p>
              <Link
                href={tab === "posted" ? "/tasks/new" : "/tasks"}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
              >
                {tab === "posted"
                  ? "Post your first task →"
                  : "Browse marketplace →"}
              </Link>
            </div>
          ) : (
            displayTasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      </div>
    </div>
  );
}
