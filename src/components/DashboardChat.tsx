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

  // Filter existing chat rooms
const filteredRooms = rooms.filter((r) =>
  r.name.toLowerCase().includes(searchQuery.toLowerCase())
);

// Filter directory users (excluding those you already have a room with)
const filteredUsers = usersList.filter((u) => {
  const name = u.username || u.email || '';
  const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
  // Don't show in user list if already matching a room name
  const alreadyInRooms = rooms.some(
    (r) => r.name.toLowerCase() === name.toLowerCase()
  );
  return matchesSearch && !alreadyInRooms;
});

  return (
  <div className="fixed inset-0 w-screen h-screen bg-[#0d0f14] text-slate-100 flex flex-col overflow-hidden font-sans">
    
    {/* Custom Dark Scrollbar Styles */}
    <style jsx global>{`
      .custom-dark-scroll::-webkit-scrollbar {
        width: 6px;
      }
      .custom-dark-scroll::-webkit-scrollbar-track {
        background: #0d0f14;
      }
      .custom-dark-scroll::-webkit-scrollbar-thumb {
        background: #222734;
        border-radius: 9999px;
      }
      .custom-dark-scroll::-webkit-scrollbar-thumb:hover {
        background: #333a4d;
      }
    `}</style>

    {/* 1. TOP MAIN VIEWPORT (Takes all remaining height above Bottom Nav) */}
    <div className="flex-1 flex overflow-hidden min-h-0 w-full relative">
      
      {/* OTHER TABS */}
      {activeTab !== 'chat' && (
        <div className="flex-1 p-5 text-slate-200 overflow-y-auto custom-dark-scroll">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold capitalize">{activeTab} Section</h2>
            <button
              onClick={() => setActiveTab('chat')}
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition"
            >
              ← Back to Chats
            </button>
          </div>
          <p className="text-xs text-slate-400">Management & Settings Section</p>
        </div>
      )}

      {/* CHAT TAB */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex w-full h-full overflow-hidden min-h-0">
          
          {/* LEFT SIDEBAR: CHAT THREADS */}
          <div 
            className={`w-full md:w-96 border-r border-slate-800/60 bg-[#12151e] flex flex-col shrink-0 h-full min-h-0 ${
              mobileView === 'list' ? 'flex' : 'hidden md:flex'
            }`}
          >
            {/* Header */}
            <div className="p-4 pb-2 flex items-center justify-between shrink-0 relative">
              <h1 className="text-2xl font-black tracking-tight text-white">Chats</h1>
              <div className="flex gap-2 relative">
                <button 
                  onClick={() => setIsThreeDotsOpen(!isThreeDotsOpen)}
                  className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-sm transition"
                  aria-label="More options"
                >
                  ⋯
                </button>

                {isThreeDotsOpen && (
                  <div className="absolute right-10 top-0 w-44 bg-[#1c212d] border border-slate-700/80 rounded-xl shadow-2xl py-1 z-50 text-xs text-slate-200">
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setIsThreeDotsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-700/60 flex items-center gap-2 font-medium"
                    >
                      <span>⚙️</span> Settings
                    </button>
                  </div>
                )}
                <button className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-sm">✏️</button>
              </div>
            </div>

            {/* Search */}
            <div className="px-4 py-2 shrink-0">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1c212d] text-slate-200 placeholder-slate-400 text-xs rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Thread List */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 min-h-0 custom-dark-scroll">
              {filteredRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => selectRoom(room)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition ${
                    activeRoom?.id === room.id ? 'bg-[#1e2433]' : 'hover:bg-[#161a25]'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-base shrink-0">
                    {room.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-xs font-semibold text-slate-100 truncate">{room.name}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">{room.lastTime}</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{room.lastMessage}</p>
                  </div>
                </button>
              ))}
              
            {/* Show Matching Active Users From Directory */}
              {searchQuery.trim() !== '' && filteredUsers && filteredUsers.length > 0 && (
                <div className="pt-2 border-t border-slate-800/50 mt-2">
                  <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    More People
                  </div>
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        handleStartDM(user);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-[#161a25] transition"
                    >
                      <div className="w-11 h-11 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-base shrink-0">
                        {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-slate-100 truncate">
                          {user.username || user.email}
                        </h4>
                        <p className="text-[10px] text-blue-400 truncate mt-0.5">Start new conversation</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            
              {/* No Results Found State */}
              {searchQuery.trim() !== '' && filteredRooms.length === 0 && (!filteredUsers || filteredUsers.length === 0) && (
                <div className="text-center py-6 text-xs text-slate-500">
                  No chats or users found matching "{searchQuery}"
                </div>
              )}
          </div>

          {/* RIGHT CONVERSATION FEED */}
          <div 
            className={`flex-1 flex flex-col bg-[#0b0c10] h-full min-h-0 overflow-hidden relative pb-16 ${
              mobileView === 'chat' ? 'flex' : 'hidden md:flex'
            }`}
          >
            {activeRoom ? (
              <div className="flex flex-col h-full w-full min-h-0 overflow-hidden">
                          
                {/* Room Header */}
                <div className="px-4 py-3 bg-[#12151e] border-b border-slate-800/80 flex items-center justify-between shrink-0 h-14">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => setMobileView('list')}
                      className="md:hidden text-slate-300 hover:text-white mr-1 text-lg font-bold"
                    >
                      ←
                    </button>
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shrink-0 text-sm">
                      {activeRoom.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <h3 className="text-xs font-bold text-slate-100 truncate">{activeRoom.name}</h3>
                      <span className="text-[10px] text-green-400 block">Active now</span>
                    </div>
                  </div>
                </div>

                {/* Messages Feed (Scrollable area) */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#090a0e] min-h-0 custom-dark-scroll">
                  {messages.map((msg) => {
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
                                ? 'bg-blue-600 text-white rounded-br-xs' :'bg-[#1c212d] text-slate-100 rounded-bl-xs'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-slate-500 px-1 mt-0.5">{msg.timestamp}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Bar */}
                <form 
                  onSubmit={handleSendMessage} 
                  className="p-3 bg-[#12151e] border-t border-slate-800/80 flex items-center gap-2 shrink-0 h-16 relative z-20 mb-16"
                >
                  <input
                    type="text"
                    placeholder="Aa"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 bg-[#1c212d] border border-slate-700/50 rounded-full px-4 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-400"
                  />
          
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
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-xs text-slate-500 p-8 mb-16">
            <div className="w-14 h-14 rounded-full bg-[#12151e] flex items-center justify-center text-xl mb-3">💬</div>
            Select a conversation thread from the list to start messaging.
          </div>
        )}
      </div>
    </div>

        {/* FIXED BOTTOM NAVIGATION BAR */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#12151e] border-t border-slate-800/80 flex items-center justify-around px-2 text-[11px] font-medium text-slate-400 z-30">
          
          {/* STAFF TAB - Only visible to Leaders & Pastors */}
          {isLeaderOrPastor && (
            <button
              onClick={() => { setActiveTab('staff'); setMobileView('list'); }}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'staff' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'}`}
            >
              <span className="text-base">👥</span>
              <span>STAFF</span>
            </button>
          )}

          {/* CHAT TAB - Visible to ALL roles */}
          <button
            onClick={() => { setActiveTab('chat'); setMobileView('list'); }}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'chat' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'}`}
          >
            <span className="text-base">💬</span>
            <span>CHAT</span>
          </button>

          {/* MANAGE TAB - Only visible to Leaders & Pastors */}
          {isLeaderOrPastor && (
            <button
              onClick={() => { setActiveTab('manage'); setMobileView('list'); }}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'manage' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'}`}
            >
              <span className="text-base">📺</span>
              <span>MANAGE</span>
            </button>
          )}

          {/* SETTINGS TAB - Visible to ALL roles */}
          <button
            onClick={() => { setActiveTab('settings'); setMobileView('list'); }}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'settings' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'}`}
          >
            <span className="text-base">⚙️</span>
            <span>SETTINGS</span>
          </button>

        </nav>

    </div>
  </div>
);
}