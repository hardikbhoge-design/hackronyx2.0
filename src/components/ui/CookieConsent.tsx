import { useState, useEffect } from 'react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div className="relative w-[360px] bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200 p-6 pt-10">
        
        {/* Cookie Illustration */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="relative w-20 h-20 bg-[#F4A261] rounded-full border-4 border-[#8B5E34] shadow-lg flex items-center justify-center overflow-hidden">
            <div className="absolute top-3 left-4 w-3 h-3 bg-[#8B5E34] rounded-full"></div>
            <div className="absolute top-5 right-5 w-4 h-4 bg-[#8B5E34] rounded-full"></div>
            <div className="absolute bottom-4 left-6 w-3 h-3 bg-[#8B5E34] rounded-full"></div>
            <div className="absolute bottom-6 right-4 w-2 h-2 bg-[#8B5E34] rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#8B5E34] rounded-full"></div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 text-center mb-3">
          Your privacy is important to us
        </h3>
        
        <p className="text-sm text-slate-600 mb-6 text-center leading-relaxed">
          We process your personal information to measure and improve our financial workflow orchestration, to assist our agentic operations, and to provide personalized dashboard experiences. For more information see our <a href="#" className="font-semibold text-indigo-600 hover:underline">Privacy Policy.</a>
        </p>

        <div className="flex items-center justify-between">
          <button 
            onClick={() => setIsVisible(false)}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            More Option
          </button>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl px-6 py-2 shadow-md shadow-indigo-500/20"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
