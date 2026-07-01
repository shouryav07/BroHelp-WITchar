"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";

const CATEGORIES = ["Design", "Development", "Writing", "Research", "Marketing", "Data", "Video", "Other"];

export default function NewTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    credits: "",
    estimatedTime: "",
    isRemote: true,
    location: "",
    tags: [] as string[],
    expiresAt: "",
  });

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t) && form.tags.length < 5) {
      setForm({ ...form, tags: [...form.tags, t] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push(`/tasks/${data.task.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        .input-field { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); transition: all 0.2s; color: white; }
        .input-field:focus { outline: none; border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.05); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .input-field::placeholder { color: rgba(255,255,255,0.2); }
        .card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); }
        .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); transition: all 0.3s ease; position: relative; overflow: hidden; }
        .btn-primary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, #818cf8, #a78bfa); opacity: 0; transition: opacity 0.3s; }
        .btn-primary:hover::before { opacity: 1; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(99,102,241,0.4); }
        .btn-primary span, .btn-primary svg { position: relative; z-index: 1; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .category-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); transition: all 0.2s; }
        .category-btn:hover { border-color: rgba(99,102,241,0.4); background: rgba(99,102,241,0.08); }
        .category-btn.selected { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.4); color: #818cf8; }
        .toggle { background: rgba(255,255,255,0.08); transition: all 0.2s; }
        .toggle.on { background: #6366f1; }
      `}</style>

      <div className="max-w-2xl mx-auto px-6">
        <Link href="/tasks" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to marketplace
        </Link>

        <div className="mb-8">
          <h1 style={{ fontFamily: "'Syne', sans-serif" }} className="text-4xl font-extrabold mb-2">Post a task</h1>
          <p className="text-white/40">Describe what you need done and set your credit budget.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="card rounded-3xl p-6 space-y-5">
            <h2 className="font-semibold text-white/70 text-sm uppercase tracking-wider">Basic Info</h2>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Task title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Design a logo for my startup"
                className="input-field w-full rounded-xl px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Description *</label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the task in detail — what you need, any requirements, expected output..."
                className="input-field w-full rounded-xl px-4 py-3 text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({ ...form, category: form.category === cat ? "" : cat })}
                    className={`category-btn rounded-full px-4 py-1.5 text-sm ${form.category === cat ? "selected" : "text-white/50"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Budget & Time */}
          <div className="card rounded-3xl p-6 space-y-5">
            <h2 className="font-semibold text-white/70 text-sm uppercase tracking-wider">Budget & Time</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Credits *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.credits}
                  onChange={(e) => setForm({ ...form, credits: e.target.value })}
                  placeholder="e.g. 50"
                  className="input-field w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Estimated time (mins) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.estimatedTime}
                  onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
                  placeholder="e.g. 120"
                  className="input-field w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Expires at (optional)</label>
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="input-field w-full rounded-xl px-4 py-3 text-sm"
              />
            </div>
          </div>

          {/* Location */}
          <div className="card rounded-3xl p-6 space-y-5">
            <h2 className="font-semibold text-white/70 text-sm uppercase tracking-wider">Location</h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Remote task</p>
                <p className="text-xs text-white/30 mt-0.5">Can be done from anywhere</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, isRemote: !form.isRemote })}
                className={`toggle w-11 h-6 rounded-full relative ${form.isRemote ? "on" : ""}`}
              >
                <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${form.isRemote ? "left-6" : "left-1"}`} />
              </button>
            </div>

            {!form.isRemote && (
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Pune, Maharashtra"
                  className="input-field w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="card rounded-3xl p-6 space-y-4">
            <h2 className="font-semibold text-white/70 text-sm uppercase tracking-wider">Tags (max 5)</h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="Add a tag..."
                className="input-field flex-1 rounded-xl px-4 py-2.5 text-sm"
              />
              <button
                type="button"
                onClick={addTag}
                className="rounded-xl px-4 py-2.5 border border-white/10 hover:border-indigo-500/40 text-white/50 hover:text-indigo-400 transition-all text-sm"
              >
                <Plus size={15} />
              </button>
            </div>

            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full px-3 py-1 text-xs">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-200">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <>
              <span>Post task</span>
              <Plus size={15} />
            </>}
          </button>
        </form>
      </div>
    </div>
  );
}