import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../utils/storage';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    setLeaders(getLeaderboard());
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }} className="question-panel">
      <div className="panel-header">🏆 LOCAL SYSTEM LEADERBOARD MARGINS</div>
      <div className="panel-body" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--tcs-light-blue)', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Rank Position</th>
              <th style={{ padding: '12px' }}>Candidate Instance</th>
              <th style={{ padding: '12px' }}>Aggregated Metric</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>#{index + 1}</td>
                <td style={{ padding: '12px' }}>{leader.name}</td>
                <td style={{ padding: '12px', color: 'var(--tcs-orange)', fontWeight: 'bold' }}>{leader.score} Pts</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}