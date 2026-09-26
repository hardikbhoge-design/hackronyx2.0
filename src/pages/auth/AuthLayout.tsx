import React from 'react';
import { BrainCircuit } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 font-sans">
      <div className="flex h-[600px] w-[1000px] max-w-full overflow-hidden rounded-3xl bg-white shadow-2xl shadow-indigo-500/10 border border-slate-100">
        
        {/* Left Side - Animated Gradient Background */}
        <div className="relative flex w-1/2 flex-col justify-center overflow-hidden bg-indigo-600 p-12 text-white login-gradient-bg">
          {/* Glassmorphism abstract shapes */}
          <div className="absolute -left-[20%] top-[10%] h-[500px] w-[500px] rounded-full bg-purple-500/40 mix-blend-multiply blur-[80px] animate-blob"></div>
          <div className="absolute -right-[20%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-orange-400/40 mix-blend-multiply blur-[80px] animate-blob animation-delay-2000"></div>
          <div className="absolute left-[20%] -bottom-[20%] h-[500px] w-[500px] rounded-full bg-indigo-400/40 mix-blend-multiply blur-[80px] animate-blob animation-delay-4000"></div>

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              {/* Logo icon */}
              <BrainCircuit className="w-8 h-8 text-white/90" />
            </div>
            
            <div className="mt-auto pb-12">
              <h1 className="text-6xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                {title.split(' ').map((word, i) => (
                  <React.Fragment key={i}>
                    {word}
                    <br />
                  </React.Fragment>
                ))}
              </h1>
            </div>
          </div>
        </div>

        {/* Right Side - Dynamic Content */}
        <div className="flex w-1/2 flex-col justify-center p-16 relative">
          {children}
        </div>
      </div>
    </div>
  );
}
