import React from 'react';

interface StreamFrameProps {
  children: React.ReactNode;
  className?: string;
}

const StreamFrame: React.FC<StreamFrameProps> = ({ children, className = "" }) => (
  <div 
    className={`${className} relative overflow-hidden`}
    style={{
      background: 'linear-gradient(135deg, rgba(232, 232, 232, 0.25) 0%, rgba(197, 142, 113, 0.2) 100%)',
      border: '1px solid rgba(197, 142, 113, 0.3)'
    }}
  >
    <div className="corner-star -top-1 -left-1" />
    <div className="corner-star -top-1 -right-1" />
    <div className="corner-star -bottom-1 -left-1" />
    <div className="corner-star -bottom-1 -right-1" />
    <div className="p-8 h-full flex flex-col items-center justify-center">
      {children}
    </div>
  </div>
);

export default StreamFrame;