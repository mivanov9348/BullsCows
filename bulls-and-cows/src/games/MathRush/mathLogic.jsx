export const generateEquation = (score) => {
  let maxNum = 10;
  if (score > 50) maxNum = 20;
  if (score > 150) maxNum = 30;
  if (score > 300) maxNum = 50;

  let taskType = 1;
  if (score > 80 && Math.random() > 0.5) taskType = 2;
  if (score > 200 && Math.random() > 0.4) taskType = 3;

  let evalText = ''; // Това, което компютърът смята
  let displayText = ''; // Това, което играчът вижда
  let answer = -1;

  const getRandomNum = (max) => Math.floor(Math.random() * max) + 1;

  while (answer < 0) {
    if (taskType === 1) {
      const operations = ['+', '-', '*'];
      const op = (score > 50 && Math.random() > 0.6) ? '*' : operations[Math.floor(Math.random() * 2)];
      
      let a = getRandomNum(maxNum);
      let b = getRandomNum(maxNum);

      if (op === '*') {
        a = getRandomNum(12);
        b = getRandomNum(12);
      }
      
      if (op === '-' && a < b) [a, b] = [b, a];

      evalText = `${a} ${op} ${b}`;
      // Сменяме * с x за красота
      displayText = `${a} ${op === '*' ? 'x' : op} ${b}`; 
      answer = eval(evalText);

    } else if (taskType === 2) {
      const ops = ['+', '-'];
      const op1 = ops[Math.floor(Math.random() * ops.length)];
      const op2 = ops[Math.floor(Math.random() * ops.length)];

      let a = getRandomNum(maxNum);
      let b = getRandomNum(maxNum);
      let c = getRandomNum(maxNum);

      evalText = `${a} ${op1} ${b} ${op2} ${c}`;
      displayText = evalText;
      answer = eval(evalText);

    } else if (taskType === 3) {
      let a = getRandomNum(15);
      let b = getRandomNum(15);
      let c = getRandomNum(5);

      if (Math.random() > 0.5) {
        evalText = `(${a} + ${b}) * ${c}`;
        displayText = `(${a} + ${b}) x ${c}`;
      } else {
        if (b < c) [b, c] = [c, b];
        evalText = `${a} * (${b} - ${c})`;
        displayText = `${a} x (${b} - ${c})`;
      }
      answer = eval(evalText);
    }
  }

  const choices = new Set([answer]);
  let safetyCounter = 0;
  
  while (choices.size < 4 && safetyCounter < 50) {
    safetyCounter++;
    const range = answer > 50 ? 12 : 6;
    const offset = Math.floor(Math.random() * (range * 2)) - range; 
    
    let fakeAnswer = answer + offset;
    
    if (Math.random() > 0.8 && answer > 10) {
       const reversedStr = answer.toString().split('').reverse().join('');
       const revNum = parseInt(reversedStr);
       if (!isNaN(revNum)) fakeAnswer = revNum;
    }

    if (fakeAnswer !== answer && fakeAnswer >= 0 && !choices.has(fakeAnswer)) {
      choices.add(fakeAnswer);
    }
  }

  while (choices.size < 4) {
    choices.add(Math.floor(Math.random() * (answer + 20)));
  }

  const shuffledChoices = Array.from(choices).sort(() => Math.random() - 0.5);

  return {
    text: displayText, // Връщаме красивия текст
    correct: answer,
    choices: shuffledChoices
  };
};