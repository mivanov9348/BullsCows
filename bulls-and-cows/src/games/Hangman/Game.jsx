import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import { WORDS_DATABASE } from './words';
import { HANGMAN_SETTINGS } from './constants';
import { getHangmanJoker } from './jokers';
import Rules from './Rules';
import Leaderboard from './Leaderboard';

// Импорти за Firebase
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

const ALPHABET = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯ".split("");

export default function HangmanApp() {
  const [view, setView] = useState('game');
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [lives, setLives] = useState(HANGMAN_SETTINGS.INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [info, setInfo] = useState("");
  const [playerName, setPlayerName] = useState(''); // За класацията

  useEffect(() => {
    startNewLevel(); // При първо зареждане стартираме НИВО, не нулираме точките
  }, []);

  const startNewLevel = () => {
    const randomWord = WORDS_DATABASE[Math.floor(Math.random() * WORDS_DATABASE.length)];
    setWord(randomWord);
    setGuessedLetters([]);
    setLives(HANGMAN_SETTINGS.INITIAL_LIVES);
    setGameOver(false);
    setGameWon(false);
    setInfo("");
  };

  // Пълно рестартиране (при загуба)
  const restartGame = () => {
    startNewLevel();
    setScore(0);
    setPlayerName('');
  };

  const handleLetterClick = (letter) => {
    if (gameOver || gameWon || guessedLetters.includes(letter)) return;

    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives === 0) setGameOver(true);
    } else {
      // Даваме точки за всяка позната буква
      setScore(prev => prev + HANGMAN_SETTINGS.POINTS_PER_LETTER);
      
      const isWon = word.split('').every(l => newGuessed.includes(l));
      if (isWon) {
        setGameWon(true);
        setScore(prev => prev + HANGMAN_SETTINGS.BONUS_WIN + (lives * 10));
      }
    }
  };

  const useJoker = () => {
    if (lives <= HANGMAN_SETTINGS.JOKER_REVEAL_COST) return;
    const letter = getHangmanJoker(word, guessedLetters);
    if (letter) {
      setLives(lives - HANGMAN_SETTINGS.JOKER_REVEAL_COST);
      handleLetterClick(letter);
      setInfo(`Жокер: Буквата е ${letter}`);
      setTimeout(() => setInfo(""), 3000);
    }
  };

  const saveToLeaderboard = async () => {
    try {
      await addDoc(collection(db, "hangman_leaderboard"), {
        name: playerName.trim() || 'Анонимен',
        score: score,
        date: new Date().toLocaleDateString('bg-BG')
      });
      restartGame();
    } catch (e) {
      console.error("Грешка при запазване: ", e);
    }
  };

  return (
    <div className="flex flex-col items-center w-full py-8 text-white min-h-screen">
      
      {/* Вътрешна навигация */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 w-full max-w-4xl px-4 z-20">
        <Link to="/" className="px-4 py-2 rounded-xl font-bold bg-gray-800 hover:bg-gray-700 border border-gray-600 flex items-center gap-2 transition-colors">
          ⬅️ Портал
        </Link>
        <button onClick={() => setView('game')} className={`px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${view === 'game' ? 'bg-white text-red-600' : 'bg-white/10 hover:bg-white/20'}`}>🎮 Игра</button>
        <button onClick={() => setView('rules')} className={`px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${view === 'rules' ? 'bg-white text-red-600' : 'bg-white/10 hover:bg-white/20'}`}>📖 Правила</button>
        <button onClick={() => setView('leaderboard')} className={`px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${view === 'leaderboard' ? 'bg-white text-red-600' : 'bg-white/10 hover:bg-white/20'}`}>🏆 Класация</button>
      </div>

      {view === 'rules' && <Rules onBack={() => setView('game')} />}
      {view === 'leaderboard' && <Leaderboard onBack={() => setView('game')} />}

      {view === 'game' && (
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl relative">
          {gameWon && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={300} />}
          
          <div className="flex justify-between items-center mb-6">
            <div className="text-xl font-black text-yellow-400">ТОЧКИ: {score}</div>
            <div className="text-xl font-black text-red-400">ЖИВОТИ: {lives} ❤️</div>
          </div>

          <div className="h-6 mb-4 text-center">
            {info && <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-sm font-bold border border-blue-500/30">{info}</span>}
          </div>

          {/* Визуализация на бесилката */}
          <div className="flex justify-center mb-8">
            <svg width="150" height="150" viewBox="0 0 100 100" className="stroke-white stroke-[4] fill-none drop-shadow-md">
              <path d="M20 90 L80 90 M30 90 L30 10 L60 10 L60 20" />
              {lives <= 5 && <circle cx="60" cy="30" r="10" />} 
              {lives <= 4 && <line x1="60" y1="40" x2="60" y2="70" />} 
              {lives <= 3 && <line x1="60" y1="50" x2="45" y2="60" />} 
              {lives <= 2 && <line x1="60" y1="50" x2="75" y2="60" />} 
              {lives <= 1 && <line x1="60" y1="70" x2="45" y2="85" />} 
              {lives === 0 && <line x1="60" y1="70" x2="75" y2="85" className="stroke-red-500" />} 
            </svg>
          </div>

          {/* Думата */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {word.split('').map((letter, i) => (
              <span key={i} className={`text-4xl font-black border-b-4 w-10 text-center uppercase pb-1 ${gameOver && !guessedLetters.includes(letter) ? 'text-red-400 border-red-400' : 'text-white border-white'}`}>
                {guessedLetters.includes(letter) || gameOver ? letter : ""}
              </span>
            ))}
          </div>

          {/* Клавиатура / Екрани за Край */}
          {!gameOver && !gameWon ? (
            <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
              {ALPHABET.map(l => (
                <button
                  key={l}
                  onClick={() => handleLetterClick(l)}
                  disabled={guessedLetters.includes(l)}
                  className={`w-10 h-12 rounded-lg font-bold transition-all shadow-sm ${
                    guessedLetters.includes(l) 
                    ? (word.includes(l) ? 'bg-green-500/50 text-white border border-green-400' : 'bg-red-500/30 text-white/50 border border-red-500/30') 
                    : 'bg-white/20 hover:bg-white/40 border border-white/10'
                  }`}
                >
                  {l}
                </button>
              ))}
              <button 
                onClick={useJoker}
                disabled={lives <= HANGMAN_SETTINGS.JOKER_REVEAL_COST}
                className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black py-3 rounded-xl font-bold shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
              >
                💡 Жокер (-2 ❤️)
              </button>
            </div>
          ) : gameWon ? (
            <div className="text-center bg-green-500/20 border border-green-400 p-6 rounded-2xl">
              <h2 className="text-3xl font-black text-green-400 mb-4">СПАСИ ЧОВЕЧЕТО! 🎉</h2>
              <button onClick={startNewLevel} className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg">
                СЛЕДВАЩА ДУМА ➡️
              </button>
            </div>
          ) : (
            <div className="text-center bg-red-500/20 border border-red-500/50 p-6 rounded-2xl">
              <h2 className="text-3xl font-black text-red-500 mb-2">ОБЕСЕН! 💀</h2>
              <p className="text-gray-300 mb-6">Събра {score} точки.</p>
              
              <div className="mb-4">
                <input
                  type="text"
                  maxLength="15"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Въведи никнейм..."
                  className="w-full px-4 py-3 bg-black/30 border border-red-500/30 rounded-xl focus:outline-none focus:border-red-400 text-center font-bold text-white placeholder-gray-500"
                />
              </div>
              <button onClick={saveToLeaderboard} className="w-full bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg">
                💾 Запази Резултата
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}