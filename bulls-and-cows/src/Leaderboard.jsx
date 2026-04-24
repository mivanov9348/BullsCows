import { useEffect, useState } from 'react';

// --- НОВИ ИМПОРТИ ЗА FIREBASE ---
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from './firebase';

export default function Leaderboard({ onBack }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Дърпаме Топ 10 от колекция "leaderboard", сортирани по най-много точки
        const q = query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        
        const fetchedScores = [];
        querySnapshot.forEach((doc) => {
          fetchedScores.push(doc.data());
        });
        
        setScores(fetchedScores);
      } catch (error) {
        console.error("Грешка при зареждане на класацията:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 mb-2">
          Глобална Класация 🌍
        </h2>
        <p className="text-sm font-medium text-gray-500">Топ 10 играчи в света</p>
      </div>

      <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-80 pr-2 min-h-[150px] relative">
        {/* Индикатор за зареждане */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-indigo-600"></div>
          </div>
        )}

        {!loading && scores.length > 0 ? (
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
        ) : !loading && (
          <div className="text-center py-8 text-gray-400 font-medium">
            <p>Все още няма резултати.</p>
            <p className="text-sm mt-1">Бъди първият в света!</p>
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