<!-- SIMPLE -->

當我開始同時使用 Claude、Codex、Antigravity 與 Hermes，最困擾的不是 AI 不夠聰明，而是每換一個 Agent，就要重新說明 GitHub 怎麼連、研究筆記放在哪裡、文獻庫如何查詢，以及哪些權限不能開放。

因此，我把這些重複的設定與操作方式整理成 [AI-tools-skills](https://github.com/wttntpc/AI-tools-skills)。它不是另一個聊天機器人，而是一套告訴不同 AI「如何連接工具、如何驗證、如何安全收工」的操作說明。

## 為什麼要把流程做成 Skill？

一般對話很容易隨著工作階段結束而消失。Skill 保存的是可以重複執行的程序，例如：

- 先檢查工具是否已安裝與登入。
- 只安裝目前真正需要的連接。
- 將憑證保存在環境變數，不寫入 GitHub。
- 完成後實際讀取資料，確認不是只有設定看起來成功。
- 開工時檢查 Git 狀態，收工時只提交相關檔案。

如此一來，即使換了 Agent，我仍能沿用相近的工作原則。

## 我會優先選擇三個研究連接

### GitHub：保存可追蹤的程式與流程

GitHub 適合保存程式、Skills、網站與修改紀錄。每次變更都能回查，而不是只留下 AI 最後貼出的一段程式。

### Zotero：確認文獻是否已經收藏

Zotero 是我的文獻資料庫。連接後，AI 可以先查詢既有收藏、整理引用資訊，再決定是否需要搜尋新文獻，減少重複下載與遺漏來源。

### HackMD：累積研究 SOP 與分析筆記

HackMD 適合保存統計分析、EEG 前處理與認知作業等研究筆記。AI 可以讀取既有 SOP，再將新的分析結果整理成一致格式。

## 連接工具後，還需要學術研究流程

[AI-tools-skills](https://github.com/wttntpc/AI-tools-skills) 解決「如何連上工具」，[AI-academic-skills](https://github.com/wttntpc/AI-academic-skills-) 則處理「連上之後如何研究」。後者可以把文獻搜尋、品質評讀、內容整理、研究寫作、同儕審查與知識同步拆成不同階段。

```text
工具連接
→ 文獻搜尋
→ 品質評讀
→ 研究筆記
→ 寫作與審查
→ 同步到 Zotero／知識庫
```

> 工具連接只是入口。真正有價值的是把研究判斷整理成可以重複、查核與持續改善的流程。

<!-- PROFESSIONAL -->

多 Agent 工作環境的主要問題不是缺少工具，而是設定、權限與操作程序彼此分散。`AI-tools-skills` 將外部工具連接封裝成獨立 Skill，使 Claude Code、Antigravity、Codex、OpenCode 與 Hermes Agent 能依各自的規則檔與設定格式執行相同目標。

## 一、連結閱讀或安裝到本機

最輕量的方式，是直接把公開 repo 交給 Agent：

```text
請讀取 https://github.com/wttntpc/AI-tools-skills 的 README 與 AI 通用懶人包.md，
先辨認目前的 Agent 與作業系統，再依需求協助我設定工具。
每一步先檢查既有狀態，只要求最小必要權限，且不得把憑證寫進 repo。
```

若要長期使用，可複製到本機：

```bash
git clone https://github.com/wttntpc/AI-tools-skills.git
```

repo 內的 `skills/00-install-all` 可依序處理全部連接，但我更建議從單一 Skill 開始。研究環境通常先選：

```text
skills/02-github
skills/10-zotero
skills/11-hackmd
```

按需求安裝能減少不必要的憑證、背景服務與除錯範圍。

## 二、規則檔與工具設定分開管理

不同 Agent 讀取的專案規則檔不同：Claude Code 使用 `CLAUDE.md`，Codex 常使用 `AGENTS.md`，Hermes 可優先使用 `.hermes.md`。規則檔應保存工作原則、專案位置與驗證方式，不應保存 token。

Hermes 的 MCP 設定位於 `~/.hermes/config.yaml`。其他 Agent 可能使用自己的 CLI 或 JSON 設定。即使語法不同，仍應遵守相同原則：

1. API token 只存在環境變數或私密憑證儲存區。
2. OAuth 與 API scope 採最小權限。
3. 連接完成後以實際讀取測試驗證。
4. 任何寫入、發信或新增文獻動作都需額外確認。
5. `.env`、token 與私人資料不得提交到 GitHub。

## 三、GitHub、Zotero 與 HackMD 的分工

| 工具 | 在研究流程中的角色 | 驗證方式 |
|---|---|---|
| GitHub | 程式、Skill、版本與網站 | 檢查登入、repo 與 diff |
| Zotero | 文獻收藏、引用資訊與去重 | 唯讀列出近期文獻或搜尋主題 |
| HackMD | SOP、分析決策與共筆 | 列出筆記並讀取指定內容 |

GitHub 保存的是可執行與可追蹤的研究資產；Zotero 保存文獻來源；HackMD 保存方法與判斷紀錄。三者不應互相取代，也不應把私人文獻內容或研究資料直接 commit 到公開 repo。

## 四、延伸到完整學術技能鏈

[AI-academic-skills](https://github.com/wttntpc/AI-academic-skills-) 將研究工作拆成：

```text
Find
→ Appraise
→ Organize
→ Write
→ Critique
→ Sync
```

文獻可先由 `paper-lookup` 或 `litpilot` 發現，再交由 `paper-review`、`paper-digest` 評讀與整理；`research-organizer` 與 `knowledge-base` 保存結構化筆記；`scientific-writing`、`peer-review` 負責寫作與批判；最後再透過 Zotero 或 NotebookLM bridge 同步。

這種分段方式比「請 AI 從搜尋一路幫我寫完論文」更容易查核。每一階段都有明確輸入、輸出與停止條件，也能在全文不足、來源無法驗證或涉及敏感資料時停止。

## 五、安裝完成不等於工作流完成

設定後應以一個小型任務驗收：讓 Agent 從 Zotero 找到一篇已知文獻、讀取一份 HackMD SOP、在 GitHub 建立不含敏感資料的修改，最後回報每個步驟的來源與狀態。

若任何工具失敗，應先修復該連接，而不是讓模型憑記憶補出內容。Skills 的目的不是擴大 AI 權限，而是把權限邊界、操作順序與驗證方法寫得更清楚。

## 相關資源

- [AI-tools-skills：跨 Agent 工具連接](https://github.com/wttntpc/AI-tools-skills)
- [AI-academic-skills：學術研究技能鏈](https://github.com/wttntpc/AI-academic-skills-)
