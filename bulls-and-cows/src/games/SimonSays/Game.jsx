import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SIMON_SETTINGS } from './constants';
import Rules from './Rules';
import Leaderboard from './Leaderboard';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

// Помощна функция за изчакване (пауза)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const playSound = (soundName) => {
  const audio = new Audio(`/sounds/${soundName}.mp3`);
  audio.play().catch(e => console.log('Звук блокиран', e));
};

export default function SimonSaysApp() {
  const [view, setView] = useState('game');
  
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [activeColor, setActiveColor] = useState(null);
  
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');

  // Стартира нова игра
  const startGame = () => {
    setScore(0);
    setRound(1);
    setSequence([]);
    setPlayerSequence([]);
    setGameOver(false);
    setPlayerName('');
    setIsPlaying(true);
    nextRound([]); // Извикваме с празен масив за първия рунд
  };

  // Генерира следващия цвят и пуска поредицата
  const nextRound = async (currentSequence) => {
    setIsPlayerTurn(false);
    const randomColor = SIMON_SETTINGS.COLORS[Math.floor(Math.random() * SIMON_SETTINGS.COLORS.length)];
    const newSequence = [...currentSequence, randomColor];
    
    setSequence(newSequence);
    setPlayerSequence([]);

    // Даваме малко време на играча да се подготви, преди да започне да свети
    await sleep(800); 

    // Компютърът показва поредицата
    for (let i = 0; i < newSequence.length; i++) {
      const color = newSequence[i];
      setActiveColor(color);
      playSound('ding'); // Можеш да сложиш различни звуци според цвета
      
      // Свети за определено време
      await sleep(SIMON_SETTINGS.FLASH_DURATION - Math.min(newSequence.length * 15, 300)); // Леко забързваме с нивата
      
      setActiveColor(null);
      
      // Пауза преди следващия цвят
      await sleep(SIMON_SETTINGS.PAUSE_DURATION);
    }

    setIsPlayerTurn(true);
  };

  // Когато играчът кликне на цвят
  const handleColorClick = async (color) => {
    if (!isPlayerTurn || gameOver || !isPlaying) return;

    // Светваме бутона
    setActiveColor(color);
    playSound('ding');
    setTimeout(() => setActiveColor(null), 200);

    const newPlayerSeq = [...playerSequence, color];
    setPlayerSequence(newPlayerSeq);

    // Проверяваме дали текущият клик е верен
    const currentIndex = newPlayerSeq.length - 1;
    if (newPlayerSeq[currentIndex] !== sequence[currentIndex]) {
      // ГРЕШКА! Край на играта
      playSound('fail');
      setGameOver(true);
      setIsPlaying(false);
      setIsPlayerTurn(false);
      return;
    }

    // Ако сме стигнали края на поредицата успешно
    if (newPlayerSeq.length === sequence.length) {
      setIsPlayerTurn(false);
      setScore(prev => prev + SIMON_SETTINGS.POINTS_PER_ROUND);
      setRound(prev => prev + 1);
      
      playSound('win'); // Звук за успешен рунд
      
      // Пускаме следващия рунд
      nextRound(sequence);
    }
  };

  const saveToLeaderboard = async () => {
    try {
      await addDoc(collection(db, "simonsays_leaderboard"), {
        name: playerName.trim() || 'Анонимен',
        score: score,
        date: new Date().toLocaleDateString('bg-BG')
      });
      startGame();
    } catch (e) {
      console.error("Грешка при запазване: ", e);
    }
  };

  // Стилизация на бутоните (за светещия ефект)
  const colorStyles = {
    green: `bg-green-500 rounded-tl-full ${activeColor === 'green' ? 'brightness-150 scale-105 shadow-[0_0_40px_rgba(34,197,94,0.8)] z-10' : 'hover:brightness-110'}`,
    red: `bg-red-500 rounded-tr-full ${activeColor === 'red' ? 'brightness-150 scale-105 shadow-[0_0_40px_rgba(239,68,68,0.8)] z-10' : 'hover:brightness-110'}`,
    yellow: `bg-yellow-500 rounded-bl-full ${activeColor === 'yellow' ? 'brightness-150 scale-105 shadow-[0_0_40px_rgba(234,179,8,0.8)] z-10' : 'hover:brightness-110'}`,
    blue: `bg-blue-600 rounded-br-full ${activeColor === 'blue' ? 'brightness-150 scale-105 shadow-[0_0_40px_rgba(37,99,235,0.8)] z-10' : 'hover:brightness-110'}`,
  };

  return (
    <div className="flex flex-col items-center w-full py-8 text-white min-h-screen relative">
      <div className="flex flex-wrap justify-center gap-3 mb-8 w-full max-w-4xl px-4 z-20 relative">
        <Link to="/" className="px-4 py-2 rounded-xl font-bold bg-gray-800 hover:bg-gray-700 border border-gray-600 flex items-center gap-2">⬅️ Портал</Link>
        <button onClick={() => setView('game')} className={`px-4 py-2 rounded-xl font-bold ${view === 'game' ? 'bg-white text-pink-600' : 'bg-white/10 hover:bg-white/20'}`}>🎮 Игра</button>
        <button onClick={() => setView('rules')} className={`px-4 py-2 rounded-xl font-bold ${view === 'rules' ? 'bg-white text-pink-600' : 'bg-white/10 hover:bg-white/20'}`}>📖 Правила</button>
        <button onClick={() => setView('leaderboard')} className={`px-4 py-2 rounded-xl font-bold ${view === 'leaderboard' ? 'bg-white text-pink-600' : 'bg-white/10 hover:bg-white/20'}`}>🏆 Класация</button>
      </div>

      {view === 'rules' && <Rules onBack={() => setView('game')} />}
      {view === 'leaderboard' && <Leaderboard onBack={() => setView('game')} />}

      {view === 'game' && (
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl relative mx-4 text-center z-10">
          
          <div className="flex justify-between items-center mb-8 bg-black/20 p-4 rounded-2xl">
            <div>
              <span className="block text-xs text-gray-400 font-bold uppercase">Точки</span>
              <span className="text-3xl font-black text-yellow-400">{score}</span>
            </div>
            <div className="text-right">
              <span className="block text-xs text-gray-400 font-bold uppercase">Рунд</span>
              <span className="text-3xl font-black text-pink-400">{round}</span>
            </div>
          </div>

          {!isPlaying && !gameOver ? (
            <div className="py-10">
              <h2 className="text-3xl font-black mb-4">Тренирай паметта си!</h2>
              <p className="text-gray-300 mb-8">Повтаряй поредицата от цветове без грешка.</p>
              <button onClick={startGame} className="w-full bg-pink-500 hover:bg-pink-600 text-white text-2xl px-8 py-4 rounded-2xl font-black shadow-[0_0_20px_rgba(236,72,153,0.5)] transform hover:scale-105 transition-all">
                ЗАПОЧНИ 🧠
              </button>
            </div>
          ) : gameOver ? (
            <div className="py-4">
              <h2 className="text-4xl font-black text-red-500 mb-2">ГРЕШКА! 💥</h2>
              <p className="text-xl text-gray-300 mb-8">Стигна до рунд <span className="text-pink-400 font-black">{round}</span> и събра <span className="text-yellow-400 font-black">{score}</span> точки.</p>
              
              <div className="mb-4">
                <input type="text" maxLength="15" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Въведи никнейм..." className="w-full px-4 py-3 bg-black/30 border border-pink-500/30 rounded-xl focus:outline-none focus:border-pink-400 text-center font-bold text-white placeholder-gray-500" />
              </div>
              <button onClick={saveToLeaderboard} className="w-full bg-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-700 shadow-lg mb-4">
                💾 Запази Резултата
              </button>
              <button onClick={startGame} className="w-full bg-gray-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-500">
                🔄 Опитай Пак
              </button>
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center">
              {/* Статус съобщение */}
              <div className="h-8 mb-6">
                <span className={`text-xl font-black tracking-widest uppercase ${isPlayerTurn ? 'text-green-400 animate-pulse' : 'text-yellow-400'}`}>
                  {isPlayerTurn ? 'ТВОЙ РЕД Е!' : 'ГЛЕДАЙ...'}
                </span>
              </div>
              
              {/* Игровата дъска 2x2 */}
              <div className="grid grid-cols-2 gap-4 w-64 h-64 bg-gray-900 p-4 rounded-full border-8 border-gray-800 shadow-2xl relative overflow-hidden">
                {/* Централен кръг (чисто декоративен) */}
                <div className="absolute inset-0 m-auto w-20 h-20 bg-gray-800 rounded-full z-20 flex items-center justify-center border-4 border-gray-900">
                  <span className="text-gray-400 font-black text-xs">SIMON</span>
                </div>

                <button 
                  onClick={() => handleColorClick('green')} 
                  disabled={!isPlayerTurn}
                  className={`transition-all duration-200 active:scale-95 ${colorStyles.green} ${!isPlayerTurn ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
                <button 
                  onClick={() => handleColorClick('red')} 
                  disabled={!isPlayerTurn}
                  className={`transition-all duration-200 active:scale-95 ${colorStyles.red} ${!isPlayerTurn ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
                <button 
                  onClick={() => handleColorClick('yellow')} 
                  disabled={!isPlayerTurn}
                  className={`transition-all duration-200 active:scale-95 ${colorStyles.yellow} ${!isPlayerTurn ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
                <button 
                  onClick={() => handleColorClick('blue')} 
                  disabled={!isPlayerTurn}
                  className={`transition-all duration-200 active:scale-95 ${colorStyles.blue} ${!isPlayerTurn ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}