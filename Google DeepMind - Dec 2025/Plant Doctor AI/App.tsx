import React, { useState, useEffect } from 'react';
import { analyzePlantImage } from './services/geminiService';
import { AnalysisState, PlantMetadata, HistoryItem } from './types';
import ImageUpload from './components/ImageUpload';
import DiagnosisCard from './components/DiagnosisCard';
import PlanTimeline from './components/PlanTimeline';
import QuickSummary from './components/QuickSummary';
import ChatInterface from './components/ChatInterface';
import PlantMetadataForm from './components/PlantMetadataForm';
import HistoryStrip from './components/HistoryStrip';
import CustomCursor from './components/CustomCursor';
import { Sprout, AlertCircle, Leaf, Settings } from 'lucide-react';
import { APP_NAME, TAGLINE } from './constants';

const INITIAL_METADATA: PlantMetadata = {
  plantName: '',
  age: '',
  environment: 'Indoor',
  sunlight: '',
  watering: '',
  fertilizer: '',
  soilType: '',
  potted: '',
  recentChanges: '',
  previousIssues: ''
};

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null,
    imagePreview: null,
    metadata: INITIAL_METADATA
  });

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [cursorEffectsEnabled, setCursorEffectsEnabled] = useState(true);

  // Load history from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('plant_doctor_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const addToHistory = (diagnosis: any, imgPreview: string, metadata: PlantMetadata) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      thumbnail: imgPreview,
      diagnosis: diagnosis.diagnosis,
      plantName: metadata.plantName || diagnosis.plant_name_identified || "Unknown",
      result: diagnosis
    };

    const newHistory = [newItem, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('plant_doctor_history', JSON.stringify(newHistory));
  };

  const handleMetadataChange = (key: keyof PlantMetadata, value: string) => {
    setState(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [key]: value }
    }));
  };

  const handleImageSelect = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      const mimeType = file.type;

      setState(prev => ({ 
        ...prev, 
        imagePreview: base64String, 
        isLoading: true, 
        error: null,
        result: null
      }));

      try {
        const diagnosis = await analyzePlantImage(base64Data, mimeType, state.metadata);
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          result: diagnosis
        }));

        addToHistory(diagnosis, base64String, state.metadata);

      } catch (error) {
        console.error("Analysis Failed", error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: "Could not analyze the image. Please try a clearer photo or check your connection."
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const restoreHistoryItem = (item: HistoryItem) => {
    setState(prev => ({
      ...prev,
      result: item.result,
      imagePreview: item.thumbnail,
      isLoading: false,
      error: null
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClear = () => {
    setState({
      isLoading: false,
      result: null,
      error: null,
      imagePreview: null,
      metadata: INITIAL_METADATA
    });
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-x-hidden">
      <CustomCursor enabled={cursorEffectsEnabled} />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
         {/* Hero Blur */}
         <div className="absolute top-0 left-0 right-0 h-[500px] bg-emerald-100/30 blur-[100px] rounded-full translate-y-[-50%]"></div>
         
         {/* Botanical diagrams (simplified as circles/paths for this implementation) */}
         <svg className="absolute -left-20 top-40 w-96 h-96 opacity-[0.03] text-stone-900 rotate-[-10deg] hidden md:block" viewBox="0 0 100 100" fill="currentColor">
           <path d="M50 0 C20 0 0 20 0 50 S20 100 50 100 S100 80 100 50 S80 0 50 0 Z M50 90 C30 90 10 70 10 50 S30 10 50 10 S90 30 90 50 S70 90 50 90 Z" />
         </svg>
         <svg className="absolute -right-20 bottom-40 w-[500px] h-[500px] opacity-[0.04] text-emerald-900 rotate-[15deg] hidden md:block" viewBox="0 0 100 100" fill="currentColor">
            <path d="M10 50 Q 50 0 90 50 T 10 50" />
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none"/>
         </svg>
      </div>

      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleClear}>
            <div className="bg-emerald-600 p-1.5 rounded-lg shadow-emerald-200 shadow-md">
               <Sprout className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-stone-800 tracking-tight">{APP_NAME}</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <span className="text-xs font-medium text-stone-400 hidden sm:block bg-stone-50 px-3 py-1 rounded-full border border-stone-100">{TAGLINE}</span>
             
             {/* Settings Toggle for Cursor */}
             <button 
               onClick={() => setCursorEffectsEnabled(!cursorEffectsEnabled)}
               className={`p-2 rounded-full transition-colors ${cursorEffectsEnabled ? 'text-emerald-600 bg-emerald-50' : 'text-stone-400 bg-stone-50'}`}
               title="Toggle Cursor Effects"
             >
               <Settings className="w-4 h-4" />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {!state.result && !state.isLoading && <HistoryStrip history={history} onSelect={restoreHistoryItem} />}

        <div className={`transition-all duration-700 ease-in-out ${state.result ? 'mb-8' : 'mb-0'}`}>
          {!state.result && !state.imagePreview && (
             <div className="text-center mb-10 animate-in fade-in zoom-in duration-500">
                <h2 className="text-4xl md:text-5xl font-extrabold text-stone-800 mb-4 tracking-tight">
                  Heal your plants with <span className="text-emerald-600 relative inline-block">
                    AI
                    <svg className="absolute -bottom-2 w-full h-3 text-emerald-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span>
                </h2>
                <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
                  Upload a photo of any sick plant. Our advanced diagnostics will identify pathogens, pests, or deficiencies and build a custom recovery plan.
                </p>
             </div>
          )}

          <div className={`max-w-3xl mx-auto transition-all ${state.result ? 'scale-95 opacity-90' : 'scale-100'}`}>
            <ImageUpload 
              onImageSelect={handleImageSelect}
              selectedImage={state.imagePreview}
              onClear={handleClear}
              isLoading={state.isLoading}
            />
            
            {!state.result && !state.isLoading && (
              <PlantMetadataForm 
                metadata={state.metadata} 
                onChange={handleMetadataChange} 
              />
            )}
          </div>
        </div>

        {state.error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start text-red-700 animate-in shake">
            <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <p>{state.error}</p>
          </div>
        )}

        {state.result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {state.result.unclear ? (
               <div className="max-w-3xl mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
                 <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-amber-900 mb-2">Image Unclear</h3>
                 <p className="text-amber-800 mb-4">{state.result.advice || "We couldn't clearly identify a plant or an issue in this image."}</p>
                 <button 
                   onClick={handleClear}
                   className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition font-semibold shadow-lg shadow-amber-200"
                 >
                   Try Another Photo
                 </button>
               </div>
            ) : (
              <>
                <QuickSummary data={state.result} />
                <DiagnosisCard data={state.result} />
                <PlanTimeline data={state.result} />
                <ChatInterface />
                
                <div className="text-center mt-12 pb-8 border-t border-stone-200 pt-8">
                  <p className="text-xs text-stone-400 flex items-center justify-center gap-2">
                    <Leaf className="w-3 h-3" />
                    Generated by AI. Always consult a local specialist for critical crop issues.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
