<!-- SIMPLE -->

我希望 AI 不只在打開電腦時回答問題，也能每天主動把值得閱讀的學術文章送到手機。我的做法是讓 Hermes Agent 在電腦或伺服器上執行工作，再透過 Telegram 接收結果。

這套系統的重點不是「多裝一個聊天機器人」，而是把文獻搜尋、篩選、摘要、排程與手機通知串成固定流程。

## 這套工作流由四個部分組成

```text
免費或本機語言模型
        ↓
Hermes Agent 執行搜尋與整理
        ↓
每日排程自動啟動任務
        ↓
Telegram 將結果送到手機
```

Hermes 是實際執行任務的 Agent；Telegram 只是我在手機上查看結果、繼續追問或調整排程的入口。電腦、WSL 或伺服器仍必須保持運作，Hermes gateway 也要持續執行，排程才會準時發送。

## 「免費模型」不等於完全沒有成本

Hermes Agent 本身是開源軟體。模型可以選擇 OpenRouter 當下標示為免費、且支援工具呼叫的模型，也可以連接自己電腦上的 Ollama 等本機模型。

兩種方式都有取捨：

- OpenRouter 免費模型設定較容易，但可能有流量、速率或供應限制。
- 本機模型沒有每次呼叫的 API 費用，但需要足夠的記憶體、運算能力與電力。

因此，我不把某一個模型名稱永久寫死，而是在 Hermes 的模型選單中確認目前仍免費、能使用工具，而且實際摘要品質足夠的模型。

## 從電腦連到手機

在 Windows 上可以選擇原生安裝或 WSL2。原生方式較直覺，WSL2 則較接近 Linux 工作環境。完成 Hermes 基本設定後，再透過 Telegram 的 BotFather 建立專用 bot，讓 Hermes gateway 將訊息送到指定聊天室。

Bot token 就像密碼，不能放進 GitHub、文章或公開截圖；同時應限制只有自己的 Telegram 帳號能操作 bot。

## 每日學術文章不只是「搜尋最新論文」

每天寄來十篇標題並不等於研究效率提升。我會先定義研究主題、時間範圍與輸出格式，例如：

- 聚焦運動、執行功能、EEG、HRV 與健康老化。
- 優先列出近幾天新增或更新的研究。
- 清楚區分期刊論文與尚未同儕審查的預印本。
- 每篇整理研究問題、樣本、方法、主要發現與限制。
- 保留 DOI 或原始連結，找不到來源時不補造。
- 與前幾天重複的文章不再推送。

Telegram 收到的內容是一份「待我判斷的閱讀清單」，不是替我決定哪些研究一定正確。

## 我的實際每日任務

我把設定保存在自己的 Hermes repo，任務名稱是 `daily-science-brief`：每天上午 8 點，搜尋過去 3 天與五個主題相關的新研究。

| 主題 | 關鍵方向 |
|---|---|
| 運動 | 身體活動、運動介入、VO₂max、有氧與阻力運動 |
| 情緒 | 情緒反應、感受與心情調節 |
| HRV | 心率變異性與自律神經 |
| EEG | 腦波、神經震盪與腦電圖 |
| 認知 | 執行功能、抑制、工作記憶、認知彈性與計畫 |

搜尋不是找到多少就全部傳送。我會優先保留研究型原文、系統性回顧與統合分析，限制每日篇數，並要求每篇都有可開啟的來源連結。這樣 Telegram 收到的是可以開始閱讀的精選清單，而不是大量未整理的搜尋結果。

> 我真正想建立的不是每天自動產生更多文字，而是一個會準時把研究線索送到手上，同時保留來源與判斷空間的工作系統。

<!-- PROFESSIONAL -->

這個工作流將 Hermes Agent 作為長時間運行的執行層，以支援工具呼叫的免費或本機模型作為推理層，透過 cron 建立每日排程，最後由 Telegram gateway 將文獻摘要推送到指定的 home channel。

## 一、安裝 Hermes 並先完成基本對話

Windows 使用者可選擇原生安裝或 WSL2。原生 Windows 目前仍屬較新的支援路徑；若已熟悉 Linux 工具鏈，WSL2 通常較接近官方主要環境。

WSL2、Linux 或 macOS 可依官方安裝方式執行：

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
source ~/.bashrc
hermes
```

原生 Windows 可在 PowerShell 使用官方安裝腳本：

```powershell
iex (irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1)
```

完成安裝後，先確認一般對話、模型與工具都能工作，再加入 Telegram 與排程。一次設定所有元件會增加除錯難度。

## 二、選擇免費且能呼叫工具的模型

在終端機執行：

```bash
hermes model
```

選擇 OpenRouter 後，從目前模型目錄確認價格為零、名稱通常帶有 `:free`，並確認支援 tool calling。免費模型名單會變動，因此不固定推薦單一名稱。模型能正常聊天，也不代表能穩定完成搜尋、讀取頁面與結構化輸出；正式排程前應先以相同提示重複測試。

另一條路徑是透過 OpenAI-compatible endpoint 連接 Ollama、LM Studio 或其他本機推論服務。本機模型沒有逐次 API 費用，但仍需考量硬體、上下文長度、工具呼叫能力與持續運行成本。

## 三、把 Hermes 連到 Telegram

在 Telegram 的 `@BotFather` 建立 bot，取得 token 後執行：

```bash
hermes gateway setup
```

設定完成後啟動 gateway：

```bash
hermes gateway start
hermes gateway status
```

若使用沒有穩定 systemd 的 WSL 環境，可以前景模式測試：

```bash
hermes gateway run
```

接著在與 bot 的 Telegram 對話中使用 `/sethome`，讓排程知道結果要送到哪個聊天室。務必設定允許使用者清單，只開放自己的 Telegram user ID。bot token 應留在 Hermes 的私密環境設定中；若外洩，應立即在 BotFather 撤銷並重建。

## 四、建立每日學術文獻排程

Hermes 的 cron 由 gateway daemon 執行。我的實際設定保存在私人 repo [wttntpc/hermes-agent](https://github.com/wttntpc/hermes-agent)，核心規格如下：

```text
name: daily-science-brief
schedule: 0 8 * * *
lookback: 過去 3 天
delivery: Telegram
topics: Exercise、Emotion、HRV、EEG、Cognition
```

如果從 Telegram 對話中建立任務，可以把 delivery 設為 `origin`，結果會回到建立任務的原聊天室；若從終端機建立，建議先在 Telegram 執行 `/sethome`，並明確使用 `--deliver telegram`。

### 可直接交給 Hermes 的任務說明

```text
建立一個名稱為 daily-science-brief 的 cron 任務，每天上午 8 點執行並傳送到 Telegram。

搜尋過去 3 天與以下主題高度相關的新文獻：
1. 運動、身體活動、運動介入、VO₂max、有氧與阻力運動
2. 情緒、情感反應、感受與心情調節
3. HRV、心率變異性與自律神經
4. EEG、腦波與神經震盪
5. 認知功能、執行功能、抑制、工作記憶、認知彈性與計畫

優先使用 PubMed／Europe PMC；以 Crossref 補 DOI、ISSN、出版商與期刊資料；
再查 arXiv、bioRxiv、medRxiv 與 Semantic Scholar。Google Scholar 只作人工備援。

最多選出 5 篇最相關文獻，優先納入 Original Article、Systematic Review 與 Meta-analysis。
每篇以繁體中文整理原文標題、中文標題、前 5 位作者、期刊、年份、研究類型、
研究問題、樣本、方法、主要結果、限制、DOI 或可直接開啟的來源連結，
並說明它與主題 1–5 的關聯。跨主題研究需特別標示。

不得補造 PMID、DOI、Impact Factor、期刊分區或研究結果。
若無合法 JCR 查詢來源，Impact Factor 與 JCR 分區標示為「待確認」；查不到的欄位寫「無」，
但不要因此中斷後續摘要。排除與過去 7 天推送內容重複的文章。
```

這份設定保留原 repo 的五個研究主題與資料來源順序，同時補上「每日最多 5 篇」、七天去重，以及 JCR 無法合法確認時不得推測等限制。

### 使用 CLI 建立

```bash
hermes cron create "0 8 * * *" \
  "執行 daily-science-brief：依已確認的五個主題搜尋過去 3 天文獻，最多選出 5 篇；驗證來源與 DOI，以繁體中文整理，禁止補造資料並排除七天內重複項目。" \
  --deliver telegram \
  --name "daily-science-brief"
```

若使用這個較短的 CLI 提示，五個主題與輸出規則應先保存為 Hermes 可讀取的 Skill 或規則檔；否則建議直接在 Telegram 貼上前面的完整任務說明。

建立後先檢查並手動測試：

```bash
hermes cron list
hermes cron status
hermes cron run <job-id>
```

確認主機時區為預期時區、來源連結能開啟、Telegram 收件位置正確，且訊息長度適合手機閱讀。免費模型遇到速率限制時，排程仍可能失敗，因此需要定期檢查執行狀態。

## 五、建立可查核的摘要規則

一份可靠的每日文獻簡報至少應包含：

1. 可點擊的原始來源或 DOI。
2. 文獻類型與同儕審查狀態。
3. 樣本、設計與主要測量。
4. 主要結果與作者提出的限制。
5. 為何符合個人研究主題。
6. 與既有文獻或前次推送是否重複。

最終仍由研究者開啟原文、確認方法並決定是否納入知識庫。Telegram 摘要是發現工具，不是研究證據本身。

## 延伸閱讀

- [Hermes Agent 官方專案](https://github.com/NousResearch/hermes-agent)
- [Hermes Telegram 設定文件](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/telegram.md)
- [Hermes 排程任務文件](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/cron.md)
