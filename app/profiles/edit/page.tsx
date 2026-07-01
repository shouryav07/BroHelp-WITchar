"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const loadProfile = async () => {
      const res = await fetch(`/api/profile/${user.id}`);
      const data = await res.json();
      setName(data.user.name || "");
      setBio(data.user.bio || "");
      setLoading(false);
    };

    loadProfile();
  }, [user?.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio }),
      });

      if (res.ok) {
        router.push(`/profiles/${user.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

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
        .btn-primary span { position: relative; z-index: 1; }
      `}</style>

      <div className="max-w-2xl mx-auto px-6">
        <Link
          href={`/profiles/${user.id}`}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Profile
        </Link>

        <div className="card rounded-3xl p-8 space-y-6">
          <h1
            style={{ fontFamily: "'Syne', sans-serif" }}
            className="text-2xl font-extrabold"
          >
            Edit Profile
          </h1>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50"
              placeholder="Your name"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 resize-none"
              placeholder="Tell others about your skills, expertise, academic background..."
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary rounded-xl px-6 py-3 text-sm font-semibold flex items-center gap-2"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin relative z-10" />
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
