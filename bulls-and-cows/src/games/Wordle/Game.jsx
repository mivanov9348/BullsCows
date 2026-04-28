import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import { WORDLE_SETTINGS, KEYBOARD_ROWS } from './constants';
import { WORDS_DATABASE } from './words';
import Rules from './Rules';
import Leaderboard from './Leaderboard';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

const playSound = (soundName) => {
  const audio = new Audio(`/sounds/${soundName}.mp3`);
  audio.play().catch(e => console.log('Звук блокиран', e));
};

export default function WordleApp() {
  const [view, setView] = useState('game');
  
  const [secretWord, setSecretWord] = useState('');
  const [guesses, setGuesses] = useState([]); 
  const [currentGuess, setCurrentGuess] = useState(''); 
  
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [shakeRow, setShakeRow] = useState(false);
  
  const [earnedPoints, setEarnedPoints] = useState(null); // За показване на спечелените точки

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = WORDS_DATABASE[Math.floor(Math.random() * WORDS_DATABASE.length)];
    setSecretWord(randomWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setGameWon(false);
    setInfoMessage('');
    setEarnedPoints(null);
  };

  const restartFullGame = () => {
    setScore(0);
    startNewGame();
  };

  const showInfo = (msg) => {
    setInfoMessage(msg);
    setTimeout(() => setInfoMessage(''), 2000);
  };

  const handleKeyPress = useCallback((key) => {
    if (gameOver || gameWon || view !== 'game') return;

    if (key === 'ENTER') {
      if (currentGuess.length !== WORDLE_SETTINGS.WORD_LENGTH) {
        setShakeRow(true);
        showInfo('Думата е твърде кратка!');
        setTimeout(() => setShakeRow(false), 500);
        return;
      }
      
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess === secretWord) {
        playSound('win');
        setGameWon(true);
        
        // --- НОВАТА ЛОГИКА ЗА ТОЧКУВАНЕ ---
        const points = WORDLE_SETTINGS.ATTEMPT_SCORES[newGuesses.length - 1];
        setEarnedPoints(points); // Запазваме ги, за да ги покажем на екрана
        setScore(prev => prev + points);
        // ----------------------------------
        
      } else if (newGuesses.length >= WORDLE_SETTINGS.MAX_ATTEMPTS) {
        playSound('fail');
        setGameOver(true);
      } else {
        playSound('ding');
      }
      return;
    }

    if (key === 'DEL' || key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

    if (currentGuess.length < WORDLE_SETTINGS.WORD_LENGTH && /^[А-ЯЪЬЮЯ]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, guesses, gameOver, gameWon, secretWord, view]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      let key = e.key.toUpperCase();
      if (key === 'BACKSPACE') key = 'DEL';
      handleKeyPress(key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const saveToLeaderboard = async () => {
    try {
      await addDoc(collection(db, "wordle_leaderboard"), {
        name: playerName.trim() || 'Анонимен',
        score: score,
        date: new Date().toLocaleDateString('bg-BG')
      });
      restartFullGame();
    } catch (e) {
      console.error("Грешка при запазване: ", e);
    }
  };

  const getGuessColors = (guessStr) => {
    let result = Array(5).fill('bg-gray-600 border-gray-600 text-white');
    let secretArr = secretWord.split('');
    let guessArr = guessStr.split('');

    for (let i = 0; i < 5; i++) {
      if (guessArr[i] === secretArr[i]) {
        result[i] = 'bg-green-500 border-green-500 text-white';
        secretArr[i] = null; 
        guessArr[i] = null;
      }
    }

    for (let i = 0; i < 5; i++) {
      if (guessArr[i] !== null && secretArr.includes(guessArr[i])) {
        result[i] = 'bg-yellow-500 border-yellow-500 text-white';
        secretArr[secretArr.indexOf(guessArr[i])] = null; 
      }
    }
    return result;
  };

  const getKeyboardColors = () => {
    const kbColors = {};
    guesses.forEach(guess => {
      const colors = getGuessColors(guess);
      guess.split('').forEach((letter, i) => {
        const colorClass = colors[i];
        const isGreen = colorClass.includes('bg-green-500');
        const isYellow = colorClass.includes('bg-yellow-500');
        
        if (isGreen) {
          kbColors[letter] = 'bg-green-500 text-white';
        } else if (isYellow && kbColors[letter] !== 'bg-green-500') {
          kbColors[letter] = 'bg-yellow-500 text-white';
        } else if (!kbColors[letter]) {
          kbColors[letter] = 'bg-gray-700 text-white opacity-50'; 
        }
      });
    });
    return kbColors;
  };

  const keyboardColors = getKeyboardColors();

  return (
    <div className="flex flex-col items-center w-full py-8 text-white min-h-screen relative">
      {gameWon && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={400} />}

      <div className="flex flex-wrap justify-center gap-3 mb-8 w-full max-w-4xl px-4 z-20 relative">
        <Link to="/" className="px-4 py-2 rounded-xl font-bold bg-gray-800 hover:bg-gray-700 border border-gray-600 flex items-center gap-2">⬅️ Портал</Link>
        <button onClick={() => setView('game')} className={`px-4 py-2 rounded-xl font-bold ${view === 'game' ? 'bg-white text-green-600' : 'bg-white/10 hover:bg-white/20'}`}>🎮 Игра</button>
        <button onClick={() => setView('rules')} className={`px-4 py-2 rounded-xl font-bold ${view === 'rules' ? 'bg-white text-green-600' : 'bg-white/10 hover:bg-white/20'}`}>📖 Правила</button>
        <button onClick={() => setView('leaderboard')} className={`px-4 py-2 rounded-xl font-bold ${view === 'leaderboard' ? 'bg-white text-green-600' : 'bg-white/10 hover:bg-white/20'}`}>🏆 Класация</button>
      </div>

      {view === 'rules' && <Rules onBack={() => setView('game')} />}
      {view === 'leaderboard' && <Leaderboard onBack={() => setView('game')} />}

      {view === 'game' && (
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative mx-4 text-center z-10 flex flex-col">
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-black tracking-widest uppercase">ДУМИЧКИ</h1>
            <div className="text-xl font-black text-yellow-400">Точки: {score}</div>
          </div>

          <div className="h-6 mb-4">
            {infoMessage && <span className="bg-gray-800 text-white px-4 py-1 rounded-lg text-sm font-bold shadow">{infoMessage}</span>}
          </div>

          {/* GRID С ДУМИТЕ */}
          <div className="flex flex-col gap-2 mb-8 items-center">
            {Array.from({ length: WORDLE_SETTINGS.MAX_ATTEMPTS }).map((_, rowIndex) => {
              const isCurrentRow = rowIndex === guesses.length;
              const guessStr = guesses[rowIndex] || (isCurrentRow ? currentGuess : '');
              const colors = guesses[rowIndex] ? getGuessColors(guesses[rowIndex]) : Array(5).fill('border-gray-500/50 bg-transparent');

              return (
                <div key={rowIndex} className={`flex gap-2 ${isCurrentRow && shakeRow ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                  {Array.from({ length: WORDLE_SETTINGS.WORD_LENGTH }).map((_, colIndex) => {
                    const letter = guessStr[colIndex] || '';
                    const colorClass = colors[colIndex];
                    const isFilled = letter !== '';
                    
                    return (
                      <div 
                        key={colIndex} 
                        className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl font-black uppercase border-2 rounded-lg transition-all duration-300
                          ${colorClass} 
                          ${isCurrentRow && isFilled ? 'border-gray-300 scale-105' : ''}
                        `}
                      >
                        {letter}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* КРАЙНИ ЕКРАНИ */}
          {(gameOver || gameWon) && (
            <div className="mb-6 p-4 bg-gray-900/80 rounded-xl border border-gray-700 animate-[fadeIn_0.5s_ease-in-out]">
              <h2 className={`text-2xl font-black mb-2 ${gameWon ? 'text-green-400' : 'text-red-500'}`}>
                {gameWon ? "ПОЗДРАВЛЕНИЯ!" : "КРАЙ НА ИГРАТА"}
              </h2>
              
              {/* Показваме спечелените точки, ако е познал */}
              {gameWon && earnedPoints && (
                <p className="text-yellow-400 font-bold mb-2 text-lg animate-bounce">
                  Спечели +{earnedPoints} точки!
                </p>
              )}

              <p className="text-lg text-gray-300 mb-4">Думата беше: <span className="font-black text-white">{secretWord}</span></p>
              
              {gameOver && score > 0 && (
                <div className="mb-4">
                  <input type="text" maxLength="15" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Въведи никнейм..." className="w-full px-4 py-2 bg-black/50 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400 text-center font-bold text-white mb-2" />
                  <button onClick={saveToLeaderboard} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold transition-all">💾 Запази в класацията</button>
                </div>
              )}
              
              <button onClick={gameWon ? startNewGame : restartFullGame} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-black mt-2">
                {gameWon ? "СЛЕДВАЩА ДУМА ➡️" : "🔄 НОВА ИГРА"}
              </button>
            </div>
          )}

          {/* ВИРТУАЛНА КЛАВИАТУРА */}
          {!gameOver && !gameWon && (
            <div className="flex flex-col gap-2 w-full max-w-sm mx-auto mt-auto">
              {KEYBOARD_ROWS.map((row, i) => (
                <div key={i} className="flex justify-center gap-1 sm:gap-1.5">
                  {row.map(key => {
                    const isActionKey = key === 'ENTER' || key === 'DEL';
                    const keyBg = keyboardColors[key] || 'bg-gray-300 text-gray-900 hover:bg-gray-400';
                    return (
                      <button
                        key={key}
                        onClick={() => handleKeyPress(key)}
                        className={`flex items-center justify-center font-bold rounded shadow-sm transition-colors
                          ${isActionKey ? 'px-2 sm:px-3 text-xs sm:text-sm bg-gray-400 text-gray-900 hover:bg-gray-500' : 'w-8 h-10 sm:w-10 sm:h-12 text-sm sm:text-base'}
                          ${!isActionKey ? keyBg : ''}
                        `}
                      >
                        {key === 'DEL' ? '⌫' : key}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}