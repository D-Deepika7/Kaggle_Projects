import React, { useState } from 'react';
import { analyzeImageForAds } from '../services/geminiService';

const ImageAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("Identify the key products and the emotional tone of this image.");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Strip the data:image/xyz;base64, part for the API if needed, 
        // but the code below handles extraction manually for display, 
        // and the service expects specific format.
        
        // Extract raw base64 data for API
        const base64Data = base64String.split(',')[1]; 
        
        setSelectedImage(base64String); // Keep full string for display
        setMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !mimeType) return;
    
    setIsLoading(true);
    setAnalysis('');
    
    try {
       const base64Data = selectedImage.split(',')[1];
       const result = await analyzeImageForAds(base64Data, mimeType, prompt);
       setAnalysis(result);
    } catch (error) {
       setAnalysis("Failed to analyze image. Please ensure your API key is valid.");
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Upload Asset
            </h3>
            
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>

            {selectedImage && (
               <div className="mt-4 relative group">
                  <img src={selectedImage} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-gray-600" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <p className="text-white font-medium">Ready to Analyze</p>
                  </div>
               </div>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
             <label className="block text-sm font-medium text-gray-400 mb-2">Analysis Focus</label>
             <textarea 
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
             />
             <button 
                onClick={handleAnalyze}
                disabled={!selectedImage || isLoading}
                className={`mt-4 w-full py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 ${!selectedImage || isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg'}`}
             >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing with Gemini 3 Pro...
                    </span>
                ) : "Analyze Image"}
             </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-full min-h-[500px] flex flex-col">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                AI Insights
            </h3>
            <div className="flex-1 bg-gray-900 rounded-lg p-4 overflow-y-auto border border-gray-800 text-gray-300 leading-relaxed whitespace-pre-wrap">
                {analysis ? analysis : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        <p>Upload an image to reveal creative insights.</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ImageAnalyzer;