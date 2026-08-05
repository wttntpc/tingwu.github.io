<!-- SIMPLE -->

寫研究計畫書之前，通常要先做兩件很花時間的事：把新出的文獻篩過一輪，判斷哪些真的可信、值得引用；等真的要動筆寫計畫書時，又要重新想一次「這個機構要的格式跟審查重點是什麼」。我把這兩段流程整理成 [AI-academic-skills](https://github.com/wttntpc/AI-academic-skills-) 裡的幾個 Skill，讓 AI Agent 照著固定步驟做，而不是每次都憑印象現場生。

## 文獻篩選：先分流，再深讀

- **litpilot**：定期掃描指定主題的新文獻，依我自己設定的收錄條件排序、做出對照表。適合「這週有沒有新的相關研究」這種例行性追蹤。
- **paper-lookup**：針對一篇特定文獻做精準查找——用 DOI、PMID 或標題，串接 PubMed、Crossref、Semantic Scholar 等十個學術資料庫，找引用關係跟開放取用全文。
- **paper-review**：對單篇文獻做深度評讀——期刊可信度、作者背景、逐條核對引用文獻是否真實存在，並依研究設計自動套用對應的風險偏誤評估工具（RCT 用 RoB2、觀察性研究用 ROBINS-I 等），最後給出證據等級評分。
- **paper-digest**：把一篇文獻濃縮成快速吸收的重點摘要，若抓不到全文會直接停止，不會只憑摘要生成內容。

這幾個 Skill 的分工邏輯是：**litpilot／paper-lookup 負責「找到」，paper-review／paper-digest 負責「判斷這篇能不能信、在講什麼」**——兩件事分開做，比讓 AI 一口氣「幫我找幾篇文獻然後直接寫進計畫書」更容易查核。

## 計畫書撰寫：先套規則，再填內容

**research-grants** 這個 Skill 內建 NSF、NIH、DOE、DARPA 與台灣國科會（NSTC）五個機構各自的格式規範與審查重點——例如 NSF 的智識價值與廣泛影響力並重、NIH 的 Specific Aims 一頁限制、國科會特定的研究架構圖要求。與其每次重新查「這個機構到底要什麼格式」，不如直接照對應機構的清單走一遍。

## 更完整的做法：把既有文獻庫也一起評讀

litpilot 預設只掃「最近 30 天」的新文獻，這對「這週有沒有新研究」很好用，但計畫書的理論基礎通常需要涵蓋好幾年的文獻，不能只看最近一個月。所以我另外做了一個 [`grant-evidence-base`](https://github.com/wttntpc/AI-academic-skills-/tree/main/grant-evidence-base) Skill：先把 Zotero 裡已經收藏的舊文獻抓出來，跟 litpilot／paper-lookup 找到的新文獻放在一起，**全部**（包含舊的、原本就信任的）交給 paper-review 評讀，再推進 Gemini NotebookLM 做跨文獻的綜合提問，最後才交給 research-grants 寫作。這樣理論基礎才不會只反映「這個月剛好搜到什麼」。

## 為什麼要拆成這麼多步驟

如果直接要求 AI「幫我找文獻並寫進計畫書」，中間的判斷過程會整個消失在一次對話裡，之後很難回頭確認：這篇文獻是真的存在、還是被生成出來的？證據等級是怎麼評出來的？把「找」「評」「寫」拆成三個獨立階段，每個階段都有明確的輸入輸出，出錯時也比較容易回頭抓到是哪一步出了問題。

> 引用寫進計畫書之前，先確認它禁得起回頭查核——這比讓 AI 一次寫完更重要。

<!-- PROFESSIONAL -->

[AI-academic-skills](https://github.com/wttntpc/AI-academic-skills-) 是我整理的一套 Claude Agent Skills 集合，涵蓋文獻研究的完整迴圈：**Find → Appraise → Organize → Write → Critique → Sync**。以下聚焦於與計畫書撰寫最直接相關的兩個階段：文獻篩選評讀（Find／Appraise）與寫作（Write）。

## Find／Appraise：從「找到」到「可以信任」

| Skill | 階段 | 核心機制 | 來源 |
|---|---|---|---|
| `litpilot` | Find | 依 `research_profile.md` 定義的收錄條件與基準值，定期掃描、排序、輸出 Excel 與圖表 | 工作坊教材（CIPH 閉環神經調控研究工作坊） |
| `paper-lookup` | Find | 串接 PubMed、PMC、bioRxiv、medRxiv、arXiv、OpenAlex、Crossref、Semantic Scholar、CORE、Unpaywall 共十個 API，處理 DOI/PMID/arXiv-ID 解析與引用圖譜 | k-dense-ai/scientific-agent-skills（MIT） |
| `paper-review` | Appraise | 期刊可信度＋作者背景＋即時 CrossRef 引用文獻存在性驗證＋依研究設計自動路由的風險偏誤評估（RoB2／ROBINS-I／Newcastle-Ottawa／AMSTAR-2）＋論證結構稽核＋**確定性 GRADE 評分**（由純 stdlib 腳本計算，非 LLM 主觀判斷） | drpwchen/paper-review-and-digest（MIT） |
| `paper-digest` | Appraise | 三層漸進式揭露的內容摘要，依論文類型調整結構，若抓不到全文則直接中止（不做僅憑摘要的摘要） | drpwchen/paper-review-and-digest（MIT） |

`paper-review` 的設計值得特別說明：它把「評讀」拆成可委派的子任務——作者背景查核、引用文獻逐條驗證、文獻分類與 PubPeer／學術爭議掃描，各自交給獨立的子 Agent 平行處理，且明確要求「查不到就回報失敗，不能用最佳猜測充當已驗證結果」。GRADE 證據等級評分則刻意用一支確定性腳本（`grade_judge.py`）計算，而不是讓模型直接給分——這是為了讓評分結果可重現、可稽核。

## Write：計畫書與手稿的證據綁定寫作

`research-grants`（k-dense-ai/scientific-agent-skills，MIT）內建 NSF、NIH、DOE、DARPA、台灣 NSTC 五個機構的專屬要求：

| 機構 | 關鍵結構 | 審查重點 |
|---|---|---|
| NSF | Project Description 15 頁上限（含 Results from Prior NSF Support ≤5 頁） | Intellectual Merit 與 Broader Impacts 並重 |
| NIH | Specific Aims 1 頁＋Research Strategy（R01 為 12 頁） | Significance／Innovation／Approach，通常需要 Preliminary Data |
| NSTC | 常需 CM03 研究架構圖 | 依台灣國科會格式規範 |

姊妹 Skill `scientific-writing`（同樣來自 k-dense-ai）則負責手稿本身：IMRaD 結構、依研究類型選擇對應的報告規範（CONSORT／PRISMA／STROBE／ARRIVE）、ICMJE／CRediT 作者列表規則，以及**證據綁定的主張檢查**——確保正文中的每個宣稱都能對應到來源，不是模型自己補的數字或方法。兩者皆為純本機執行、無網路呼叫，圖表生成則是選用功能（透過 `scientific-schematics`，需要 OpenRouter API key，會把提示詞送到第三方服務，未發表的敏感內容需自行評估是否適合傳送）。

## 進階串接：`grant-evidence-base` Skill，補齊 litpilot 的時間窗口盲點

`litpilot` 的預設搜尋窗口是最近 30 天（排程週報則是 7 天），這是為了「追蹤新文獻」而設計，不是為了建立計畫書需要的多年份理論基礎。原本這套串接只是一份手寫的操作指引，放在 repo 裡一份普通的 markdown 檔——但這樣 Claude Code 完全不會主動想到要照著做，因為它掃描技能的機制只認 skill 資料夾裡的 `SKILL.md`，不會去讀一份散落在別處的文件。所以後來把它改寫成正式的 [`grant-evidence-base`](https://github.com/wttntpc/AI-academic-skills-/tree/main/grant-evidence-base) Skill，設定好觸發語句（例如「幫我把 Zotero 跟 NotebookLM 一起評讀」），這樣它才會跟其他 Skill 一樣被自動安裝、自動觸發，而不必每次都手動提醒。它本身不做任何新的事，純粹是照順序呼叫五個既有 Skill：

1. 明確設定文獻年限範圍，覆蓋 litpilot 的 30 天預設
2. 用 `zotero-bridge` 的唯讀查詢，把既有 Zotero 收藏列出來當起始文獻庫
3. 用拉寬窗口的 litpilot／`paper-lookup` 補新文獻，依 DOI 去重
4. **不分新舊**，全部交給 `paper-review` 評讀——「已經在 Zotero 裡多年，理應可信」不能是跳過評讀的理由
5. 把評讀過的文獻推進 NotebookLM，用 `notebook_query` 做跨文獻的綜合提問（例如「這些研究報告的效果量在哪裡有分歧？」）
6. 把評讀結果＋NotebookLM 綜整交給 `research-grants`／`scientific-writing` 撰寫

這個串接屬於「深度處理」流程，適合在動筆寫計畫書之前跑一次，不建議當成日常文獻追蹤——日常追蹤仍交給 litpilot 預設的 30 天窗口即可。另外，NotebookLM 是第三方服務，未發表的手稿或機密初步資料在推送前應先確認是否適合外傳。

## 為什麼要把「找」「評」「寫」拆成獨立階段

多數文獻工具停在「找到論文」或「摘要這篇 PDF」。把流程拆成獨立階段的價值在於：每一階段都有明確輸入、輸出與停止條件——`paper-review` 在全文不可得時中止、子 Agent 查證失敗時回報而非用猜測填補、`scientific-writing` 拒絕生成缺乏來源支持的主張。這比「請 AI 從搜尋一路寫到計畫書」更容易在事後回頭核對每一個判斷點。

## 使用時仍要注意的事

- **未發表授權來源**：`litpilot`、`research-organizer`、`knowledge-base` 是整理自其他作者、未附開源授權的教材／Skill，僅供個人參考使用；若要重製或散布，應直接聯繫原作者。
- **AI 生成圖表會外傳提示詞**：`research-grants`／`scientific-writing` 的圖表生成功能會把描述送到 OpenRouter，未公開的研究內容應審慎評估是否使用。
- **GRADE 分數是輔助而非結論**：確定性腳本降低了主觀評分的變異，但風險偏誤評估的輸入（研究設計判讀、偏誤條目勾選）仍需人工核對，不能只看最終等級就下結論。

## 相關資源

- [AI-academic-skills：學術研究技能鏈](https://github.com/wttntpc/AI-academic-skills-)
- [`grant-evidence-base`：既有 Zotero 庫＋NotebookLM 綜整＋新文獻的串接 Skill](https://github.com/wttntpc/AI-academic-skills-/tree/main/grant-evidence-base)
- [k-dense-ai/scientific-agent-skills](https://github.com/k-dense-ai/scientific-agent-skills)（`paper-lookup`／`scientific-writing`／`research-grants`／`peer-review` 來源，MIT）
- [drpwchen/paper-review-and-digest](https://github.com/drpwchen/paper-review-and-digest)（`paper-review`／`paper-digest` 來源，MIT）
- [AI-tools-skills：跨 Agent 工具連接（前置設定）](https://github.com/wttntpc/AI-tools-skills)
