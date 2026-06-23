import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EmailModule from './components/EmailModule';
import PassageModule from './components/PassageModule';
import MockTestModule from './components/MockTestModule';
import Leaderboard from './components/Leaderboard';

import './styles/global.css';
import './styles/tcs-theme.css';
import './styles/email.css';
import './styles/passage.css';
import './styles/mock.css';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [currentModule, setModule] = useState('dashboard');
  const [fullScreen, setFullScreen] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const toggleFullScreen = () => {
    if (!fullScreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setFullScreen(!fullScreen);
  };

  return (
    <div className="app-container">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        fullScreen={fullScreen} 
        toggleFullScreen={toggleFullScreen} 
      />
      <div className="workspace">
        <Sidebar currentModule={currentModule} setModule={setModule} />
        <main className="main-content">
          {currentModule === 'dashboard' && <Dashboard />}
          {currentModule === 'email' && <EmailModule />}
          {currentModule === 'passage' && <PassageModule />}
          {currentModule === 'mock' && <MockTestModule />}
          {currentModule === 'leaderboard' && <Leaderboard />}
        </main>
      </div>
    </div>
  );
}