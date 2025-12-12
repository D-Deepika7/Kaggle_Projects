import React from 'react';
import { Calendar, Clock, PenTool, Droplets, ShieldCheck, ClipboardList } from 'lucide-react';
import { PlantDiagnosis, RecommendedStep } from '../types';

interface PlanTimelineProps {
  data: PlantDiagnosis;
}

const PlanTimeline: React.FC<PlanTimelineProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Immediate Steps Column */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
        <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-emerald-600" />
          Immediate Actions
        </h3>
        <div className="space-y-4">
          {data.recommended_steps.map((stepItem: RecommendedStep) => (
            <div key={stepItem.step} className="flex gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100 hover:border-emerald-200 transition-colors">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {stepItem.step}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-stone-800 mb-1">{stepItem.action}</h4>
                <div className="flex items-center gap-4 text-xs text-stone-500 mt-2">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {stepItem.duration}
                  </span>
                  <span className="flex items-center">
                    <PenTool className="w-3 h-3 mr-1" /> {stepItem.tools.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Preventive Tips in the same column for flow */}
        <div className="mt-8 pt-6 border-t border-stone-100">
           <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4 flex items-center">
             <ShieldCheck className="w-4 h-4 mr-2" /> Prevention
           </h3>
           <ul className="space-y-2">
             {data.preventive_tips.map((tip, idx) => (
               <li key={idx} className="flex items-start text-sm text-stone-600">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-2 flex-shrink-0"></span>
                 {tip}
               </li>
             ))}
           </ul>
        </div>
      </div>

      {/* 7-Day Plan Column */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 flex flex-col">
        <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          7-Day Recovery Plan
        </h3>
        
        <div className="flex-1 relative pl-4 border-l-2 border-stone-100 space-y-6 py-2">
          {Object.entries(data.seven_day_care_plan).map(([dayKey, activity], index) => {
            const dayNum = index + 1;
            const isToday = index === 0;
            return (
              <div key={dayKey} className="relative pl-6">
                <span className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${isToday ? 'bg-blue-600 shadow-md ring-2 ring-blue-100' : 'bg-stone-300'}`}></span>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                    <span className={`text-xs font-bold uppercase tracking-wider w-12 ${isToday ? 'text-blue-600' : 'text-stone-400'}`}>
                        Day {dayNum}
                    </span>
                    <p className="text-sm text-stone-700 flex-1">{activity}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Follow Up Section */}
         <div className="mt-8 pt-6 border-t border-stone-100 bg-blue-50/30 -mx-6 -mb-6 p-6 rounded-b-2xl">
           <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-3 flex items-center">
             <ClipboardList className="w-4 h-4 mr-2" /> Follow Up
           </h3>
           <div className="flex flex-wrap gap-2">
              {data.follow_up_tests.map((test, idx) => (
                <span key={idx} className="bg-white text-blue-700 border border-blue-100 px-3 py-1.5 rounded-md text-sm shadow-sm">
                  {test}
                </span>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default PlanTimeline;
