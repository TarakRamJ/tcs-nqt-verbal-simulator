import React from 'react';

export default function Sidebar({ currentModule, setModule }) {
  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', desc: 'Performance insights' },
    { id: 'email', label: '✉️ Email Writing', desc: '10 Min Keyword challenge' },
    { id: 'passage', label: '🧠 Passage Recall', desc: '30 Sec Memory Retention' },
    { id: 'mock', label: '📝 Mock Test Mode', desc: 'Full sequential exam simulation' },
    { id: 'leaderboard', label: '🏆 Leaderboard', desc: 'Local community ranking' },
  ];

  return (
    <aside className="tcs-sidebar">
      <div className="nav-group">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${currentModule === item.id ? 'active' : ''}`}
            onClick={() => setModule(item.id)}
          >
            <div>
              <div style={{ fontSize: '14px' }}>{item.label}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '10px', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)' }}>
        Systems Operational V4.12<br />
        Strict compliance with TCS Interface rules.
      </div>
    </aside>
  );
}