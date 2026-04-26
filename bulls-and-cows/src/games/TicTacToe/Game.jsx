import { Link } from 'react-router-dom';

export default function TicTacToeApp() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <Link to="/" className="absolute top-8 left-8 px-4 py-2 rounded-xl font-bold bg-gray-800 hover:bg-gray-700 border border-gray-600 flex items-center gap-2">
        ⬅️ Портал
      </Link>
      <h1 className="text-5xl font-black mb-4">Морски Шах ❌⭕</h1>
      <p className="text-xl text-gray-300">В процес на разработка...</p>
    </div>
  );
}