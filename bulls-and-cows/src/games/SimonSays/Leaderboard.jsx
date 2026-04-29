import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from '../../firebase';

export default function Leaderboard({ onBack }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, "simonsays_leaderboard"), orderBy("score", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        const fetchedScores = [];
        querySnapshot.forEach((doc) => fetchedScores.push(doc.data()));
        setScores(fetchedScores);
      } catch (error) {
        console.error("Грешка:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20 text-white mx-4 z-20 relative">
      <div className="flex justify-between mb-4">
        <Link to="/" className="text-xs text-gray-400 hover:text-white transition-colors">⬅️ Към Портала</Link>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-2">Глобална Класация 🌍</h2>
        <p className="text-sm font-medium text-gray-300">Саймън Казва (Топ 10)</p>
      </div>

      <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-80 pr-2 min-h-[150px] relative">
        {loading && <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-10 rounded-xl"><div className="animate-spin rounded-full h-8 w-8 border-b-4 border-pink-500"></div></div>}
        {!loading && scores.length > 0 ? (
          scores.map((score, index) => (
            <div key={index} className={`flex items-center justify-between p-3 rounded-xl border ${index === 0 ? 'bg-yellow-500/20 border-yellow-400/50' : index === 1 ? 'bg-gray-400/20 border-gray-300/50' : index === 2 ? 'bg-orange-500/20 border-orange-400/50' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center gap-3">
                <span className={`font-black w-6 text-center ${index === 0 ? 'text-yellow-400 text-xl' : index === 1 ? 'text-gray-300 text-lg' : index === 2 ? 'text-orange-400 text-lg' : 'text-gray-400'}`}>#{index + 1}</span>
                <div><div className="font-bold text-white text-lg">{score.name}</div><div className="text-xs text-gray-400">{score.date}</div></div>
              </div>
              <div className="font-black text-pink-400 text-lg">{score.score} <span className="text-xs text-gray-400">т.</span></div>
            </div>
          ))
        ) : !loading && <div className="text-center py-8 text-gray-400"><p>Все още няма резултати.</p></div>}
      </div>
      <button onClick={onBack} className="mt-6 w-full bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm">🔙 Назад към играта</button>
    </div>
  );
}