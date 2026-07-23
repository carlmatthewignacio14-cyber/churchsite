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
      
      {/* TOP HEADER BAR */}
      <div className="p-2.5 bg-[#181c24] border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 text-slate-200 text-xs px-3 py-1.5 rounded-lg font-bold tracking-wide transition"
        >
          ← BACK TO HOMEPAGE
        </button>
      </div>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        
        {/* OTHER TABS */}
        {activeTab !== 'chat' && (
          <div className="flex-1 p-5 text-slate-200 overflow-y-auto">
            <h2 className="text-xl font-bold capitalize mb-2">{activeTab} Section</h2>
            <p className="text-xs text-slate-400">Settings and management features here.</p>
          </div>
        )}

        {/* MESSENGER CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex w-full overflow-hidden min-h-0">
            
            {/* LEFT SIDEBAR: MESSENGER LIST (Image 2 style) */}
            <div 
              className={`w-full md:w-96 border-r border-slate-800/80 bg-[#14171f] flex flex-col shrink-0 min-h-0 ${
                mobileView === 'list' ? 'flex' : 'hidden md:flex'
              }`}
            >
              {/* Header Title + Actions */}
              <div className="p-4 pb-2 flex items-center justify-between shrink-0">
                <h1 className="text-2xl font-black tracking-tight text-white">Chats</h1>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-sm">⋯</button>
                  <button className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-sm">✏️</button>
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
                <button
                  onClick={() => setFilterCategory('groups')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    filterCategory === 'groups' ? 'bg-blue-600/30 text-blue-400 border border-blue-500/30' : 'bg-[#202531] text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Groups
                </button>
              </div>

              {/* Chat Thread List */}
              <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 min-h-0">
                {filteredRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => selectRoom(room)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition ${
                      activeRoom?.id === room.id ? 'bg-[#212735]' : 'hover:bg-[#1a1f2c]'
                    }`}
                  >
                    {/* Circle Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                        {room.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#14171f] rounded-full"></span>
                    </div>

                    {/* Room Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs md:text-sm font-semibold text-slate-100 truncate">{room.name}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">{room.lastTime}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{room.lastMessage}</p>
                    </div>
                  </button>
                ))}

                {/* Direct Message Quick Directory List */}
                <div className="pt-3 px-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Directory</span>
                  <div className="mt-2 space-y-1">
                    {usersList
                      .filter((u) => (u.username || u.email).toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((u) => (
                        <button
                          key={u.id}
                          onClick={() => handleStartDM(u)}
                          className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#1a1f2c] text-xs text-slate-300"
                        >
                          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">
                            {(u.username || u.email).charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate">{u.username || u.email}</span>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT CONVERSATION FEED (Image 3 style) */}
            <div 
              className={`flex-1 flex flex-col bg-[#0b0d12] overflow-hidden min-h-0 ${
                mobileView === 'chat' ? 'flex' : 'hidden md:flex'
              }`}
            >
              {activeRoom ? (
                <>
                  {/* Top Bar with Avatar & Actions */}
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

                    {/* Messenger Call & Info Actions */}
                    <div className="flex items-center gap-3 text-blue-500 text-lg">
                      <button className="hover:opacity-80">📞</button>
                      <button className="hover:opacity-80">📹</button>
                      <button className="hover:opacity-80">ℹ️</button>
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

                  {/* Messenger Bottom Input Toolbar */}
                  <form onSubmit={handleSendMessage} className="p-3 bg-[#14171f] border-t border-slate-800/80 flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 text-red-500 text-lg shrink-0">
                      <button type="button" className="hover:opacity-80">➕</button>
                      <button type="button" className="hover:opacity-80">🖼️</button>
                      <button type="button" className="hover:opacity-80">😀</button>
                      <button type="button" className="hover:opacity-80">👾</button>
                    </div>

                    <input
                      type="text"
                      placeholder="Aa"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="flex-1 bg-[#202531] border border-slate-700/50 rounded-full px-4 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-400"
                    />

                    <button
                      type="submit"
                      className="text-red-500 font-bold px-2 py-1 text-lg hover:scale-105 transition shrink-0"
                    >
                      ❤️
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

      {/* BOTTOM NAVIGATION BAR */}
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

        <button
          onClick={() => { setActiveTab('settings'); setMobileView('list'); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-blue-500 font-bold' : 'hover:text-slate-200'}`}
        >
          <span>⚙️</span>
          <span>SETTINGS</span>
        </button>
      </nav>
    </div>
  );
}
