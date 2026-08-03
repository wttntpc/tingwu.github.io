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

Hermes 的 cron 由 gateway daemon 執行。可以直接在對話中描述：

```text
每天早上 8 點搜尋最近新增的運動、執行功能、EEG、HRV 與健康老化研究，
篩選最相關的 3 篇，整理研究問題、樣本、方法、主要結果、限制及 DOI／來源連結，
標示期刊論文或預印本，不得補造引用，並傳送到 Telegram。
```

也可以用 CLI 建立：

```bash
hermes cron create "0 8 * * *" \
  "搜尋近幾日與指定研究主題相關的新文獻；驗證標題、作者、年份與 DOI，選出 3 篇並以繁體中文整理。若無法確認來源就不要收錄。" \
  --deliver telegram \
  --name "每日學術文獻"
```

建立後應先手動觸發一次，檢查主機時區、來源連結、訊息長度與 Telegram 投遞位置。免費模型遇到速率限制時，排程仍可能失敗，因此需要定期查看 cron status。

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
