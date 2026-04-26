import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import { WORDS_DATABASE } from './words';
import { HANGMAN_SETTINGS } from './constants';
import { getHangmanJoker } from './jokers';
import Rules from './Rules';
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

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = WORDS_DATABASE[Math.floor(Math.random() * WORDS_DATABASE.length)];
    setWord(randomWord);
    setGuessedLetters([]);
    setLives(HANGMAN_SETTINGS.INITIAL_LIVES);
    setGameOver(false);
    setGameWon(false);
    setInfo("");
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
      // Проверка за победа
      const isWon = word.split('').every(l => newGuessed.includes(l));
      if (isWon) {
        setGameWon(true);
        setScore(score + HANGMAN_SETTINGS.BONUS_WIN + (lives * 10));
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
    }
  };

  return (
    <div className="flex flex-col items-center w-full py-8 text-white min-h-screen">
      {/* Навигация */}
      <div className="flex gap-4 mb-8 z-20">
        <Link to="/" className="px-4 py-2 rounded-xl font-bold bg-white/10 hover:bg-white/20">🏠 Портал</Link>
        <button onClick={() => setView('game')} className={`px-4 py-2 rounded-xl font-bold ${view === 'game' ? 'bg-white text-indigo-600' : 'bg-white/10'}`}>🎮 Игра</button>
        <button onClick={() => setView('rules')} className={`px-4 py-2 rounded-xl font-bold ${view === 'rules' ? 'bg-white text-indigo-600' : 'bg-white/10'}`}>📖 Правила</button>
      </div>

      {view === 'rules' && <Rules onBack={() => setView('game')} />}

      {view === 'game' && (
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl relative">
          {gameWon && <Confetti width={window.innerWidth} height={window.innerHeight} />}
          
          <div className="flex justify-between items-center mb-8">
            <div className="text-xl font-black text-yellow-400">ТОЧКИ: {score}</div>
            <div className="text-xl font-black text-red-400">ЖИВОТИ: {lives} ❤️</div>
          </div>

          {/* Визуализация на бесилката (Simple SVG) */}
          <div className="flex justify-center mb-8">
            <svg width="150" height="150" viewBox="0 0 100 100" className="stroke-white stroke-[4] fill-none">
              {/* Бесилка */}
              <path d="M20 90 L80 90 M30 90 L30 10 L60 10 L60 20" />
              {/* Човече (показва се спрямо живота) */}
              {lives <= 5 && <circle cx="60" cy="30" r="10" />} {/* Глава */}
              {lives <= 4 && <line x1="60" y1="40" x2="60" y2="70" />} {/* Тяло */}
              {lives <= 3 && <line x1="60" y1="50" x2="45" y2="60" />} {/* Лява ръка */}
              {lives <= 2 && <line x1="60" y1="50" x2="75" y2="60" />} {/* Дясна ръка */}
              {lives <= 1 && <line x1="60" y1="70" x2="45" y2="85" />} {/* Ляв крак */}
              {lives === 0 && <line x1="60" y1="70" x2="75" y2="85" />} {/* Десен крак */}
            </svg>
          </div>

          {/* Думата с долни черти */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {word.split('').map((letter, i) => (
              <span key={i} className="text-4xl font-black border-b-4 border-white w-10 text-center uppercase">
                {guessedLetters.includes(letter) || gameOver ? letter : ""}
              </span>
            ))}
          </div>

          {/* Клавиатура */}
          {!gameOver && !gameWon ? (
            <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
              {ALPHABET.map(l => (
                <button
                  key={l}
                  onClick={() => handleLetterClick(l)}
                  disabled={guessedLetters.includes(l)}
                  className={`w-10 h-12 rounded-lg font-bold transition-all ${
                    guessedLetters.includes(l) 
                    ? (word.includes(l) ? 'bg-green-500 opacity-50' : 'bg-red-500 opacity-30') 
                    : 'bg-white/20 hover:bg-white/40'
                  }`}
                >
                  {l}
                </button>
              ))}
              <button 
                onClick={useJoker}
                disabled={lives <= HANGMAN_SETTINGS.JOKER_REVEAL_COST}
                className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-xl font-bold"
              >
                💡 Жокер (-2 ❤️)
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className={`text-4xl font-black mb-4 ${gameWon ? 'text-green-400' : 'text-red-500'}`}>
                {gameWon ? "ПОБЕДА!" : "КРАЙ НА ИГРАТА!"}
              </h2>
              <button onClick={startNewGame} className="bg-indigo-600 px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700">
                НОВА ДУМА
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}