"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  MessageSquare,
  Calendar,
  CheckCircle,
  Loader2,
  Edit,
} from "lucide-react";

type Review = {
  id: string;
  score: number;
  comment?: string;
  createdAt: string;
  giver: { id: string; name?: string; image?: string };
  task: { id: string; title: string };
};

type ProfileUser = {
  id: string;
  name?: string;
  image?: string;
  bio?: string;
  rating: number;
  ratingCount: number;
  createdAt: string;
  postedTasks: {
    id: string;
    title: string;
    credits: number;
    createdAt: string;
  }[];
  ratingsReceived: Review[];
};

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={s <= score ? "text-yellow-400" : "text-white/15"}
          fill={s <= score ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const currentUser = session?.user as any;

  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingConvo, setStartingConvo] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/profile/${params.id}`);
        if (!res.ok) {
          setProfile(null);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setProfile(data.user);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) load();
  }, [params?.id]);

  const startConversation = async () => {
    if (!profile || !currentUser?.id) return;
    setStartingConvo(true);

    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profile.id }),
      });

      const data = await res.json();
      router.push(`/messages/${data.conversation.id}`);
    } catch {
      console.error("Failed to start conversation");
    } finally {
      setStartingConvo(false);
    }
  };

  const isOwnProfile = currentUser?.id === params.id;

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
        .skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
      `}</style>

      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </Link>

        {loading ? (
          <div className="space-y-4">
            <div className="skeleton h-20 w-20 rounded-full" />
            <div className="skeleton h-6 w-40 rounded" />
            <div className="skeleton h-4 w-64 rounded" />
          </div>
        ) : !profile ? (
          <div className="text-center py-20 text-white/30">User not found.</div>
        ) : (
          <div className="space-y-5">
            {/* Profile Card */}
            <div className="card rounded-3xl p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-indigo-500/20 border-2 border-indigo-500/30 flex items-center justify-center text-2xl font-bold text-indigo-400 overflow-hidden">
                    {profile.image ? (
                      <img
                        src={profile.image}
                        className="w-full h-full object-cover"
                        alt="profile"
                      />
                    ) : (
                      (profile.name?.[0] ?? "U").toUpperCase()
                    )}
                  </div>

                  <div>
                    <h1
                      style={{ fontFamily: "'Syne', sans-serif" }}
                      className="text-2xl font-extrabold"
                    >
                      {profile.name ?? "Anonymous"}
                    </h1>

                    <div className="flex items-center gap-3 mt-1.5">
                      {profile.rating > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <StarRating score={Math.round(profile.rating)} />
                          <span className="text-sm font-medium text-yellow-400">
                            {profile.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-white/30">
                            ({profile.ratingCount} reviews)
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-white/25">
                          No reviews yet
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Buttons */}
                <div className="flex gap-3">
                  {isOwnProfile && (
                    <Link
                      href="/profiles/edit"
                      className="btn-primary rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </Link>
                  )}

                  {!isOwnProfile && currentUser?.id && (
                    <button
                      onClick={startConversation}
                      disabled={startingConvo}
                      className="btn-primary rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2"
                    >
                      {startingConvo ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <>
                          <MessageSquare size={14} />
                          <span>Message</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-white/50 text-sm leading-relaxed mt-5 pt-5 border-t border-white/6">
                  {profile.bio}
                </p>
              )}

              {/* Meta */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/6 text-xs text-white/30">
                <span className="flex items-center gap-1.5">
                  <Calendar size={11} />
                  Joined{" "}
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle size={11} />
                  {profile.postedTasks.length} tasks completed
                </span>
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <h2
                style={{ fontFamily: "'Syne', sans-serif" }}
                className="text-xl font-bold mb-4"
              >
                Reviews{" "}
                <span className="text-white/30 font-normal text-base">
                  ({profile.ratingsReceived.length})
                </span>
              </h2>

              {profile.ratingsReceived.length === 0 ? (
                <div className="card rounded-2xl py-10 text-center">
                  <p className="text-white/25 text-sm">No reviews yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {profile.ratingsReceived.map((review) => (
                    <div key={review.id} className="card rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                            {review.giver.name?.[0]?.toUpperCase() ?? "U"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {review.giver.name ?? "Anonymous"}
                            </p>
                            <p className="text-xs text-white/30">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <StarRating score={review.score} />
                      </div>

                      {review.comment && (
                        <p className="text-sm text-white/50 leading-relaxed">
                          {review.comment}
                        </p>
                      )}

                      <Link
                        href={`/tasks/${review.task.id}`}
                        className="inline-flex items-center gap-1 text-xs text-indigo-400/60 hover:text-indigo-400 mt-2 transition-colors"
                      >
                        <CheckCircle size={10} /> {review.task.title}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
