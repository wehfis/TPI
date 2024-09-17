import React, { useState } from 'react';


// Український алфавіт з цифрами
const alphabet = 'АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ0123456789';
const _mod = alphabet.length; // Модуль алфавіту

const charToIndex = (char) => alphabet.indexOf(char);
const indexToChar = (index) => alphabet[(index + _mod) % _mod];

// Генерація ключової матриці
const generateKeyMatrix = (keyword) => {
  const n = Math.sqrt(keyword.length);
  if (n % 1 !== 0) {
    throw new Error("Довжина ключового слова має бути квадратом цілого числа.");
  }

  const keyMatrix = [];
  for (let i = 0; i < n; i++) {
    keyMatrix.push([]);
    for (let j = 0; j < n; j++) {
      keyMatrix[i].push(charToIndex(keyword[i * n + j]));
    }
  }
  return keyMatrix;
};

// Обчислення детермінанта
const getDeterminant = (matrix, modulus) => {
  const n = matrix.length;
  if (n === 1) return matrix[0][0];
  if (n === 2) {
    return (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % modulus;
  }

  let determinant = 0;
  for (let c = 0; c < n; c++) {
    const subMatrix = matrix.slice(1).map(row => row.filter((_, idx) => idx !== c));
    determinant += Math.pow(-1, c) * matrix[0][c] * getDeterminant(subMatrix, modulus);
    determinant %= modulus;
  }
  return (determinant + modulus) % modulus;
};

// Обчислення оберненого елемента за модулем
const modInverse = (a, modulus) => {
  a %= modulus;
  for (let x = 1; x < modulus; x++) {
    if ((a * x) % modulus === 1) return x;
  }
  return -1;
};

// Генерація оберненої матриці
const invertMatrix = (matrix, modulus) => {
  const det = getDeterminant(matrix, modulus);
  const invDet = modInverse(det, modulus);
  if (invDet === -1) throw new Error("Матриця не має оберненої.");

  const adjugate = adjugateMatrix(matrix, modulus);
  return adjugate.map(row => row.map(val => (val * invDet) % modulus));
};

// Генерація приспійненої матриці
const adjugateMatrix = (matrix, modulus) => {
  const n = matrix.length;
  if (n === 1) return [[1]];

  const adjugate = [];
  for (let i = 0; i < n; i++) {
    adjugate.push([]);
    for (let j = 0; j < n; j++) {
      const subMatrix = matrix
        .filter((_, rowIdx) => rowIdx !== i)
        .map(row => row.filter((_, colIdx) => colIdx !== j));
      const cofactor = Math.pow(-1, i + j) * getDeterminant(subMatrix, modulus);
      adjugate[i].push(((cofactor % modulus) + modulus) % modulus);
    }
  }
  return adjugate;
};

// Поділ тексту на блоки
const divideTextIntoBlocks = (text, blockSize) => {
  const blocks = [];
  for (let i = 0; i < text.length; i += blockSize) {
    const block = text.slice(i, i + blockSize).split('').map(charToIndex);
    while (block.length < blockSize) block.push(0); // Доповнення блоку
    blocks.push(block);
  }
  return blocks;
};

// Основний компонент
const HillCipher = () => {
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [key, setKey] = useState('');

  const handleEncrypt = () => {
    try {
      const keyMatrix = generateKeyMatrix(key);
      const n = keyMatrix.length;
      const blocks = divideTextIntoBlocks(plaintext, n);
      
      const encryptedText = blocks.map(block => {
        return block.map((_, i) => {
          return block.reduce((sum, val, j) => sum + keyMatrix[i][j] * val, 0) % _mod;
        }).map(indexToChar).join('');
      }).join('');

      setCiphertext(encryptedText);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDecrypt = () => {
    try {
      const keyMatrix = generateKeyMatrix(key);
      const invKeyMatrix = invertMatrix(keyMatrix, _mod);
      const n = invKeyMatrix.length;
      const blocks = divideTextIntoBlocks(ciphertext, n);

      const decryptedText = blocks.map(block => {
        return block.map((_, i) => {
          return block.reduce((sum, val, j) => sum + invKeyMatrix[i][j] * val, 0) % _mod;
        }).map(indexToChar).join('');
      }).join('');

      setDecryptedText(decryptedText);
    } catch (error) {
      alert(error.message);
    }
  };


  const styles = {
    container: {
      maxWidth: '600px',
      width: '600px',
      margin: '20px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#f9f9f9',
    },
    title: {
      textAlign: 'center',
      color: '#333',
    },
    input: {
      display: 'block',
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      width: '100%',
      padding: '10px',
      fontSize: '16px',
      backgroundColor: '#007BFF',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    result: {
      marginTop: '20px',
      padding: '10px',
      backgroundColor: 'black',
      borderRadius: '4px',
      fontFamily: 'monospace',
      fontSize: '16px',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Шифр Хілла</h1>
      <textarea
        placeholder="Введіть текст"
        value={plaintext}
        onChange={(e) => setPlaintext(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Ключове слово (квадрат довжини)"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleEncrypt} style={styles.button}>
        Зашифрувати
      </button>
      <div style={styles.result}>Зашифрований текст: {ciphertext}</div>

      <button onClick={handleDecrypt} style={styles.button}>
        Розшифрувати
      </button>
      <div style={styles.result}>Розшифрований текст: {decryptedText}</div>
    </div>
  );
};

export default HillCipher;

