// data.js
const testJsonUrl = './data/Test.json';

// Функція для завантаження даних із Test.json
export async function loadTestData() {
    try {
        const response = await fetch(testJsonUrl);
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Помилка завантаження Test.json:', error);
        return [];
    }
}