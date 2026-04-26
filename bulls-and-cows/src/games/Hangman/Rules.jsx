export default function Rules({ onBack }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20 text-gray-800">
      <h2 className="text-3xl font-black text-center mb-6 text-red-600">Как се играе?</h2>
      <ul className="space-y-4 font-medium">
        <li className="flex gap-3">❌ <span>Имаш 6 опита да познаеш думата.</span></li>
        <li className="flex gap-3">🅰️ <span>Избирай букви от виртуалната клавиатура.</span></li>
        <li className="flex gap-3">💡 <span>Жокерът ти показва една вярна буква, но губиш 2 живота.</span></li>
        <li className="flex gap-3">🏆 <span>Целта е да събереш най-висок резултат, без да бъдеш "обесен"!</span></li>
      </ul>
      <button onClick={onBack} className="mt-8 w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-xl font-bold">🔙 Назад</button>
    </div>
  );
}