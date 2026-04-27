export const generateEquation = (score) => {
  // Определяме колко трудно да е на база точките
  let maxNum = 10;
  if (score > 50) maxNum = 20;
  if (score > 150) maxNum = 30;
  if (score > 300) maxNum = 50;

  // Какъв "тип" задача ще дадем?
  // Ниво 1: Просто събиране/изваждане/умножение (2 числа)
  // Ниво 2: Три числа (напр. a + b - c)
  // Ниво 3: Скоби (напр. (a + b) * c)
  let taskType = 1;
  if (score > 80 && Math.random() > 0.5) taskType = 2;
  if (score > 200 && Math.random() > 0.4) taskType = 3;

  let text = '';
  let answer = 0;

  const getRandomNum = (max) => Math.floor(Math.random() * max) + 1;

  if (taskType === 1) {
    // --- ТИП 1: ПРОСТИ УРАВНЕНИЯ (2 числа) ---
    const operations = ['+', '-', '*'];
    const op = (score > 50 && Math.random() > 0.6) ? '*' : operations[Math.floor(Math.random() * 2)];
    
    let a = getRandomNum(maxNum);
    let b = getRandomNum(maxNum);

    // Пазим числата за умножение малки, за да могат да се сметнат наум бързо
    if (op === '*') {
      a = getRandomNum(12);
      b = getRandomNum(12);
    }
    
    // Избягваме отрицателни отговори при изваждане
    if (op === '-' && a < b) [a, b] = [b, a];

    text = `${a} ${op} ${b}`;
    answer = eval(text); // Безопасно е тук, защото ние контролираме стринга

  } else if (taskType === 2) {
    // --- ТИП 2: ТРИ ЧИСЛА (без скоби) ---
    const ops = ['+', '-'];
    const op1 = ops[Math.floor(Math.random() * ops.length)];
    const op2 = ops[Math.floor(Math.random() * ops.length)];

    let a = getRandomNum(maxNum);
    let b = getRandomNum(maxNum);
    let c = getRandomNum(maxNum);

    // Правим малка корекция, за да нямаме отрицателен резултат
    if (a + (op1 === '+' ? b : -b) - c < 0) {
      c = getRandomNum(a); 
    }

    text = `${a} ${op1} ${b} ${op2} ${c}`;
    answer = eval(text);

  } else if (taskType === 3) {
    // --- ТИП 3: СКОБИ ---
    // (a + b) * c  ИЛИ  a * (b - c)
    let a = getRandomNum(15);
    let b = getRandomNum(15);
    let c = getRandomNum(5); // Умножителят да е малък

    if (Math.random() > 0.5) {
      text = `(${a} + ${b}) * ${c}`;
    } else {
      // Искаме b > c, за да няма отрицателни в скобата
      if (b < c) [b, c] = [c, b];
      text = `${a} * (${b} - ${c})`;
    }
    answer = eval(text);
  }

  // --- ГЕНЕРИРАНЕ НА 3 ГРЕШНИ ОТГОВОРА (Дистрактори) ---
  const choices = new Set([answer]);
  
  while (choices.size < 4) {
    // Генерираме грешни отговори, които са близо до верния (от -5 до +5)
    // При по-големи резултати (>50), дистракторите също могат да са по-далече (от -10 до +10)
    const range = answer > 50 ? 10 : 5;
    const offset = Math.floor(Math.random() * (range * 2)) - range; 
    
    let fakeAnswer = answer + offset;
    
    // Понякога слагаме "хитър" грешен отговор (напр. ако отговорът е 24, слагаме 42)
    if (Math.random() > 0.8 && answer > 10) {
       const reversedStr = answer.toString().split('').reverse().join('');
       fakeAnswer = parseInt(reversedStr);
    }

    if (fakeAnswer !== answer && fakeAnswer >= 0 && !choices.has(fakeAnswer)) {
      choices.add(fakeAnswer);
    }
  }

  // Разбъркваме масива с отговори, за да не е винаги първият
  const shuffledChoices = Array.from(choices).sort(() => Math.random() - 0.5);

  return {
    text: text,
    correct: answer,
    choices: shuffledChoices
  };
};