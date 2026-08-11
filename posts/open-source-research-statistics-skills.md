<!-- SIMPLE -->

GitHub 上找得到的 Skill，就一定是開源嗎？**不是。**「公開可讀」只代表我們看得到檔案；只有作者附上明確的開源授權，我們才知道能否合法地複製、修改與再散布。

我盤點目前安裝的研究工具後，將具有明確 MIT、BSD-3-Clause 或 Apache-2.0 授權，而且直接服務於文獻研究、統計分析或生醫資料處理的 Skills 整理在這篇文章。這不是一張「全部都要安裝」的清單，而是一套按研究階段挑選工具的方法。

## 先看結論：我會怎麼選

| 研究工作 | 建議 Skill | 能協助什麼 | 授權 |
|---|---|---|---|
| 找文獻 | `paper-lookup` | 查 PubMed、PMC、Crossref、OpenAlex 等來源，保留 DOI 與查詢資訊 | MIT |
| 快速讀懂單篇論文 | `paper-digest` | 依全文整理研究問題、方法、結果與複習卡 | MIT |
| 深度評讀單篇論文 | `paper-review` | 檢查期刊、作者、方法、引用與研究限制 | MIT |
| 多篇文獻整合 | `literature-review` | 規劃跨資料庫搜尋、篩選、主題統整與引文查核 | MIT |
| 研究寫作 | `scientific-writing` | 管理論述與證據對應、報告規範及引用一致性 | MIT |
| 稿件品質檢查 | `peer-review` | 檢查方法、統計、倫理、圖表、可重現性與報告完整度 | MIT |
| 計畫書 | `research-grants` | 整理研究意義、創新性、方法、預算與計畫格式 | MIT |
| 選擇統計方法 | `statistical-analysis` | 檢定選擇、假設檢查、效果量與 APA 格式報告 | MIT |
| 樣本數規劃 | `statistical-power` | 事前檢力、最小可偵測效果、power curve 與模擬 | MIT |
| 統計模型實作 | `statsmodels` | OLS、GLM、混合模型、時間序列與模型診斷 | BSD-3-Clause |
| HRV／PPG／EEG 等生理訊號 | `neurokit2` | 生理訊號處理、HRV、事件分析與複雜度指標 | MIT |
| 通用資料分析流程 | `data:*` | 資料探索、統計分析、視覺化、Dashboard 與結果驗證 | Apache-2.0 |
| 生醫與單細胞研究 | `bio-research:*` | 單細胞 QC、scvi-tools、Nextflow 與實驗資料轉換 | Apache-2.0 |

其中，K-Dense 的研究 Skills 集合在公開儲存庫中採 MIT 授權，但作者也提醒：**每個 Skill 仍應以自身 `SKILL.md` 的 `license` 欄位為準。** Anthropic 的 Data 與 Bio Research 則收錄於 Apache-2.0 的 [Knowledge Work Plugins](https://github.com/anthropics/knowledge-work-plugins)。

## 一條適合我的精簡研究流程

```mermaid
flowchart LR
  A[研究問題] --> B[paper-lookup]
  B --> C[paper-digest 或 paper-review]
  C --> D[statistical-power]
  D --> E[statistical-analysis]
  E --> F[statsmodels 或 neurokit2]
  F --> G[scientific-writing]
  G --> H[peer-review]
```

這條流程不需要一次啟用所有工具。找資料時用文獻 Skill；規劃研究時用樣本數 Skill；真的要建模時，才呼叫 `statsmodels` 或 `neurokit2`。這樣較省提示內容，也能避免不同 Skill 同時給出互相矛盾的指示。

### 最小核心組合

對我的運動科學、認知神經科學、HRV 與 EEG 研究，我會先保留六項：

1. `paper-lookup`：可重現地找文獻。
2. `paper-review`：深入判讀單篇研究是否可信。
3. `statistical-power`：在收資料前規劃樣本數。
4. `statistical-analysis`：決定分析方法與報告內容。
5. `neurokit2`：處理 PPG、ECG、HRV、EEG 等生理訊號。
6. `scientific-writing`：把分析結果寫成有證據來源的研究文字。

若要做較複雜的迴歸、混合模型或時間序列，再加入 `statsmodels`；若要執行單細胞或生物資訊流程，再從 `bio-research:*` 按需求選裝。

## 開源不等於完全免費，也不等於結果正確

Skill 通常是一組教 AI 如何工作的 Markdown 指引與輔助程式。它採開源授權，不代表：

- 所連接的資料庫、模型或 API 一定免費。
- 搜到的論文一定能免費下載全文。
- AI 選的統計方法一定適合你的研究設計。
- 產生的結論已經通過研究者、統計顧問或同儕審查。

我會把 Skill 當成「研究流程的檢查表與助手」，而不是把研究判斷外包給 AI。任何關鍵結果仍須核對原始論文、資料字典、模型假設、效果量、信賴區間與分析程式。

## 哪些目前不列入「明確開源」？

以下工具可能很好用，但我目前沒有找到足以支持自由再散布的明確授權，因此不放入上面的開源清單：

- `litpilot`、`ting-litpilot`
- `research-organizer`
- `knowledge-base`
- `ai-tools-zotero`

另外，我自己建立的 `zotero-bridge` 與 `notebooklm-bridge` 雖在 metadata 宣告 MIT，但最好再補上一份完整 `LICENSE` 檔與作者年份，才方便別人清楚理解再利用條件。

> 判斷原則很簡單：沒有 LICENSE 或清楚的授權聲明，就先視為「版權保留」，不要因為儲存庫是 public 就假設可以自由改作與散布。

## 實際使用前的五項檢查

1. 查看儲存庫根目錄的 `LICENSE`。
2. 再看個別 `SKILL.md` 是否另有 `license` 欄位。
3. 檢查外部 API、模型、資料庫與套件的個別條款。
4. 安裝前閱讀 Skill 的指令與腳本，確認不會上傳機密資料或執行危險命令。
5. 分享修改版時保留原作者、著作權與授權文字，並清楚標記修改內容。

我的結論是：**值得安裝的不是最多的 Skills，而是授權清楚、用途不重複，而且能在研究流程中指出何時需要人工判斷的 Skills。**

<!-- PROFESSIONAL -->

Agent Skill 是提供給 AI agent 的可重用程序知識，可能包含 `SKILL.md`、參考文件、範例程式與外部工具設定。評估其是否適合研究工作，至少需要分開回答三個問題：它是否具有明確授權、是否符合研究方法需求，以及其依賴的資料與服務是否有不同條款。

## 稽核範圍與納入標準

本次盤點以目前環境中已安裝、且主要用途為文獻研究、科學寫作、統計分析或生醫資料處理的 Skills 為範圍。只有符合下列任一條件者才列為「明確開源」：

1. Skill 所在公開儲存庫具有 OSI 常見開源授權，且個別 Skill 未宣告衝突條款。
2. 個別 `SKILL.md` 明確標示 MIT 或 BSD-3-Clause，並可在安裝內容中找到相應授權文字。
3. Plugin 根目錄的授權明確涵蓋其 Skills 目錄，例如 Anthropic Knowledge Work Plugins 的 Apache-2.0。

單純公開原始碼、README 使用「free」或「community」，以及 metadata 只有作者名稱，都不足以判定為開源。

## 依研究生命週期分類

### 1. 文獻探索與證據吸收

- `paper-lookup`：面向多資料庫檢索與識別碼查找，強調可重現的查詢來源、參數和取得日期。
- `paper-digest`：以單篇全文為前提做教學式內容重組，不應用摘要取代全文，也不等同品質評讀。
- `paper-review`：負責單篇研究的深度批判性評讀，涵蓋期刊與作者背景、引用查核、研究設計、統計與限制。
- `literature-review`：處理多篇文獻的系統性搜尋、篩選、資料擷取與主題統整；實際執行仍應事先登錄 protocol，並保存完整搜尋式與排除理由。

這四項不是彼此替代。`paper-lookup` 回答「有哪些文獻」，`paper-digest` 回答「這篇做了什麼」，`paper-review` 回答「這篇多可信」，`literature-review` 則回答「整體證據如何」。

### 2. 研究規劃與統計推論

- `statistical-power` 適合資料收集前的樣本數規劃、最小可偵測效果與模擬式檢力；不應把觀察到的 p 值倒推成事後檢力，作為不顯著結果的解釋。
- `statistical-analysis` 提供從研究問題、變項型態、相依結構到假設檢查、效果量與報告格式的分析路徑。
- `statsmodels` 是較低階的模型實作 Skill，適合需要係數推論、殘差診斷、GLM、mixed models 或 time series 的任務。
- Anthropic `data:*` 是較完整的資料工作流，包括 `explore-data`、`statistical-analysis`、`create-viz`、`build-dashboard` 與 `validate-data`。其中 `validate-data` 特別適合作為分享前的獨立 QA 關卡。

建議保留「問題定義 → 資料品質 → 模型假設 → 效果估計 → 敏感度分析 → 可重現報告」順序，而不是先選一個檢定名稱再尋找合理化理由。

### 3. 生理訊號與生醫分析

- `neurokit2` 將 ECG、PPG、HRV、EEG、EDA、呼吸與肌電等生理訊號的處理流程帶入研究工作；腕式 PPG 的峰值間隔、移動偽影與裝置演算法限制仍需獨立記錄。
- Anthropic `bio-research:*` 涵蓋 `single-cell-rna-qc`、`scvi-tools`、`nextflow-development` 與 `instrument-data-to-allotrope` 等較專門流程，適合實際有相應資料與運算環境時按需安裝，不適合為了「可能有一天會用到」而整包載入。

### 4. 科學寫作與品質控制

- `scientific-writing` 強調論述—證據對應、報告規範、作者責任、保密與一致性檢查。
- `peer-review` 將方法、統計、可重現性、倫理、圖表與引用檢查整理成結構化審查，但最終評語仍由具領域知識的人負責。
- `research-grants` 協助組織研究意義、創新性、方法與申請格式；各補助機構的當年度規定仍須回到官方公告確認。

## 三種授權的實務差異

| 授權 | 一般可做的事 | 再散布時的主要注意事項 |
|---|---|---|
| [MIT](https://opensource.org/license/mit) | 使用、修改、散布與商業使用 | 保留著作權與授權聲明；軟體按現況提供 |
| [BSD-3-Clause](https://opensource.org/license/bsd-3-clause) | 使用、修改、散布與商業使用 | 保留聲明；不得以作者或貢獻者名稱為衍生產品背書 |
| [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) | 使用、修改、散布與商業使用 | 保留 LICENSE／NOTICE、標示修改，並包含明確專利授權條款 |

這是研究工具管理上的實務整理，不是法律意見。若要將修改版 Skill 納入商業服務、封閉產品或跨組織散布，仍應逐一閱讀完整授權文字。

## Skill 授權不等於整條工作流的授權

一個 MIT Skill 可能呼叫有速率限制的文獻 API、付費語言模型、受資料使用協議約束的臨床資料，或另有授權的 Python 套件。因此，完整的可重現研究清單至少應記錄：

- Skill 名稱、來源儲存庫、版本或 commit SHA。
- Skill 與儲存庫授權。
- Python／R 套件與版本鎖定檔。
- 外部資料庫、API、模型和全文存取條件。
- 提示詞、查詢式、執行日期、隨機種子與人工修訂紀錄。

這也說明為何「開源」與「科學可信度」是兩條不同軸線。授權回答能否合法再利用；研究品質則由設計、資料、方法、查核與透明報告共同決定。

## 我的安裝策略

我不會把所有研究 Skills 永久放入每次對話的上下文，而是建立三層配置：

| 層級 | Skills | 啟用時機 |
|---|---|---|
| 日常核心 | `paper-lookup`、`paper-review`、`statistical-analysis` | 找文獻、評讀與一般研究分析 |
| 專案型 | `statistical-power`、`statsmodels`、`neurokit2`、`scientific-writing` | 規劃樣本數、正式建模、生理訊號與論文撰寫 |
| 領域型 | `literature-review`、`research-grants`、`data:*`、`bio-research:*` | 系統性回顧、計畫申請、完整資料專案或生醫分析 |

這種分層能減少上下文與 token 消耗，也讓每次工作只有一個清楚的主要方法框架。安裝前仍應檢閱 `SKILL.md`、相關腳本與外部連線權限；授權清楚只是最低門檻，不是安全與品質保證。

## 參考來源

- [K-Dense Scientific Agent Skills](https://github.com/k-dense-ai/scientific-agent-skills)：公開科研 Skills 集合與個別授權說明。
- [Anthropic Knowledge Work Plugins](https://github.com/anthropics/knowledge-work-plugins)：Data 與 Bio Research Plugins，儲存庫採 Apache-2.0。
- [MIT License（Open Source Initiative）](https://opensource.org/license/mit)
- [BSD 3-Clause License（Open Source Initiative）](https://opensource.org/license/bsd-3-clause)
- [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)

最後的原則是：**選擇授權明確、範圍清楚、能留下可重現紀錄的 Skill；讓 AI 協助執行，讓研究者保留判斷與責任。**
