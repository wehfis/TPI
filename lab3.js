// Завдання 1: Потоковий шифр на основі генератора BBS

function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

function isPrime(num) {
    if (num <= 1) return false;
    if (num === 2) return true;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function generateLargePrime() {
    let num;
    do {
        num = Math.floor(Math.random() * 1000) + 100; // Випадкове просте число в діапазоні 100-1000
    } while (!isPrime(num));
    return num;
}

function bbsGenerator(p, q, length) {
    const n = p * q;
    let x = Math.floor(Math.random() * n);
    while (gcd(x, n) !== 1) {
        x = Math.floor(Math.random() * n);
    }
    
    const bits = [];
    for (let i = 0; i < length; i++) {
        x = (x * x) % n;
        bits.push(x % 2);
    }
    return bits;
}

// Генеруємо прості числа p і q, модуль n та випадкове число x
const p = generateLargePrime();
const q = generateLargePrime();
const keyStreamLength = 16; // Довжина послідовності
const keyStream = bbsGenerator(p, q, keyStreamLength);

console.log(`Прості числа p: ${p}, q: ${q}`);
console.log(`Ключова послідовність: ${keyStream.join('')}`);

// Функція шифрування і дешифрування
function xorEncryptDecrypt(text, keyStream) {
    const binaryText = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
    const encrypted = binaryText.split('').map((bit, i) => bit ^ keyStream[i % keyStream.length]).join('');
    return encrypted;
}

const message = "hello";
const encryptedMessage = xorEncryptDecrypt(message, keyStream);
console.log(`Зашифроване повідомлення: ${encryptedMessage}`);
const decryptedMessage = xorEncryptDecrypt(encryptedMessage, keyStream);
console.log(`Розшифроване повідомлення: ${decryptedMessage}`);


// Завдання 2: ЛРЗЗ зі зворотним зв'язком
function lfsr(seed, taps, length) {
    let state = seed;
    const result = [];
    
    for (let i = 0; i < length; i++) {
        const bit = taps.reduce((acc, tap) => acc ^ ((state >> tap) & 1), 0);
        state = (state >> 1) | (bit << (taps.length - 1));
        result.push(state & 1);
    }
    return result;
}

// Початкове насіння (seed) і налаштування тапів для багаточлена x^10 + x^3 + 1
const seed = 0b1010101010; // 10-бітове насіння
const taps = [10, 3]; // Позиції зворотного зв'язку
const sequenceLength = 16; // Довжина послідовності

const lfsrSequence = lfsr(seed, taps, sequenceLength);
console.log(`Послідовність ЛРЗЗ: ${lfsrSequence.join('')}`);
