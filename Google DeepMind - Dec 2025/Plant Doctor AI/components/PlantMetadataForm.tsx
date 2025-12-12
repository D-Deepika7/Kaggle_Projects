import React, { useState } from 'react';
    import { ChevronDown, ChevronUp, Sprout, Sun, Droplets, FlaskConical } from 'lucide-react';
    import { PlantMetadata } from '../types';
    import { COMMON_PLANTS } from '../constants';
    
    interface PlantMetadataFormProps {
      metadata: PlantMetadata;
      onChange: (key: keyof PlantMetadata, value: string) => void;
    }
    
    const PlantMetadataForm: React.FC<PlantMetadataFormProps> = ({ metadata, onChange }) => {
      const [isOpen, setIsOpen] = useState(false);
      const [suggestions, setSuggestions] = useState<string[]>([]);
    
      const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        onChange('plantName', val);
        if (val.length > 1) {
          const filtered = COMMON_PLANTS.filter(p => p.toLowerCase().includes(val.toLowerCase()));
          setSuggestions(filtered.slice(0, 5));
        } else {
          setSuggestions([]);
        }
      };
    
      const selectSuggestion = (name: string) => {
        onChange('plantName', name);
        setSuggestions([]);
      };
    
      return (
        <div className="w-full bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden mt-6">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 transition-colors"
          >
            <div className="flex items-center text-stone-800 font-semibold">
              <Sprout className="w-5 h-5 mr-2 text-emerald-600" />
              Add More Information (Optional)
            </div>
            {isOpen ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
          </button>
    
          {isOpen && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
              
              {/* Plant Name with Autocomplete */}
              <div className="relative">
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Plant Name</label>
                <input
                  type="text"
                  value={metadata.plantName}
                  onChange={handleNameChange}
                  placeholder="e.g. Monstera"
                  className="w-full p-2.5 rounded-lg border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-stone-200 rounded-lg mt-1 shadow-lg">
                    {suggestions.map((s) => (
                      <li 
                        key={s} 
                        onClick={() => selectSuggestion(s)}
                        className="px-4 py-2 hover:bg-emerald-50 cursor-pointer text-sm text-stone-700"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
    
              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Growth Stage</label>
                <select 
                  value={metadata.age}
                  onChange={(e) => onChange('age', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-200 bg-white focus:border-emerald-500 outline-none"
                >
                  <option value="">Select...</option>
                  <option value="Seedling">Seedling</option>
                  <option value="Young">Young</option>
                  <option value="Mature">Mature</option>
                  <option value="Flowering">Flowering</option>
                  <option value="Not Sure">Not Sure</option>
                </select>
              </div>
    
              {/* Environment */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1 flex items-center">
                  <Sun className="w-3 h-3 mr-1" /> Environment
                </label>
                <div className="flex gap-2 mb-2">
                  {['Indoor', 'Outdoor'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => onChange('environment', opt)}
                      className={`flex-1 py-1.5 text-sm rounded-md border ${metadata.environment === opt ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-white border-stone-200 text-stone-600'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <select 
                  value={metadata.sunlight}
                  onChange={(e) => onChange('sunlight', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-200 bg-white text-sm"
                >
                  <option value="">Sunlight Exposure...</option>
                  <option value="Full Sun">Full Sun</option>
                  <option value="Partial Shade">Partial Shade</option>
                  <option value="Low Light">Low Light</option>
                </select>
              </div>
    
              {/* Care */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1 flex items-center">
                  <Droplets className="w-3 h-3 mr-1" /> Care Details
                </label>
                <input 
                  type="text"
                  value={metadata.watering}
                  onChange={(e) => onChange('watering', e.target.value)}
                  placeholder="Days since last water..."
                  className="w-full p-2.5 rounded-lg border border-stone-200 mb-2 text-sm"
                />
                <div className="flex gap-2">
                   <select 
                    value={metadata.fertilizer}
                    onChange={(e) => onChange('fertilizer', e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-stone-200 bg-white text-sm"
                   >
                     <option value="">Fertilizer?</option>
                     <option value="Yes">Yes</option>
                     <option value="No">No</option>
                   </select>
                   <select 
                    value={metadata.potted}
                    onChange={(e) => onChange('potted', e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-stone-200 bg-white text-sm"
                   >
                     <option value="">Location?</option>
                     <option value="Potted">Potted</option>
                     <option value="Ground">In Ground</option>
                   </select>
                </div>
              </div>
    
              {/* Free Text */}
              <div className="md:col-span-2">
                 <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Previous Issues / Recent Changes</label>
                 <textarea
                   value={metadata.previousIssues}
                   onChange={(e) => onChange('previousIssues', e.target.value)}
                   placeholder="E.g. Moved to a new room, saw bugs last week..."
                   className="w-full p-2.5 rounded-lg border border-stone-200 text-sm h-20"
                 />
              </div>
    
            </div>
          )}
        </div>
      );
    };
    
    export default PlantMetadataForm;
    