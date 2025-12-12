import React, { useState } from 'react';
import { Zap, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { PlantDiagnosis } from '../types';
import SafetyModal from './SafetyModal';

interface QuickSummaryProps {
  data: PlantDiagnosis;
}

const QuickSummary: React.FC<QuickSummaryProps> = ({ data }) => {
  const [showSafety, setShowSafety] = useState(false);

  const getSeverityColor = (s: string) => {
    switch (s) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-stone-600 bg-stone-50';
    }
  };

  const primaryAction = data.recommended_steps.find(s => s.duration === 'immediate')?.action || data.recommended_steps[0]?.action || "Review care plan";

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-emerald-500 border-y border-r border-stone-100 mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center text-sm font-bold text-stone-400 uppercase tracking-wide mb-1">
              <Zap className="w-4 h-4 mr-1 text-emerald-500" />
              Quick Diagnosis
            </div>
            <h2 className="text-2xl font-bold text-stone-800">
              {data.plant_name_identified || "Your Plant"}
            </h2>
            <p className="text-lg text-emerald-800 font-medium mt-1">
              Detected: <span className="underline decoration-emerald-300 decoration-2 underline-offset-2">{data.diagnosis}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className={`px-4 py-2 rounded-xl border flex flex-col justify-center ${getSeverityColor(data.severity)}`}>
                <span className="text-xs font-bold uppercase opacity-80">Severity</span>
                <span className="font-bold capitalize flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1.5" />
                  {data.severity}
                </span>
            </div>
            
            <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white flex flex-col justify-center shadow-lg shadow-emerald-200">
                <span className="text-xs font-bold uppercase opacity-80 text-emerald-100">Action</span>
                <span className="font-bold flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  {primaryAction.length > 25 ? primaryAction.substring(0, 25) + '...' : primaryAction}
                </span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Badge */}
      <div className="bg-stone-100 rounded-xl p-3 mb-8 flex items-start justify-between border border-stone-200">
        <div className="flex items-start text-xs text-stone-600">
          <ShieldAlert className="w-4 h-4 text-stone-400 mr-2 flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-stone-700">Safety note:</strong> This diagnosis is AI-assisted and may be incorrect. Not a substitute for professional advice. Always follow product labels.
          </p>
        </div>
        <button 
          onClick={() => setShowSafety(true)}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 whitespace-nowrap ml-4 underline"
        >
          More on safety
        </button>
      </div>

      <SafetyModal isOpen={showSafety} onClose={() => setShowSafety(false)} />
    </>
  );
};

export default QuickSummary;
