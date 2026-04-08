import React from 'react';

const StreamUIOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="geometric-bg absolute inset-0" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-[800px] h-[800px] border border-[#c58e711a] rounded-full animate-orbit flex items-center justify-center">
         <div className="w-[600px] h-[600px] border border-[#c58e712a] rounded-full" />
         <div className="absolute w-full h-[1px] bg-[#c58e710d]" />
         <div className="absolute h-full w-[1px] bg-[#c58e710d]" />
      </div>
    </div>
    <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-[#c58e714d] opacity-50" />
    <div className="absolute top-10 right-10 w-20 h-20 border-t border-r border-[#c58e714d] opacity-50" />
    <div className="absolute bottom-10 left-10 w-20 h-20 border-b border-l border-[#c58e714d] opacity-50" />
    <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-[#c58e714d] opacity-50" />
  </div>
  );
};

export default StreamUIOverlay;