import React from 'react';

export default function Header({ theme, toggleTheme, fullScreen, toggleFullScreen }) {
  return (
    <header className="tcs-header">
      <div className="tcs-brand">
        <div>
          <h2 style={{ fontSize: '18px', letterSpacing: '0.5px' }}>iOM-VERBAL</h2>
          <p className="tcs-logo-sub">TCS NQT ASSESSMENT SIMULATOR</p>
        </div>
      </div>
      <div className="tcs-actions">
        <button className="tcs-btn-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
        <button className="tcs-btn-toggle" onClick={toggleFullScreen}>
          {fullScreen ? '🗗 Exit Fullscreen' : '🗖 Fullscreen'}
        </button>
        <div style={{ textAlign: 'right', fontSize: '12px' }}>
          <div>Candidate ID: <span style={{ color: 'var(--tcs-orange)', fontWeight: 'bold' }}>NQT-2026-X97</span></div>
          <div style={{ color: '#bfdbfe' }}>Section: Verbal Ability</div>
        </div>
      </div>
    </header>
  );
}