"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Wifi,
  Star,
  Tag,
  CheckCircle,
  Loader2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

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
  expiresAt?: string;
  posterId: string;
  acceptorId?: string;
  poster: {
    id: string;
    name?: string;
    image?: string;
    rating: number;
    ratingCount: number;
  };
  acceptor?: { id: string; name?: string };
};

const statusStyle: Record<string, string> = {
  OPEN: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  IN_PROGRESS: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  COMPLETED: "bg-green-500/15 text-green-400 border border-green-500/20",
  CANCELLED: "bg-red-500/15 text-red-400 border border-red-500/20",
  DISPUTED: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
};

function UserCard({
  user,
  label,
  showMessage,
  onMessage,
  messageLoading,
}: {
  user: {
    id: string;
    name?: string;
    image?: string;
    rating?: number;
    ratingCount?: number;
  };
  label: string;
  showMessage?: boolean;
  onMessage?: () => void;
  messageLoading?: boolean;
}) {
  const letter = user.name?.[0]?.toUpperCase() ?? "U";
  const displayName = user.name ?? "Anonymous";

  return (
    <div className="card rounded-2xl p-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href={`/profiles/${user.id}`}>
          <div className="h-10 w-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 hover:border-indigo-400/60 transition-colors flex items-center justify-center font-bold text-indigo-400 overflow-hidden">
            {user.image ? (
              <img src={user.image} className="w-full h-full object-cover" />
            ) : (
              letter
            )}
          </div>
        </Link>
        <div>
          <Link
            href={`/profiles/${user.id}`}
            className="text-sm font-medium text-white hover:text-indigo-400 transition-colors block"
          >
            {displayName}
          </Link>
          <p className="text-xs text-white/30">{label}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user.rating !== undefined && user.rating > 0 && (
          <div className="flex items-center gap-1.5 text-yellow-500">
            <Star size={13} fill="currentColor" />
            <span className="text-sm font-medium">
              {user.rating.toFixed(1)}
            </span>
            {user.ratingCount !== undefined && (
              <span className="text-xs text-white/30">
                ({user.ratingCount})
              </span>
            )}
          </div>
        )}
        {showMessage && onMessage && (
          <button
            onClick={onMessage}
            disabled={messageLoading}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium border border-indigo-500/25 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all"
          >
            {messageLoading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <>
                <MessageSquare size={12} /> Message
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as any;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`/api/tasks/${params.id}`);
      const data = await res.json();
      setTask(data.task);
      setLoading(false);
    };
    fetchTask();
  }, [params.id]);

  const isMyTask = task?.posterId === user?.id;
  const isAcceptor = task?.acceptorId === user?.id;
  const canAccept = task?.status === "OPEN" && !isMyTask;
  const canComplete = task?.status === "IN_PROGRESS" && isMyTask;

  const handleAccept = async () => {
    setError("");
    setActionLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task?.id}/accept`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setTask({ ...task!, status: "IN_PROGRESS", acceptorId: user.id });
      setSuccess("Task accepted! Get to work 🎉");
    } catch {
      setError("Something went wrong.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    setError("");
    setActionLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task?.id}/complete`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setTask({ ...task!, status: "COMPLETED" });
      setSuccess("Task completed! Credits transferred ✅");
    } catch {
      setError("Something went wrong.");
    } finally {
      setActionLoading(false);
    }
  };

  const startConversation = async (userId: string) => {
    if (!user?.id) return;
    setMessageLoading(userId);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      router.push(`/messages/${data.conversation.id}`);
    } catch {
      setError("Failed to open conversation.");
    } finally {
      setMessageLoading(null);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        .card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); }
        .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); transition: all 0.3s; position: relative; overflow: hidden; }
        .btn-primary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, #818cf8, #a78bfa); opacity: 0; transition: opacity 0.3s; }
        .btn-primary:hover::before { opacity: 1; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(99,102,241,0.4); }
        .btn-primary span, .btn-primary svg { position: relative; z-index: 1; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-success { background: linear-gradient(135deg, #10b981, #059669); transition: all 0.3s; }
        .btn-success:hover { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(16,185,129,0.4); }
        .btn-success:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
      `}</style>

      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back to marketplace
        </Link>

        {loading ? (
          <div className="space-y-4">
            <div className="skeleton h-8 w-2/3 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-3/4 rounded" />
          </div>
        ) : !task ? (
          <div className="text-center py-20 text-white/30">Task not found.</div>
        ) : (
          <div className="space-y-5">
            <div className="card rounded-3xl p-7">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    {task.category && (
                      <span className="text-xs bg-white/5 border border-white/8 rounded-full px-2.5 py-0.5 text-white/40">
                        {task.category}
                      </span>
                    )}
                    <span
                      className={`text-xs font-medium rounded-full px-3 py-1 ${statusStyle[task.status]}`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                  <h1
                    style={{ fontFamily: "'Syne', sans-serif" }}
                    className="text-3xl font-extrabold mb-2"
                  >
                    {task.title}
                  </h1>
                </div>
                <div className="text-right shrink-0">
                  <p
                    style={{ fontFamily: "'Syne', sans-serif" }}
                    className="text-4xl font-extrabold"
                  >
                    {task.credits}
                  </p>
                  <p className="text-xs text-white/30">credits</p>
                </div>
              </div>

              <p className="text-white/60 leading-relaxed mb-6">
                {task.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-white/40">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} /> {task.estimatedTime} mins
                </span>
                {task.isRemote ? (
                  <span className="flex items-center gap-1.5 text-emerald-500/70">
                    <Wifi size={13} /> Remote
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-orange-500/70">
                    <MapPin size={13} /> {task.location || "Local"}
                  </span>
                )}
                {task.expiresAt && (
                  <span>
                    Expires {new Date(task.expiresAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-xs bg-indigo-500/10 border border-indigo-500/15 text-indigo-400/70 rounded-full px-3 py-1"
                    >
                      <Tag size={9} /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Poster card */}
            <UserCard
              user={task.poster}
              label="Posted by"
              showMessage={!isMyTask && !!user?.id}
              onMessage={() => startConversation(task.poster.id)}
              messageLoading={messageLoading === task.poster.id}
            />

            {/* Acceptor card */}
            {task.acceptor && (
              <UserCard
                user={task.acceptor}
                label="Accepted by"
                showMessage={task.acceptor.id !== user?.id && !!user?.id}
                onMessage={() => startConversation(task.acceptor!.id)}
                messageLoading={messageLoading === task.acceptor.id}
              />
            )}

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 flex items-center gap-2">
                <AlertCircle size={14} /> {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400 flex items-center gap-2">
                <CheckCircle size={14} /> {success}
              </div>
            )}

            {canAccept && (
              <button
                onClick={handleAccept}
                disabled={actionLoading}
                className="btn-primary w-full rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <Loader2 size={15} className="animate-spin relative z-10" />
                ) : (
                  <>
                    <span>Accept this task</span>
                    <CheckCircle size={15} className="relative z-10" />
                  </>
                )}
              </button>
            )}

            {canComplete && (
              <button
                onClick={handleComplete}
                disabled={actionLoading}
                className="btn-success w-full rounded-xl py-3.5 text-sm font-semibold text-white flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <>
                    <CheckCircle size={15} /> Mark as complete & transfer
                    credits
                  </>
                )}
              </button>
            )}

            {isMyTask && task.status === "OPEN" && (
              <p className="text-center text-xs text-white/25">
                This is your task. Waiting for someone to accept it.
              </p>
            )}
            {isAcceptor && task.status === "IN_PROGRESS" && (
              <p className="text-center text-xs text-white/25">
                You accepted this task. Complete it and the poster will mark it
                done.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
