// 1. Map symbols to CoinGecko IDs (for price data) const COIN_MAP = { 'BTC': 'bitcoin', 'ETH': 'ethereum', 'USDT': 'tether', 'SOL': 'solana', 'XRP': 'ripple', 'ADA': 'cardano', 'DOGE': 'dogecoin', 'BNB': 'binancecoin', 'USDC': 'usd-coin' };// 2. Read symbol from URL const urlParams = new URLSearchParams(window.location.search); const symbolRaw = urlParams.get('symbol') || 'BTC'; const symbol = symbolRaw.toUpperCase(); const coinId = COIN_MAP[symbol] || symbol.toLowerCase();// 3. Setup UI const iconEl = document.getElementById('tokenIcon'); const symbolEl = document.getElementById('tokenSymbol'); const priceEl = document.getElementById('tokenPrice'); const container = document.getElementById('chartContainer');symbolEl.innerText = symbol;// --- NEW IMAGE LOGIC --- // We pull the image from CoinCap's CDN. They use lowercase symbols (btc, eth). iconEl.src = https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png; // -----------------------// 4. Initialize Chart const chart = LightweightCharts.createChart(container, { layout: { background: { color: '#1a1a1a' }, textColor: '#d1d4dc', }, grid: { vertLines: { color: '#2B2B43' }, horzLines: { color: '#2B2B43' }, }, width: container.clientWidth, height: container.clientHeight, timeScale: { timeVisible: true, secondsVisible: false }, });const areaSeries = chart.addAreaSeries({ lineColor: '#2962FF', topColor: '#2962FF', bottomColor: 'rgba(41, 98, 255, 0.28)', });window.addEventListener('resize', () => { chart.resize(container.clientWidth, container.clientHeight); });// 5. Fetch Data async function loadData() { try { const response = await fetch(https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1); if (!response.ok) throw new Error("API Error");    const data = await response.json();
    
    const chartData = data.prices.map(item => ({
        time: item[0] / 1000,
        value: item[1]
    }));

    areaSeries.setData(chartData);
    chart.timeScale().fitContent();

    const lastPrice = chartData[chartData.length - 1].value;
    priceEl.innerText = `$${lastPrice.toFixed(2)}`;

} catch (error) {
    console.error(error);
    priceEl.innerText = "Error";
    priceEl.style.color = "red";
}}loadData();