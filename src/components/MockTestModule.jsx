import React, { useState } from 'react';
import EmailModule from './EmailModule';
import PassageModule from './PassageModule';
import { saveHistoryItem } from '../utils/storage';

export default function MockTestModule() {
  const [mockStep, setMockStep] = useState(1); // 1: Info, 2: Email, 3: Passage, 4: Summary Report
  const [emailResult, setEmailResult] = useState(null);
  const [passageResult, setPassageResult] = useState(null);

  const startMockTest = () => {
    setMockStep(2);
  };

  const handleEmailFinished = (res) => {
    setEmailResult(res);
    setMockStep(3);
  };

  const handlePassageFinished = (res) => {
    setPassageResult(res);
    
    const aggregatedScore = Math.round(((res.finalScore + emailResult.finalScore) / 2));
    
    // Save comprehensive unified score structure
    saveHistoryItem({
      type: 'Full Mock Test',
      mode: 'Mock Test',
      score: aggregatedScore,
      details: {
        emailScore: emailResult.finalScore,
        passageScore: res.finalScore,
        accuracy: Math.round((res.similarityPct + (emailResult.keywordScore / 30 * 100)) / 2)
      }
    });

    setMockStep(4);
  };

  return (
    <div style={{ width: '100%' }}>
      {mockStep === 1 && (
        <div className="question-panel" style={{ maxWidth: '700px', margin: '30px auto' }}>
          <div className="panel-header">🚨 TCS NQT COGNITIVE VERBAL MOCK EXAMINATION</div>
          <div className="panel-body" style={{ lineHeight: '1.6' }}>
            <p>You are initializing a high-fidelity simulator tracking the multi-stage evaluation rules of the TCS Verbal Round.</p>
            <h4 style={{ marginTop: '15px' }}>Rules of Engagement:</h4>
            <ul>
              <li><strong>Stage 1 (Email Writing):</strong> 10 Minutes absolute limit window.</li>
              <li><strong>Stage 2 (Passage Recall):</strong> 30 Seconds study window followed by recall interface.</li>
              <li>System state locks until full sequence completion.</li>
            </ul>
            <button className="btn-primary" style={{ marginTop: '20px', width: '100%' }} onClick={startMockTest}>
              Authorize & Begin Full Mock Test
            </button>
          </div>
        </div>
      )}

      {mockStep === 2 && (
        <EmailModule isMockMode={true} onMockSubmit={handleEmailFinished} />
      )}

      {mockStep === 3 && (
        <PassageModule isMockMode={true} onMockSubmit={handlePassageFinished} />
      )}

      {mockStep === 4 && (
        <div className="question-panel" style={{ maxWidth: '800px', margin: '20px auto' }}>
          <div className="panel-header">🏆 INTEGRATED MOCK REPORT CARD</div>
          <div className="panel-body">
            <div className="report-header" style={{ textAlign: 'center' }}>
              <h3>Composite Analytical Performance Profile</h3>
              <div className="score-badge-large">
                {Math.round((emailResult.finalScore + passageResult.finalScore) / 2)} / 100
              </div>
            </div>

            <div className="report-grid">
              <div className="metric-card">
                <h4>Email Task Output Score</h4>
                <p>{emailResult.finalScore} / 100</p>
              </div>
              <div className="metric-card">
                <h4>Passage Round Recall Score</h4>
                <p>{passageResult.finalScore} / 100</p>
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: 'var(--bg-app)', borderRadius: '4px' }}>
              <h4>System Recommendations & Diagnostics:</h4>
              <p style={{ fontSize: '14px', marginTop: '5px', color: 'var(--text-muted)' }}>
                {((emailResult.finalScore + passageResult.finalScore) / 2) >= 80 
                  ? "🔥 High Competence Level. Structural deployment match satisfies current high-tier threshold filters." 
                  : "⚠️ Remedial Action Advised. Pay extreme attention to text token tracking logic patterns."}
              </p>
            </div>
            
            <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => setMockStep(1)}>
              Initialize New Mock Instance
            </button>
          </div>
        </div>
      )}
    </div>
  );
}