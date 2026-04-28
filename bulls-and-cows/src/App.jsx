import { Routes, Route, Link } from 'react-router-dom';
import BullsAndCowsApp from './games/BullsAndCows/Game'; 
import HangmanApp from './games/Hangman/Game';
import TicTacToeApp from './games/TicTacToe/Game';
import MathRushApp from './games/MathRush/Game'; 
import WordleApp from './games/Wordle/Game'; // <-- НОВИЯТ ИМПОРТ

export default function App() {
  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      
      <Routes>
        <Route path="/" element={
          <div className="container mx-auto px-4 py-16">
            
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 tracking-tight drop-shadow-lg">
                Мини Гейминг Портал
              </h1>
              <p className="text-xl text-indigo-200 font-medium">Избери игра и се забавлявай!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              {/* ИГРА 1: Бикове и Крави */}
              <Link to="/bulls" className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden hover:bg-white/20 transition-all duration-300 hover:shadow-[0_0_40px_rgba(129,140,248,0.4)] hover:-translate-y-2 flex flex-col">
                <div className="h-48 bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-300 drop-shadow-xl relative z-10">🐂🐄</span>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-black text-white">Бикове и Крави</h2>
                    <span className="bg-green-500 text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm">Hot</span>
                  </div>
                  <p className="text-indigo-100 text-sm mb-6 flex-1 leading-relaxed">Класическа логическа игра. Използвай ума си и жокери, за да познаеш тайното число!</p>
                  <div className="text-yellow-400 font-bold text-base flex items-center gap-2 group-hover:text-yellow-300">
                    <span>Играй сега</span><span className="group-hover:translate-x-2 transition-transform duration-300">➡️</span>
                  </div>
                </div>
              </Link>

              {/* ИГРА 2: Бесеница */}
              <Link to="/hangman" className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden hover:bg-white/20 transition-all duration-300 hover:shadow-[0_0_40px_rgba(248,113,113,0.4)] hover:-translate-y-2 flex flex-col">
                <div className="h-48 bg-gradient-to-tr from-red-500 to-orange-600 flex items-center justify-center relative overflow-hidden">
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-300 drop-shadow-xl relative z-10">🪢🔤</span>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-black text-white">Бесеница</h2>
                    <span className="bg-blue-500 text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm">New</span>
                  </div>
                  <p className="text-indigo-100 text-sm mb-6 flex-1 leading-relaxed">Спаси човечето, като познаеш скритата дума буква по буква. Внимавай с грешките!</p>
                  <div className="text-yellow-400 font-bold text-base flex items-center gap-2 group-hover:text-yellow-300">
                    <span>Играй сега</span><span className="group-hover:translate-x-2 transition-transform duration-300">➡️</span>
                  </div>
                </div>
              </Link>

              {/* ИГРА 3: Бърза Математика */}
              <Link to="/math" className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden hover:bg-white/20 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:-translate-y-2 flex flex-col">
                <div className="h-48 bg-gradient-to-tr from-blue-500 to-cyan-600 flex items-center justify-center relative overflow-hidden">
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-300 drop-shadow-xl relative z-10">⏱️🔢</span>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-black text-white">Бърза Математика</h2>
                    <span className="bg-red-500 text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm">Rush</span>
                  </div>
                  <p className="text-indigo-100 text-sm mb-6 flex-1 leading-relaxed">Решавай уравнения преди времето да изтече! Верен отговор дава време, грешен ти го взима.</p>
                  <div className="text-yellow-400 font-bold text-base flex items-center gap-2 group-hover:text-yellow-300">
                    <span>Играй сега</span><span className="group-hover:translate-x-2 transition-transform duration-300">➡️</span>
                  </div>
                </div>
              </Link>

              {/* ИГРА 4: Думички (Wordle) */}
              <Link to="/wordle" className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden hover:bg-white/20 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:-translate-y-2 flex flex-col">
                <div className="h-48 bg-gradient-to-tr from-green-500 to-emerald-700 flex items-center justify-center relative overflow-hidden">
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-300 drop-shadow-xl relative z-10">🟩🟨⬜</span>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-black text-white">Думички</h2>
                    <span className="bg-yellow-500 text-xs font-bold px-3 py-1 rounded-full text-black shadow-sm">Trending</span>
                  </div>
                  <p className="text-indigo-100 text-sm mb-6 flex-1 leading-relaxed">
                    Българският вариант на популярната игра Wordle. Познай тайната дума от 5 букви за 6 опита!
                  </p>
                  <div className="text-yellow-400 font-bold text-base flex items-center gap-2 group-hover:text-yellow-300">
                    <span>Играй сега</span><span className="group-hover:translate-x-2 transition-transform duration-300">➡️</span>
                  </div>
                </div>
              </Link>

              {/* ИГРА 5: Морски Шах */}
              <Link to="/tictactoe" className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="h-48 bg-gray-800/80 flex items-center justify-center">
                  <span className="text-6xl opacity-50">❌⭕</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-black text-gray-300">Морски Шах</h2>
                  </div>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">Очаквайте скоро...</p>
                </div>
              </Link>

            </div>
          </div>
        } />
        
        {/* РУТОВЕ ЗА ИГРИТЕ */}
        <Route path="/bulls" element={<BullsAndCowsApp />} />
        <Route path="/hangman" element={<HangmanApp />} />
        <Route path="/tictactoe" element={<TicTacToeApp />} />
        <Route path="/math" element={<MathRushApp />} />
        <Route path="/wordle" element={<WordleApp />} /> {/* <-- РУТ ЗА ДУМИЧКИ */}
      </Routes>
      
    </div>
  );
}