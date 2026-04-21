import { useState, useEffect } from 'react';

// Помощна функция за генериране на 4-цифрено число с уникални цифри
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
  const [secret, setSecret] = useState('');
  const [guess, setGuess] = useState('');
  const [history, setHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState(null);

  // Зареждане на играта и локалния сторидж при първоначално пускане
  useEffect(() => {
    setSecret(generateSecretNumber());
    const savedScore = localStorage.getItem('bullsAndCowsBestScore');
    if (savedScore) {
      setBestScore(parseInt(savedScore, 10));
    }
  }, []);

  const handleGuess = (e) => {
    e.preventDefault();

    // Валидация: трябва да са точно 4 цифри
    if (guess.length !== 4 || isNaN(guess)) {
      alert('Моля, въведи точно 4 цифри!');
      return;
    }

    // Изчисляване на бикове и крави
    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < 4; i++) {
      if (guess[i] === secret[i]) {
        bulls++;
      } else if (secret.includes(guess[i])) {
        cows++;
      }
    }

    const newHistory = [{ guess, bulls, cows }, ...history];
    setHistory(newHistory);
    setGuess('');

    // Проверка за победа
    if (bulls === 4) {
      setGameOver(true);
      const currentAttempts = newHistory.length;
      
      // Обновяване на рекорда в localStorage
      if (!bestScore || currentAttempts < bestScore) {
        setBestScore(currentAttempts);
        localStorage.setItem('bullsAndCowsBestScore', currentAttempts.toString());
      }
    }
  };

  const restartGame = () => {
    setSecret(generateSecretNumber());
    setHistory([]);
    setGameOver(false);
    setGuess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans text-gray-800">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100">
        
        {/* Заглавие и Рекорд */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-600 mb-2">Бикове и Крави</h1>
          <p className="text-sm text-gray-500">Познай 4-цифреното число!</p>
          {bestScore && (
            <div className="mt-2 inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
              🏆 Най-добър опит: {bestScore}
            </div>
          )}
        </div>

        {/* Форма за въвеждане */}
        {!gameOver ? (
          <form onSubmit={handleGuess} className="flex gap-2 mb-6">
            <input
              type="text"
              maxLength="4"
              value={guess}
              onChange={(e) => setGuess(e.target.value.replace(/\D/g, ''))} // Позволява само цифри
              placeholder="Въведи 4 цифри..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg tracking-widest text-center font-bold"
            />
            <button
              type="submit"
              disabled={guess.length !== 4}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-md"
            >
              Опитай
            </button>
          </form>
        ) : (
          <div className="text-center mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <h2 className="text-2xl font-bold text-green-600 mb-2">Поздравления! 🎉</h2>
            <p className="text-gray-700">Ти позна числото <strong>{secret}</strong> от {history.length} опита.</p>
            <button
              onClick={restartGame}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Играй отново
            </button>
          </div>
        )}

        {/* История на опитите */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {history.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm font-mono w-6 text-right">
                  #{history.length - index}
                </span>
                <span className="text-xl font-mono font-bold tracking-widest text-gray-700">
                  {item.guess}
                </span>
              </div>
              <div className="flex gap-3 font-semibold text-sm">
                <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-md">
                  <span className="text-lg">🐂</span> {item.bulls}
                </span>
                <span className="flex items-center gap-1 text-orange-600 bg-orange-100 px-2 py-1 rounded-md">
                  <span className="text-lg">🐄</span> {item.cows}
                </span>
              </div>
            </div>
          ))}
          
          {history.length === 0 && (
            <p className="text-center text-gray-400 italic py-4">Все още нямаш направени опити.</p>
          )}
        </div>
      </div>
    </div>
  );
}