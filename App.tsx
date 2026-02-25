import React, { useState, useEffect, useMemo } from 'react';
import { ScoutEvent, PostponeType, ActivityType, DaySchedule } from './types';
import { addMinutes, compareTimes, getDuration, isDateToday, getRemainingSeconds, formatRemainingTime, timeToMinutes } from './utils/time';
import Modal from './components/Modal';
import EventForm from './components/EventForm';
import PostponeForm from './components/PostponeForm';

const STORAGE_KEY = 'scout_timetable_nature_v8';
const SYNC_API_BASE = 'https://kvdb.io/T8pWfWw5bVpLpQYjYnNqfR/';

const INITIAL_DATA: DaySchedule[] = [
  {
    id: 'day-friday',
    date: 'Piatok',
    events: [
      { id: 'f1', startTime: '07:00', endTime: '07:15', title: 'Budíček', category: ActivityType.OTHER },
      { id: 'f2', startTime: '07:15', endTime: '08:00', title: 'Úvod a Hra vonku', category: ActivityType.PROGRAM },
      { id: 'f3', startTime: '08:00', endTime: '08:45', title: 'Raňajky', category: ActivityType.FOOD },
      { id: 'f4', startTime: '08:45', endTime: '12:00', title: 'Dopoludňajší blok', category: ActivityType.LECTURE },
      { id: 'f5', startTime: '12:00', endTime: '13:00', title: 'Obed', category: ActivityType.FOOD },
    ],
    isCollapsed: false
  },
  {
    id: 'day-saturday',
    date: 'Sobota',
    events: [
      { id: 's1', startTime: '07:00', endTime: '07:30', title: 'Budíček a rozcvička', category: ActivityType.PROGRAM },
      { id: 's2', startTime: '07:30', endTime: '08:00', title: 'Hygiena', category: ActivityType.OTHER },
      { id: 's3', startTime: '08:00', endTime: '08:30', title: 'Raňajky', category: ActivityType.FOOD },
      { id: 's4', startTime: '08:30', endTime: '12:00', title: 'Tvorba hry (Ubuntu)', category: ActivityType.PROGRAM },
      { id: 's5', startTime: '12:00', endTime: '12:45', title: 'BRNO (Vlasáč)', category: ActivityType.PROGRAM },
      { id: 's6', startTime: '12:45', endTime: '13:30', title: 'Obed', category: ActivityType.FOOD },
    ],
    isCollapsed: false
  },
  {
    id: 'day-sunday',
    date: 'Nedeľa',
    events: [
      { id: 'n1', startTime: '07:00', endTime: '07:30', title: 'Budíček', category: ActivityType.OTHER },
      { id: 'n2', startTime: '07:30', endTime: '08:00', title: 'Rozcvička', category: ActivityType.PROGRAM },
      { id: 'n3', startTime: '08:00', endTime: '08:30', title: 'Raňajky', category: ActivityType.FOOD },
      { id: 'n4', startTime: '08:30', endTime: '10:30', title: 'Priprava družinoviek', category: ActivityType.LECTURE },
    ],
    isCollapsed: false
  }
];

const App: React.FC = () => {
  const [days, setDays] = useState<DaySchedule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [campCode, setCampCode] = useState<string>(localStorage.getItem('scout_camp_code') || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'live'>('grid');
  
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isPostponeModalOpen, setIsPostponeModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<{ dayId: string; event: ScoutEvent } | null>(null);
  const [targetDayId, setTargetDayId] = useState<string | null>(null);
  const [postponingInfo, setPostponingInfo] = useState<{ dayId: string; eventId: string } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
  }, [days]);

  useEffect(() => {
    localStorage.setItem('scout_camp_code', campCode);
  }, [campCode]);

  const saveToCloud = async () => {
    if (!campCode) return alert('Zadajte kód MATICE!');
    setIsSyncing(true);
    try {
      await fetch(`${SYNC_API_BASE}${campCode}`, {
        method: 'POST',
        body: JSON.stringify(days),
      });
      alert('🌿 Plán úspešne uložený v cloude!');
    } catch (e) {
      alert('Chyba spojenia.');
    } finally {
      setIsSyncing(false);
    }
  };

  const loadFromCloud = async () => {
    if (!campCode) return alert('Zadajte kód MATICE!');
    setIsSyncing(true);
    try {
      const res = await fetch(`${SYNC_API_BASE}${campCode}`);
      if (res.ok) {
        const data = await res.json();
        setDays(data);
        alert('🍃 Plán stiahnutý!');
      } else {
        alert('Nič sa nenašlo.');
      }
    } catch (e) {
      alert('Chyba sťahovania.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddDay = () => {
    const newDay: DaySchedule = {
      id: `day-${Date.now()}`,
      date: `Nový Deň`,
      events: [],
      isCollapsed: false
    };
    setDays(prev => [...prev, newDay]);
  };

  const handleRemoveDay = (dayId: string) => {
    if (confirm('Zmazať celý deň?')) {
      console.log('Before remove - days:', days.length, 'IDs:', days.map(d => d.id));
      const newDays = days.filter(d => d.id !== dayId);
      console.log('After filter - newDays:', newDays.length, 'IDs:', newDays.map(d => d.id));
      setDays(newDays);
      // Force localStorage update
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDays));
      console.log('localStorage updated:', newDays.length, 'days');
    }
  };

  const handleAddOrEditEvent = (data: Omit<ScoutEvent, 'id'>) => {
    if (!targetDayId) return;
    setDays(prev => prev.map(day => {
      if (day.id !== targetDayId) return day;
      let nextEvents: ScoutEvent[];
      if (editingEvent) {
        nextEvents = day.events.map(e => e.id === editingEvent.event.id ? { ...e, ...data } : e);
      } else {
        const newEvent: ScoutEvent = { id: Date.now().toString(), ...data };
        nextEvents = [...day.events, newEvent];
      }
      return { ...day, events: nextEvents.sort((a, b) => compareTimes(a.startTime, b.startTime)) };
    }));
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const handleMoveEvent = (dayId: string, eventId: string, direction: 'up' | 'down') => {
    setDays(prev => prev.map(day => {
      if (day.id !== dayId) return day;
      const sorted = [...day.events].sort((a, b) => compareTimes(a.startTime, b.startTime));
      const idx = sorted.findIndex(e => e.id === eventId);
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      
      if (targetIdx < 0 || targetIdx >= sorted.length) return day;
      
      // Swap properties but keep time slots
      const a = sorted[idx];
      const b = sorted[targetIdx];
      
      const nextEvents = sorted.map((e, i) => {
        if (i === idx) return { ...e, title: b.title, category: b.category, responsible: b.responsible, shadow: b.shadow };
        if (i === targetIdx) return { ...e, title: a.title, category: a.category, responsible: a.responsible, shadow: a.shadow };
        return e;
      });
      
      return { ...day, events: nextEvents };
    }));
  };

  const handleDeleteEvent = (dayId: string, eventId: string) => {
    setDays(prev => prev.map(day => {
      if (day.id !== dayId) return day;
      return { ...day, events: day.events.filter(e => e.id !== eventId) };
    }));
  };

  const handlePostpone = (minutes: number, type: PostponeType) => {
    if (!postponingInfo) return;
    const { dayId, eventId } = postponingInfo;
    setDays(prev => prev.map(day => {
      if (day.id !== dayId) return day;
      const targetEvent = day.events.find(e => e.id === eventId);
      if (!targetEvent) return day;
      
      const updatedEvents = day.events.map(e => {
        if (type === PostponeType.SINGLE) {
          return e.id === eventId ? { ...e, startTime: addMinutes(e.startTime, minutes), endTime: addMinutes(e.endTime, minutes) } : e;
        } else {
          if (compareTimes(e.startTime, targetEvent.startTime) >= 0) {
            return { ...e, startTime: addMinutes(e.startTime, minutes), endTime: addMinutes(e.endTime, minutes) };
          }
          return e;
        }
      });
      return { ...day, events: updatedEvents.sort((a, b) => compareTimes(a.startTime, b.startTime)) };
    }));
    setIsPostponeModalOpen(false);
    setPostponingInfo(null);
  };

  const isCurrentEvent = (ev: ScoutEvent, dayDate: string) => {
    if (!isDateToday(dayDate)) return false;
    const nowMins = currentTime.getHours() * 60 + currentTime.getMinutes();
    const startMins = timeToMinutes(ev.startTime);
    const endMins = timeToMinutes(ev.endTime, true);
    return nowMins >= startMins && nowMins < endMins;
  };

  const currentActiveActivity = useMemo(() => {
    const todayDay = days.find(d => isDateToday(d.date));
    if (!todayDay) return null;
    return todayDay.events.find(ev => isCurrentEvent(ev, todayDay.date)) || null;
  }, [days, currentTime]);

  const nextActivity = useMemo(() => {
    const todayDay = days.find(d => isDateToday(d.date));
    if (!todayDay) return null;
    const nowMins = currentTime.getHours() * 60 + currentTime.getMinutes();
    return todayDay.events
      .filter(ev => timeToMinutes(ev.startTime) >= nowMins)
      .filter(ev => !isCurrentEvent(ev, todayDay.date))
      .sort((a, b) => compareTimes(a.startTime, b.startTime))[0] || null;
  }, [days, currentTime]);

  const getCategoryStyles = (cat: ActivityType, active: boolean) => {
    switch (cat) {
      case ActivityType.LECTURE: return { 
        bar: 'bg-emerald-800', bg: active ? 'bg-emerald-50' : 'bg-white', border: active ? 'border-emerald-800 ring-4 ring-emerald-100 shadow-lg' : 'border-stone-100', icon: 'fa-brain', text: 'text-emerald-800', colorClass: 'from-emerald-800 to-green-950'
      };
      case ActivityType.PROGRAM: return { 
        bar: 'bg-sky-800', bg: active ? 'bg-sky-50' : 'bg-white', border: active ? 'border-sky-800 ring-4 ring-sky-100 shadow-lg' : 'border-stone-100', icon: 'fa-dice-d6', text: 'text-sky-800', colorClass: 'from-sky-800 to-blue-900'
      };
      case ActivityType.FOOD: return { 
        bar: 'bg-amber-800', bg: active ? 'bg-amber-50' : 'bg-white', border: active ? 'border-amber-800 ring-4 ring-amber-100 shadow-lg' : 'border-stone-100', icon: 'fa-utensils', text: 'text-amber-800', colorClass: 'from-amber-800 to-stone-900'
      };
      default: return { 
        bar: 'bg-red-800', bg: active ? 'bg-pink-50' : 'bg-white', border: active ? 'border-red-800 ring-4 ring-pink-100 shadow-lg' : 'border-stone-100', icon: 'fa-heart', text: 'text-red-800', colorClass: 'from-red-800 to-stone-900'
      };
    }
  };

  const progressPercent = useMemo(() => {
    if (!currentActiveActivity) return 0;
    const start = timeToMinutes(currentActiveActivity.startTime);
    const end = timeToMinutes(currentActiveActivity.endTime, true);
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }, [currentActiveActivity, currentTime]);

  return (
    <div className="min-h-screen text-stone-900 dark:text-stone-100 dark:bg-slate-900 pb-10">
      <div className={`${viewMode === 'grid' ? 'max-w-4xl' : 'max-w-6xl'} mx-auto relative min-h-screen flex flex-col transition-all duration-700 px-3 sm:px-6`}>
        
        <header className="sticky top-0 z-50 glass-effect p-4 sm:p-5 flex flex-col gap-5 rounded-b-[2.5rem] shadow-xl border-b-2 border-stone-200/30">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-tr from-emerald-900 to-green-700 rounded-2xl flex items-center justify-center text-white shadow-2xl animate-sway text-2xl">
                🪨
              </div>
              <div>
                <h1 className="font-extrabold text-2xl tracking-tight uppercase leading-none whitespace-nowrap">Matica <span className="text-emerald-800">Ro(c)k</span></h1>
              </div>
            </div>

            {viewMode === 'grid' && (
              <div className="flex items-center gap-2 flex-grow justify-end overflow-hidden">
                <input 
                  type="text" placeholder="KÓD MATICE" value={campCode} 
                  onChange={e => setCampCode(e.target.value.toUpperCase())}
                  className="max-w-[120px] sm:max-w-[180px] h-9 bg-stone-100/50 border-2 border-stone-500 focus:border-emerald-800 focus:bg-white rounded-xl px-3 text-[10px] font-black outline-none transition-all placeholder:text-stone-500 uppercase tracking-widest"
                />
                <button onClick={loadFromCloud} className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-stone-500 bg-white border-2 border-stone-500 rounded-xl hover:text-emerald-800 transition-colors"><i className="fas fa-leaf text-base"></i></button>
                <button onClick={saveToCloud} className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-emerald-800 bg-emerald-50 border-2 border-emerald-800 rounded-xl hover:text-stone-500 transition-colors"><i className="fas fa-cloud-arrow-up text-base"></i></button>
                <button onClick={handleAddDay} className="bg-stone-500 text-white w-9 h-9 flex-shrink-0 rounded-xl hover:bg-stone-800 flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                  <i className="fas fa-plus text-base"></i>
                </button>
              </div>
            )}
            
            {viewMode === 'live' && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-emerald-800 bg-emerald-50 border border-emerald-100">
                  <i className="fas fa-clock text-xl"></i>
                </div>
                <div className="font-black text-xl tabular-nums">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
          </div>

          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
              {[
                { label: 'Prednáška', icon: 'fa-brain', color: 'bg-emerald-50 text-emerald-800 border-emerald-800'},
                { label: 'Program', icon: 'fa-dice-d6', color: 'bg-sky-50 text-sky-800 border-sky-800' },
                { label: 'Jedlo', icon: 'fa-utensils', color: 'bg-amber-50 text-amber-800 border-amber-800' },
                { label: 'Ostatné', icon: 'fa-heart', color: 'bg-pink-50 text-red-800 border-red-800' },
              ].map(item => (
                <div key={item.label} className={`flex items-center justify-center gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border-2 text-[9px] sm:text-[11px] font-black uppercase tracking-widest ${item.color}`}>
                  <i className={`fas ${item.icon}`}></i>
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 p-1 bg-stone-100/60 rounded-2xl border-0 border-stone-200/50">
            <button 
              onClick={() => setViewMode('grid')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-black uppercase tracking-widest rounded-xl transition-all border-2 ${viewMode === 'grid' ? 'bg-stone-200 text-stone-900 border-stone-800 shadow-md' : 'text-stone-400 border-stone-200'}`}
            >
              Matica
            </button>
            <button 
              onClick={() => setViewMode('live')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-black uppercase tracking-widest rounded-xl transition-all border-2 ${viewMode === 'live' ? 'bg-stone-200 text-stone-900 border-stone-800 shadow-lg' : 'text-stone-400 border-stone-200'}`}
            >
              Práve Prebieha
            </button>
          </div>
        </header>

        <div className="flex-grow pt-10">
          {viewMode === 'grid' ? (
            <main className="space-y-12">
              {days.map(day => {
                const sortedEvents = [...day.events].sort((a,b) => compareTimes(a.startTime, b.startTime));
                return (
                  <section key={day.id} className="relative">
                    <div className="flex items-center justify-between mb-8 px-2">
                      <div className="flex items-center gap-4 cursor-pointer" onClick={() => setDays(prev => prev.map(d => d.id === day.id ? {...d, isCollapsed: !d.isCollapsed} : d))}>
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${day.isCollapsed ? 'bg-stone-200 text-stone-500' : 'bg-emerald-100 text-emerald-800'}`}>
                          <i className={`fas fa-chevron-right text-xs transition-transform ${!day.isCollapsed ? 'rotate-90' : ''}`}></i>
                        </div>
                        <input 
                          type="text" value={day.date} 
                          onClick={e => e.stopPropagation()}
                          onChange={e => setDays(prev => prev.map(d => d.id === day.id ? {...d, date: e.target.value} : d))}
                          className="font-black text-stone-800 text-2xl uppercase bg-transparent outline-none w-full focus:text-emerald-800 transition-colors tracking-normal day-name-input" 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => {setTargetDayId(day.id); setIsEventModalOpen(true);}} className="w-10 h-10 bg-white dark:bg-emerald-700 border border-stone-100 dark:border-emerald-600 text-emerald-600 dark:text-white rounded-xl hover:border-emerald-200 dark:hover:border-emerald-500 shadow-sm transition-all hover:scale-105 active:scale-95"><i className="fas fa-plus"></i></button>
                        <button onClick={() => {console.log('Remove clicked for day:', day.id); handleRemoveDay(day.id);}} className="w-10 h-10 bg-white dark:bg-red-900 border border-stone-100 dark:border-red-800 text-stone-600 dark:text-red-200 rounded-xl hover:text-rose-600 dark:hover:text-red-100 shadow-sm transition-all hover:scale-105 active:scale-95"><i className="fas fa-trash-can text-sm"></i></button>
                      </div>
                    </div>

                    {!day.isCollapsed && (
                      <div className="space-y-1 timeline-line relative pl-2 pb-8">
                        {sortedEvents.map((ev, idx) => {
                          const isExpanded = expandedEventId === ev.id;
                          const active = isCurrentEvent(ev, day.date);
                          const styles = getCategoryStyles(ev.category, active);
                          const duration = getDuration(ev.startTime, ev.endTime);
                          
                          const heightPx = Math.max(50, duration * 2.5);

                          return (
                            <div key={ev.id} className="relative z-10 flex items-start gap-5 sm:gap-10 group">
                              <div className="flex flex-col items-center pt-2.5 relative z-20">
                                <div className={`w-5 h-5 rounded-full border-[3px] transition-all duration-700 ${active ? `bg-white ${styles.border.split(' ')[0]} scale-125 shadow-xl ring-4 ring-emerald-100` : 'bg-white border-stone-200 group-hover:border-stone-400'}`}></div>
                              </div>

                              <div className="flex-grow flex gap-3">
                                <div className="flex-grow">
                                  <div 
                                    onClick={() => setExpandedEventId(isExpanded ? null : ev.id)}
                                    style={{ minHeight: `${heightPx}px` }}
                                    className={`flex flex-col rounded-[1.8rem] border-2 transition-all duration-300 cursor-pointer overflow-hidden ${styles.bg} ${styles.border} ${active ? '-translate-y-1 scale-[1.01]' : 'shadow-sm hover:border-stone-300'}`}
                                  >
                                    <div className="flex flex-grow">
                                      <div className={`w-2.5 ${styles.bar}`}></div>
                                      <div className="flex-grow p-4 sm:p-5 flex flex-col justify-center overflow-hidden">
                                        <div className="flex justify-between items-center gap-4">
                                          <div className="flex flex-col overflow-hidden">
                                            <div className="flex items-center gap-2.5">
                                              <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${styles.text}`}>
                                                {ev.startTime} — {ev.endTime}
                                              </span>
                                              {active && <span className={`flex h-2 w-2 rounded-full ${styles.bar} animate-pulse`}></span>}
                                            </div>
                                            <h4 className={`text-sm sm:text-base font-bold uppercase tracking-normal leading-tight mt-0.5 ${active ? styles.text + ' italic font-black' : 'text-stone-700'} truncate`}>
                                              {ev.title}
                                            </h4>
                                          </div>
                                          
                                          <div className="flex items-center gap-4 flex-shrink-0">
                                            {(ev.responsible || ev.shadow) && (
                                              <div className="text-right flex flex-col justify-center min-w-[70px]">
                                                {ev.responsible && (
                                                  <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-tight ${styles.text}`}>
                                                    {ev.responsible}
                                                  </span>
                                                )}
                                                {ev.shadow && (
                                                  <span className="text-[9px] sm:text-[10px] font-medium text-stone-500 block leading-tight">
                                                    {ev.shadow}
                                                  </span>
                                                )}
                                              </div>
                                            )}
                                            <div className={`${active ? styles.text + ' opacity-40' : styles.text + ' opacity-20'} text-xl sm:text-2xl`}>
                                              <i className={`fas ${styles.icon}`}></i>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {active && (
                                          <div className="flex items-center gap-3 mt-3">
                                            <div className={`flex-grow ${styles.text.replace('text', 'bg')}/10 h-2 rounded-full overflow-hidden`}>
                                              <div className={`${styles.bar} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${progressPercent}%` }}></div>
                                            </div>
                                            <span className={`text-[10px] font-black ${styles.text} whitespace-nowrap tabular-nums uppercase`}>
                                              -{formatRemainingTime(getRemainingSeconds(ev.endTime))}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {isExpanded && (
                                    <div className="grid grid-cols-3 gap-3 mt-3 p-2 bg-stone-100 rounded-[1.5rem] animate-in fade-in duration-300 shadow-xl border border-stone-400/20">
                                      <button onClick={() => {setPostponingInfo({dayId: day.id, eventId: ev.id}); setIsPostponeModalOpen(true);}} className="flex flex-col items-center gap-1.5 py-3 text-stone-700 hover:text-sky-700 transition-colors">
                                        <i className="fas fa-clock text-xs"></i>
                                        <span className="text-[8px] font-black uppercase tracking-widest">Posun</span>
                                      </button>
                                      <button onClick={() => {setTargetDayId(day.id); setEditingEvent({dayId: day.id, event: ev}); setIsEventModalOpen(true);}} className="flex flex-col items-center gap-1.5 py-3 text-stone-700 hover:text-emerald-700 transition-colors">
                                        <i className="fas fa-pen-nib text-xs"></i>
                                        <span className="text-[8px] font-black uppercase tracking-widest">Upraviť</span>
                                      </button>
                                      <button onClick={() => handleDeleteEvent(day.id, ev.id)} className="flex flex-col items-center gap-1.5 py-3 text-rose-800 hover:text-rose-950 transition-colors">
                                        <i className="fas fa-trash-can text-xs"></i>
                                        <span className="text-[8px] font-black uppercase tracking-widest">Zmazať</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex flex-col gap-1 justify-center">
                                  <button 
                                    disabled={idx === 0}
                                    onClick={() => handleMoveEvent(day.id, ev.id, 'up')}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${idx === 0 ? 'text-stone-200' : 'text-stone-400 hover:bg-white hover:text-emerald-700 active:scale-90 shadow-sm'}`}
                                  >
                                    <i className="fas fa-chevron-up text-xs"></i>
                                  </button>
                                  <button 
                                    disabled={idx === sortedEvents.length - 1}
                                    onClick={() => handleMoveEvent(day.id, ev.id, 'down')}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${idx === sortedEvents.length - 1 ? 'text-stone-200' : 'text-stone-400 hover:bg-white hover:text-emerald-700 active:scale-90 shadow-sm'}`}
                                  >
                                    <i className="fas fa-chevron-down text-xs"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Plus button at the bottom of the list */}
                        <div className="relative z-10 flex items-center gap-5 sm:gap-10 pt-4">
                           <div className="w-5 h-5 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
                           </div>
                           <button 
                             onClick={() => {setTargetDayId(day.id); setIsEventModalOpen(true);}}
                             className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-stone-200 text-stone-400 hover:text-emerald-700 hover:border-emerald-200 transition-all shadow-sm active:scale-95 group"
                           >
                             <i className="fas fa-plus text-xs"></i>
                             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pridať aktivitu</span>
                           </button>
                        </div>

                        {day.events.length === 0 && (
                          <div className="ml-14 p-12 text-center border-2 border-dashed border-stone-200 rounded-[2rem] text-stone-300 text-[11px] font-black uppercase tracking-[0.4em] bg-stone-50/20">
                            Prázdny papier
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                );
              })}
            </main>
          ) : (
            <main className="flex-grow flex items-center justify-center p-4 min-h-[60vh]">
              {currentActiveActivity ? (() => {
                const styles = getCategoryStyles(currentActiveActivity.category, true);
                return (
                  <div className={`w-full max-w-6xl h-auto rounded-[3.5rem] p-6 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden transition-all duration-1000 ${styles.bg} border-4 ${styles.border.split(' ')[0]}`}>
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none rock-pattern"></div>
                    
                    <div className="absolute top-6 left-8 right-8 flex flex-wrap justify-center gap-3 text-stone-400 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] z-10">
                      <span className="bg-stone-100/50 px-5 py-2 rounded-full backdrop-blur-2xl border border-stone-200">{currentActiveActivity.startTime} — {currentActiveActivity.endTime}</span>
                      <span className={`bg-stone-100/50 px-5 py-2 rounded-full backdrop-blur-2xl border border-stone-200 capitalize ${styles.text}`}>{currentActiveActivity.category}</span>
                    </div>
                    
                    <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black ${styles.text} uppercase tracking-tight mb-2 mt-10 leading-tight animate-in zoom-in-95 duration-1000 drop-shadow-sm z-10 text-balance px-4 italic`}>
                      {currentActiveActivity.title}
                    </h2>

                    {(currentActiveActivity.responsible || currentActiveActivity.shadow) && (
                      <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-1000 z-10">
                        {currentActiveActivity.responsible && (
                          <div className={`text-lg sm:text-xl font-black uppercase tracking-tight ${styles.text}`}>
                            {currentActiveActivity.responsible}
                          </div>
                        )}
                        {currentActiveActivity.shadow && (
                          <div className="text-base sm:text-lg font-medium text-stone-500 mt-0.5">
                            {currentActiveActivity.shadow}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="relative z-10 mb-6">
                      <div className={`relative w-40 h-40 sm:w-64 sm:h-64 flex items-center justify-center ${styles.text}`}>
                        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="3" />
                          <circle 
                            cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4" 
                            strokeDasharray="276" strokeDashoffset={276 - (276 * progressPercent) / 100}
                            strokeLinecap="round" className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-[8px] sm:text-[10px] font-black opacity-60 uppercase tracking-[0.4em] mb-1">Zostáva</span>
                          <div className="text-3xl sm:text-5xl font-black tabular-nums tracking-normal">
                            {formatRemainingTime(getRemainingSeconds(currentActiveActivity.endTime))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {nextActivity && (
                      <div className="mt-4 p-4 md:p-6 bg-stone-100/50 backdrop-blur-3xl rounded-[2.5rem] border border-stone-200 w-full max-w-lg z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 overflow-hidden shadow-sm">
                        <div className="flex items-center justify-center gap-3 mb-2 opacity-50">
                          <div className="h-px bg-stone-300 flex-grow"></div>
                          <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] whitespace-nowrap">O {nextActivity.startTime}</span>
                          <div className="h-px bg-stone-300 flex-grow"></div>
                        </div>
                        <p className={`font-black text-lg sm:text-2xl uppercase truncate italic tracking-tight ${getCategoryStyles(nextActivity.category, true).text}`}>
                          {nextActivity.title}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })() : (
                <div className="text-center p-12 sm:p-20 bg-white/95 backdrop-blur-xl rounded-[4rem] border-4 border-stone-50 shadow-2xl w-full max-w-3xl transform transition-all overflow-hidden relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-stone-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 text-stone-200 animate-sway border border-stone-100">
                    <i className="fas fa-campground text-4xl sm:text-5xl opacity-10"></i>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black text-stone-900 uppercase mb-4 tracking-normal italic">Voľný Čas</h2>
                  <p className="text-stone-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.5em] px-8 leading-relaxed">Aktuálne nie je naplánovaný žiaden program</p>
                  
                  {nextActivity && (
                    <div className="mt-16 pt-12 border-t-2 border-stone-50 relative">
                      <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.6em] block mb-8">Priprav sa na</span>
                      <div className="bg-stone-50/50 p-8 rounded-[3rem] border border-stone-100 shadow-sm">
                        <span className={`font-black text-2xl block mb-2 ${getCategoryStyles(nextActivity.category, true).text}`}>{nextActivity.startTime}</span>
                        <p className="text-stone-950 font-black uppercase text-2xl sm:text-4xl leading-tight line-clamp-2 italic tracking-tight">{nextActivity.title}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </main>
          )}
        </div>
      </div>

      <Modal isOpen={isEventModalOpen} onClose={() => {setIsEventModalOpen(false); setEditingEvent(null);}} title={editingEvent ? 'Zmeniť Aktivitu' : 'Pridať Novú'}>
        <EventForm 
          event={editingEvent?.event} 
          defaultStartTime={targetDayId ? (days.find(d => d.id === targetDayId)?.events.length ? [...days.find(d => d.id === targetDayId)!.events].sort((a,b) => compareTimes(a.startTime, b.startTime)).pop()!.endTime : '07:00') : '07:00'}
          onCancel={() => {setIsEventModalOpen(false); setEditingEvent(null);}} 
          onSubmit={handleAddOrEditEvent}
        />
      </Modal>

      <Modal isOpen={isPostponeModalOpen} onClose={() => setIsPostponeModalOpen(false)} title="Časový Posun">
        <PostponeForm onCancel={() => setIsPostponeModalOpen(false)} onPostpone={handlePostpone} />
      </Modal>
    </div>
  );
};

export default App;