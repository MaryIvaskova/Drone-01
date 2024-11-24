export const Utils = (() => {
    async function fetchExchangeRate() {
        const response = await fetch("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5");
        const data = await response.json();
        return parseFloat(data.find(rate => rate.ccy === "USD").sale);
    }

    return { fetchExchangeRate };
})();