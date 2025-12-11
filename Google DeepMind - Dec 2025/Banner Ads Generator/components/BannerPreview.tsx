import React from 'react';
import { BannerSpec } from '../types';

interface BannerPreviewProps {
  spec: BannerSpec;
  dimensions: string;
}

const BannerPreview: React.FC<BannerPreviewProps> = ({ spec, dimensions }) => {
  // Parse dimensions for inline styles (simplified)
  // Default to a box if parsing fails
  let width = "300px";
  let height = "250px";
  
  if (dimensions.includes('x')) {
    const [w, h] = dimensions.split('x');
    width = `${w}px`;
    height = `${h}px`;
  }

  const styles = {
    width: width,
    height: height,
    backgroundColor: spec.visualDirection.backgroundColorHex,
    color: spec.visualDirection.textColorHex,
    fontFamily: spec.visualDirection.typography.includes('Serif') ? 'serif' : 'sans-serif',
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-xl overflow-hidden">
        <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Visual Mockup</h3>
        <div className="flex justify-center items-center bg-gray-900/50 p-8 rounded-lg overflow-auto">
            
            <div 
                style={styles} 
                className="relative shadow-2xl flex flex-col justify-between p-4 transition-all duration-500 hover:scale-105 origin-center shrink-0"
            >
                {/* Simulated Background Pattern/Image */}
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent pointer-events-none"></div>

                <div className="relative z-10">
                    <h1 className="text-xl font-bold leading-tight mb-2">{spec.headline}</h1>
                    <p className="text-sm opacity-90">{spec.subheadline}</p>
                </div>

                <div className="relative z-10 mt-auto">
                    <p className="text-xs mb-3 opacity-80 line-clamp-3">{spec.body}</p>
                    <button 
                        className="px-4 py-2 text-xs font-bold uppercase tracking-wide rounded w-full shadow-lg filter brightness-110 contrast-125"
                        style={{
                            backgroundColor: spec.visualDirection.textColorHex, 
                            color: spec.visualDirection.backgroundColorHex
                        }}
                    >
                        {spec.cta}
                    </button>
                </div>
            </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
             <h3 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Copy Strategy
             </h3>
             <ul className="space-y-3 text-sm text-gray-300">
                <li><span className="text-gray-500 block text-xs uppercase">Headline</span> {spec.headline}</li>
                <li><span className="text-gray-500 block text-xs uppercase">Subhead</span> {spec.subheadline}</li>
                <li><span className="text-gray-500 block text-xs uppercase">Body</span> {spec.body}</li>
                <li><span className="text-gray-500 block text-xs uppercase">CTA</span> {spec.cta}</li>
             </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
             <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                Visual Direction
             </h3>
             <div className="space-y-3 text-sm text-gray-300">
                <div>
                    <span className="text-gray-500 block text-xs uppercase mb-1">Palette</span> 
                    <div className="flex gap-2">
                        {spec.visualDirection.colorPalette.map((color, idx) => (
                            <div key={idx} className="w-6 h-6 rounded-full border border-white/20" style={{backgroundColor: color}} title={color}></div>
                        ))}
                    </div>
                </div>
                <p><span className="text-gray-500 block text-xs uppercase">Imagery</span> {spec.visualDirection.imageryDescription}</p>
                <p><span className="text-gray-500 block text-xs uppercase">Layout</span> {spec.visualDirection.layoutDescription}</p>
             </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700">
        <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            AI Strategy Rationale
        </h3>
        <p className="text-gray-300 italic leading-relaxed text-sm">
            "{spec.rationale}"
        </p>
      </div>
    </div>
  );
};

export default BannerPreview;