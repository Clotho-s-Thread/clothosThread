import React from 'react';

interface StreamFrameProps {
  children: React.ReactNode;
  className?: string;
}

const StreamFrame: React.FC<StreamFrameProps> = ({ children, className = "" }) => (
  <div className={`stream-frame ${className}`}>
    <div className="corner-star -top-1 -left-1" />
    <div className="corner-star -top-1 -right-1" />
    <div className="corner-star -bottom-1 -left-1" />
    <div className="corner-star -bottom-1 -right-1" />
    <div className="p-3 border border-[#c58e7133] m-1 h-full relative overflow-hidden flex flex-col items-center justify-center">
      {children}
    </div>
  </div>
);

export default StreamFrame;