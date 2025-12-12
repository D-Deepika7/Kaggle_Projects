import React from 'react';
import { History, ArrowRight } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryStripProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const HistoryStrip: React.FC<HistoryStripProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 mb-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider flex items-center">
          <History className="w-4 h-4 mr-2" /> Your Recent Diagnoses
        </h3>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="flex-shrink-0 w-64 bg-white p-3 rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all text-left snap-start group"
          >
            <div className="flex gap-3">
              <img 
                src={item.thumbnail} 
                alt="thumb" 
                className="w-16 h-16 rounded-lg object-cover bg-stone-100"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-stone-800 text-sm truncate">{item.plantName || "Unknown Plant"}</p>
                <p className="text-emerald-600 text-xs font-medium truncate mb-1">{item.diagnosis}</p>
                <p className="text-stone-400 text-[10px]">{new Date(item.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryStrip;
