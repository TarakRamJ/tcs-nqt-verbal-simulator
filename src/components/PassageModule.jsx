import React, { useState, useEffect } from 'react';
import passageQuestions from '../data/passageQuestions.json';
import { evaluatePassage } from '../utils/evaluators';
import { saveHistoryItem } from '../utils/storage';

export default function PassageModule({ isMockMode = false, onMockSubmit = null }) {
  const [selectedId, setSelectedId] = useState(1);
  const [step, setStep] = useState(1); // 1: Read, 2: Write, 3: Result
  const [readTimer, setReadTimer] = useState(30);
  const [userText, setUserText] = useState('');
  const [report, setReport] = useState(null);

  const activePassage = passageQuestions.find(p => p.id === parseInt(selectedId)) || passageQuestions[0];

  useEffect(() => {
    let interval = null;
    if (step === 1 && readTimer > 0) {
      interval = setInterval(() => {
        setReadTimer(prev => prev - 1);
      }, 1000);
    } else if (step === 1 && readTimer === 0) {
      setStep(2);
    }
    return () => clearInterval(interval);
  }, [step, readTimer]);

  const handleStartTyping = () => {
    setStep(2);
  };

  const handleSubmit = () => {
    const results = evaluatePassage(activePassage.passage, userText);
    setReport(results);
    setStep(3);

    if (!isMockMode) {
      saveHistoryItem({
        type: 'Passage Recall',
        mode: 'Practice',
        questionId: selectedId,
        score: results.finalScore,
        details: results
      });
    } else if (onMockSubmit) {
      onMockSubmit(results);
    }
  };

  return (
    <div className="exam-layout" style={{ gridTemplateColumns: '1fr' }}>
      <div className="question-panel">
        <div className="panel-header">
          {isMockMode ? "MOCK TEST STEP 2: PASSAGE RECALL ROUND" : `🧠 PASSAGE ROUND (Topic: ${activePassage.topic})`}
        </div>
        <div className="panel-body">
          {!isMockMode && step === 1 && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: '600', marginRight: '10px' }}>Select Target Passage Dataset:</label>
              <select value={selectedId} onChange={(e) => { setSelectedId(e.target.value); setReadTimer(30); }} style={{ padding: '6px', borderRadius: '4px' }}>
                {passageQuestions.map(p => <option key={p.id} value={p.id}>Passage #{p.id} ({p.topic})</option>)}
              </select>
            </div>
          )}

          {step === 1 && (
            <div className="countdown-overlay">
              <div className="timer-circle">{readTimer}s</div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Study the technical sequence below before memory window closure.</p>
              <div className="passage-display-box">
                {activePassage.passage}
              </div>
              <button className="btn-primary" onClick={handleStartTyping}>Skip Timer & Start Typing</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <p style={{ marginBottom: '10px', color: 'var(--tcs-orange)', fontWeight: 'bold' }}>⚡ Reconstruct the passage as accurately as possible from memory:</p>
              <textarea
                className="email-textarea"
                style={{ height: '200px' }}
                placeholder="Begin reproduction chain..."
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
              />
              <div style={{ marginTop: '15px' }}>
                <button className="btn-primary" onClick={handleSubmit}>Submit Performance Token</button>
              </div>
            </div>
          )}

          {step === 3 && report && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'var(--tcs-light-blue)', padding: '20px', borderRadius: '4px', textAlign: 'center' }}>
                <h3>Final Aggregated Memory Score</h3>
                <div style={{ fontSize: '42px', fontWeight: '800', color: 'var(--tcs-orange)' }}>{report.finalScore} / 100</div>
                <p>Structural Similarity Convergence: <strong>{report.similarityPct}%</strong></p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ border: '1px solid var(--border-color)', padding: '15px', borderRadius: '4px' }}>
                  <strong style={{ color: 'var(--success)' }}>Original Target Reference Matrix:</strong>
                  <p style={{ marginTop: '10px', lineHeight: '1.5', fontSize: '14px' }}>{activePassage.passage}</p>
                </div>
                <div style={{ border: '1px solid var(--border-color)', padding: '15px', borderRadius: '4px' }}>
                  <strong style={{ color: 'var(--tcs-blue)' }}>Your Reconstructed Interface Input:</strong>
                  <p style={{ marginTop: '10px', lineHeight: '1.5', fontSize: '14px' }}>{userText || <span style={{ color: 'red' }}>[Empty Input Matrix]</span>}</p>
                </div>
              </div>

              {report.missingKeywords.length > 0 && (
                <div style={{ backgroundColor: '#fff5f5', padding: '15px', borderLeft: '4px solid red', borderRadius: '4px' }}>
                  <strong style={{ color: '#c53030' }}>Unmapped Key Structural Semantic Tokens:</strong>
                  <div className="missing-list">
                    {report.missingKeywords.map((w, idx) => <span key={idx} className="missing-tag">{w}</span>)}
                  </div>
                </div>
              )}

              {!isMockMode && (
                <button className="btn-secondary" style={{ width: 'max-content' }} onClick={() => { setStep(1); setReadTimer(30); setUserText(''); setReport(null); }}>
                  Try Another Challenge
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}