'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

export default function DashboardChat({ currentUser }: { currentUser: any }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const myUsername = currentUser?.user_metadata?.username || currentUser?.email || 'User';
  const currentUserId = currentUser?.id;

  useEffect(() => {
    if (!currentUserId) return;

    // Load past conversations from database on refresh
    const loadChatHistory = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (data && !error) {
        const formattedMessages: Message[] = data.map((row: any) => ({
          id: row.id.toString(),
          sender: row.sender_name || 'User',
          text: row.message_text || '',
          timestamp: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages(formattedMessages);
      }
    };

    loadChatHistory();

    // Listen live for new incoming database rows
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, 
        (payload) => {
          const newRow = payload.new;
          const incomingMsg: Message = {
            id: newRow.id.toString(),
            sender: newRow.sender_name || 'User',
            text: newRow.message_text || '',
            timestamp: new Date(newRow.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages((prev) => prev.some(m => m.id === incomingMsg.id) ? prev : [...prev, incomingMsg]);
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUserId) return;

    const currentText = inputText;
    setInputText('');

    // Save directly to your Supabase table rows
    const { error } = await supabase
      .from('chat_messages')
      .insert([
        {
          user_id: currentUserId,
          sender_name: myUsername,
          message_text: currentText
        }
      ]);

    if (error) console.error("Failed to save message:", error.message);
  };

    // 🚀 3. Broadcast message out to everyone listening right now
    await supabase.channel('church-live-chat').send({
      type: 'broadcast',
      event: 'message',
      payload: messagePayload
    });

    setInputText('');
  };

  return (
    <div className="border border-slate-800 bg-slate-900 rounded-xl overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 bg-slate-950 border-b border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live Staff & Leadership Chat Room
        </h3>
        <p className="text-[11px] text-slate-400">Real-time messaging platform</p>
      </div>

      {/* Message Feed Display Window */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
        {messages.length === 0 ? (
          <div className="text-center text-xs text-slate-500 pt-12">No recent conversation logs. Type a message below to start!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === myUsername;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-slate-400 mb-0.5 px-1">{msg.sender}</span>
                <div className={`p-2.5 rounded-xl max-w-xs text-sm ${
                  isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-100 rounded-tl-none'
                }`}>
                  <p>{msg.text}</p>
                  <span className="block text-[9px] text-slate-400 text-right mt-1">{msg.timestamp}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Typing Form Controls Footer */}
      <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          placeholder="Type your message here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded-lg text-xs uppercase tracking-wider">
          Send
        </button>
      </form>
    </div>
  );
}
