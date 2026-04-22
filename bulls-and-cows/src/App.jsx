import { useState, useEffect } from 'react';
import Rules from './Rules';
import Leaderboard from './Leaderboard';

const generateSecretNumber = () => {
  let digits = [];
  while (digits.length < 4) {
    let randomDigit = Math.floor(Math.random() * 10).toString();
    if (!digits.includes(randomDigit)) {
      digits.push(randomDigit);
    }
  }
  return digits.join('');
};

export default function App() {
  const [view, setView] = useState('game');

  const [secret, setSecret] = useState('');
  const [guess, setGuess] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  
  // НОВ STATE: За бележника на играча
  const [notes, setNotes] = useState('');

  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(15);
  const [score, setScore] = useState(0);
  
  const [isLevelCleared, setIsLevelCleared] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    setSecret(generateSecretNumber());
  }, []);

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 3000);
  };

  const saveToLeaderboard = (finalLevel, finalScore) => {
    const saved = JSON.parse(localStorage.getItem('bullsAndCowsLeaderboard')) || [];
    const newRecord = {
      level: finalLevel,
      score: finalScore,
      date: new Date().toLocaleDateString('bg-BG')
    };
    localStorage.setItem('bullsAndCowsLeaderboard', JSON.stringify([...saved, newRecord]));
  };

  const handleGuess = (e) => {
    e.preventDefault();

    if (guess.length !== 4) {
      showError('Въведи точно 4 цифри!');
      return;
    }

    const uniqueDigits = new Set(guess.split(''));
    if (uniqueDigits.size !== 4) {
      showError('Цифрите не трябва да се повтарят!');
      return;
    }

    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < 4; i++) {
      if (guess[i] === secret[i]) {
        bulls++;
      } else if (secret.includes(guess[i])) {
        cows++;
      }
    }

    const currentLives = lives - 1;
    setLives(currentLives);
    
    const newHistory = [{ guess, bulls, cows }, ...history];
    setHistory(newHistory);
    setGuess('');
    setError('');

    if (bulls === 4) {
      setIsLevelCleared(true);
      setScore(score + 100 + (currentLives * 10));
      return;
    }

    if (currentLives === 0) {
      setIsGameOver(true);
      saveToLeaderboard(level, score);
    }
  };

  const startNextLevel = () => {
    setSecret(generateSecretNumber());
    setHistory([]);
    setLives(lives + 7);
    setLevel(level + 1);
    setIsLevelCleared(false);
    setGuess('');
    setNotes(''); // Изчистваме бележките за новото ниво (по желание)
  };

  const restartGame = () => {
    setSecret(generateSecretNumber());
    setHistory([]);
    setLevel(1);
    setLives(15);
    setScore(0);
    setIsGameOver(false);
    setIsLevelCleared(false);
    setGuess('');
    setNotes('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 font-sans bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-gray-800">
      
      {/* Навигация */}
      <div className="flex gap-4 mb-8">
        <button onClick={() => setView('game')} className={`px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${view === 'game' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white hover:bg-white/30'}`}>🎮 Игра</button>
        <button onClick={() => setView('rules')} className={`px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${view === 'rules' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white hover:bg-white/30'}`}>📖 Правила</button>
        <button onClick={() => setView('leaderboard')} className={`px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${view === 'leaderboard' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white hover:bg-white/30'}`}>🏆 Класация</button>
      </div>

      {view === 'rules' && <Rules onBack={() => setView('game')} />}
      {view === 'leaderboard' && <Leaderboard onBack={() => setView('game')} />}

      {/* Основна игрална част с Тетрадка отстрани */}
      {view === 'game' && (
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl justify-center items-start">
          
          {/* ЛЯВА ЧАСТ: Самата игра */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full lg:max-w-md p-8 border border-white/20">
            
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100 shadow-inner">
              <div className="text-center">
                <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider">Ниво</span>
                <span className="text-2xl font-black text-indigo-600">{level}</span>
              </div>
              <div className="text-center">
                <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider">Животи</span>
                <span className={`text-2xl font-black ${lives <= 3 ? 'text-red-500 animate-pulse' : 'text-pink-500'}`}>
                  {lives} ❤️
                </span>
              </div>
              <div className="text-center">
                <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider">Точки</span>
                <span className="text-2xl font-black text-yellow-500">{score}</span>
              </div>
            </div>

            <div className="h-6 mb-2">
              {error && <p className="text-red-500 text-sm font-bold text-center animate-bounce">⚠️ {error}</p>}
            </div>

            {isLevelCleared && !isGameOver && (
              <div className="text-center p-6 bg-gradient-to-b from-green-50 to-green-100 border border-green-200 rounded-2xl shadow-inner mb-6">
                <h2 className="text-3xl font-black text-green-600 mb-2">НИВО {level} МИНАТО! 🎉</h2>
                <p className="text-gray-700 font-medium mb-4">Ти позна числото <span className="font-black text-xl text-green-700">{secret}</span></p>
                <p className="text-sm bg-green-200 text-green-800 inline-block px-3 py-1 rounded-full font-bold mb-6">
                  +7 Живота бонус!
                </p>
                <button onClick={startNextLevel} className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Към Ниво {level + 1} ➡️
                </button>
              </div>
            )}

            {isGameOver && (
              <div className="text-center p-6 bg-gradient-to-b from-red-50 to-red-100 border border-red-200 rounded-2xl shadow-inner mb-6">
                <h2 className="text-3xl font-black text-red-600 mb-2">КРАЙ НА ИГРАТА! 💀</h2>
                <p className="text-gray-700 mb-2">Опитите ти свършиха.</p>
                <p className="text-gray-700 mb-4">Тайното число беше <span className="font-black text-xl text-red-700">{secret}</span></p>
                
                <div className="bg-white p-3 rounded-xl mb-6 shadow-sm border border-red-100">
                  <p className="text-sm text-gray-500 font-bold uppercase">Твоят резултат</p>
                  <p className="text-2xl font-black text-indigo-600">{score} точки (Ниво {level})</p>
                </div>

                <button onClick={restartGame} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  🔄 Нова Игра
                </button>
              </div>
            )}

            {!isLevelCleared && !isGameOver && (
              <form onSubmit={handleGuess} className="flex gap-3 mb-6">
                <input
                  type="text"
                  maxLength="4"
                  value={guess}
                  onChange={(e) => {
                    setGuess(e.target.value.replace(/\D/g, ''));
                    if (error) setError('');
                  }} 
                  placeholder="1234"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-purple-500 transition-all text-2xl tracking-[0.5em] text-center font-black text-gray-700 bg-gray-50/50"
                />
                <button
                  type="submit"
                  disabled={guess.length !== 4}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none"
                >
                  Опитай
                </button>
              </form>
            )}

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {history.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-purple-200 transition-colors group">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-300 text-sm font-black w-6 text-right group-hover:text-purple-300 transition-colors">
                      #{history.length - index}
                    </span>
                    <span className="text-2xl font-mono font-black tracking-widest text-gray-700">
                      {item.guess}
                    </span>
                  </div>
                  <div className="flex gap-2 font-bold text-sm">
                    <span className="flex items-center gap-1.5 text-green-700 bg-green-100/80 px-3 py-1.5 rounded-lg border border-green-200">
                      <span className="text-xl drop-shadow-sm">🐂</span> {item.bulls}
                    </span>
                    <span className="flex items-center gap-1.5 text-orange-700 bg-orange-100/80 px-3 py-1.5 rounded-lg border border-orange-200">
                      <span className="text-xl drop-shadow-sm">🐄</span> {item.cows}
                    </span>
                  </div>
                </div>
              ))}
              
              {history.length === 0 && !isLevelCleared && !isGameOver && (
                <div className="text-center py-6">
                  <p className="text-gray-400 font-medium text-lg">Въведи първото си предположение!</p>
                  <span className="text-4xl mt-2 block opacity-50">🤔</span>
                </div>
              )}
            </div>
          </div>

          {/* ДЯСНА ЧАСТ: Тетрадка на играча */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full lg:max-w-xs p-6 border border-white/20 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-gray-700 flex items-center gap-2">
                <span>📝</span> Бележки
              </h3>
              <button 
                onClick={() => setNotes('')} 
                className="text-xs text-red-500 font-bold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-200"
              >
                Изчисти
              </button>
            </div>
            
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Води си записки тук...&#10;&#10;Например:&#10;❌ 1, 2, 3 отпадат&#10;👀 5 сигурно участва&#10;🐂 8 е на първа позиция"
              className="flex-1 w-full bg-yellow-50/60 border-2 border-yellow-200 rounded-xl p-4 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all resize-none custom-scrollbar font-medium text-gray-700 leading-relaxed shadow-inner"
            />
          </div>

        </div>
      )}
    </div>
  );
}