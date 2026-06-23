import React, { useState, useEffect } from 'react';
import { getHistory } from '../utils/storage';

export default function Dashboard() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const clearMetrics = () => {
    if(window.confirm("Purge local history database?")) {
      localStorage.removeItem('tcs_nqt_history');
      setHistory([]);
    }
  };

  const totalTests = history.length;
  const averageScore = totalTests ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / totalTests) : 0;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Candidate Analytics Control Desk</h2>
          <p style={{ color: 'var(--text-muted)' }}>Real-time local tracking profile telemetry</p>
        </div>
        {totalTests > 0 && <button className="btn-secondary" style={{ background: '#ffcccb', color: '#cc0000' }} onClick={clearMetrics}>Purge Logs</button>}
      </div>

      <div className="report-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '30px' }}>
        <div className="metric-card" style={{ padding: '20px' }}>
          <h4>Attempts Checked</h4>
          <p style={{ fontSize: '32px' }}>{totalTests}</p>
        </div>
        <div className="metric-card" style={{ padding: '20px' }}>
          <h4>Mean Target Quality</h4>
          <p style={{ fontSize: '32px', color: 'var(--tcs-orange)' }}>{averageScore}%</p>
        </div>
        <div className="metric-card" style={{ padding: '20px' }}>
          <h4>Current Gate Pass</h4>
          <p style={{ fontSize: '32px', color: averageScore >= 75 ? 'green' : 'gray' }}>
            {averageScore >= 75 ? 'ELIGIBLE' : 'LOW MARGIN'}
          </p>
        </div>
      </div>

      <div className="question-panel">
        <div className="panel-header">Execution Logs System Records</div>
        <div className="panel-body" style={{ padding: '0' }}>
          {history.length === 0 ? (
            <p style={{ padding: '20px', color: 'var(--text-muted)' }}>No localized history nodes identified yet. Initialize a module to begin compilation.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--tcs-light-blue)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px' }}>Timestamp</th>
                  <th style={{ padding: '12px' }}>Module Target</th>
                  <th style={{ padding: '12px' }}>Evaluation Mode</th>
                  <th style={{ padding: '12px' }}>Score Profile</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{h.date}</td>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{h.type}</td>
                    <td style={{ padding: '12px' }}><span style={{ fontSize: '11px', background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>{h.mode}</span></td>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--tcs-blue)' }}>{h.score}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}