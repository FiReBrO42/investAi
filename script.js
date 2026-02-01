// 模擬歷史投資分析資料
const MOCK_DATA = [
    {
        id: "R001",
        date: "2023-10-25",
        stockId: "2330",
        stockName: "台積電",
        type: "股票分析",
        sentiment: "bullish",
        summary: "台積電 Q3 法說會優於預期，先進封裝產能持續擴充。技術面站上月線，MACD 黃金交叉，展現多頭排列氣勢。",
        entry: "545",
        target: "580",
        stopLoss: "530"
    },
    {
        id: "R002",
        date: "2023-10-26",
        stockId: "3231",
        stockName: "緯創",
        type: "指標搭配",
        sentiment: "neutral",
        summary: "目前股價在布林通道中軌震盪，RSI 指數 50 附近徘徊。建議等待突破方向明確後再進行操作，需留意法人籌碼動向。",
        entry: "98.5",
        target: "105",
        stopLoss: "92"
    },
    {
        id: "R003",
        date: "2023-10-24",
        stockId: "2603",
        stockName: "長榮",
        type: "ATR計算",
        sentiment: "bearish",
        summary: "受到全球運價指數下跌影響，股價呈現弱勢整理。ATR 顯示波動率放大，建議嚴格執行止損，目前空方勢力較強。",
        entry: "110",
        target: "100",
        stopLoss: "115"
    },
    {
        id: "R004",
        date: "2023-10-27",
        stockId: "2454",
        stockName: "聯發科",
        type: "股票分析",
        sentiment: "bullish",
        summary: "新一代旗艦晶片發表，市場反應熱烈。股價強勢突破前高，成交量溫和放大，小週期 EMA 黃金交叉支撐強勁。",
        entry: "820",
        target: "880",
        stopLoss: "790"
    },
    {
        id: "R005",
        date: "2023-10-23",
        stockId: "0050",
        stockName: "元大台灣50",
        type: "期貨/指數",
        sentiment: "neutral",
        summary: "跟隨加權指數區間震盪，外資期貨空單未明顯回補。建議區間操作，下檔季線有強支撐。",
        entry: "125",
        target: "130",
        stopLoss: "122"
    }
];

// DOM 元素引用
const reportGrid = document.getElementById('report-grid');
const searchBtn = document.getElementById('search-btn');
const resetBtn = document.getElementById('reset-btn');
const stockInput = document.getElementById('stock-id');
const startDateInput = document.getElementById('date-start');
const endDateInput = document.getElementById('date-end');
const countLabel = document.getElementById('count');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 預設填入一些日期範圍 (選用)
    // 渲染所有資料
    renderCards(MOCK_DATA);

    // 綁定事件
    searchBtn.addEventListener('click', handleSearch);
    resetBtn.addEventListener('click', handleReset);
    
    // 支援 Enter 鍵搜尋
    stockInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
});

/**
 * 根據條件篩選並渲染
 */
function handleSearch() {
    const stockQuery = stockInput.value.trim().toLowerCase();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    const filtered = MOCK_DATA.filter(item => {
        // 股票代碼或名稱篩選
        const matchStock = stockQuery === '' || 
                           item.stockId.includes(stockQuery) || 
                           item.stockName.includes(stockQuery);
        
        // 日期篩選
        let matchDate = true;
        if (startDate && item.date < startDate) matchDate = false;
        if (endDate && item.date > endDate) matchDate = false;

        return matchStock && matchDate;
    });

    renderCards(filtered);
}

/**
 * 重置篩選條件
 */
function handleReset() {
    stockInput.value = '';
    startDateInput.value = '';
    endDateInput.value = '';
    renderCards(MOCK_DATA);
}

/**
 * 渲染卡片網格
 * @param {Array} data 
 */
function renderCards(data) {
    // 更新計數
    countLabel.textContent = data.length;
    
    // 清空網格
    reportGrid.innerHTML = '';

    if (data.length === 0) {
        reportGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fa-solid fa-folder-open" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>找不到符合條件的報表數據</p>
            </div>
        `;
        return;
    }

    // 生成並插入卡片 HTML
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'report-card';
        
        // 判斷趨勢顏色
        const sentimentClass = item.sentiment; // 'bullish', 'bearish', 'neutral'
        const sentimentIcon = item.sentiment === 'bullish' ? 'fa-arrow-trend-up' : 
                              item.sentiment === 'bearish' ? 'fa-arrow-trend-down' : 'fa-minus';

        // 隨機生成一個背景顏色條作為裝飾 (根據 sentiment)
        const borderColor = item.sentiment === 'bullish' ? 'var(--accent-green)' : 
                            item.sentiment === 'bearish' ? 'var(--accent-red)' : 'var(--text-muted)';
        
        card.style.setProperty('--primary-color', borderColor);

        card.innerHTML = `
            <div class="card-header">
                <div class="stock-info">
                    <h3>${item.stockName} <span class="stock-id">${item.stockId}</span></h3>
                </div>
                <span class="report-date"><i class="fa-regular fa-clock"></i> ${item.date}</span>
            </div>

            <div class="card-badges">
                <span class="badge ${sentimentClass}"><i class="fa-solid ${sentimentIcon}"></i> ${getSentimentLabel(item.sentiment)}</span>
                <span class="badge">${item.type}</span>
            </div>

            <div class="card-content">
                <p class="summary">${item.summary}</p>
                <div class="data-points">
                    <div class="data-point">
                        <span class="label">進場建議</span>
                        <span class="value">${item.entry}</span>
                    </div>
                    <div class="data-point">
                        <span class="label">目標價</span>
                        <span class="value green">${item.target}</span>
                    </div>
                    <div class="data-point">
                        <span class="label">止損價</span>
                        <span class="value red">${item.stopLoss}</span>
                    </div>
                </div>
            </div>

            <div class="card-footer">
                <a href="#" class="read-btn">查看完整報告 <i class="fa-solid fa-arrow-right"></i></a>
            </div>
        `;

        reportGrid.appendChild(card);
    });
}

function getSentimentLabel(sentiment) {
    if (sentiment === 'bullish') return '看多';
    if (sentiment === 'bearish') return '看空';
    return '盤整';
}
