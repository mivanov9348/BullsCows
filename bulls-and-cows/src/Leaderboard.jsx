import { useEffect, useState } from 'react';

export default function Leaderboard({ onBack }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('bullsAndCowsLeaderboard')) || [];
    const sortedScores = savedScores.sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.score - a.score;
    });
    setScores(sortedScores.slice(0, 10));
  }, []);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 mb-2">
          Топ Играчи
        </h2>
        <p className="text-sm font-medium text-gray-500">Зала на славата (Топ 10)</p>
      </div>

      <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-80 pr-2">
        {scores.length > 0 ? (
          scores.map((score, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-3 rounded-xl border ${
                index === 0 ? 'bg-yellow-50 border-yellow-200' : 
                index === 1 ? 'bg-gray-50 border-gray-200' : 
                index === 2 ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`font-black w-6 text-center ${
                  index === 0 ? 'text-yellow-500 text-xl' : 
                  index === 1 ? 'text-gray-400 text-lg' : 
                  index === 2 ? 'text-orange-400 text-lg' : 'text-gray-300'
                }`}>
                  #{index + 1}
                </span>
                <div>
                  {/* Тук визуализираме името и нивото */}
                  <div className="font-bold text-gray-800 text-lg">
                    {score.name} <span className="text-xs text-gray-400 font-normal ml-1">(Ниво {score.level})</span>
                  </div>
                  <div className="text-xs text-gray-400">{score.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-indigo-600 text-lg">{score.score} <span className="text-xs">т.</span></div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400 font-medium">
            <p>Все още няма резултати.</p>
            <p className="text-sm mt-1">Изиграй първата си игра!</p>
          </div>
        )}
      </div>

      <button
        onClick={onBack}
        className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
      >
        🔙 Назад към играта
      </button>
    </div>
  );
}