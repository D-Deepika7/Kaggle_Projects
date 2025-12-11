import React, { useState } from 'react';
import { AppTab, BannerRequest, BannerSpec } from './types';
import { generateBannerStrategy } from './services/geminiService';
import BannerPreview from './components/BannerPreview';
import ChatInterface from './components/ChatInterface';
import ImageAnalyzer from './components/ImageAnalyzer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.GENERATOR);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSpec, setGeneratedSpec] = useState<BannerSpec | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<BannerRequest>({
    brandName: '',
    productName: '',
    campaignGoal: '',
    targetAudience: '',
    dimensions: '300x250',
    tone: 'Professional & Trustworthy'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedSpec(null);
    try {
      const spec = await generateBannerStrategy(formData);
      setGeneratedSpec(spec);
    } catch (error) {
      alert("Failed to generate banner. Please check API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0 z-20">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            BannerCraft
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">AI Creative Suite</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab(AppTab.GENERATOR)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === AppTab.GENERATOR 
              ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>
            <span className="font-medium">Generator</span>
          </button>
          
          <button
            onClick={() => setActiveTab(AppTab.CHAT)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === AppTab.CHAT 
              ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
            <span className="font-medium">AI Chat</span>
          </button>

          <button
            onClick={() => setActiveTab(AppTab.ANALYZER)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === AppTab.ANALYZER 
              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            <span className="font-medium">Visual Analyzer</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 bg-gray-800/50 p-3 rounded border border-gray-700">
                <p className="font-bold mb-1">Model Info</p>
                <p>Gemini 3 Pro Preview</p>
                <p className="mt-1">Thinking Budget: 32k</p>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-full p-8 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-gray-900 pointer-events-none -z-10"></div>
        
        {activeTab === AppTab.GENERATOR && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-xl">
                <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    Campaign Details
                </h2>
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Brand Name</label>
                    <input name="brandName" value={formData.brandName} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="e.g. Acme Corp" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Product/Service</label>
                    <input name="productName" value={formData.productName} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="e.g. Cloud Storage Pro" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Campaign Goal</label>
                    <input name="campaignGoal" value={formData.campaignGoal} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="e.g. Increase signups by 20%" required />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-400 mb-1">Target Audience</label>
                    <input name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="e.g. Small business owners" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Size</label>
                        <select name="dimensions" value={formData.dimensions} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all">
                            <option value="300x250">300x250 (Medium Rec)</option>
                            <option value="728x90">728x90 (Leaderboard)</option>
                            <option value="160x600">160x600 (Skyscraper)</option>
                            <option value="320x50">320x50 (Mobile)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Tone</label>
                        <select name="tone" value={formData.tone} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all">
                            <option>Professional</option>
                            <option>Playful & Witty</option>
                            <option>Urgent</option>
                            <option>Luxurious</option>
                        </select>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {isLoading ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Thinking (Gemini 3)...
                        </>
                    ) : 'Generate Specification'}
                  </button>
                </form>
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-8">
                {generatedSpec ? (
                    <BannerPreview spec={generatedSpec} dimensions={formData.dimensions} />
                ) : (
                    <div className="h-full min-h-[400px] border-2 border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-600 bg-gray-900/50">
                        <svg className="w-20 h-20 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        <p className="text-xl font-medium">Ready to create</p>
                        <p className="text-sm mt-2">Enter campaign details to generate assets</p>
                    </div>
                )}
            </div>
          </div>
        )}

        {activeTab === AppTab.CHAT && <ChatInterface />}
        
        {activeTab === AppTab.ANALYZER && <ImageAnalyzer />}

      </main>
    </div>
  );
};

export default App;