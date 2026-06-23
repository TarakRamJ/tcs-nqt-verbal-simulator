import React from 'react';

export default function ProgressBar({ progress }) {
  return (
    <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
      <div 
        style={{ 
          width: `${progress}%`, 
          backgroundColor: 'var(--tcs-orange)', 
          height: '100%', 
          transition: 'width 0.3s ease' 
        }} 
      />
    </div>
  );
}