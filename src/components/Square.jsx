import React, { useState } from 'react';

// Створення українського алфавіту з цифрами
const ukrAlphabet = 'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ0123456789';

// Створення квадрату Уітстона (7x7)
const createSquare = (keyword) => {
  const alphabet = ukrAlphabet;
  const usedChars = new Set();
  let square = '';

  for (let char of keyword.toUpperCase()) {
    if (!usedChars.has(char) && alphabet.includes(char)) {
      square += char;
      usedChars.add(char);
    }
  }

  for (let char of alphabet) {
    if (!usedChars.has(char)) {
      square += char;
    }
  }

  return square;
};

// Пошук координат літери в квадраті
const findPosition = (square, letter) => {
  const size = 7; // Розмір квадрату
  const index = square.indexOf(letter);
  return { row: Math.floor(index / size), col: index % size };
};

// Шифрування пари символів
const encryptPair = (square1, square2, pair) => {
  const size = 7;
  const pos1 = findPosition(square1, pair[0]);
  const pos2 = findPosition(square2, pair[1]);

  const char1 = square1[pos1.row * size + pos2.col];
  const char2 = square2[pos2.row * size + pos1.col];

  return char1 + char2;
};

// Розшифрування пари символів
const decryptPair = (square1, square2, pair) => {
  const size = 7;
  const pos1 = findPosition(square1, pair[0]);
  const pos2 = findPosition(square2, pair[1]);

  const char1 = square1[pos1.row * size + pos2.col];
  const char2 = square2[pos2.row * size + pos1.col];

  return char1 + char2;
};

// Основний компонент
const DoubleWheatstoneCipher = () => {
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [key1, setKey1] = useState('');
  const [key2, setKey2] = useState('');

  const handleEncrypt = () => {
    const square1 = createSquare(key1);
    const square2 = createSquare(key2);
    let text = plaintext.toUpperCase().replace(/ /g, '');

    // Якщо довжина тексту непарна, додаємо останній символ
    if (text.length % 2 !== 0) {
      text += text[text.length - 1];
    }

    let encryptedText = '';

    for (let i = 0; i < text.length; i += 2) {
      const pair = text.slice(i, i + 2);
      encryptedText += encryptPair(square1, square2, pair);
    }

    setCiphertext(encryptedText);
  };

  const handleDecrypt = () => {
    const square1 = createSquare(key1);
    const square2 = createSquare(key2);
    let text = plaintext.toUpperCase();

    let decryptedText = '';

    for (let i = 0; i < text.length; i += 2) {
      const pair = text.slice(i, i + 2);
      decryptedText += decryptPair(square1, square2, pair);
    }

    setDecryptedText(decryptedText);
  };

  const styles = {
    container: {
      maxWidth: '600px',
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
      <h1 style={styles.title}>Шифр Подвійний квадрат Уітстона</h1>
      <input
        type="text"
        placeholder="Введіть текст"
        value={plaintext}
        onChange={(e) => setPlaintext(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Ключове слово 1"
        value={key1}
        onChange={(e) => setKey1(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Ключове слово 2"
        value={key2}
        onChange={(e) => setKey2(e.target.value)}
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

export default DoubleWheatstoneCipher;
