import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import { MATH_SETTINGS } from './constants';
import { generateEquation } from './mathLogic';
import Rules from './Rules';
import Leaderboard from './Leaderboard';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

const playSound = (soundName) => {
  const audio = new Audio(`/sounds/${soundName}.mp3`);
  audio.play().catch(e => console.log('Звук блокиран', e));
};

export default function MathRushApp() {
  const [view, setView] = useState('game');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MATH_SETTINGS.INITIAL_TIME);
  const [score, setScore] = useState(0);
  const [currentEq, setCurrentEq] = useState(null);
  
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [flash, setFlash] = useState(null); // 'green' за верен, 'red' за грешен отговор

  // Управление на таймера
  useEffect(() => {
    let timer;
    // Таймерът върви само ако играем и сме в таба "game"
    if (isPlaying && !gameOver && view === 'game' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            setIsPlaying(false);
            playSound('fail');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, gameOver, view, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(MATH_SETTINGS.INITIAL_TIME);
    setCurrentEq(generateEquation(0));
    setGameOver(false);
    setIsPlaying(true);
    setPlayerName('');
  };

  const handleAnswer = (answer) => {
    if (!isPlaying || gameOver) return;

    if (answer === currentEq.correct) {
      // Верен отговор
      playSound('ding');
      const newScore = score + MATH_SETTINGS.POINTS_PER_ANSWER;
      setScore(newScore);
      setTimeLeft(prev => prev + MATH_SETTINGS.BONUS_TIME);
      setCurrentEq(generateEquation(newScore)); // Даваме нова задача
      
      // Бърз зелен ефект на екрана
      setFlash('green');
      setTimeout(() => setFlash(null), 200);
    } else {
      // Грешен отговор
      playSound('fail');
      setTimeLeft(prev => Math.max(0, prev - MATH_SETTINGS.PENALTY_TIME));
      
      // Бърз червен ефект на екрана
      setFlash('red');
      setTimeout(() => setFlash(null), 200);
    }
  };

  const saveToLeaderboard = async () => {
    try {
      await addDoc(collection(db, "mathrush_leaderboard"), {
        name: playerName.trim() || 'Анонимен',
        score: score,
        date: new Date().toLocaleDateString('bg-BG')
      });
      startGame();
    } catch (e) {
      console.error("Грешка при запазване: ", e);
    }
  };

  return (
    <div className="flex flex-col items-center w-full py-8 text-white min-h-screen relative">
      
      {/* Флаш ефект при отговор */}
      {flash === 'green' && <div className="absolute inset-0 bg-green-500/20 z-50 pointer-events-none transition-all duration-200"></div>}
      {flash === 'red' && <div className="absolute inset-0 bg-red-500/20 z-50 pointer-events-none transition-all duration-200"></div>}

      <div className="flex flex-wrap justify-center gap-3 mb-8 w-full max-w-4xl px-4 z-20">
        <Link to="/" className="px-4 py-2 rounded-xl font-bold bg-gray-800 hover:bg-gray-700 border border-gray-600 flex items-center gap-2">⬅️ Портал</Link>
        <button onClick={() => setView('game')} className={`px-4 py-2 rounded-xl font-bold ${view === 'game' ? 'bg-white text-blue-600' : 'bg-white/10 hover:bg-white/20'}`}>🎮 Игра</button>
        <button onClick={() => setView('rules')} className={`px-4 py-2 rounded-xl font-bold ${view === 'rules' ? 'bg-white text-blue-600' : 'bg-white/10 hover:bg-white/20'}`}>📖 Правила</button>
        <button onClick={() => setView('leaderboard')} className={`px-4 py-2 rounded-xl font-bold ${view === 'leaderboard' ? 'bg-white text-blue-600' : 'bg-white/10 hover:bg-white/20'}`}>🏆 Класация</button>
      </div>

      {view === 'rules' && <Rules onBack={() => setView('game')} />}
      {view === 'leaderboard' && <Leaderboard onBack={() => setView('game')} />}

      {view === 'game' && (
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl relative mx-4 text-center">
          
          {/* Статистика горе */}
          <div className="flex justify-between items-center mb-10 bg-black/20 p-4 rounded-2xl">
            <div>
              <span className="block text-xs text-gray-400 font-bold uppercase">Точки</span>
              <span className="text-3xl font-black text-yellow-400">{score}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 font-bold uppercase">Време</span>
              {/* Таймерът става червен и пулсира, ако остават < 5 сек */}
              <span className={`text-4xl font-black ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>

          {!isPlaying && !gameOver ? (
            <div className="py-10">
              <h2 className="text-3xl font-black mb-4">Готов ли си?</h2>
              <p className="text-gray-300 mb-8">Решавай бързо, защото времето изтича!</p>
              <button onClick={startGame} className="w-full bg-blue-500 hover:bg-blue-600 text-white text-2xl px-8 py-4 rounded-2xl font-black shadow-[0_0_20px_rgba(59,130,246,0.5)] transform hover:scale-105 transition-all">
                ЗАПОЧНИ ⏱️
              </button>
            </div>
          ) : gameOver ? (
            <div className="py-4">
              <h2 className="text-4xl font-black text-red-500 mb-2">ВРЕМЕТО ИЗТЕЧЕ!</h2>
              <p className="text-xl text-gray-300 mb-8">Успя да събереш <span className="text-yellow-400 font-black text-3xl">{score}</span> точки.</p>
              
              <div className="mb-4">
                <input type="text" maxLength="15" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Въведи никнейм..." className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-xl focus:outline-none focus:border-blue-400 text-center font-bold text-white placeholder-gray-500" />
              </div>
              <button onClick={saveToLeaderboard} className="w-full bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg mb-4">
                💾 Запази Резултата
              </button>
              <button onClick={startGame} className="w-full bg-gray-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-500">
                🔄 Опитай Пак
              </button>
            </div>
          ) : (
            <div className="py-4">
              {/* Уравнението */}
              <div className="text-6xl font-black tracking-widest mb-12 drop-shadow-lg">
                {currentEq?.text} = ?
              </div>
              
              {/* Бутони с отговори */}
              <div className="grid grid-cols-2 gap-4">
                {currentEq?.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(choice)}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-3xl font-black py-6 rounded-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}