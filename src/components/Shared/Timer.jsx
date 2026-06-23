import React, { useEffect } from 'react';

export default function Timer({ secondsLeft, setSecondsLeft, onTimeUp }) {
  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [secondsLeft, onTimeUp, setSecondsLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = secondsLeft < 60;

  return (
    <div style={{
      padding: '10px 15px',
      backgroundColor: isLowTime ? '#f8d7da' : 'var(--tcs-light-blue)',
      color: isLowTime ? '#721c24' : '#002f6c',
      borderRadius: '4px',
      textAlign: 'center',
      fontWeight: 'bold',
      border: `1px solid ${isLowTime ? '#f5c6cb' : 'var(--border-color)'}`
    }}>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Time Remaining</div>
      <div style={{ fontSize: '24px', fontFamily: 'monospace' }}>{formatTime(secondsLeft)}</div>
    </div>
  );
}