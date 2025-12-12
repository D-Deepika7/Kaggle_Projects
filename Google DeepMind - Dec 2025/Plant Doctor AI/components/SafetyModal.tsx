import React from 'react';
import { ShieldAlert, Info, X, CheckSquare, AlertTriangle } from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-stone-100">
        
        <div className="p-6 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-stone-800 flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-emerald-600" />
            Safety & Accuracy
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-stone-600 leading-relaxed">
            Plant Doctor AI provides evidence-based suggestions using image analysis and plant metadata. 
            <strong className="block mt-2 text-stone-800">Important: This tool is for informational and educational purposes only. It is not a replacement for professional horticultural or plant pathology advice.</strong>
          </p>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
             <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide mb-2 flex items-center">
               <AlertTriangle className="w-4 h-4 mr-2" /> Accuracy & Limitations
             </h3>
             <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-amber-900/80">
               <li>The AI estimates diagnosis confidence (0–100%). Treat results with caution when confidence is under 60%.</li>
               <li>For ambiguous cases, we highly recommend consulting a local nursery.</li>
               <li>Community feedback helps us track accuracy; consider the "User-validated accuracy" metrics when available.</li>
             </ul>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
             <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-2 flex items-center">
               <Info className="w-4 h-4 mr-2" /> Safety with Treatments
             </h3>
             <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-blue-900/80">
               <li>For any chemical treatment (fungicides, insecticides), <strong>always read and follow the product label</strong>.</li>
               <li>Wear appropriate PPE (gloves, eye protection) and keep pets/children away while treating.</li>
               <li>Do not mix household remedies with commercial pesticides unless explicitly recommended.</li>
             </ul>
          </div>
          
          <div className="text-xs text-stone-400 pt-4 border-t border-stone-100">
            <p>Privacy: You control whether we save your photos to history via Settings. Shared images may be used for model improvement with permission.</p>
          </div>
        </div>

        <div className="p-4 border-t border-stone-100 bg-stone-50 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center"
          >
            <CheckSquare className="w-4 h-4 mr-2" /> I Understand
          </button>
        </div>

      </div>
    </div>
  );
};

export default SafetyModal;
