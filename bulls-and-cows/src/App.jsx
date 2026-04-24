import { useState } from 'react';
import Game from './Game';
import Rules from './Rules';
import Leaderboard from './Leaderboard';

export default function App() {
  const [view, setView] = useState('game'); // 'game', 'rules', 'leaderboard'

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 font-sans bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-gray-800">
      
      {/* Навигация */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setView('game')} 
          className={`px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${view === 'game' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
        >
          🎮 Игра
        </button>
        <button 
          onClick={() => setView('rules')} 
          className={`px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${view === 'rules' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
        >
          📖 Правила
        </button>
        <button 
          onClick={() => setView('leaderboard')} 
          className={`px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${view === 'leaderboard' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
        >
          🏆 Класация
        </button>
      </div>

      {/* Показване на съответния компонент */}
      {view === 'game' && <Game />}
      {view === 'rules' && <Rules onBack={() => setView('game')} />}
      {view === 'leaderboard' && <Leaderboard onBack={() => setView('game')} />}
      
    </div>
  );
}