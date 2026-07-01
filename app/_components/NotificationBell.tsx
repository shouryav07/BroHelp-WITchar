"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getPusherClient } from "@/lib/pusher-client";
import { Bell, MessageSquare, X } from "lucide-react";

type NotifConversation = {
  id: string;
  participantA: { id: string; name?: string; username?: string; image?: string };
  participantB: { id: string; name?: string; username?: string; image?: string };
  messages: { content: string; createdAt: string }[];
};

export default function NotificationBell() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversations, setConversations] = useState<NotifConversation[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    const res = await fetch("/api/notifications");
    const data = await res.json();
    setUnreadCount(data.unreadCount || 0);
    setConversations(data.conversations || []);
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications();

    // Pusher real-time
    const channel = getPusherClient().subscribe(`notifications-${user.id}`);
    channel.bind("new-message", () => {
      fetchNotifications();
    });

    return () => { getPusherClient().unsubscribe(`notifications-${user.id}`) };
  }, [user?.id]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goToConversation = (convId: string) => {
    setOpen(false);
    router.push(`/messages/${convId}`);
    fetchNotifications();
  };

  return (
    <div ref={ref} className="relative">
      <style>{`
        .notif-dropdown { background: #111118; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
        .notif-item { transition: background 0.15s; }
        .notif-item:hover { background: rgba(255,255,255,0.04); }
      `}</style>

      <button
        onClick={() => setOpen(!open)}
        className="relative h-9 w-9 rounded-xl border border-white/8 bg-white/3 flex items-center justify-center hover:border-white/15 transition-all"
      >
        <Bell size={15} className="text-white/50" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown absolute right-0 top-12 w-80 rounded-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>

          {conversations.length === 0 ? (
            <div className="py-10 text-center">
              <Bell size={24} className="text-white/10 mx-auto mb-2" />
              <p className="text-xs text-white/25">No new notifications</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {conversations.map((conv) => {
                const other = conv.participantA.id === user?.id ? conv.participantB : conv.participantA;
                const lastMsg = conv.messages[0];
                return (
                  <button
                    key={conv.id}
                    onClick={() => goToConversation(conv.id)}
                    className="notif-item w-full flex items-start gap-3 px-4 py-3 text-left border-b border-white/4 last:border-0"
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0 mt-0.5">
                      {other.name?.[0]?.toUpperCase() ?? other.username?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <MessageSquare size={11} className="text-indigo-400 shrink-0" />
                        <span className="text-xs font-medium text-white">{other.username ?? other.name ?? "User"}</span>
                      </div>
                      {lastMsg && (
                        <p className="text-xs text-white/40 truncate">{lastMsg.content}</p>
                      )}
                    </div>
                    <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  </button>
                );
              })}
            </div>
          )}

          <div className="px-4 py-2.5 border-t border-white/6">
            <button
              onClick={() => { setOpen(false); router.push("/messages"); }}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors w-full text-center"
            >
              View all messages →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}