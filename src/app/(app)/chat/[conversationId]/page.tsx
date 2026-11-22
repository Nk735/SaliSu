"use client";
import {useEffect,useState} from "react";
import {useParams} from "next/navigation";
import {useMessages} from "@/lib/realtime/useMessages";
import {ChatPinnedTrip} from "@/components/chat/ChatPinnedTrip";
import {QuickReplies} from "@/components/chat/QuickReplies";
import {SeatRequestCard} from "@/components/chat/SeatRequestCard";
import {MapsPinCard} from "@/components/chat/MapsPinCard";

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { messages, supabase } = useMessages(conversationId);
  const [conversation, setConversation] = useState<any>(null);
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!conversationId) return;
    supabase.from("conversations").select("*,trips(*)").eq("id", conversationId).single().then(r => setConversation(r.data));
  }, [conversationId, supabase]);

  async function send(text = body) {
    if (!text.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("messages").insert({ conversation_id: conversationId, sender_id: user.id, body: text.trim() });
    setBody("");
  }

  async function requestSeat() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !conversation?.trip_id) return;
    await supabase.from("trip_requests").upsert({ trip_id: conversation.trip_id, passenger_id: user.id, seats: 1, status: "pending" });
  }

  return (
    <div className="chat-messages-bg flex h-full flex-col">
      <ChatPinnedTrip trip={conversation?.trips} />
      <div className="flex-1 space-y-2 overflow-y-auto p-3.5">
        {conversation?.trips && (
          <>
            <SeatRequestCard status="idle" onRequest={requestSeat} />
            <MapsPinCard label={conversation.trips.maps_label} url={conversation.trips.maps_url} />
          </>
        )}
        {messages.map(m => (
          <div key={m.id} className="max-w-[82%] rounded-2xl rounded-bl-md border border-line bg-card px-3 py-2 text-xs">
            <p className="font-medium">{m.body}</p>
            {m.maps_url && <a className="mt-1 block text-accentWarm" href={m.maps_url}>Apri Maps</a>}
          </div>
        ))}
      </div>
      <div className="border-t border-line bg-card p-3">
        <QuickReplies onSelect={send} />
        <div className="mt-2 flex gap-2">
          <input value={body} onChange={e => setBody(e.target.value)} onKeyDown={e => { if (e.key === "Enter") send(); }} placeholder="Scrivi un messaggio..." className="min-w-0 flex-1 rounded-xl border border-line bg-base px-3 py-2.5 text-sm" />
          <button onClick={() => send()} className="rounded-xl bg-crimson px-3 text-white">➤</button>
        </div>
      </div>
    </div>
  );
}
