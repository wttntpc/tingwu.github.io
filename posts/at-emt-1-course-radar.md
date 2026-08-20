<!-- SIMPLE -->

為了解決緊急救護技術員（EMT-1）與運動傷害防護員（AT）在累積繼續教育時數時，必須四處搜尋各個學會官網、報名系統的痛點，我獨立開發並上線了「進修課程雷達」網站。

這個網站能全自動追蹤全台相關進修與複訓課程，並彙整成一個美觀、具備即時搜尋與區域篩選的儀表板。

👉 **[立即體驗：運動防護 & EMT-1 進修課程雷達 ↗](https://at-emt-1-course-radar.vercel.app/)**

## 💡 為什麼要開發這個網站？

作為一個同時就讀認知神經科學研究所、並擁有運動防護員與 EMT-1 證照的跨領域研究者，我非常了解時數累積的繁瑣。以往我們需要手動巡邏 BeClass、防護學會官網、急救推廣協會等多個網站，非常容易錯過報名期限。

為了解決這個問題，我建立了一套自動化爬蟲，每天自動巡邏並將新課程同步到雲端資料庫，讓所有人都能一目了然全台最新的開課資訊。

## 🌟 主要功能特點

1. **六大平台自動彙整**：整合了 BeClass、TATS 運動防護學會、TEMTAF 中華緊急救護技術員協會、SFAST 台灣急救推廣協會、旺英衛教基金會與篤志享學教育的開課資訊。
2. **開課地區自動歸類**：透過後台語意演算法，自動識別開課機構與地點（如「高醫大」、「台北中正」），將其劃分為北區、中區、南區、東區與線上課程。
3. **過期課程自動隱藏**：以當前系統日期為基準，自動標記並過濾掉已經開課的歷史項目，節省時間。
4. **一鍵報名跳轉**：點擊任何一門課程，將會直接導向該官方平台的報名詳細頁面（如 TEMTAF 的 Class ID 詳情頁）。

---

<!-- PROFESSIONAL -->

「進修課程雷達」是一個基於無伺服器架構（Serverless）開發的輕量化自動資料集與動態展示網站，主要用於解決台灣運動防護學分與緊急醫療救護繼續教育積分的零散與不透明。

## 🛠️ 系統架構與技術棧

本專案採用 **GitHub Actions ➔ Supabase ➔ Vercel** 的無伺服器混合鏈路：

```
[ 本機開發 / GitHub Actions (排程)]
             │
             ▼ (BeautifulSoup 爬蟲多源解析)
[ 雲端資料庫 Supabase ] ◄─────► [ 前端網頁 Vercel (自體封裝/PostgREST 混合載入) ]
```

1. **資料爬取與清洗 (Python + BeautifulSoup)**：
   * 主程式配置於 GitHub Actions，每日定期執行多源爬取。
   * **ROC 年分正規化**：針對台灣特有的民國年分（例如 `115年01月30日`），撰寫 Regex 解析器並進行西元日期的自動轉換（`民國年 + 1911`），確保資料庫 Date 欄位格式統一，利於排序。
   * **黑白名單字元過濾**：設定包含與排除詞庫（排除不動產營業員、水上活動等無關複訓雜訊），保障資料品質。
2. **雲端儲存與 RLS 安全策略 (Supabase)**：
   * 採用 PostgreSQL 作為儲存主體，啟用 Row Level Security (RLS)。
   * **安全性機制**：前端網頁僅被授予 `SELECT`（公開讀取）政策，而資料寫入與更新（`Prefer: resolution=merge-duplicates` 覆寫插入）僅限於持有 `service_role` 金鑰的後端爬蟲，避免資料庫被惡意竄改。
3. **前端渲染與混合式載入 (Vercel + Vanilla JS + Tailwind)**：
   * 託管於 Vercel 的前端 `index.html` 採用混合式架構：當配置有 `SUPABASE_ANON_KEY` 時，會透過 API 直接向 Supabase 進行非同步動態載入；若連線失敗或本機離線時，則自動 fallback 到封裝於 HTML 尾部的靜態 JSON 快照。

## 📊 資料庫欄位結構 (PostgreSQL Schema)

```sql
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,                       -- 唯一識別碼 (BeClass rid 或自建 Hash)
    title TEXT NOT NULL,                       -- 課程名稱
    url TEXT NOT NULL,                         -- 官方報名網址
    date DATE,                                 -- 開課日期 (西元格式，支援 NULL)
    source TEXT NOT NULL,                      -- 來源管道名稱
    query_keyword TEXT NOT NULL,               -- 分類關鍵字
    created_at TIMESTAMPTZ DEFAULT NOW()       -- 爬取時間
);
```
