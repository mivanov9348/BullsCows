import { Routes, Route, Link } from 'react-router-dom';
import BullsAndCowsApp from './games/BullsAndCows/Game'; // Забележи пътя!

export default function App() {
  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      
      {/* Главна навигационна лента горе */}
      <nav className="bg-black/30 backdrop-blur-md p-4 shadow-lg border-b border-white/10 flex justify-center gap-6">
        <Link to="/" className="text-xl font-black hover:text-yellow-400 transition-colors">
          🏠 Начало
        </Link>
        <Link to="/bulls" className="text-xl font-bold text-gray-300 hover:text-white transition-colors">
          🐂 Бикове и Крави
        </Link>
        <Link to="#" className="text-xl font-bold text-gray-500 cursor-not-allowed">
          ⏳ Очаквайте още...
        </Link>
      </nav>

      {/* Тук React Router ще зарежда съответната игра */}
      <Routes>
        <Route path="/" element={
          <div className="flex flex-col items-center justify-center mt-20">
            <h1 className="text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Мини Гейминг Портал
            </h1>
            <Link to="/bulls" className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl font-bold text-2xl shadow-xl transform hover:-translate-y-1 transition-all">
              Играй Бикове и Крави ➡️
            </Link>
          </div>
        } />
        
        {/* Забележи: Тук зареждаме Game.jsx от папката на играта */}
        <Route path="/bulls" element={<BullsAndCowsApp />} />
      </Routes>
      
    </div>
  );
}