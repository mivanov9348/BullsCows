import { Link } from 'react-router-dom';

export default function Rules({ onBack }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20 text-white mx-4 z-20 relative">
      <div className="flex justify-between mb-4">
        <Link to="/" className="text-xs text-gray-400 hover:text-white transition-colors">⬅️ Към Портала</Link>
      </div>

      <h2 className="text-3xl font-black text-center mb-6 text-green-400">Как се играе?</h2>
      <ul className="space-y-4 font-medium text-gray-200">
        <li className="flex gap-3">🔢 <span>Познай скритата дума от 5 букви. Имаш 6 опита.</span></li>
        <li className="flex flex-col gap-2 mt-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 flex items-center justify-center bg-green-500 text-white font-bold rounded">А</span>
            <span>- Буквата е в думата и е на <strong>точното</strong> място.</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 flex items-center justify-center bg-yellow-500 text-white font-bold rounded">Б</span>
            <span>- Буквата е в думата, но на <strong>грешно</strong> място.</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 flex items-center justify-center bg-gray-600 text-white font-bold rounded">В</span>
            <span>- Буквата <strong>не участва</strong> в думата.</span>
          </div>
        </li>

        {/* НОВАТА ЧАСТ ЗА ТОЧКУВАНЕТО И ОТПАДАНЕТО */}
        <li className="flex gap-3 mt-4 border-t border-white/20 pt-4">🏆 <span><strong>Точкуване:</strong> Колкото по-бързо познаеш, толкова повече точки получаваш!</span></li>
        <ul className="ml-9 text-sm text-gray-300 list-disc grid grid-cols-2 gap-1">
          <li>1-ви опит: <span className="text-green-400 font-bold">100 т.</span></li>
          <li>2-ри опит: <span className="text-green-400 font-bold">80 т.</span></li>
          <li>3-ти опит: <span className="text-green-400 font-bold">60 т.</span></li>
          <li>4-ти опит: <span className="text-yellow-400 font-bold">40 т.</span></li>
          <li>5-ти опит: <span className="text-yellow-400 font-bold">20 т.</span></li>
          <li>6-ти опит: <span className="text-orange-400 font-bold">10 т.</span></li>
        </ul>
        <li className="flex gap-3 text-red-400 font-bold mt-2">💀 <span>Ако не познаеш думата от 6-ия път, отпадаш и играта приключва!</span></li>
      </ul>
      <button onClick={onBack} className="mt-8 w-full bg-white/20 hover:bg-white/30 py-3 rounded-xl font-bold transition-colors">🔙 Назад</button>
    </div>
  );
}