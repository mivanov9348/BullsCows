import { Link } from 'react-router-dom';

export default function Rules({ onBack }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20 text-white mx-4 z-20 relative">
      <div className="flex justify-between mb-4">
        <Link to="/" className="text-xs text-gray-400 hover:text-white transition-colors">⬅️ Към Портала</Link>
      </div>

      <h2 className="text-3xl font-black text-center mb-6 text-blue-400">Как се играе?</h2>
      <ul className="space-y-4 font-medium text-gray-200">
        <li className="flex gap-3">⏱️ <span>Имаш <strong>30 секунди</strong> на старта.</span></li>
        <li className="flex gap-3">🧠 <span>Решавай задачите колкото се може по-бързо.</span></li>
        <li className="flex gap-3">✅ <span>Верен отговор дава <strong>+2 секунди</strong> и 10 точки.</span></li>
        <li className="flex gap-3">❌ <span>Грешен отговор ти отнема <strong>3 секунди</strong>! Не налучквай!</span></li>
        <li className="flex gap-3">🔥 <span>С напредването задачите стават по-трудни.</span></li>
      </ul>
      <button onClick={onBack} className="mt-8 w-full bg-white/20 hover:bg-white/30 py-3 rounded-xl font-bold transition-colors">🔙 Назад</button>
    </div>
  );
}