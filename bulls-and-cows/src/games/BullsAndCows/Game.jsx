import { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { GAME_SETTINGS } from './constants';
import { getRevealJoker, getPositionJoker } from './jokers';
import Rules from './Rules';
import Leaderboard from './Leaderboard';

// Пътят към firebase вече е една папка назад!
import { db } from '../../firebase'; 
import { collection, addDoc } from 'firebase/firestore';

const generateSecretNumber = () => {
  let digits = [];
  while (digits.length < GAME_SETTINGS.SECRET_NUMBER_LENGTH) {
    let randomDigit = Math.floor(Math.random() * 10).toString();
    if (!digits.includes(randomDigit)) {
      digits.push(randomDigit);
    }
  }
  return digits.join('');
};

const playSound = (soundName) => {
  const audio = new Audio(`/sounds/${soundName}.mp3`);
  audio.play().catch(e => console.log('Звукът е блокиран', e));
};

export default function BullsAndCowsApp() {
  const [view, setView] = useState('game'); // Вътрешна навигация на играта

  const [secret, setSecret] = useState(generateSecretNumber);
  const [guess, setGuess] = useState('');
  const [history, setHistory] = useState([]);
  
  // ПАМЕТ ЗА ЖОКЕРИТЕ
  const [usedJokers, setUsedJokers] = useState([]);

  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const [notes, setNotes] = useState('');
  const [playerName, setPlayerName] = useState('');

  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(GAME_SETTINGS.INITIAL_LIVES);
  const [score, setScore] = useState(0);

  const [isLevelCleared, setIsLevelCleared] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const heartbeatAudio = useRef(typeof Audio !== "undefined" ? new Audio('/sounds/heartbeat.mp3') : null);

  useEffect(() => {
    if (heartbeatAudio.current) {
      if (lives <= 3 && lives > 0 && !isLevelCleared && !isGameOver) {
        heartbeatAudio.current.loop = true;
        heartbeatAudio.current.play().catch(e => console.log('Чака клик', e));
      } else {
        heartbeatAudio.current.pause();
        heartbeatAudio.current.currentTime = 0;
      }
    }
    return () => {
      if (heartbeatAudio.current) {
        heartbeatAudio.current.pause();
      }
    };
  }, [lives, isLevelCleared, isGameOver]);

  const showError = (msg) => {
    setInfoMessage('');
    setError(msg);
    setTimeout(() => setError(''), 3000);
  };

  const showInfo = (msg) => {
    setError('');
    setInfoMessage(msg);
    setTimeout(() => setInfoMessage(''), 5000);
  };

  const saveToLeaderboard = async (finalLevel, finalScore, name) => {
    try {
      await addDoc(collection(db, "leaderboard"), {
        name: name.trim() || 'Анонимен',
        level: finalLevel,
        score: finalScore,
        date: new Date().toLocaleDateString('bg-BG')
      });
    } catch (e) {
      console.error("Грешка: ", e);
    }
  };

  const handleRevealJoker = () => {
    if (lives <= GAME_SETTINGS.JOKER_REVEAL_COST) {
      showError(`Трябват ти повече от ${GAME_SETTINGS.JOKER_REVEAL_COST} живота!`);
      return;
    }
    const digit = getRevealJoker(secret, history, usedJokers);
    setUsedJokers(prev => [...prev, digit]); // Записваме в паметта
    setLives(prev => prev - GAME_SETTINGS.JOKER_REVEAL_COST);
    playSound('joker');
    showInfo(`💡 Жокер: Цифрата ${digit} участва! (-${GAME_SETTINGS.JOKER_REVEAL_COST} ❤️)`);
  };

  const handlePositionJoker = () => {
    if (lives <= GAME_SETTINGS.JOKER_POSITION_COST) {
      showError(`Трябват ти повече от ${GAME_SETTINGS.JOKER_POSITION_COST} живота!`);
      return;
    }
    const { digit, position } = getPositionJoker(secret, history, usedJokers);
    setUsedJokers(prev => [...prev, digit]); // Записваме в паметта
    setLives(prev => prev - GAME_SETTINGS.JOKER_POSITION_COST);
    playSound('joker');
    showInfo(`📍 Жокер: Цифрата ${digit} е на ${position}-ра позиция! (-${GAME_SETTINGS.JOKER_POSITION_COST} ❤️)`);
  };

  const handleGuess = (e) => {
    e.preventDefault();

    if (guess.length !== GAME_SETTINGS.SECRET_NUMBER_LENGTH) {
      showError(`Въведи точно ${GAME_SETTINGS.SECRET_NUMBER_LENGTH} цифри!`);
      return;
    }

    const uniqueDigits = new Set(guess.split(''));
    if (uniqueDigits.size !== GAME_SETTINGS.SECRET_NUMBER_LENGTH) {
      showError('Цифрите не трябва да се повтарят!');
      return;
    }

    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < GAME_SETTINGS.SECRET_NUMBER_LENGTH; i++) {
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
    setInfoMessage('');

    if (bulls === GAME_SETTINGS.SECRET_NUMBER_LENGTH) {
      playSound('win');
      setIsLevelCleared(true);
      setScore(score + GAME_SETTINGS.BASE_SCORE_PER_LEVEL + (currentLives * GAME_SETTINGS.SCORE_PER_REMAINING_LIFE));
      return;
    } else if (bulls === 0 && cows === 0) {
      playSound('fail');
    } else if (bulls > 0) {
      playSound('bull');
    } else {
      playSound('ding');
    }

    if (currentLives === 0) {
      setIsGameOver(true);
    }
  };

  const startNextLevel = () => {
    setSecret(generateSecretNumber());
    setHistory([]);
    setUsedJokers([]); // Изчистваме паметта на жокерите
    setLives(lives + GAME_SETTINGS.BONUS_LIVES_PER_LEVEL);
    setLevel(level + 1);
    setIsLevelCleared(false);
    setGuess('');
    setNotes('');
  };

  const restartGame = () => {
    setSecret(generateSecretNumber());
    setHistory([]);
    setUsedJokers([]);
    setLevel(1);
    setLives(GAME_SETTINGS.INITIAL_LIVES);
    setScore(0);
    setIsGameOver(false);
    setIsLevelCleared(false);
    setGuess('');
    setNotes('');
    setPlayerName('');
    setError('');
    setInfoMessage('');
  };

  const handleGameOverSave = async () => {
    await saveToLeaderboard(level, score, playerName);
    restartGame();
  };

  const isDangerZone = lives <= 3 && !isLevelCleared && !isGameOver;

  return (
    <div className="flex flex-col items-center w-full py-8 text-gray-800">
      {/* Вътрешна навигация на играта */}
      <div className="flex gap-4 mb-8">
        <button onClick={() => setView('game')} className={`px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${view === 'game' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white hover:bg-white/30'}`}>🎮 Игра</button>
        <button onClick={() => setView('rules')} className={`px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${view === 'rules' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white hover:bg-white/30'}`}>📖 Правила</button>
        <button onClick={() => setView('leaderboard')} className={`px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${view === 'leaderboard' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white hover:bg-white/30'}`}>🏆 Класация</button>
      </div>

      <div className={view === 'game' ? 'block w-full' : 'hidden'}>
        {isLevelCleared && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={400} gravity={0.15} />}

        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl mx-auto justify-center items-start z-10 relative">
          <div className={`bg-white/95 backdrop-blur-sm rounded-3xl w-full lg:max-w-md p-8 border relative overflow-hidden transition-all duration-500 ${isDangerZone ? 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)]' : 'border-white/20 shadow-2xl'}`}>
            {isDangerZone && <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none rounded-3xl" />}

            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100 shadow-inner mt-4 relative z-10">
              <div className="text-center">
                <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider">Ниво</span>
                <span className="text-2xl font-black text-indigo-600">{level}</span>
              </div>
              <div className="text-center">
                <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider">Животи</span>
                <span className={`text-2xl font-black ${isDangerZone ? 'text-red-600 animate-bounce' : 'text-pink-500'}`}>{lives} ❤️</span>
              </div>
              <div className="text-center">
                <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider">Точки</span>
                <span className="text-2xl font-black text-yellow-500">{score}</span>
              </div>
            </div>

            <div className="h-6 mb-2 relative z-10">
              {error && <p className="text-red-500 text-sm font-bold text-center animate-bounce">⚠️ {error}</p>}
              {infoMessage && <p className="text-blue-600 bg-blue-50 py-1 rounded-lg text-sm font-bold text-center border border-blue-200 shadow-sm">{infoMessage}</p>}
            </div>

            {isLevelCleared && !isGameOver && (
              <div className="text-center p-6 bg-gradient-to-b from-green-50 to-green-100 border border-green-200 rounded-2xl shadow-inner mb-6 relative z-10">
                <h2 className="text-3xl font-black text-green-600 mb-2">НИВО {level} МИНАТО! 🎉</h2>
                <p className="text-gray-700 font-medium mb-4">Ти позна числото <span className="font-black text-xl text-green-700">{secret}</span></p>
                <p className="text-sm bg-green-200 text-green-800 inline-block px-3 py-1 rounded-full font-bold mb-6 shadow-sm">
                  +{GAME_SETTINGS.BONUS_LIVES_PER_LEVEL} Живота бонус!
                </p>
                <button onClick={startNextLevel} className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Към Ниво {level + 1} ➡️
                </button>
              </div>
            )}

            {isGameOver && (
              <div className="text-center p-6 bg-gradient-to-b from-red-50 to-red-100 border border-red-200 rounded-2xl shadow-inner mb-6 relative z-10">
                <h2 className="text-3xl font-black text-red-600 mb-2">КРАЙ НА ИГРАТА! 💀</h2>
                <p className="text-gray-700 mb-4">Тайното число беше <span className="font-black text-xl text-red-700">{secret}</span></p>
                <div className="bg-white p-3 rounded-xl mb-4 shadow-sm border border-red-100">
                  <p className="text-sm text-gray-500 font-bold uppercase">Твоят резултат</p>
                  <p className="text-2xl font-black text-indigo-600">{score} точки <span className="text-sm font-normal text-gray-500">(Ниво {level})</span></p>
                </div>
                <div className="mb-6">
                  <input type="text" maxLength="15" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Въведи твоя никнейм..." className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500 text-center font-bold text-gray-700 shadow-inner" />
                </div>
                <button onClick={handleGameOverSave} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  💾 Запази и Нова Игра
                </button>
              </div>
            )}

            {!isLevelCleared && !isGameOver && (
              <form onSubmit={handleGuess} className="flex flex-col gap-3 mb-6 relative z-10">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={GAME_SETTINGS.SECRET_NUMBER_LENGTH}
                  value={guess}
                  onChange={(e) => {
                    setGuess(e.target.value.replace(/\D/g, ''));
                    if (error) setError('');
                  }}
                  placeholder="1234"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-purple-500 transition-all text-2xl tracking-[0.5em] text-center font-black text-gray-700 bg-gray-50/50"
                />
                
                <button
                  type="submit"
                  disabled={guess.length !== GAME_SETTINGS.SECRET_NUMBER_LENGTH}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:shadow-none"
                >
                  Опитай
                </button>

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleRevealJoker}
                    disabled={lives <= GAME_SETTINGS.JOKER_REVEAL_COST}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 disabled:bg-gray-50 disabled:text-gray-400 border border-blue-200 px-2 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                  >
                    💡 Цифра (-{GAME_SETTINGS.JOKER_REVEAL_COST}❤️)
                  </button>
                  <button
                    type="button"
                    onClick={handlePositionJoker}
                    disabled={lives <= GAME_SETTINGS.JOKER_POSITION_COST}
                    className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 disabled:bg-gray-50 disabled:text-gray-400 border border-purple-200 px-2 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                  >
                    📍 Позиция (-{GAME_SETTINGS.JOKER_POSITION_COST}❤️)
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar relative z-10">
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
                    <span className="flex items-center gap-1.5 text-green-700 bg-green-100/80 px-3 py-1.5 rounded-lg border border-green-200"><span className="text-xl drop-shadow-sm">🐂</span> {item.bulls}</span>
                    <span className="flex items-center gap-1.5 text-orange-700 bg-orange-100/80 px-3 py-1.5 rounded-lg border border-orange-200"><span className="text-xl drop-shadow-sm">🐄</span> {item.cows}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full lg:max-w-xs p-6 border border-white/20 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-gray-700 flex items-center gap-2"><span>📝</span> Бележки</h3>
              <button onClick={() => setNotes('')} className="text-xs text-red-500 font-bold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-200">Изчисти</button>
            </div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Води си записки тук..." className="flex-1 w-full bg-yellow-50/60 border-2 border-yellow-200 rounded-xl p-4 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all resize-none custom-scrollbar font-medium text-gray-700 leading-relaxed shadow-inner" />
          </div>
        </div>
      </div>

      {/* Рендерираме Правила и Класация под същото меню, както преди */}
      {view === 'rules' && <Rules onBack={() => setView('game')} />}
      {view === 'leaderboard' && <Leaderboard onBack={() => setView('game')} />}
    </div>
  );
}