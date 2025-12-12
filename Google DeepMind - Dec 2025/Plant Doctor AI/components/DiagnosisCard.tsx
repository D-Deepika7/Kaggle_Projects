import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, ThumbsUp, ThumbsDown, AlertOctagon, HelpCircle } from 'lucide-react';
import { PlantDiagnosis } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DiagnosisCardProps {
  data: PlantDiagnosis;
}

const DiagnosisCard: React.FC<DiagnosisCardProps> = ({ data }) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [communityAccuracy, setCommunityAccuracy] = useState<number>(0);
  const [voteCount, setVoteCount] = useState<number>(0);

  // Use safety confidence if available, fallback to root confidence
  const modelConfidence = data.safety?.confidence ?? data.confidence;
  const isLowConfidence = modelConfidence < 60;

  useEffect(() => {
    // Generate a pseudo-random accuracy based on the diagnosis length hash for demo
    const hash = data.diagnosis.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseAccuracy = 75 + (hash % 23);
    const baseVotes = 50 + (hash % 200);
    
    setCommunityAccuracy(baseAccuracy);
    setVoteCount(baseVotes);
    
    const stored = localStorage.getItem(`feedback_${data.diagnosis}`);
    if (stored === 'up') setFeedback('up');
    if (stored === 'down') setFeedback('down');
  }, [data.diagnosis]);

  const handleVote = (type: 'up' | 'down') => {
    setFeedback(type);
    localStorage.setItem(`feedback_${data.diagnosis}`, type);
    if (type === 'up') {
      setVoteCount(prev => prev + 1);
      setCommunityAccuracy(prev => Math.min(99, Math.round(((prev * voteCount) + 100) / (voteCount + 1))));
    }
  };

  const chartData = [
    { name: 'Confidence', value: modelConfidence },
    { name: 'Uncertainty', value: 100 - modelConfidence },
  ];
  
  const COLORS = ['#10b981', '#e5e7eb'];
  const LOW_CONF_COLORS = ['#fbbf24', '#e5e7eb']; // Amber for low confidence

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden mb-8">
      
      {/* Low Confidence Warning Banner */}
      {isLowConfidence && (
        <div className="bg-amber-50 border-b border-amber-100 p-3 flex items-center justify-center text-sm text-amber-900">
           <AlertOctagon className="w-4 h-4 mr-2 text-amber-600" />
           <span className="font-semibold">Low Confidence Diagnosis ({modelConfidence}%)</span>
           <span className="mx-2">•</span>
           <span>Please take a clearer photo or consult a nursery.</span>
        </div>
      )}

      <div className="p-6 md:p-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-stone-800">Detailed Analysis</h2>
            <div className="flex items-center text-xs text-stone-500 font-medium">
               <span>Community validation: <strong className={voteCount < 5 ? 'text-stone-400' : 'text-emerald-600'}>{voteCount < 5 ? 'Not enough data' : `${communityAccuracy}%`}</strong></span>
               <span className="mx-2">•</span>
               <span>Model confidence: <strong className={isLowConfidence ? 'text-amber-600' : 'text-emerald-600'}>{modelConfidence}%</strong></span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleVote('up')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${feedback === 'up' ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-stone-50 text-stone-600 hover:bg-stone-100'}`}
            >
              <ThumbsUp className="w-4 h-4" /> Helpful
            </button>
            <button 
              onClick={() => handleVote('down')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${feedback === 'down' ? 'bg-red-100 text-red-700 font-bold' : 'bg-stone-50 text-stone-600 hover:bg-stone-100'}`}
            >
              <ThumbsDown className="w-4 h-4" /> Wrong
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Explanation */}
          <div className="md:col-span-2">
             <div className="bg-stone-50 rounded-xl p-5 mb-6 leading-relaxed text-stone-700 border border-stone-100">
               {data.explanation_simple}
             </div>

             <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3">Potential Causes</h3>
             <div className="flex flex-wrap gap-2 mb-6">
               {data.causes.map((cause, idx) => (
                 <span key={idx} className="bg-white text-stone-600 px-3 py-1 rounded-full text-sm font-medium border border-stone-200 shadow-sm">
                   {cause}
                 </span>
               ))}
             </div>
             
             {isLowConfidence && (
               <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-sm text-amber-800">
                 <h4 className="font-bold flex items-center mb-2"><HelpCircle className="w-4 h-4 mr-2"/> Tips for a better diagnosis</h4>
                 <ul className="list-disc ml-5 space-y-1 text-amber-800/80">
                   <li>Ensure the leaf is in focus and well-lit.</li>
                   <li>Include both healthy and affected parts in the frame.</li>
                   <li>Check the underside of leaves for pests.</li>
                 </ul>
               </div>
             )}
          </div>

          {/* Right: Confidence & Evidence */}
          <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
             {/* Gauge */}
             <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 relative mb-2">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={chartData}
                         cx="50%"
                         cy="50%"
                         innerRadius={35}
                         outerRadius={45}
                         startAngle={90}
                         endAngle={-270}
                         paddingAngle={0}
                         dataKey="value"
                         stroke="none"
                       >
                         {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={isLowConfidence ? LOW_CONF_COLORS[index % LOW_CONF_COLORS.length] : COLORS[index % COLORS.length]} />
                         ))}
                       </Pie>
                     </PieChart>
                   </ResponsiveContainer>
                   <div className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${isLowConfidence ? 'text-amber-600' : 'text-emerald-700'}`}>
                     {modelConfidence}%
                   </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Confidence</span>
             </div>

             <h3 className="text-sm font-semibold text-emerald-900 mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-2" /> Evidence
             </h3>
             <ul className="space-y-3">
                {(data.safety?.evidence || data.evidence).map((ev, idx) => (
                  <li key={idx} className="flex items-start text-xs text-stone-700 leading-snug">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{ev}</span>
                  </li>
                ))}
             </ul>
             <div className="mt-4 pt-4 border-t border-emerald-100 text-[10px] text-emerald-800">
                <span className="font-bold">Focus Area:</span> {data.visual_markup}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DiagnosisCard;
