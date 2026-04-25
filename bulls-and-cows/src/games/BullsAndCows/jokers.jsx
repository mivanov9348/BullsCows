// Връща просто цифра (избягва вече показани чрез жокер и вече уцелени)
export const getRevealJoker = (secret, history, usedJokers) => {
  const secretArray = secret.split('');
  const guessedDigits = new Set(history.map(h => h.guess).join('').split(''));
  const usedDigits = new Set(usedJokers);

  // Филтрираме цифрите, които НЕ СА били уцелени и НЕ СА давани като жокер досега
  const availableDigits = secretArray.filter(digit => !guessedDigits.has(digit) && !usedDigits.has(digit));

  if (availableDigits.length > 0) {
    return availableDigits[Math.floor(Math.random() * availableDigits.length)];
  }
  
  // Ако вече са изчерпани логичните опции, даваме произволна непоказвана
  const fallbackDigits = secretArray.filter(d => !usedDigits.has(d));
  if (fallbackDigits.length > 0) {
    return fallbackDigits[Math.floor(Math.random() * fallbackDigits.length)];
  }

  // Краен случай (ако е поискал жокер за всички 4 цифри)
  return secretArray[Math.floor(Math.random() * secretArray.length)];
};

// Връща цифра И точната й позиция (избягва вече уцелени бикове)
export const getPositionJoker = (secret, history, usedJokers) => {
  const secretArray = secret.split('');
  const knownPositions = new Set();

  history.forEach(h => {
    for (let i = 0; i < 4; i++) {
      if (h.guess[i] === secretArray[i]) {
        knownPositions.add(i);
      }
    }
  });

  const availablePositions = [];
  for (let i = 0; i < secretArray.length; i++) {
    // Ако позицията не е уцелена и цифрата на тази позиция не е давана като позиционен жокер
    if (!knownPositions.has(i) && !usedJokers.includes(secretArray[i])) {
      availablePositions.push(i);
    }
  }

  let pos;
  if (availablePositions.length > 0) {
    pos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
  } else {
    pos = Math.floor(Math.random() * secretArray.length);
  }

  return { digit: secretArray[pos], position: pos + 1 }; 
};