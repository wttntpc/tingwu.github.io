<!-- SIMPLE -->

我希望 AI 不只在我打開電腦時回答問題，而是每天早上主動把值得閱讀的學術文章送到手機。這篇文章記錄我的實際做法：讓 Hermes Agent 搜尋與整理文獻、用 cron 在每天上午 8 點啟動任務，再透過 Telegram 把結果送給我。

<figure class="article-figure">
  <img src="assets/hermes-academic-brief-workflow.png" alt="學術文獻經過搜尋、查核與排程後，由電腦上的 AI Agent 傳送到手機" loading="lazy">
  <figcaption>我的每日流程：找文獻 → 核對來源 → 定時執行 → 傳送到手機。</figcaption>
</figure>

> 這不是「讓 AI 每天替我讀完論文」，而是建立一份準時送達、保留來源、可以再人工判斷的閱讀清單。

## 完成後會得到什麼？

每天上午 8 點，Telegram 會收到最多 5 篇新文獻。內容包含原文標題、中文標題、作者、期刊、研究類型、樣本、方法、主要結果、限制，以及可直接開啟的 DOI 或來源連結。找不到的欄位標示「無」或「待確認」，不能由 AI 猜測。

整個系統有四個部分：

```text
文獻資料來源
     ↓
Hermes + 語言模型搜尋、篩選與整理
     ↓
Hermes cron 每天上午 8 點啟動
     ↓
Telegram 將結果送到手機
```

電腦或伺服器必須保持開機，Hermes gateway 也必須持續運作。Telegram 只是收件與互動介面，不會在手機上執行文獻搜尋。

## 開始前先準備四件事

- 一台能長時間運作的 Windows、WSL2、Linux 或 macOS 電腦。
- 一個 Telegram 帳號，以及只給自己使用的 bot。
- 一個支援工具呼叫的模型：可選免費雲端模型或本機模型。
- 清楚的研究主題、資料來源順序與摘要查核規則。

如果是第一次安裝，我建議 Windows 使用者先選 WSL2；它比較接近 Hermes 的 Linux 使用環境。原生 Windows 安裝也可行，但目前仍是較新的支援路徑。

## 第一步：安裝 Hermes

WSL2、Linux 或 macOS 在終端機執行：

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
source ~/.bashrc
hermes
```

原生 Windows 則在 PowerShell 執行：

```powershell
iex (irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1)
```

安裝完若找不到 `hermes`，先關閉再重新開啟終端機。第一次設定不要急著加入 Telegram；先和 Hermes 對話一次，確認模型與基本工具可以正常運作。

## 第二步：選擇免費或本機模型

在一般終端機執行：

```bash
hermes model
```

免費雲端模型通常比較容易開始，但「免費」可能隨供應商調整，也可能有速率、每日額度或暫停服務等限制。我會確認三件事：目前價格是否仍為零、是否支援 tool calling、能否用相同提示連續完成搜尋與摘要。

本機模型可經 Ollama、LM Studio 或其他 OpenAI-compatible endpoint 使用。它沒有逐次 API 費用，卻仍需要記憶體、運算效能、電力與一台持續開機的電腦。模型免費也不代表搜尋工具或外部 API 一定沒有成本，因此正式啟用前仍要查看各服務的額度。

## 第三步：用 BotFather 建立 Telegram bot

1. 在 Telegram 搜尋官方的 `@BotFather`。
2. 傳送 `/newbot`。
3. 輸入顯示名稱。
4. 設定一個以 `bot` 結尾、且未被使用的 username。
5. 保存 BotFather 回傳的 bot token。

Bot token 等同密碼。不要貼進文章、對話截圖或 GitHub；如果曾經公開，立即在 BotFather 使用 `/revoke`，再產生新 token。

接著查出自己的數字型 Telegram user ID。這不是 `@username`，而是一串數字；可用 Telegram 的 `@userinfobot` 查詢。

## 第四步：讓 Hermes 連上 Telegram

回到電腦執行：

```bash
hermes gateway setup
```

選擇 Telegram，依畫面輸入 bot token 與自己的數字型 user ID。這個 allowed users 清單很重要：它可以避免陌生人找到 bot 後直接操作你的 Agent。

先以前景模式啟動並測試：

```bash
hermes gateway
```

回到 Telegram，開啟剛建立的 bot 並傳送一則測試訊息。收到 Hermes 回覆後，在同一個對話輸入：

```text
/sethome
```

這會把目前聊天室設為排程結果的預設收件位置。個人使用不需要關閉 BotFather 的 group privacy，也不建議把 bot 加入公開群組。

## 第五步：建立每天上午 8 點的任務

我實際使用的任務名稱是 `daily-science-brief`，完整研究規格保存在 [wttntpc/hermes-agent](https://github.com/wttntpc/hermes-agent)。五個主題是：

| 主題 | 搜尋方向 |
|---|---|
| 運動 | 身體活動、運動介入、VO₂max、有氧與阻力運動 |
| 情緒 | 情緒反應、感受與心情調節 |
| HRV | 心率變異性與自律神經 |
| EEG | 腦波、神經震盪與腦電圖 |
| 認知 | 執行功能、抑制、工作記憶、認知彈性與計畫 |

最容易的方式，是直接對 Hermes 說：

```text
請建立一個名為 daily-science-brief 的 cron 任務，
每天上午 8 點執行，結果傳送到 Telegram。

搜尋過去 3 天與運動、情緒、HRV、EEG、認知功能高度相關的新文獻。
優先使用 PubMed／Europe PMC，再以 Crossref 補 DOI 與期刊資料，
其次才查 arXiv、bioRxiv、medRxiv 與 Semantic Scholar。

每天最多選 5 篇，以繁體中文整理研究問題、樣本、方法、主要結果與限制，
保留可開啟的 DOI 或來源連結，標示期刊論文或預印本，並排除過去 7 天重複內容。
查不到的資料寫「無」或「待確認」，絕對不要補造。
```

建立後，先不要等到隔天。立即列出並手動執行：

```bash
hermes cron list
hermes cron run daily-science-brief
hermes cron status
```

## 第六步：讓 gateway 長時間運作

cron 是由 Hermes gateway 負責執行。只關掉終端機而沒有安裝背景服務，隔天通常不會收到訊息。測試成功後可執行：

```bash
hermes gateway install
hermes gateway status
```

不同作業系統會使用對應的背景服務機制。完成後重新開機一次，再檢查 gateway 與 cron 狀態，才算真正完成。

## 收到摘要後，我仍會做三個確認

1. 點開 DOI 或來源連結，確認標題、作者與年份相符。
2. 區分正式期刊論文與尚未同儕審查的預印本。
3. 回到全文確認樣本、方法、主要結果與限制，再決定是否存入 Zotero 或研究筆記。

Impact Factor 與 JCR 分區不適合由模型憑搜尋片段推測。沒有合法、可核對的資料來源時，就應標示「待確認」。Telegram 摘要是文獻發現工具，不是最後的研究證據。

## 快速故障排除

| 問題 | 優先檢查 |
|---|---|
| bot 完全不回覆 | gateway 是否仍在執行、token 是否正確 |
| 陌生人可以操作 | 是否設定自己的 numeric user ID 為 allowed user |
| 手動測試成功，早上卻沒收到 | gateway 背景服務、主機開機狀態、`/sethome` |
| 收到時間不對 | 主機的日期、時間與時區 |
| 免費模型偶爾失敗 | 供應商額度、速率限制、工具呼叫能力 |
| 摘要有不存在的 DOI | 提示是否要求來源核對，並人工開啟連結驗證 |

<!-- PROFESSIONAL -->

這個工作流把 Hermes Agent 當作長時間運行的執行層，以支援工具呼叫的雲端免費模型或本機模型作為推理層，使用 Hermes cron 建立每日排程，最後由 Telegram gateway 把結果送到指定 home channel。

<figure class="article-figure">
  <img src="assets/hermes-academic-brief-workflow.png" alt="文獻來源經 AI Agent 查核與排程後傳送至手機的系統架構" loading="lazy">
  <figcaption>系統邊界：模型負責整理，Hermes 負責工具與排程，Telegram 負責傳送；原始來源仍需由研究者核對。</figcaption>
</figure>

## 一、先理解架構與必要條件

```text
PubMed / Europe PMC / Crossref / preprint APIs
                      ↓
        Hermes tools + configured model
                      ↓
       cron scheduler inside the gateway
                      ↓
     Telegram home channel → researcher
```

Gateway 每 60 秒檢查排程，到期後以新的 Agent session 執行任務，完成後把 final response 交給設定的 delivery target。這代表主機、網路與 gateway 必須在排程時間保持可用；Telegram bot 本身不會代替 Hermes 執行任務。

開始前建議決定：

1. 執行環境：原生 Windows、WSL2、Linux 或 macOS。
2. 模型路徑：OpenRouter 等雲端服務，或 Ollama／LM Studio 等本機 endpoint。
3. 搜尋範圍：主題、lookback、來源順序與每日篇數。
4. 信任邊界：哪些內容可送往第三方模型，哪些資料必須留在本機。

## 二、安裝與基本驗證

### WSL2、Linux、macOS

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
source ~/.bashrc
hermes --version
hermes
```

### 原生 Windows PowerShell

```powershell
iex (irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1)
```

安裝後開啟新的 PowerShell 視窗，再檢查：

```powershell
Get-Command hermes
hermes --version
```

原生 Windows 支援仍屬 early beta；若遇到路徑、子程序或非 ASCII 字元問題，可改用 WSL2。無論採哪一條路徑，都應先讓一般對話與工具測試成功，再加入訊息平台和排程，這樣才能判斷錯誤發生在哪一層。

## 三、模型選擇與費用控制

在 Hermes session 外執行：

```bash
hermes model
```

若選 OpenRouter 免費模型，應以當下模型目錄為準，確認價格為零、支援 tool calling，並以相同文獻提示重複測試。不要把某個 `:free` model ID 永久寫進公開文章，因為供應狀態與限制會改變。

本機模型則可在 `hermes model` 選擇 Custom endpoint，連到 Ollama、LM Studio、vLLM、llama.cpp 或其他 OpenAI-compatible server。評估時至少測試：上下文長度、工具呼叫、JSON／Markdown 輸出穩定性、繁體中文品質，以及主機長時間負載。

排程最好鎖定 provider 與 model，避免聊天模型日後更換時影響無人值守任務。Hermes 的解析順序是「job pin → `cron.model` → 全域預設」；可設定 cron fleet 的預設模型：

```bash
hermes config set cron.model_provider openrouter
hermes config set cron.model <目前已驗證的免費模型-id>
```

不要關閉預設的 model drift guard。它能避免未鎖定的排程在全域模型變更後，靜默改用不同或可能付費的模型。

## 四、Telegram BotFather 與最小權限設定

在官方 `@BotFather` 傳送 `/newbot`，設定顯示名稱與以 `bot` 結尾的唯一 username，取得 token。接著用 `@userinfobot` 查詢自己的 numeric user ID。

推薦使用互動式設定：

```bash
hermes gateway setup
```

設定精靈會要求 bot token 與 allowed user IDs。若需人工檢查，敏感值存於 `~/.hermes/.env`，概念如下，但文章或 repo 中只能使用 placeholder：

```dotenv
TELEGRAM_BOT_TOKEN=<BotFather-issued-token>
TELEGRAM_ALLOWED_USERS=<your-numeric-user-id>
```

安全原則：

- token 不進 Git、HackMD 公開筆記或截圖。
- 個人 bot 只允許自己的 numeric user ID。
- 不需要群組功能時，維持 BotFather 預設 privacy mode。
- token 外洩時，立即用 `/revoke` 撤銷並更新 Hermes 設定。
- 以預設 long polling 執行時，不需要為 Telegram 對外開放入站連接埠。

## 五、啟動 gateway 並設定收件位置

前景測試使用：

```bash
hermes gateway
```

Telegram 能正常回覆後，在預計接收排程結果的 DM 或群組傳送：

```text
/sethome
```

`/sethome` 會設定 `TELEGRAM_HOME_CHANNEL`。個人 DM 的 chat ID 通常與 numeric user ID 相同；群組 ID 則通常為負數。接著安裝並檢查背景服務：

```bash
hermes gateway install
hermes gateway status
```

WSL2 使用者還應確認 systemd 已啟用；原生 Windows 則檢查登入後的背景排程是否成功啟動。重新開機後再次執行 `hermes gateway status`，比只看第一次前景測試更可靠。

## 六、把研究規格寫成可查核的任務

我的原始設定保存在公開 repo [wttntpc/hermes-agent](https://github.com/wttntpc/hermes-agent)，任務名稱為 `daily-science-brief`：每天 08:00 搜尋過去 3 天的新研究，主題涵蓋 Exercise、Emotion、HRV、EEG 與 Cognition。

### 可直接交給 Hermes 的完整提示

```text
建立名稱為 daily-science-brief 的 recurring cron 任務：
- schedule: 0 8 * * *
- deliver: telegram
- 每天最多輸出 5 篇
- 排除過去 7 天已推送的重複文獻

你是我的科學文獻摘要助手。搜尋過去 3 天與以下主題高度相關的新文獻：
1. Exercise、physical activity、exercise intervention、VO₂max、aerobic fitness、resistance exercise
2. Emotion、feeling、affective reactivity、mood regulation
3. Heart rate variability、HRV、autonomic nervous system
4. EEG、brain oscillations、electroencephalography、neural oscillations
5. Cognition、executive function、inhibition、working memory、switching、cognitive flexibility、planning

資料來源依序為：
1. PubMed／Europe PMC
2. Crossref：補 DOI、ISSN、出版商與期刊名稱
3. arXiv／bioRxiv／medRxiv
4. Semantic Scholar
5. Google Scholar 僅供人工備援，不進行不穩定的批次抓取

優先納入 Original Article、Systematic Review 與 Meta-analysis；
非必要時排除會議摘要、社論與書評。全程使用繁體中文。

每篇輸出：原文標題、中文標題、前 5 位作者、期刊、年份、研究類型、
同儕審查狀態、研究問題、樣本、方法、主要結果、限制、主題關聯，
以及可直接開啟的 PubMed 或 DOI 連結。

不得補造 PMID、DOI、Impact Factor、JCR 分區、樣本或研究結果。
查不到的欄位寫「無」；沒有可合法核對的 JCR 來源時寫「待確認」。
先開啟來源核對標題、作者、年份與 DOI，再納入摘要。
```

原 repo 末段寫的是「主題 1–4」，但實際共有五個主題；本文已修正為「主題 1–5」。同時增加每日最多 5 篇、七天去重與同儕審查狀態，讓手機版輸出更可讀，也避免重複推送。

## 七、建立 cronjob

### 方法 A：在 Telegram 或 Hermes 對話中建立

把上一節提示貼給 Hermes。官方排程工具支援自然語言與 cron expression，Hermes 會透過 `cronjob` tool 建立任務。從 Telegram 建立時可使用 `origin` 回傳原聊天室；本工作流明確使用 `telegram`，送到 `/sethome` 指定的位置。

### 方法 B：使用 CLI

```bash
hermes cron create "0 8 * * *" \
  "執行 daily-science-brief 規格：搜尋過去 3 天五個研究主題，最多 5 篇，核對來源與 DOI，以繁體中文輸出，禁止補造，排除七天內重複文獻。" \
  --deliver telegram \
  --name "daily-science-brief" \
  --provider openrouter \
  --model "<目前已驗證的免費模型-id>"
```

若採短提示，完整規則應封裝成 Hermes Skill，並用 `--skill <skill-name>` 附加到排程；否則短提示可能漏掉來源順序與查核條件。cron session 是獨立的新 session，不應假設它記得建立任務時的聊天內容。

`0 8 * * *` 依執行主機的時間運作。建立前應確認作業系統顯示 Asia/Taipei 的正確日期、時間與時區。

## 八、驗收與持續監測

建立後立即執行：

```bash
hermes cron list
hermes cron status
hermes cron run daily-science-brief
hermes cron runs <job-id> --limit 20
```

第一次驗收應逐項確認：

1. Telegram 是否送到正確聊天室。
2. 是否最多 5 篇，且內容適合手機閱讀。
3. 每篇 DOI／PubMed 連結能否開啟。
4. 標題、作者、年份是否與原始頁面一致。
5. 預印本是否清楚標示未同儕審查。
6. gateway 重開機後是否仍會運作。
7. cron 是否固定使用預期的 provider 與 model。

需要暫停、恢復、手動執行或刪除時，可用：

```bash
hermes cron pause daily-science-brief
hermes cron resume daily-science-brief
hermes cron run daily-science-brief
hermes cron remove daily-science-brief
```

## 九、摘要品質與研究倫理界線

可靠摘要至少要保留來源、文獻類型、樣本、設計、主要測量、主要結果、限制與主題關聯。模型找不到資料時應停止推論，而不是用常識補齊；Impact Factor 與 JCR 分區只能引用合法、可核對的資料。

若提示、搜尋紀錄或上傳檔案含有未公開研究資料、個資、醫療資訊或機構機密，必須先確認資料治理與服務條款。即使使用本機模型，外部搜尋工具仍可能把 query 傳往第三方服務。

最終仍由研究者開啟原文、確認方法與結果，再決定是否收藏至 Zotero、加入 Gemini Notebook 或轉寫為研究筆記。自動推送負責「發現」，不能代替品質評讀。

## 十、常見錯誤對照

| 現象 | 可能原因 | 處理方式 |
|---|---|---|
| Telegram bot 無回覆 | gateway 未啟動或 token 錯誤 | 執行 `hermes gateway` 查看前景錯誤 |
| 顯示未授權 | allowed user ID 填成 username | 改用 numeric user ID |
| cron 執行但沒有 Telegram 訊息 | 尚未 `/sethome` 或 delivery 錯誤 | 設定 home channel 並檢查 `--deliver telegram` |
| 手動成功、隔天失敗 | gateway 沒有安裝為背景服務 | 執行 `hermes gateway install` 並重開機驗證 |
| 發送時間偏移 | 主機時區錯誤 | 修正作業系統時區後重新檢查 next run |
| 免費模型突然不能用 | 配額、速率或供應狀態改變 | 重新用 `hermes model` 測試並更新 job pin |
| DOI 或期刊資料不一致 | 模型未完成交叉核對 | 強制先開啟 PubMed／Crossref 來源，人工抽查 |
| 每天重複相同文獻 | cron session 不保留前次記憶 | 使用持久化去重清單或 Skill 規範最近七天紀錄 |

## 延伸閱讀

- [我的 daily-science-brief 設定](https://github.com/wttntpc/hermes-agent)
- [Hermes Agent 官方專案](https://github.com/NousResearch/hermes-agent)
- [Hermes 安裝文件](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/installation.md)
- [Hermes Telegram 設定文件](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/telegram.md)
- [Hermes Scheduled Tasks 文件](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/cron.md)
- [Hermes 原生 Windows 指南](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/windows-native.md)
