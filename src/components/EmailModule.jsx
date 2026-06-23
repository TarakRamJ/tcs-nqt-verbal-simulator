import React, { useState, useEffect } from 'react';
import emailQuestions from '../data/emailQuestions.json';
import Timer from './Shared/Timer';
import { evaluateEmail } from '../utils/evaluators';
import { saveHistoryItem } from '../utils/storage';

export default function EmailModule({ isMockMode = false, onMockSubmit = null }) {
  const [selectedId, setSelectedId] = useState(1);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [report, setReport] = useState(null);

  const activeQuestion = emailQuestions.find(q => q.id === parseInt(selectedId)) || emailQuestions[0];

  // Save/Load Draft locally if not in mock test mode
  useEffect(() => {
    if (!isMockMode) {
      const savedDraft = localStorage.getItem(`email_draft_${selectedId}`);
      setAnswer(savedDraft || '');
    }
  }, [selectedId, isMockMode]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setAnswer(val);
    if (!isMockMode) {
      localStorage.setItem(`email_draft_${selectedId}`, val);
    }
  };

  const handleReset = () => {
    if (window.confirm("Clear text input workspace?")) {
      setAnswer('');
      if (!isMockMode) localStorage.removeItem(`email_draft_${selectedId}`);
    }
  };

  const handleSubmit = () => {
    const evalResult = evaluateEmail(answer, activeQuestion.keywords, activeQuestion);
    setReport(evalResult);

    if (!isMockMode) {
      saveHistoryItem({
        type: 'Email Writing',
        mode: 'Practice',
        questionId: selectedId,
        score: evalResult.finalScore,
        details: evalResult
      });
    } else if (onMockSubmit) {
      onMockSubmit(evalResult);
    }
  };

  const wordCount = answer.trim() === '' ? 0 : answer.trim().split(/\s+/).length;
  const charCount = answer.length;

  return (
    <div className="exam-layout">
      <div className="question-panel">
        <div className="panel-header">
          {isMockMode ? "MOCK TEST STEP 1: EMAIL WRITING SECTION" : "🔴 PRACTICE MODULE: EMAIL WRITING"}
        </div>
        <div className="panel-body">
          {!isMockMode && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: '600', marginRight: '10px' }}>Select Scenario:</label>
              <select value={selectedId} onChange={(e) => { setSelectedId(e.target.value); setReport(null); }} style={{ padding: '6px', borderRadius: '4px' }}>
                {emailQuestions.map(q => <option key={q.id} value={q.id}>Scenario #{q.id} - {q.scenario.substring(0, 45)}...</option>)}
              </select>
            </div>
          )}

          <div className="email-meta-box">
            <strong>Context Scenario Directives:</strong>
            <p style={{ marginTop: '5px', fontSize: '14px', lineHeight: '1.5' }}>{activeQuestion.scenario}</p>
            <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <strong>Target Node:</strong> {activeQuestion.receiver} ({activeQuestion.designation}) | <strong>Sign off:</strong> {activeQuestion.signature}
            </div>
          </div>

          <div>
            <strong>Mandatory System Clauses / Keywords:</strong>
            <div className="keyword-container">
              {activeQuestion.keywords.map((kw, idx) => {
                const isMatched = answer.toLowerCase().includes(kw.toLowerCase());
                return (
                  <span key={idx} className={`keyword-tag ${isMatched ? 'matched' : ''}`}>
                    {kw} {isMatched ? '✓' : '◦'}
                  </span>
                );
              })}
            </div>
          </div>

          <textarea
            className="email-textarea"
            placeholder="Type your formal evaluation email framework here... Ensure Subject:, Salutation, Body, and Sign-off fields are coherent."
            value={answer}
            onChange={handleTextChange}
          />
          
          <div className="counter-bar">
            <span>Words: <strong>{wordCount}</strong> (Recommended: 40-80 words)</span>
            <span>Characters: <strong>{charCount}</strong></span>
          </div>

          <div className="action-row">
            <button className="btn-primary" onClick={handleSubmit}>Submit & Evaluate</button>
            <button className="btn-secondary" onClick={handleReset}>Reset Editor</button>
          </div>

          {report && (
            <div style={{ marginTop: '25px', borderTop: '2px solid var(--border-color)', paddingTop: '15px' }}>
              <h3 style={{ color: 'var(--tcs-blue)' }}>Automated Evaluation Feedback</h3>
              <div className="report-grid">
                <div className="metric-card"><h4>Grammar Matrix</h4><p>{report.grammar} / 40</p></div>
                <div className="metric-card"><h4>Spelling Authenticity</h4><p>{report.spelling} / 20</p></div>
                <div className="metric-card"><h4>Keyword Precision</h4><p>{report.keywordScore} / 30</p></div>
                <div className="metric-card"><h4>Structural Coherence</h4><p>{report.structureScore} / 10</p></div>
              </div>
              <div style={{ marginTop: '15px', background: 'var(--tcs-light-blue)', padding: '15px', borderRadius: '4px' }}>
                <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Aggregated Output Score: <span style={{ color: 'var(--tcs-orange)' }}>{report.finalScore} / 100</span></div>
                {report.missingKeywords.length > 0 && (
                  <div style={{ marginTop: '10px', color: '#721c24' }}>
                    <strong>Missed Flags:</strong> {report.missingKeywords.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="right-panel">
        <Timer secondsLeft={timeLeft} setSecondsLeft={setTimeLeft} onTimeUp={handleSubmit} />
        <div className="info-card">
          <h3>NQT Evaluation Schema</h3>
          <ul style={{ paddingLeft: '15px', marginTop: '10px', fontSize: '13px', lineHeight: '1.7' }}>
            <li>Do not omit any target keyword token.</li>
            <li>Incorporate structural boundaries precisely.</li>
            <li>Maintain word limit profiles strictly (40 - 80 words).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}