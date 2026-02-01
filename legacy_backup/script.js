// DOM 元素引用
const reportGrid = document.getElementById('report-grid');
const searchBtn = document.getElementById('search-btn');
const resetBtn = document.getElementById('reset-btn');
const stockInput = document.getElementById('stock-id');
const categorySelect = document.getElementById('category-select');
const startDateInput = document.getElementById('date-start');
const endDateInput = document.getElementById('date-end');
const countLabel = document.getElementById('count');

// Modal Elements
const modalOverlay = document.getElementById('report-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.querySelector('.modal-body'); 

let INVESTMENT_DATA = [];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadMarkdownData();

    // 綁定事件
    searchBtn.addEventListener('click', handleSearch);
    resetBtn.addEventListener('click', handleReset);
    
    // 支援 Enter 鍵搜尋
    stockInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // 點擊 Modal 外部關閉
    window.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
});

async function loadMarkdownData() {
    try {
        const response = await fetch('data/manifest.json');
        if (!response.ok) throw new Error('無法讀取 manifest.json');
        
        const fileList = await response.json();
        
        const promises = fileList.map(async (filePath) => {
            try {
                const res = await fetch(filePath);
                if (!res.ok) throw new Error(`無法讀取 ${filePath}`);
                const text = await res.text();
                return parseMarkdown(text);
            } catch (e) {
                console.warn(e);
                return null;
            }
        });

        const results = await Promise.all(promises);
        INVESTMENT_DATA = results.filter(item => item !== null);
        renderCards(INVESTMENT_DATA);

    } catch (error) {
        console.error('Error loading markdown data:', error);
        reportGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; color: var(--accent-red); margin-bottom: 10px;"></i>
                <p>載入數據失敗，請確認檔案路徑與伺服器設定。</p>
                <code style="display:block; margin-top:10px; font-size:0.8rem; background:rgba(0,0,0,0.3); padding:5px;">${error.message}</code>
            </div>
        `;
    }
}

function parseMarkdown(mdContent) {
    // 1. 分離 Frontmatter 與 Body
    // 簡單的正則表達式匹配 YAML header
    const fmRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/;
    const match = mdContent.match(fmRegex);
    
    let metadata = {};
    let body = mdContent;

    if (match) {
        const fmString = match[1];
        // 移除 Frontmatter 部分
        body = mdContent.replace(match[0], '').trim();
        
        // 簡單解析 YAML Lines (key: value)
        fmString.split('\n').forEach(line => {
            const parts = line.split(':');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                // 處理值包含冒號的情況 (ex: time: 10:00)
                let value = parts.slice(1).join(':').trim();
                
                // 移除可能的引號
                if ((value.startsWith('"') && value.endsWith('"')) || 
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                metadata[key] = value;
            }
        });
    }

    // 2. 提取摘要 (## 摘要 ... ## 之間的內容)
    // 假設結構是 ## 摘要 \n content \n ## 其他
    const summaryRegex = /## 摘要\s*([\s\S]*?)\s*(?=##|$)/;
    const summaryMatch = body.match(summaryRegex);
    
    // 如果沒有找到 ## 摘要，則嘗試用 focus 欄位，或取前 100 字
    let summary = summaryMatch ? summaryMatch[1].trim() : (metadata.focus || body.slice(0, 100) + "...");

    // 3. 轉換 Body 為 HTML (使用 marked)
    // 確保 marked 已載入
    const htmlContent = (typeof marked !== 'undefined') ? marked.parse(body) : body;

    return {
        ...metadata,
        summary: summary,
        fullHtml: htmlContent
    };
}

/**
 * 根據條件篩選並渲染
 */
function handleSearch() {
    const stockQuery = stockInput.value.trim().toLowerCase();
    const categoryQuery = categorySelect.value;
    
    const filtered = INVESTMENT_DATA.filter(item => {
        // 股票代碼或名稱篩選
        const matchStock = stockQuery === '' || 
                           (item.id && item.id.toLowerCase().includes(stockQuery)) || 
                           (item.stockName && item.stockName.toLowerCase().includes(stockQuery));
        
        // 分類篩選
        const matchCategory = categoryQuery === 'all' || item.category === categoryQuery;

        return matchStock && matchCategory;
    });

    renderCards(filtered);
}

function handleReset() {
    stockInput.value = '';
    categorySelect.value = 'all';
    startDateInput.value = '';
    endDateInput.value = '';
    renderCards(INVESTMENT_DATA);
}

function renderCards(data) {
    if (!countLabel || !reportGrid) return;
    
    countLabel.textContent = data.length;
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

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'report-card';
        
        const sentimentClass = item.sentiment || 'neutral';
        const sentimentIcon = item.sentiment === 'bullish' ? 'fa-arrow-trend-up' : 
                              item.sentiment === 'bearish' ? 'fa-arrow-trend-down' : 'fa-minus';

        // 隨機生成一個背景顏色條作為裝飾 (根據 sentiment)
        const borderColor = item.sentiment === 'bullish' ? 'var(--accent-green)' : 
                            item.sentiment === 'bearish' ? 'var(--accent-red)' : 'var(--text-muted)';
        
        card.style.setProperty('--primary-color', borderColor);

        // 構建卡片 HTML
        card.innerHTML = `
            <div class="card-header">
                <div class="stock-info">
                    <h3>${item.stockName || '未知名稱'} <span class="stock-id">${item.id || 'N/A'}</span></h3>
                </div>
                <!-- <span class="report-date"><i class="fa-regular fa-clock"></i> ${item.date || ''}</span> -->
            </div>

            <div class="card-badges">
                <span class="badge ${sentimentClass}"><i class="fa-solid ${sentimentIcon}"></i> ${getSentimentLabel(item.sentiment)}</span>
                <span class="badge">${item.type || '分析'}</span>
            </div>

            <div class="card-content">
                <p class="summary">${item.summary}</p>
                <div class="data-points">
                    <div class="data-point">
                        <span class="label">進場</span>
                        <span class="value">${item.entry || '-'}</span>
                    </div>
                    <div class="data-point">
                        <span class="label">目標</span>
                        <span class="value green">${item.target || '-'}</span>
                    </div>
                </div>
            </div>

            <div class="card-footer">
                <button class="read-btn" onclick="openModal('${item.id}')" style="background:none; border:none; cursor:pointer; font-family:inherit;">
                    查看完整報告 <i class="fa-solid fa-arrow-right"></i>
                </button>
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

function openModal(stockId) {
    const item = INVESTMENT_DATA.find(d => d.id === stockId);
    if (!item) return;

    if (modalTitle) modalTitle.innerHTML = `${item.stockName} <span class="stock-id">${item.id}</span>`;
    
    // 將轉換後的 HTML 注入 Modal Body
    // 增加一些 scoped style 來美化 markdown 內容
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="markdown-content">
                ${item.fullHtml}
            </div>
        `;
    }

    if (modalOverlay) modalOverlay.classList.add('active');
}

function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('active');
}
