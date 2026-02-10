import React, { useState } from 'react';
import { PostponeType } from '../types';

interface PostponeFormProps {
  onPostpone: (minutes: number, type: PostponeType) => void;
  onCancel: () => void;
}

const PostponeForm: React.FC<PostponeFormProps> = ({ onPostpone, onCancel }) => {
  const [minutes, setMinutes] = useState(15);
  const [type, setType] = useState<PostponeType>(PostponeType.CASCADE);

  return (
    <form onSubmit={e => { e.preventDefault(); onPostpone(minutes, type); }} className="space-y-8">
      <div className="grid grid-cols-4 gap-3">
        {[5, 10, 15, 30].map(v => (
          <button
            key={v} type="button" onClick={() => setMinutes(v)}
            className={`py-3 text-xs font-black rounded-xl transition-all ${minutes === v ? 'bg-stone-800 text-white shadow-lg' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'}`}
          >
            +{v}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] block ml-2">Dosah zmeny</label>
        <div className="space-y-2.5">
          {[
            { id: PostponeType.SINGLE, label: 'Iba tento jeden', sub: 'Ostatné ostávajú fixné', icon: 'fa-circle-dot' },
            { id: PostponeType.CASCADE, label: 'Kaskádový posun', sub: 'Posun celého zvyšku dňa', icon: 'fa-water' }
          ].map(opt => (
            <label key={opt.id} className={`flex items-center gap-4 p-4 border-2 rounded-[1.8rem] cursor-pointer transition-all ${type === opt.id ? 'border-emerald-600 bg-emerald-50/30' : 'border-stone-50 bg-stone-50/50 hover:border-stone-200'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${type === opt.id ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-300'}`}>
                <i className={`fas ${opt.icon} text-sm`}></i>
              </div>
              <div className="flex-grow">
                <span className={`block text-[12px] font-black uppercase tracking-tight ${type === opt.id ? 'text-emerald-900' : 'text-stone-700'}`}>{opt.label}</span>
                <span className="block text-[10px] text-stone-400 font-medium">{opt.sub}</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${type === opt.id ? 'border-emerald-600 bg-emerald-600' : 'border-stone-200 bg-white'}`}>
                {type === opt.id && <i className="fas fa-check text-[8px] text-white"></i>}
              </div>
              <input type="radio" checked={type === opt.id} onChange={() => setType(opt.id as PostponeType)} className="hidden" />
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-4 text-[11px] font-black text-stone-400 bg-stone-50 rounded-[1.5rem] hover:bg-stone-100 transition-all uppercase tracking-widest">Späť</button>
        <button type="submit" className="flex-[2] py-4 text-[11px] font-black text-white bg-stone-800 rounded-[1.5rem] shadow-xl hover:bg-stone-900 transition-all uppercase tracking-widest">Zmeniť čas</button>
      </div>
    </form>
  );
};

export default PostponeForm;