<!-- SIMPLE -->

> **閱讀指引｜難度：中等**：需要會開啟終端機並貼上指令。第一次設定請閱讀 SIMPLE 版，預留約 30–60 分鐘；已熟悉命令列、模型 endpoint 與背景服務者，可切換 PROFESSIONAL 版。

我希望 AI 不只在我打開電腦時回答問題，而是每天早上主動把值得閱讀的學術文章送到手機。這篇文章記錄我的實際做法：讓 Hermes Agent 搜尋與整理文獻、用 cron 在每天上午 8 點啟動任務，再透過 Telegram 把結果送給我。

<figure class="article-figure">
  <img src="assets/hermes-academic-brief-workflow.png" alt="學術文獻經過搜尋、查核與排程後，由電腦上的 AI Agent 傳送到手機" loading="lazy">
  <figcaption>我的每日流程：找文獻 → 核對來源 → 定時執行 → 傳送到手機。</figcaption>
</figure>

> 這不是「讓 AI 每天替我讀完論文」，而是建立一份準時送達、保留來源、可以再人工判斷的閱讀清單。

## 5 分鐘讀完的極簡版：先看完整路線

1. 安裝 Hermes，執行 `hermes`，確認可以正常對話。
2. 執行 `hermes model`，選擇已測試過 tool calling 的免費或本機模型。
3. 用 BotFather 建立 Telegram bot，再執行 `hermes gateway setup` 填入 token 與自己的數字型 user ID。
4. 執行 `hermes gateway`，在 Telegram 測試回覆，並於該聊天室傳送 `/sethome`。
5. 建立 `daily-science-brief`，再用 `hermes cron run daily-science-brief` 立即驗收，不要等到隔天。

> ⚠️ **最容易漏掉的一件事：執行 Hermes 的電腦必須開機、連網，而且 gateway 必須持續運作。**若無法讓個人電腦常駐，可改用 always-on 小主機／伺服器；否則就接受任務只會在電腦開機且 gateway 正常時執行。

## 先用白話理解：Hermes 到底是什麼？

Hermes 不是另一個語言模型，也不只是聊天視窗。比較準確的說法是：它是一個能把「模型、工具、記憶、Skills、排程與通訊軟體」接在一起的 AI Agent 執行環境。模型負責理解與生成內容，Hermes 則負責讓模型可以搜尋資料、讀寫檔案、呼叫工具、定時執行工作，並把結果傳到 Telegram。

| 元件 | 白話說法 | 在這個工作流的用途 |
|---|---|---|
| 語言模型 | 負責思考與整理的「大腦」 | 判讀搜尋結果、摘要論文、按照格式輸出 |
| Tools | Agent 可以使用的「手腳」 | 搜尋網頁、查詢文獻、開啟 DOI、處理檔案 |
| Skills | 可重複使用的「工作手冊」 | 固定文獻搜尋順序、摘要欄位與查核規則 |
| Memory | 跨任務保存的「長期筆記」 | 記錄偏好與重要背景，但不等於自動讀取全部舊對話 |
| Gateway | 長時間在線的「接線與傳送中心」 | 連接 Telegram，並承載 cron 排程器 |
| Cron | 「鬧鐘」 | 每天上午 8 點啟動新的文獻整理任務 |

> **名詞小字典**：Gateway＝讓 Hermes 持續接收與傳送訊息的背景服務；cron＝按時間啟動任務的排程器；bot token＝BotFather 發的機器人密碼；user ID＝Telegram 的數字帳號識別碼，不是 `@username`；Session＝一條獨立對話；Skill＝可重複使用的工作規則。

因此，即使使用免費或本機模型，真正決定成果是否可靠的仍是工作流程：來源要指定、欄位要固定、查不到要誠實標示，最後還要由研究者核對。

### 它真的會「越用越懂我」嗎？

會，但不是偷偷重新訓練模型。Hermes 的成長主要來自三種可檢查的資料：對話與 Session 索引、長期記憶，以及寫成 Markdown 的 Skill。完成複雜任務後，Agent 可以把成功步驟整理成 Skill，日後按需要載入；這比較像助理逐漸整理出工作手冊，而不是模型權重自動改變。

還要注意「同一個 Hermes」不代表所有聊天共用同一段即時記憶。終端機、Telegram 與其他平台可共用模型設定、工具、檔案與 Skills，但每條 Session 的即時對話通常彼此獨立。跨 Session 的舊內容需要透過搜尋或記憶機制取回。因此，cron 每次啟動新 Session 時，不能只說「照我們昨天談的做」，而要把完整規格寫在 prompt 或 Skill 中。

> Skills 可能由 Agent 建立、更新或刪除。研究工作流若牽涉查核規則，建議把 Skill 放進 Git 版本控制，變更後先看差異再採用。

## 完成後會得到什麼？

初學者建議每天先收最多 5 篇新文獻；我的進階設定可增加到 20 篇，並拆成「跨主題交集優先」與「其餘單一主題」兩個區塊。內容包含原文標題、中文標題、作者、期刊、研究類型、樣本、方法、主要結果、限制，以及可直接開啟的 DOI 或來源連結。找不到的欄位標示「無」或「待確認」，不能由 AI 猜測。

<figure class="telegram-preview">
  <div class="telegram-phone" role="img" aria-label="Telegram 每日學術文獻推送格式示意">
    <div class="telegram-phone-header"><strong>Daily Science Brief</strong><span>08:00</span></div>
    <div class="telegram-bubble">
      <strong>📚 今日新文獻｜跨主題交集優先</strong><br>
      1. 運動介入與 HRV 的新研究<br>
      <small>研究類型：Original Article<br>樣本：成人運動介入研究<br>主要結果：……<br>限制：……<br>DOI：可直接開啟的來源連結</small>
    </div>
    <div class="telegram-bubble">
      <strong>單一主題的新文獻</strong><br>
      2. EEG 與執行功能研究<br>
      <small>找不到的欄位：待確認</small>
    </div>
  </div>
  <figcaption>訊息成品示意，不是真實 Telegram 截圖，也不是實際研究結果。正式發布真實截圖前，請遮住 bot 名稱、chat ID、PMID／私人收藏資訊與任何 token。</figcaption>
</figure>

要換成真實成品圖時，先讓 `hermes cron run daily-science-brief` 完整推送一次，再截取 Telegram 的訊息區。裁掉手機通知列與私人聊天室名稱，遮住 bot username、chat ID 或私人收藏標記；BotFather token 不應出現在任何截圖。將處理後的圖片交給我，即可用真實畫面替換上方示意圖。

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

如果是第一次安裝，可先依需求選擇 Windows 原生或 WSL2：

| 情況 | 建議 |
|---|---|
| 只需要聊天、Telegram、cron、瀏覽器工具與一般 MCP | 原生 Windows 即可，路徑也比較直覺 |
| 已有 Linux 開發環境、需要 POSIX 工具或 Dashboard 內嵌終端機 | 使用 WSL2 |
| 想讓 gateway 長時間運作 | 兩者皆可；原生 Windows 使用排程工作，WSL2 建議啟用 systemd |
| 不想處理 Windows 與 Linux 兩套路徑 | 優先原生 Windows |

Hermes 官方目前把原生 Windows 標示為 early beta；若遇到子程序、路徑或中文字元問題，再改用 WSL2 會比較容易排除。

## 第一步：安裝 Hermes

WSL2、Linux 或 macOS 在終端機執行：

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
source ~/.bashrc
hermes
```

原生 Windows 則在 PowerShell 執行：

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

安裝完若找不到 `hermes`，先關閉再重新開啟終端機。第一次設定不要急著加入 Telegram；先和 Hermes 對話一次，確認模型與基本工具可以正常運作。

> **成功長這樣 👉 Hermes 已啟動**：執行 `hermes --version` 會顯示版本資訊；執行 `hermes` 後能進入對話畫面，而且沒有出現「找不到指令」、缺少模型設定或 API key 錯誤。畫面文字可能隨版本改變，判斷重點是可以送出問題並收到回答。

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

> **成功長這樣 👉 Bot 已建立**：BotFather 會顯示建立完成、提供 bot 連結，並回傳一串類似 `123456789:[已遮蔽]` 的 token。若要截圖，只保留「建立完成」與 bot username；完整 token 不應出現在圖片裡。

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

> **成功長這樣 👉 第一次測試回覆**：你傳送「請只回覆：連線成功」，bot 在同一個聊天室回覆「連線成功」。如果看到 `Unauthorized`、`Forbidden` 或完全沒有回覆，尚未成功，先檢查 gateway、token 與 allowed user ID。

```text
/sethome
```

傳這個指令，是告訴 Hermes：「以後每天的自動訊息就送到這個聊天室」。個人使用不需要關閉 BotFather 的 group privacy，也不建議把 bot 加入公開群組。

> **成功長這樣 👉 收件位置已設定**：bot 會確認目前聊天室已成為 home channel，或表示排程訊息會送到此處；實際措辭可能隨版本不同。若沒有任何確認，先不要建立 cron。

## 第五步：建立每天上午 8 點的任務

任務名稱是 `daily-science-brief`。目前的進階工作流已移除情緒主題，並把研究範圍細分成 7 個查詢群組；第一次設定可先用以下 4 個核心領域測試：

| 主題 | 搜尋方向 |
|---|---|
| 運動 | 身體活動、運動介入、VO₂max、有氧與阻力運動 |
| HRV | 心率變異性與自律神經 |
| EEG | 腦波、神經震盪與腦電圖 |
| 認知 | 執行功能、抑制、工作記憶、認知彈性與計畫 |

最容易的方式，是直接對 Hermes 說：

```text
請建立一個名為 daily-science-brief 的 cron 任務，
每天上午 8 點執行，結果傳送到 Telegram。

搜尋過去 3 天與運動、HRV、EEG、認知功能高度相關的新文獻。
優先使用 PubMed／Europe PMC，再以 Crossref 補 DOI 與期刊資料，
其次才查 arXiv、bioRxiv、medRxiv 與 Semantic Scholar。

每天最多選 5 篇，以繁體中文整理研究問題、樣本、方法、主要結果與限制，
保留可開啟的 DOI 或來源連結，標示期刊論文或預印本，並排除過去 7 天重複內容。
查不到的資料寫「無」或「待確認」，絕對不要補造。
```

> **進階調整**：確認 5 篇版本穩定後，可改成每天最多 20 篇，並要求輸出兩區塊：第一區「跨主題交集文獻」，第二區「其餘單一主題文獻」。目前實際工作流使用 7 個查詢群組、交集優先，且不再納入情緒主題；這樣既保留廣度，也不會讓單一關鍵詞的文章蓋過真正跨領域的研究。

如果介面顯示 cron expression，`0 8 * * *` 就是「每天上午 8 點」；五個欄位依序是「分、時、日、月、星期」。時間依執行 Hermes 的主機時區計算。

建立後，先不要等到隔天。立即列出並手動執行：

```bash
hermes cron list
hermes cron run daily-science-brief
hermes cron status
```

> **成功長這樣 👉 排程已可交付**：`hermes cron list` 能看到 `daily-science-brief` 為啟用狀態與下一次執行時間；手動 `run` 後 Telegram 收到一則完整摘要；`status` 或執行紀錄沒有錯誤。三項都通過，才算完成。

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

> **閱讀指引｜難度：中等**：熟悉終端機、模型 endpoint、環境變數與背景服務者可直接閱讀本版，約 20–40 分鐘完成設定與驗收；第一次接觸 Hermes，建議先切換 SIMPLE 版。

## TL;DR：專業版部署順序

1. 安裝 Hermes，完成 `hermes --version`、一般對話與工具測試。
2. 鎖定已驗證的 provider／model，再完成 Telegram token 與 allowed user ID 設定。
3. 前景啟動 gateway，測試回覆並在目標聊天室傳送 `/sethome`。
4. 建立 `0 8 * * *` 排程，先用 5 篇模式驗收，再升級為 20 篇與交集優先模式。
5. 安裝 gateway 背景服務、重新開機、手動執行 cron，最後等待一次正式排程。

> ⚠️ **運行條件**：主機必須開機、連網，gateway 也必須常駐。無法讓工作電腦持續運作時，可部署到 always-on 小主機／伺服器；否則排程只會在主機與 gateway 可用時執行。

這個工作流把 Hermes Agent 當作長時間運行的執行層，以支援工具呼叫的雲端免費模型或本機模型作為推理層，使用 Hermes cron 建立每日排程，最後由 Telegram gateway 把結果送到指定 home channel。

<figure class="article-figure">
  <img src="assets/hermes-academic-brief-workflow.png" alt="文獻來源經 AI Agent 查核與排程後傳送至手機的系統架構" loading="lazy">
  <figcaption>系統邊界：模型負責整理，Hermes 負責工具與排程，Telegram 負責傳送；原始來源仍需由研究者核對。</figcaption>
</figure>

<figure class="telegram-preview">
  <div class="telegram-phone" role="img" aria-label="Telegram 每日學術文獻推送格式示意">
    <div class="telegram-phone-header"><strong>Daily Science Brief</strong><span>08:00</span></div>
    <div class="telegram-bubble"><strong>📚 跨主題交集優先</strong><br><small>1. 運動介入 × HRV｜研究類型、樣本、方法、主要結果、限制與 DOI</small></div>
    <div class="telegram-bubble"><strong>其餘單一主題</strong><br><small>2. EEG 與執行功能｜查不到的欄位標示「待確認」</small></div>
  </div>
  <figcaption>訊息成品示意，不是真實 Telegram 截圖或研究結果。取得真實推送後，可用已遮蔽 bot 名稱、chat ID 與私人資訊的截圖替換。</figcaption>
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

### Hermes 是協調層，不是模型本身

Hermes 將不同責任拆開處理：模型提供推理能力，Tools 提供可執行動作，Skills 提供程序性知識，Memory 提供長期背景，Gateway 負責訊息平台與背景服務，cron 則負責在指定時間建立獨立任務。這種拆分讓模型可以更換，但研究規格、傳送方式與排程仍能保留。

| 層級 | 儲存或執行內容 | 對每日文獻摘要的影響 |
|---|---|---|
| Provider／Model | 推理、工具選擇、文字生成 | 影響摘要品質、速度、費用與工具呼叫穩定性 |
| Tools | 搜尋、瀏覽、終端機、檔案操作 | 決定 Agent 是否真的打開來源核對，而非只憑模型記憶 |
| Skills | `SKILL.md` 與相關參考檔 | 固定搜尋策略、輸出格式、排除條件與驗收方式 |
| Session／Memory | 當次對話、歷史索引、長期偏好 | 幫助延續背景，但不應作為唯一的任務規格來源 |
| Gateway／Cron | 訊息路由、背景服務與排程 | 決定任務是否準時啟動，以及結果送往哪個聊天室 |

> **名詞速查**：Gateway＝常駐訊息與排程服務；cron＝定時啟動任務的排程器；bot token＝Telegram bot 的機密憑證；user ID＝數字型帳號識別碼，不是 `@username`；Session＝彼此分離的一次對話；Skill＝可版本控制、可重用的任務規則。

### Session、Memory 與 Skill 不要混為一談

- **Session** 是一條獨立對話線。Telegram DM、群組、Topic、CLI 與 cron 任務可能各自形成不同 Session。
- **內建 Memory** 可保存 `MEMORY.md`、`USER.md` 等長期資訊，並可透過 FTS5 搜尋歷史；它不會在每次任務開始前無限制載入所有舊對話。
- **Honcho 等記憶 Provider** 可進一步建立偏好與使用者模型，但屬額外服務或設定，並不是完成 cron 推送的必要條件。
- **Skill** 是明確、可版本控制的程序文件，最適合存放「每日文獻摘要必須怎麼做」。官方 Skills 系統採按需載入，只有任務需要時才展開完整內容，以降低不必要的上下文。

Hermes 可在成功完成包含多次工具呼叫的複雜工作後，建議或建立新 Skill，也能透過 `skill_manage` 更新現有 Skill。這是所謂「自我進化」的重要來源，但並非模型自行重訓。對研究用途而言，任何自動修改都應納入版本控制與人工審閱，尤其不能讓 Agent 靜默放寬 DOI、來源或查核規則。

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
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

安裝後開啟新的 PowerShell 視窗，再檢查：

```powershell
Get-Command hermes
hermes --version
```

原生 Windows 支援仍屬 early beta；若遇到路徑、子程序或非 ASCII 字元問題，可改用 WSL2。無論採哪一條路徑，都應先讓一般對話與工具測試成功，再加入訊息平台和排程，這樣才能判斷錯誤發生在哪一層。

> **成功長這樣 👉 Hermes 已啟動**：`hermes --version` 能顯示版本，CLI 可以進入 session 並完成一次回答；若使用工具測試，也不應出現 provider、API key 或 tool calling 錯誤。

官方文件指出，原生 Windows 已可使用 CLI、Telegram gateway、cron、瀏覽器工具、MCP、本機 Ollama／LM Studio 與 Web Dashboard；主要缺少的是需要 POSIX PTY 的 Dashboard 內嵌終端機。WSL2 則更接近 Linux 部署，但要額外理解 Windows 與 Linux 的檔案路徑、網路和常駐機制。如果 Ollama 或 LM Studio 跑在 Windows、Hermes 跑在 WSL2，還必須確認模型服務不是只綁定 `127.0.0.1`，並處理 Windows 防火牆與 WSL2 網路位址。

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

> **成功長這樣 👉 BotFather 已完成**：畫面會顯示 bot 建立完成、bot 連結與 token。token 只存入 Hermes 的安全設定；教學截圖應把整串 token 完全遮住，而不是只遮其中幾碼。

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

> **成功長這樣 👉 Gateway 已連線**：在 Telegram 傳送「請只回覆：連線成功」，同一個 bot 對話收到正常回答；Hermes 前景終端機沒有 `Unauthorized`、allowlist 或連線錯誤。

```text
/sethome
```

白話來說，傳送 `/sethome` 是告訴 Hermes：「以後每天的自動訊息就送到這個聊天室」。技術上它會設定 `TELEGRAM_HOME_CHANNEL`；個人 DM 的 chat ID 通常與 numeric user ID 相同，群組 ID 則通常為負數。

> **成功長這樣 👉 Home channel 已設定**：bot 會確認目前聊天室已設為 home channel，或表示排程結果將傳送到這裡；確認文字可能依版本不同。接著才安裝並檢查背景服務：

```bash
hermes gateway install
hermes gateway status
```

WSL2 使用者還應確認 systemd 已啟用；原生 Windows 則檢查登入後的背景排程是否成功啟動。重新開機後再次執行 `hermes gateway status`，比只看第一次前景測試更可靠。

Telegram 的 home channel 只是預設收件位置。官方 cron delivery 也能指定 `telegram:<chat-id>`、特定 Topic 的 `chat_id:thread_id`、`local`、`origin` 或多個平台。個人研究工作流先固定一個私人 DM 最容易驗證；若改用群組或 Topic，還要另外確認群組 allowed users／allowed chats、BotFather privacy mode，以及是否要求提及 bot 才回應。

目前 Telegram 採預設拒絕策略：若未設定允許的使用者，所有使用者都會被拒絕。這比把 bot 公開後再阻擋陌生人安全，但也代表「bot 沒回覆」時應先檢查 numeric user ID，而不是反覆重建 token。

## 六、把研究規格寫成可查核的任務

任務名稱為 `daily-science-brief`：每天 08:00 搜尋過去 3 天的新研究。本文保留 5 篇的初學者預設；目前的進階做法則細分成 7 個查詢群組、每日最多 20 篇，先列跨主題交集，再列其餘單一主題，並已移除情緒主題。

### 可直接交給 Hermes 的完整提示

```text
建立名稱為 daily-science-brief 的 recurring cron 任務：
- schedule: 0 8 * * *
- deliver: telegram
- 初次測試每天最多輸出 5 篇；穩定後可改為最多 20 篇
- 排除過去 7 天已推送的重複文獻

你是我的科學文獻摘要助手。搜尋過去 3 天與以下主題高度相關的新文獻：
1. Exercise、physical activity、exercise intervention、VO₂max、aerobic fitness、resistance exercise
2. Heart rate variability、HRV、autonomic nervous system
3. EEG、brain oscillations、electroencephalography、neural oscillations
4. Cognition、executive function、inhibition、working memory、switching、cognitive flexibility、planning

若採進階模式，請把上述核心領域細分為目前使用的 7 個查詢群組，最多納入 20 篇，
並分成兩區塊輸出：A. 跨主題交集文獻（優先）；B. 其餘單一主題文獻。

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

5 篇模式適合第一次驗收與手機閱讀；20 篇模式則適合穩定運行後擴大探索範圍。無論選哪一種，都應保留七天去重、同儕審查狀態與來源核對規則。

## 七、建立 cronjob

`0 8 * * *` 代表「每天上午 8 點」；五個欄位依序是「分、時、日、月、星期」。它依執行 Hermes 的主機時區運作，因此建立前要先核對系統時間與 `Asia/Taipei` 時區。

### 方法 A：在 Telegram 或 Hermes 對話中建立

把上一節提示貼給 Hermes。官方排程工具支援自然語言與 cron expression，Hermes 會透過 `cronjob` tool 建立任務。從 Telegram 建立時可使用 `origin` 回傳原聊天室；本工作流明確使用 `telegram`，送到 `/sethome` 指定的位置。

### 方法 B：使用 CLI

```bash
hermes cron create "0 8 * * *" \
  "執行 daily-science-brief 規格：搜尋過去 3 天的 7 個研究查詢群組，不含情緒主題，最多 20 篇；先列跨主題交集，再列其餘單一主題。核對來源與 DOI，以繁體中文輸出，禁止補造，排除七天內重複文獻。" \
  --deliver telegram \
  --name "daily-science-brief" \
  --provider openrouter \
  --model "<目前已驗證的免費模型-id>"
```

若採短提示，完整規則應封裝成 Hermes Skill，並用 `--skill <skill-name>` 附加到排程；否則短提示可能漏掉來源順序與查核條件。cron session 是獨立的新 session，不應假設它記得建立任務時的聊天內容。

### 排程真正執行時會發生什麼？

每次 scheduler tick 時，Hermes 會讀取 `~/.hermes/cron/jobs.json`、比對 `next_run_at`，為到期任務建立新的 Agent Session，載入附加的 Skills，執行提示至完成，傳送 final response，最後更新執行紀錄與下一次時間。`~/.hermes/cron/.tick.lock` 會避免同一批任務因重疊 tick 而重複執行。

這套流程帶來三個實務結論：

1. cron prompt 應該自給自足，不能依賴建立任務時的聊天上下文。
2. Agent 的最終回答會自動交給 delivery target，不必在 prompt 裡再要求呼叫一次傳訊工具。
3. 若任務執行超過一分鐘，不代表 scheduler 會重複啟動同一批工作；但仍應限制每日篇數與搜尋範圍，避免長時間占用模型配額。

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
2. 篇數是否符合所選模式：初學版最多 5 篇；進階版最多 20 篇，且分成「交集優先」與「其餘單一主題」。
3. 每篇 DOI／PubMed 連結能否開啟。
4. 標題、作者、年份是否與原始頁面一致。
5. 預印本是否清楚標示未同儕審查。
6. gateway 重開機後是否仍會運作。
7. cron 是否固定使用預期的 provider 與 model。

> **成功長這樣 👉 排程驗收通過**：list 顯示任務已啟用與正確的 next run；手動 run 後 Telegram 收到完整格式；runs／status 沒有 delivery 或模型錯誤；重新開機後 gateway 仍正常。不要只以「任務建立成功」當作完成。

需要暫停、恢復、手動執行或刪除時，可用：

```bash
hermes cron pause daily-science-brief
hermes cron resume daily-science-brief
hermes cron run daily-science-brief
hermes cron remove daily-science-brief
```

## 九、版本、安全與維運注意事項

Hermes 更新速度快，本文刻意不綁定單一版本號；實際功能與指令一律以官方最新文件為準。每次升級都應重新檢查 gateway、cron、allowlist、敏感資訊遮罩與 Skill 安全機制，不能只沿用舊版假設。

這些保護能降低風險，但不能取代資料治理：

- PII redaction 是防護層，不代表可以放心上傳未去識別的受試者資料。
- 使用本機模型可避免把提示傳給雲端模型，但 PubMed、Crossref、搜尋引擎與其他外部 Tools 仍會收到查詢。
- 社群 Skill 安裝前應先 `inspect` 並查看來源；安全掃描不是完整的人工程式碼審查。
- `~/.hermes/.env`、`auth.json`、Telegram token 與模型金鑰都不應加入 Git。
- Agent 可以修改 Skills，因此重要研究規格應保留 Git 版本、審查差異並限制可寫目錄。

升級後不要直接假設舊任務正常。應重新執行 `hermes gateway status`、手動跑一次 cron、確認 home channel、檢查輸出格式，再等待下一次正式排程。

## 十、摘要品質與研究倫理界線

可靠摘要至少要保留來源、文獻類型、樣本、設計、主要測量、主要結果、限制與主題關聯。模型找不到資料時應停止推論，而不是用常識補齊；Impact Factor 與 JCR 分區只能引用合法、可核對的資料。

若提示、搜尋紀錄或上傳檔案含有未公開研究資料、個資、醫療資訊或機構機密，必須先確認資料治理與服務條款。即使使用本機模型，外部搜尋工具仍可能把 query 傳往第三方服務。

最終仍由研究者開啟原文、確認方法與結果，再決定是否收藏至 Zotero、加入 Gemini Notebook 或轉寫為研究筆記。自動推送負責「發現」，不能代替品質評讀。

## 十一、常見錯誤對照

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
| Telegram 群組中偶爾回覆、偶爾不回覆 | privacy mode、allowed chats 或 require mention 規則不一致 | 先用私人 DM 驗證，再逐項加入群組限制 |
| WSL2 連不到 Windows 的 Ollama／LM Studio | 模型服務只綁定 localhost 或被防火牆阻擋 | 允許區域網路介面並從 WSL2 測試 endpoint |
| 更新 Hermes 後排程行為改變 | gateway、cron 或設定結構隨版本更新 | 查閱 release notes，重啟 gateway 並重新做手動驗收 |

## 延伸閱讀

- [Hermes Agent 官方專案](https://github.com/NousResearch/hermes-agent)
- [Hermes 安裝文件](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/installation.md)
- [Hermes Telegram 設定文件](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/telegram.md)
- [Hermes Scheduled Tasks 文件](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/cron.md)
- [Hermes Skills System 文件](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md)
- [Hermes Honcho Memory 文件](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/honcho.md)
- [Hermes Windows WSL2 指南](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/windows-wsl-quickstart.md)
- [Hermes 原生 Windows 指南](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/windows-native.md)
- [Smart4A：Hermes Agent 安裝速查](https://hermes.smart4a.tw/)（概念與教材編排參考；版本與指令以官方文件為準）
