"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPusherClient } from "@/lib/pusher-client";
import { ArrowLeft, Send, Loader2, MessageSquare } from "lucide-react";

type User = { id: string; name?: string; username?: string; image?: string };
type Message = { id: string; content: string; senderId: string; createdAt: string; sender: User };
type Conversation = {
  id: string;
  participantA: User;
  participantB: User;
  messages: Message[];
  unread: number;
  updatedAt: string;
};

function Avatar({ user, size = "sm" }: { user: User; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-12 w-12 text-base" };
  const letter = user.name?.[0]?.toUpperCase() ?? user.username?.[0]?.toUpperCase() ?? "U";
  return (
    <div className={`${sizes[size]} rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 shrink-0`}>
      {user.image ? <img src={user.image} className="rounded-full w-full h-full object-cover" /> : letter}
    </div>
  );
}

function ConversationItem({ conv, currentUserId, isActive, onClick }: { conv: Conversation; currentUserId: string; isActive: boolean; onClick: () => void }) {
  const other = conv.participantA.id === currentUserId ? conv.participantB : conv.participantA;
  const lastMsg = conv.messages[0];

  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${isActive ? "bg-indigo-500/15 border border-indigo-500/25" : "hover:bg-white/4 border border-transparent"}`}>
      <Avatar user={other} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-sm font-medium text-white truncate">{other.username ?? other.name ?? "User"}</span>
          {conv.unread > 0 && (
            <span className="h-5 w-5 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-bold shrink-0">{conv.unread}</span>
          )}
        </div>
        {lastMsg && (
          <p className="text-xs text-white/30 truncate">{lastMsg.content}</p>
        )}
      </div>
    </button>
  );
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const params = useParams();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>((params?.id as string) || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const otherUser = activeConv
    ? activeConv.participantA.id === user?.id ? activeConv.participantB : activeConv.participantA
    : null;

  // Load conversations
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      setConversations(data.conversations || []);
      setLoadingConvs(false);
    };
    load();
  }, []);

  // Load messages when active conv changes
  useEffect(() => {
    if (!activeConvId) return;
    setLoadingMsgs(true);
    const load = async () => {
      const res = await fetch(`/api/conversations/${activeConvId}/messages`);
      const data = await res.json();
      setMessages(data.messages || []);
      setLoadingMsgs(false);
      // Mark as read in UI
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, unread: 0 } : c))
      );
    };
    load();
  }, [activeConvId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Pusher subscription
  useEffect(() => {
    if (!activeConvId) return;
    const channel = getPusherClient().subscribe(`conversation-${activeConvId}`);
    channel.bind("new-message", (msg: Message) => {
      if(msg.senderId === user?.id)return;
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });
    return () => { getPusherClient().unsubscribe(`conversation-${activeConvId}`) };
  }, [activeConvId]);

  const sendMessage = async () => {
    if (!input.trim() || !activeConvId || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");

    // Optimistic
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      content,
      senderId: user?.id,
      createdAt: new Date().toISOString(),
      sender: { id: user?.id, name: user?.name, username: user?.username },
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await fetch(`/api/conversations/${activeConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-screen bg-[#0a0a0f] text-white flex flex-col pt-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        .msg-input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); transition: all 0.2s; }
        .msg-input:focus { outline: none; border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.04); }
        .msg-input::placeholder { color: rgba(255,255,255,0.2); }
        .send-btn { background: linear-gradient(135deg, #6366f1, #8b5cf6); transition: all 0.2s; }
        .send-btn:hover { opacity: 0.9; transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.4; transform: none; }
        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-track { background: transparent; }
        .messages-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .sidebar::-webkit-scrollbar { width: 4px; }
        .sidebar::-webkit-scrollbar-track { background: transparent; }
        .sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-white/5 flex flex-col shrink-0">
          <div className="p-4 border-b border-white/5">
            <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl font-bold">Messages</h2>
          </div>

          <div className="flex-1 overflow-y-auto sidebar p-3 space-y-1">
            {loadingConvs ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="h-10 w-10 rounded-full bg-white/5 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/5 rounded animate-pulse w-2/3" />
                    <div className="h-2 bg-white/5 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))
            ) : conversations.length === 0 ? (
              <div className="text-center py-10">
                <MessageSquare size={24} className="text-white/15 mx-auto mb-2" />
                <p className="text-xs text-white/25">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  currentUserId={user?.id}
                  isActive={conv.id === activeConvId}
                  onClick={() => setActiveConvId(conv.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!activeConvId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare size={40} className="text-white/10 mx-auto mb-3" />
                <p className="text-white/25 text-sm">Select a conversation to start chatting</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-16 border-b border-white/5 flex items-center px-6 gap-3 shrink-0">
                {otherUser && (
                  <>
                    <Avatar user={otherUser} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-white">{otherUser.username ?? otherUser.name ?? "User"}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto messages-area px-6 py-4 space-y-3">
                {loadingMsgs ? (
                  <div className="flex justify-center pt-10">
                    <Loader2 size={20} className="animate-spin text-white/30" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center pt-10">
                    <p className="text-white/20 text-sm">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                        {!isMe && <Avatar user={msg.sender} size="sm" />}
                        <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${isMe ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white/6 text-white/80 rounded-bl-sm"}`}>
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${isMe ? "text-indigo-200/60" : "text-white/25"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Type a message..."
                    className="msg-input flex-1 rounded-xl px-4 py-3 text-sm text-white"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || sending}
                    className="send-btn h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                  >
                    {sending ? <Loader2 size={16} className="animate-spin text-white" /> : <Send size={16} className="text-white" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}