export const WORDLE_SETTINGS = {
  WORD_LENGTH: 5,
  MAX_ATTEMPTS: 6,
  // Точки за: 1-ви, 2-ри, 3-ти, 4-ти, 5-ти, 6-ти опит
  ATTEMPT_SCORES: [100, 80, 60, 40, 20, 10], 
};

export const LEADERBOARD_WORDLE_KEY = 'wordle_leaderboard';

// Българска подредба на клавиатурата (Фонетична)
export const KEYBOARD_ROWS = [
  ['Я', 'В', 'Е', 'Р', 'Т', 'Ъ', 'У', 'И', 'О', 'П', 'Ш', 'Щ'],
  ['А', 'С', 'Д', 'Ф', 'Г', 'Х', 'Й', 'К', 'Л'],
  ['ENTER', 'З', 'Ь', 'Ц', 'Ж', 'Б', 'Н', 'М', 'Ч', 'Ю', 'DEL']
];