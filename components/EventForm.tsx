import React, { useState, useEffect } from 'react';
import { ScoutEvent, ActivityType } from '../types';
import { addMinutes } from '../utils/time';

interface EventFormProps {
  event?: ScoutEvent | null;
  defaultStartTime?: string;
  onSubmit: (data: Omit<ScoutEvent, 'id'>) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, defaultStartTime, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(event?.title || '');
  const [startTime, setStartTime] = useState(event?.startTime || defaultStartTime || '07:00');
  const [endTime, setEndTime] = useState(event?.endTime || '08:00');
  const [category, setCategory] = useState<ActivityType>(event?.category || ActivityType.OTHER);
  const [responsible, setResponsible] = useState(event?.responsible || '');
  const [shadow, setShadow] = useState(event?.shadow || '');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
      setCategory(event.category);
      setResponsible(event.responsible || '');
      setShadow(event.shadow || '');
    } else if (defaultStartTime && !event) {
      setStartTime(defaultStartTime);
      setEndTime(addMinutes(defaultStartTime, 60));
    }
  }, [event, defaultStartTime]);

  const handleStartTimeChange = (val: string) => {
    setStartTime(val);
    setEndTime(addMinutes(val, 60));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, startTime, endTime, category, responsible, shadow });
  };

  const categories = [
    { label: 'Prednáška', value: ActivityType.LECTURE, color: 'bg-emerald-800', textColor: 'text-emerald-800', bgColor: 'bg-emerald-50', icon: 'fa-brain' },
    { label: 'Program', value: ActivityType.PROGRAM, color: 'bg-sky-800', textColor: 'text-sky-800', bgColor: 'bg-sky-50', icon: 'fa-dice-d6' },
    { label: 'Jedlo', value: ActivityType.FOOD, color: 'bg-amber-800', textColor: 'text-amber-800', bgColor: 'bg-amber-50', icon: 'fa-utensils' },
    { label: 'Ostatné', value: ActivityType.OTHER, color: 'bg-red-800', textColor: 'text-red-800', bgColor: 'bg-pink-50', icon: 'fa-heart' },
  ];

  const inputClasses = "w-full px-5 py-3 bg-stone-50 border-2 border-stone-200 focus:border-emerald-400 focus:bg-white rounded-xl outline-none text-base font-bold transition-all placeholder:text-stone-300 shadow-inner";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[10px] font-black text-stone-400 mb-2 uppercase tracking-[0.4em] ml-2">Názov Bloku</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClasses}
            placeholder="Názov aktivity..."
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-stone-400 mb-2 uppercase tracking-[0.4em] ml-2">Kategória</label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-2 px-3 py-2 border-2 rounded-lg transition-all group ${
                  category === cat.value 
                    ? `border-stone-300 bg-stone-200 text-stone-700 shadow-sm` 
                    : `border-stone-50 bg-stone-50 text-stone-400 hover:border-stone-200`
                }`}
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center transition-all flex-shrink-0 ${category === cat.value ? 'bg-stone-800 text-white' : cat.color + ' text-white shadow-sm'}`}>
                  <i className={`fas ${cat.icon} text-[10px]`}></i>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-left truncate">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-[10px] font-black text-stone-400 mb-2 uppercase tracking-[0.4em] ml-2">Zodpovedný</label>
          <input
            type="text"
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            className={inputClasses}
            placeholder="Meno..."
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-stone-400 mb-2 uppercase tracking-[0.4em] ml-2">Tieň</label>
          <input
            type="text"
            value={shadow}
            onChange={(e) => setShadow(e.target.value)}
            className={inputClasses}
            placeholder="Meno..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black text-stone-400 mb-2 uppercase tracking-[0.4em] ml-2">Začiatok</label>
          <input
            type="time"
            required
            step="300"
            value={startTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-stone-400 mb-2 uppercase tracking-[0.4em] ml-2">Koniec</label>
          <input
            type="time"
            required
            step="300"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 text-[10px] font-black text-stone-500 bg-stone-100 rounded-xl hover:bg-stone-200 transition-all uppercase tracking-[0.2em]"
        >
          Zrušiť
        </button>
        <button
          type="submit"
          className="flex-[2] py-3 text-[10px] font-black text-white bg-stone-800 rounded-xl hover:bg-stone-900 transition-all shadow-md uppercase tracking-[0.2em]"
        >
          {event ? 'Uložiť zmeny' : 'Vytvoriť aktivitu'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;