export const getHangmanJoker = (word, guessedLetters) => {
  const wordLetters = word.split('');
  // Намираме буквите от думата, които играчът още не е познал
  const remainingLetters = wordLetters.filter(letter => !guessedLetters.includes(letter));
  
  if (remainingLetters.length > 0) {
    // Връщаме случайна непозната буква
    return remainingLetters[Math.floor(Math.random() * remainingLetters.length)];
  }
  return null;
};