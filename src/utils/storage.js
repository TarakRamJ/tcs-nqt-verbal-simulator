export const getHistory = () => {
  const data = localStorage.getItem('tcs_nqt_history');
  return data ? JSON.parse(data) : [];
};

export const saveHistoryItem = (item) => {
  const history = getHistory();
  const newItem = {
    ...item,
    id: Date.now(),
    date: new Date().toLocaleDateString()
  };
  history.unshift(newItem);
  localStorage.setItem('tcs_nqt_history', JSON.stringify(history));
  
  // Track Leaderboard Sync
  saveLeaderboardItem(newItem);
};

export const getLeaderboard = () => {
  const data = localStorage.getItem('tcs_nqt_leaderboard');
  if (!data) {
    // Generate default baseline candidates for context
    const defaults = [
      { name: "Rahul Sharma", score: 92, date: "23/06/2026" },
      { name: "Priya Patel", score: 87, date: "22/06/2026" },
      { name: "Aman Verma", score: 81, date: "23/06/2026" }
    ];
    localStorage.setItem('tcs_nqt_leaderboard', JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(data).sort((a, b) => b.score - a.score);
};

const saveLeaderboardItem = (item) => {
  const leaders = getLeaderboard();
  leaders.push({
    name: item.mode === "Mock Test" ? "You (Mock)" : "You (Practice)",
    score: item.score,
    date: item.date
  });
  const sorted = leaders.sort((a, b) => b.score - a.score).slice(0, 10);
  localStorage.setItem('tcs_nqt_leaderboard', JSON.stringify(sorted));
};