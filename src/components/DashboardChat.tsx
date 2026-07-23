'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

interface ChatRoom {
  id: string;
  name: string;
  is_group: boolean;
  lastMessage?: string;
  lastTime?: string;
  avatarUrl?: string;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
}

export default function DashboardChat({ currentUser }: { currentUser: any }) {
  const rawRole = currentUser?.user_metadata?.role || currentUser?.role || 'member';
  const userRole = rawRole.toString().toLowerCase();
  const isLeaderOrPastor = ['leader', 'pastor'].includes(userRole);

  const [activeTab, setActiveTab] = useState<'staff' | 'chat' | 'manage' | 'settings'>('chat');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [filterCategory, setFilterCategory] = useState<'all' | 'unread' | 'groups'>('all');
  const [isThreeDotsOpen, setIsThreeDotsOpen] = useState(false);

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const myUsername = currentUser?.user_metadata?.username || currentUser?.email || 'User';
  const currentUserId = currentUser?.id;

  // 1. Initial Fetch
  useEffect(() => {
    if (!currentUserId) return;

    const fetchInitialSidebarData = async () => {
      const { data: userMemberships } = await supabase
        .from('room_members')
        .select('room_id')
        .eq('user_id', currentUserId);

      if (userMemberships && userMemberships.length > 0) {
        const roomIds = userMemberships.map((m) => m.room_id);
        const { data: userRooms } = await supabase
          .from('chat_rooms')
          .select('id, name, is_group')
          .in('id', roomIds);

        if (userRooms) {
          setRooms(
            userRooms.map((r: any) => ({
              id: r.id,
              name: r.name || 'Private Message',
              is_group: r.is_group,
              lastMessage: 'Tap to view conversation',
              lastTime: 'Now',
            }))
          );
        }
      }

      const { data: profiles } = await supabase
        .from('user_directory')
        .select('id, username, email')
        .neq('id', currentUserId);

      if (profiles) setUsersList(profiles);
    };

    fetchInitialSidebarData();
  }, [currentUserId]);

  // 2. Realtime Messages
  useEffect(() => {
    if (!currentUserId || !activeRoom) return;

    const loadChatHistory = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', activeRoom.id)
        .order('created_at', { ascending: true });

      if (data && !error) {
        setMessages(
          data.map((row: any) => ({
            id: row.id.toString(),
            sender: row.sender_name || 'User',
            text: row.message_text || '',
            timestamp: new Date(row.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }))
        );
      }
    };

    loadChatHistory();

    const channel = supabase
      .channel(`room-messages:${activeRoom.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${activeRoom.id}`,
        },
        (payload) => {
          const newRow = payload.new;
          const incomingMsg: Message = {
            id: newRow.id.toString(),
            sender: newRow.sender_name || 'User',
            text: newRow.message_text || '',
            timestamp: new Date(newRow.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };

          setMessages((prev) =>
            prev.some((m) => m.id === incomingMsg.id) ? prev : [...prev, incomingMsg]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, activeRoom?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectRoom = (room: ChatRoom) => {
    setActiveRoom(room);
    setMobileView('chat');
  };

  const handleStartDM = async (targetUser: UserProfile) => {
    if (!currentUserId) return;

    const { data: myMemberships } = await supabase
      .from('room_members')
      .select('room_id')
      .eq('user_id', currentUserId);

    let targetRoomId = null;

    if (myMemberships && myMemberships.length > 0) {
      const myRoomIds = myMemberships.map((m) => m.room_id);

      const { data: sharedDM } = await supabase
        .from('room_members')
        .select('room_id, chat_rooms!inner(id, is_group)')
        .eq('user_id', targetUser.id)
        .eq('chat_rooms.is_group', false)
        .in('room_id', myRoomIds)
        .maybeSingle();

      if (sharedDM) targetRoomId = sharedDM.room_id;
    }

    const dmName = targetUser.username || targetUser.email;

    if (!targetRoomId) {
      const { data: newRoom } = await supabase
        .from('chat_rooms')
        .insert([{ name: dmName, is_group: false }])
        .select()
        .single();

      if (newRoom) {
        targetRoomId = newRoom.id;
        await supabase.from('room_members').insert([
          { room_id: targetRoomId, user_id: currentUserId },
          { room_id: targetRoomId, user_id: targetUser.id },
        ]);
      }
    }

    if (targetRoomId) {
      const dmTarget = { id: targetRoomId, name: dmName, is_group: false, lastMessage: 'Direct Message', lastTime: 'Now' };
      setRooms((prev) =>
        prev.some((r) => r.id === targetRoomId) ? prev : [...prev, dmTarget]
      );
      selectRoom(dmTarget);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUserId || !activeRoom) return;

    const currentText = inputText;
    setInputText('');

    await supabase.from('chat_messages').insert([
      {
        user_id: currentUserId,
        sender_name: myUsername,
        message_text: currentText,
        room_id: activeRoom.id,
      },
    ]);
  };

  const filteredRooms = rooms.filter((r) => {
    if (filterCategory === 'groups') return r.is_group;
    return r.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#11141a] text-slate-100 overflow-hidden font-sans">

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        
        {/* OTHER TABS */}
        {activeTab !== 'chat' && (
          <div className="flex-1 p-5 text-slate-200 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold capitalize">{activeTab} Section</h2>
              <button
                onClick={() => setActiveTab('chat')}
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition"
              >
                ← Back to Chats
              </button>
            </div>
            <p className="text-xs text-slate-400">Manage app configuration and user settings here.</p>
          </div>
        )}

        {/* MESSENGER CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex w-full overflow-hidden min-h-0">
            
            {/* LEFT SIDEBAR: MESSENGER LIST */}
            <div 
              className={`w-full md:w-96 border-r border-slate-800/80 bg-[#14171f] flex flex-col shrink-0 min-h-0 ${
                mobileView === 'list' ? 'flex' : 'hidden md:flex'
              }`}
            >
              {/* Header Title + Actions */}
              <div className="p-4 pb-2 flex items-center justify-between shrink-0 relative">
                <h1 className="text-2xl font-black tracking-tight text-white">Chats</h1>
                <div className="flex gap-2 relative">
                  {/* 3-DOT ACTION BUTTON & DROPDOWN MENU */}
                  <button 
                    onClick={() => setIsThreeDotsOpen(!isThreeDotsOpen)}
                    className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-sm transition"
                    aria-label="More options"
                  >
                    ⋯
                  </button>

                  {/* Dropdown Menu */}
                  {isThreeDotsOpen && (
                    <div className="absolute right-10 top-0 w-44 bg-[#202531] border border-slate-700/80 rounded-xl shadow-2xl py-1 z-50 text-xs text-slate-200">
                      <button
                        onClick={() => {
                          setActiveTab('settings');
                          setIsThreeDotsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-700/60 flex items-center gap-2 font-medium"
                      >
                        <span>⚙️</span> Settings
                      </button>
                      <button
                        onClick={() => setIsThreeDotsOpen(false)}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-700/60 flex items-center gap-2 font-medium text-slate-400"
                      >
                        <span>🔕</span> Mute Notifications
                      </button>
                    </div>
                  )}

                  <button className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-sm">
                    ✏️
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="px-4 py-2 shrink-0">
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 text-sm">🔍</span>
                  <input
                    type="text"
                    placeholder="Search Messenger..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#202531] text-slate-200 placeholder-slate-400 text-xs rounded-full pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto shrink-0 border-b border-slate-800/40">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    filterCategory === 'all' ? 'bg-blue-600/30 text-blue-400 border border-blue-500/30' : 'bg-[#202531] text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterCategory('unread')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    filterCategory === 'unread' ? 'bg-blue-600/30 text-blue-400 border border-blue-500/30' : 'bg-[#202531] text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Unread
                </button>
                {/* RIGHT CONVERSATION FEED */}
            <div 
              className={`flex-1 flex flex-col bg-[#0b0d12] overflow-hidden min-h-0 ${
                mobileView === 'chat' ? 'flex' : 'hidden md:flex'
              }`}
            >
              {activeRoom ? (
                <>
                  {/* Top Bar with Avatar */}
                  <div className="px-4 py-3 bg-[#14171f] border-b border-slate-800/80 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => setMobileView('list')}
                        className="md:hidden text-slate-300 hover:text-white mr-1"
                      >
                        ←
                      </button>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shrink-0">
                        {activeRoom.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <h3 className="text-sm font-bold text-slate-100 truncate">{activeRoom.name}</h3>
                        <span className="text-[10px] text-green-400 block">Active now</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Stream */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0e1017] min-h-0">
                    {messages.length === 0 ? (
                      <div className="text-center text-xs text-slate-500 pt-16">
                        No messages yet. Say hello to start the chat!
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isMe = msg.sender === myUsername;
                        return (
                          <div key={msg.id} className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {!isMe && (
                              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 self-end">
                                {msg.sender.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                              <span className="text-[10px] text-slate-400 px-1 mb-0.5">{msg.sender}</span>
                              <div
                                className={`px-3.5 py-2 rounded-2xl text-xs md:text-sm leading-relaxed ${
                                  isMe
                                    ? 'bg-blue-600 text-white rounded-br-xs'
                                    : 'bg-[#202531] text-slate-100 rounded-bl-xs'
                                }`}
                              >
                                {msg.text}
                              </div>
                              <span className="text-[9px] text-slate-500 px-1 mt-0.5">{msg.timestamp}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Clean Input Bar */}
                  <form onSubmit={handleSendMessage} className="p-3 bg-[#14171f] border-t border-slate-800/80 flex items-center gap-2 shrink-0">
                    <input
                      type="text"
                      placeholder="Aa"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="flex-1 bg-[#202531] border border-slate-700/50 rounded-full px-4 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-400"
                    />

                    {/* Paper Airplane Send Button */}
                    <button
                      type="submit"
                      aria-label="Send message"
                      className="p-2 text-blue-500 hover:text-blue-400 hover:scale-105 transition shrink-0 flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 ml-0.5"
                      >
                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.917H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.917a.75.75 0 0 0 .926.941l18-7.5a.75.75 0 0 0 0-1.382l-18-7.5Z" />
                      </svg>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-xs text-slate-500 p-8">
                  <div className="w-16 h-16 rounded-full bg-[#14171f] flex items-center justify-center text-2xl mb-3">💬</div>
                  Select a conversation thread from the list to start messaging.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAVIGATION BAR (Settings removed, hidden into 3-dot dropdown) */}
      <nav className="h-14 bg-[#14171f] border-t border-slate-800/80 flex items-center justify-around px-2 text-[11px] font-medium text-slate-400 shrink-0">
        {isLeaderOrPastor && (
          <button
            onClick={() => { setActiveTab('staff'); setMobileView('list'); }}
            className={`flex flex-col items-center gap-1 ${activeTab === 'staff' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'}`}
          >
            <span>👥</span>
            <span>STAFF</span>
          </button>
        )}

        <button
          onClick={() => { setActiveTab('chat'); setMobileView('list'); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'}`}
        >
          <span>💬</span>
          <span>CHAT</span>
        </button>

        {isLeaderOrPastor && (
          <button
            onClick={() => { setActiveTab('manage'); setMobileView('list'); }}
            className={`flex flex-col items-center gap-1 ${activeTab === 'manage' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'}`}
          >
            <span>📺</span>
            <span>MANAGE</span>
          </button>
        )}
      </nav>
    </div>
  );
}
