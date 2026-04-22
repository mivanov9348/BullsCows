export default function Rules({ onBack }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 mb-2">
          Как се играе?
        </h2>
        <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-bold tracking-wide mb-4">
          РЕЖИМ: ОЦЕЛЯВАНЕ
        </span>
      </div>

      <div className="space-y-4 text-gray-700 font-medium">
        <div className="flex gap-4 items-start">
          <div className="text-2xl bg-indigo-100 p-2 rounded-xl">❤️</div>
          <div>
            <h3 className="font-bold text-indigo-700">Начални животи</h3>
            <p className="text-sm">Започваш играта с общо <strong>15 опита (живота)</strong>. Всеки грешен опит ти взима 1 живот.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="text-2xl bg-green-100 p-2 rounded-xl">🎯</div>
          <div>
            <h3 className="font-bold text-green-700">Бикове и Крави</h3>
            <p className="text-sm"><strong>Бик:</strong> Позната цифра на точното място. <br/><strong>Крава:</strong> Позната цифра на грешно място.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="text-2xl bg-yellow-100 p-2 rounded-xl">⚡</div>
          <div>
            <h3 className="font-bold text-yellow-700">Бонус за победа</h3>
            <p className="text-sm">Ако познаеш числото, минаваш на следващо ниво и получаваш <strong>+7 допълнителни опита</strong> към оставащите ти!</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="text-2xl bg-red-100 p-2 rounded-xl">💀</div>
          <div>
            <h3 className="font-bold text-red-700">Край на играта</h3>
            <p className="text-sm">Играта приключва, когато опитите ти стигнат 0. Целта е да преминеш колкото се може повече нива!</p>
          </div>
        </div>
      </div>

      <button
        onClick={onBack}
        className="mt-8 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
      >
        🔙 Назад към играта
      </button>
    </div>
  );
}