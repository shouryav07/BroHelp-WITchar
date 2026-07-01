"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Search, MapPin, Wifi, Clock, Star, SlidersHorizontal, X, MessageSquare } from "lucide-react";

type Task = {
  id: string;
  title: string;
  description: string;
  category?: string;
  tags: string[];
  credits: number;
  estimatedTime: number;
  isRemote: boolean;
  location?: string;
  status: string;
  createdAt: string;
  poster: {
    id: string;
    name?: string;
    image?: string;
    rating: number;
  };
};

const CATEGORIES = ["All", "Design", "Development", "Writing", "Research", "Marketing", "Data", "Video", "Other"];
const STATUSES = ["OPEN", "IN_PROGRESS", "COMPLETED"];

export default function MarketplacePage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [startingConvo, setStartingConvo] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    category: "",
    minCredits: "",
    maxCredits: "",
    isRemote: "",
    status: "OPEN",
  });

  const fetchTasks = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.minCredits) params.set("minCredits", filters.minCredits);
    if (filters.maxCredits) params.set("maxCredits", filters.maxCredits);
    if (filters.isRemote !== "") params.set("isRemote", filters.isRemote);
    if (filters.status) params.set("status", filters.status);

    const res = await fetch(`/api/tasks?${params.toString()}`);
    const data = await res.json();
    setTasks(data.tasks || []);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, [filters]);

  const startConversation = async (e: React.MouseEvent, userId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?.id || userId === user.id) return;
    setStartingConvo(userId);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      router.push(`/messages/${data.conversation.id}`);
    } catch {
      console.error("Failed to start conversation");
    } finally {
      setStartingConvo(null);
    }
  };

  const filtered = tasks.filter((t) =>
    search === "" ||
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const clearFilters = () => setFilters({ category: "", minCredits: "", maxCredits: "", isRemote: "", status: "OPEN" });
  const hasActiveFilters = filters.category || filters.minCredits || filters.maxCredits || filters.isRemote !== "";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        .input-field { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); transition: all 0.2s; }
        .input-field:focus { outline: none; border-color: rgba(99,102,241,0.5); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .input-field::placeholder { color: rgba(255,255,255,0.2); }
        .task-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); transition: all 0.2s; }
        .task-card:hover { border-color: rgba(99,102,241,0.35); background: rgba(99,102,241,0.04); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
        .filter-panel { background: #0e0e18; border: 1px solid rgba(255,255,255,0.07); }
        .chip { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); transition: all 0.15s; }
        .chip:hover { border-color: rgba(99,102,241,0.4); }
        .chip.active { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.4); color: #818cf8; }
        .skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
        .msg-btn { background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); transition: all 0.2s; }
        .msg-btn:hover { background: rgba(99,102,241,0.25); border-color: rgba(99,102,241,0.5); }
        .profile-link { transition: color 0.15s; }
        .profile-link:hover span { color: #818cf8; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif" }} className="text-4xl font-extrabold mb-1">Marketplace</h1>
            <p className="text-white/40">Find tasks to help with and earn credits.</p>
          </div>
          <Link href="/tasks/new" className="rounded-full px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-opacity">
            + Post a task
          </Link>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks, tags..." className="input-field w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm border transition-all ${showFilters || hasActiveFilters ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-400" : "border-white/8 text-white/50 hover:border-white/15"}`}>
            <SlidersHorizontal size={14} /> Filters
            {hasActiveFilters && <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />}
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setFilters({ ...filters, status: s })} className={`chip rounded-full px-4 py-1.5 text-xs font-medium ${filters.status === s ? "active" : "text-white/40"}`}>
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        {showFilters && (
          <div className="filter-panel rounded-2xl p-5 mb-6 space-y-5">
            <div>
              <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setFilters({ ...filters, category: cat === "All" ? "" : cat })} className={`chip rounded-full px-3 py-1 text-xs ${(cat === "All" && !filters.category) || filters.category === cat ? "active" : "text-white/40"}`}>{cat}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Credit Range</label>
              <div className="flex items-center gap-3">
                <input type="number" value={filters.minCredits} onChange={(e) => setFilters({ ...filters, minCredits: e.target.value })} placeholder="Min" className="input-field rounded-xl px-3 py-2 text-sm text-white w-28" />
                <span className="text-white/30 text-sm">to</span>
                <input type="number" value={filters.maxCredits} onChange={(e) => setFilters({ ...filters, maxCredits: e.target.value })} placeholder="Max" className="input-field rounded-xl px-3 py-2 text-sm text-white w-28" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Location Type</label>
              <div className="flex gap-2">
                {[{ label: "All", value: "" }, { label: "Remote", value: "true" }, { label: "Local", value: "false" }].map((opt) => (
                  <button key={opt.label} onClick={() => setFilters({ ...filters, isRemote: opt.value })} className={`chip rounded-full px-4 py-1.5 text-xs ${filters.isRemote === opt.value ? "active" : "text-white/40"}`}>{opt.label}</button>
                ))}
              </div>
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors">
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        )}

        {!loading && <p className="text-sm text-white/30 mb-4">{filtered.length} task{filtered.length !== 1 ? "s" : ""} found</p>}

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl p-5 border border-white/5">
                <div className="skeleton h-5 w-1/2 rounded mb-3" />
                <div className="skeleton h-3 w-full rounded mb-2" />
                <div className="skeleton h-3 w-2/3 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/20 text-lg mb-2">No tasks found</p>
            <p className="text-white/15 text-sm">Try adjusting your filters or search</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`}>
                <div className="task-card rounded-2xl p-5 cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {task.category && <span className="text-xs bg-white/5 border border-white/8 rounded-full px-2.5 py-0.5 text-white/40">{task.category}</span>}
                        {task.isRemote
                          ? <span className="text-xs flex items-center gap-1 text-emerald-500/70"><Wifi size={10} /> Remote</span>
                          : <span className="text-xs flex items-center gap-1 text-orange-500/70"><MapPin size={10} /> {task.location || "Local"}</span>
                        }
                      </div>
                      <h3 className="font-semibold text-white text-base mb-1.5 truncate">{task.title}</h3>
                      <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">{task.description}</p>
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {task.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-indigo-500/10 border border-indigo-500/15 text-indigo-400/70 rounded-full px-2.5 py-0.5">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{task.credits}</span>
                      <span className="text-xs text-white/25">credits</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Clickable profile */}
                      <Link
                        href={`/profiles/${task.poster.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="profile-link flex items-center gap-1.5"
                      >
                        <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                          {task.poster.name?.[0]?.toUpperCase() ?? "U"}
                        </div>
                        <span className="text-xs text-white/40 transition-colors">{task.poster.name ?? "Anonymous"}</span>
                      </Link>

                      {task.poster.rating > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-yellow-500/70">
                          <Star size={10} fill="currentColor" /> {task.poster.rating.toFixed(1)}
                        </span>
                      )}

                      {/* Message button */}
                      {user?.id && task.poster.id !== user.id && (
                        <button
                          onClick={(e) => startConversation(e, task.poster.id)}
                          disabled={startingConvo === task.poster.id}
                          className="msg-btn flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs text-indigo-400"
                        >
                          <MessageSquare size={11} />
                          {startingConvo === task.poster.id ? "Opening..." : "Message"}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-white/30">
                      <Clock size={11} /> {task.estimatedTime}m
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}