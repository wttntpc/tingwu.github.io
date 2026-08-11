<!-- SIMPLE -->

AI 設計 Skill 越裝越多，網站就會越漂亮嗎？我的結論是：**不一定，而且很可能相反。**

這十套工具大多在解決同一件事：避免 AI 做出千篇一律的漸層、圓角卡片與 SaaS 首頁。若同時安裝，它們可能對字體、動畫、版面密度與重構程度提出互相衝突的要求。對我的需求而言，真正重要的不是收集最多 Skill，而是把工具分成三層：

1. **研究正確性**：文獻、統計、EEG、HRV 與可重現分析。
2. **成果呈現**：文章、圖表、Dashboard 與無障礙設計。
3. **視覺風格**：紙張感、字體、留白、色彩與動畫。

這篇評估的是第二、三層。它們可以讓研究成果更容易理解，卻不能判斷研究設計是否合理，也不能代替統計與文獻查核。

## 先看結論

| Skill | 對學術研究的幫助 | 對我的網站 | 建議 |
|---|---|---|---|
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 圖表、Dashboard、無障礙 | 適合，但功能很多 | **保留；已安裝，按需使用** |
| [Taste Skill](https://github.com/leonxlnx/taste-skill) | 研究成果的版面呈現 | 很適合既有網站稽核 | **只保留 redesign-existing-projects** |
| [Impeccable](https://github.com/pbakaus/impeccable) | 幫助呈現，不處理研究方法 | 完整但較重，且有自動檢查 hook | **目前不安裝** |
| [Anthropic Frontend Design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | 幫助視覺敘事 | 與現有工具高度重疊 | **不安裝** |
| [Hallmark](https://github.com/nutlope/hallmark) | 幫助避免 AI 模板感 | 可能把現有網站改動過大 | **目前不安裝** |
| [GSAP Skills](https://github.com/greensock/gsap-skills) | 適合互動式科普 | 個人網站不需要大量動畫 | **有專案再安裝** |
| [Stitch Skills](https://github.com/google-labs-code/stitch-skills) | 適合製作介面原型 | 需要 Stitch MCP，流程較重 | **目前不安裝** |
| [Vercel Web Design Guidelines](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) | 有助無障礙與品質檢查 | 輕量、只做稽核 | **可考慮安裝** |
| [Nothing Design Skill](https://github.com/dominikmartn/nothing-design-skill) | 幾乎沒有研究方法價值 | 工業、點陣風與學術紙張風不符 | **不安裝** |
| [Garden Skills](https://github.com/ConardLi/garden-skills) | 文章、圖像與知識檢索各有用途 | 不必安裝整包 | **只保留 beautiful-article** |

## 我真正需要的組合

目前最精簡的配置是：

- `ui-ux-pro-max`：只有在研究圖表、HRV／EEG 視覺化與 Dashboard 工作時使用。
- `redesign-existing-projects`：改善既有個人網站，但保留原架構與學術紙張風。
- `beautiful-article`：把完整素材整理成可閱讀、可分享的長文。
- `web-design-guidelines`：未來若需要第二套獨立的無障礙稽核，可再安裝。

其他工具不是不好，而是現階段沒有增加足夠的新能力。少裝一套，就少一組可能衝突的設計規則，也能減少 AI 每次工作時需要讀取的內容。

> 我的原則是：研究 Skill 決定內容是否可信，設計 Skill 決定內容是否容易理解。兩者不能互相取代。

<!-- PROFESSIONAL -->

Agent Skill 本質上是一組提供給 AI 的操作規則、判斷框架與參考資料。安裝設計 Skill 並不等於新增一個可靠的研究方法模組；它通常改變的是模型在版面、字體、互動、動態效果與程式檢查上的偏好。

因此，我用五個準則評估這十套 Skill：

1. 是否對學術研究工作有直接或間接價值。
2. 是否符合簡約、暖白、襯線標題的學術紙張風。
3. 是否與現有 Skill 重複。
4. 是否引入額外 runtime、MCP、hook 或前端依賴。
5. 是否能限制在單一任務使用，而不是每次自動介入。

## 一、UI UX Pro Max：保留，但不能讓它自動決定風格

[UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) 提供可搜尋的風格、色彩、字體、UX 規則與圖表建議資料庫，也能依專案條件產生設計系統。它對我的價值不在於重新設計首頁，而是協助：

- 選擇 HRV、EEG 與行為資料的圖表形式。
- 檢查圖例、顏色對比與行動版互動。
- 規劃研究 Dashboard 的資訊密度。
- 建立可重複使用的設計 token。

問題是資料庫會依關鍵字自動配對風格，結果不一定符合既有品牌。因此它適合當「建議資料庫」，不適合當「最終設計決策者」。目前已安裝，但應固定附加限制：保留原生 HTML／CSS／JavaScript、低動態、紙張風、不使用 Bento、玻璃風與 SaaS 漸層。

## 二、Taste Skill：只需要既有網站稽核模組

[Taste Skill](https://github.com/leonxlnx/taste-skill) 是一組反制通用 AI 介面的設計 Skills，包含一般前端設計、既有網站重設、極簡、品牌與圖片生成等不同模組。對我最有用的是 `redesign-existing-projects`：先掃描現況、診斷通用模板感，再做有限度修正。

整套安裝會和 UI UX Pro Max、Frontend Design、Hallmark 形成重疊。我的網站已經用 `redesign-existing-projects` 完成過稽核，因此不需要再安裝 Taste Skill 的其他視覺模組。

## 三、Impeccable：強大的完整工作流，但目前過重

[Impeccable](https://github.com/pbakaus/impeccable) 包含一套 Skill、23 個設計命令與 59 條可重現的偵測規則。它能建立 `PRODUCT.md`、`DESIGN.md`，並提供 audit、critique、polish、distill、typeset、layout 等分工清楚的命令。Codex 安裝還可以搭配專案 hook，在 UI 檔案修改後自動偵測問題。

這種工作流適合持續開發多頁產品或由多人維護的設計系統。對目前的單人學術網站而言，hook、工作檔與大量命令增加的治理成本高於收益；而且它與現有稽核工具重複。若未來同時維護個人網站、研究平台與互動 Dashboard，再考慮以「專案限定」方式安裝。

## 四、Anthropic Frontend Design：原則精煉，但新增價值有限

[Anthropic Frontend Design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) 是一份精簡的視覺設計指引，強調從題材、受眾與頁面任務出發，做出有主體性的字體、色彩與版面選擇，而不是套用模型最常見的模板。

它的觀念很好，但目前已有 `frontend-ui-engineering`、`redesign-existing-projects` 與 UI UX Pro Max。再安裝一份高層次設計原則，實際新增能力不多，反而可能增加提示規則競爭，因此暫不安裝。

## 五、Hallmark：適合打破模板，不適合穩定的學術識別

[Hallmark](https://github.com/nutlope/hallmark) 會從多種主結構與 21 個主題中選擇設計，並用 57 個 anti-slop gate 檢查結果。它還能 audit 現有程式、redesign 網站，以及從截圖或網址抽取設計 DNA。

它適合需要每個專案都呈現不同視覺個性的工作室；我的需求則是讓所有文章共享穩定、安靜、可辨識的學術紙張風。Hallmark 的 redesign 模式可能把結構改得太多，而 audit 能力又與既有工具重複，所以目前不安裝。

## 六、GSAP Skills：只有互動敘事專案才需要

[GSAP Skills](https://github.com/greensock/gsap-skills) 是 GreenSock 官方提供的動畫 Skills，涵蓋 tween、timeline、ScrollTrigger、React／Vue／Svelte 整合與效能管理。它的技術內容具權威性，適合製作滾動敘事、動畫解釋器或複雜狀態轉場。

但我的個人網站刻意採低動態，文章的 Poincaré plot 與認知作業小工具也不需要時間軸動畫。現在安裝會鼓勵不必要的前端依賴。若未來製作「運動後 HRV 隨時間變化」的互動式科普專題，再針對該專案安裝 `gsap-core`、`gsap-timeline` 與 `gsap-performance` 即可。

## 七、Stitch Skills：依賴 Stitch MCP，現在沒有必要

[Google Stitch Skills](https://github.com/google-labs-code/stitch-skills) 提供設計生成、code-to-design、設計系統管理、靜態 HTML 擷取與元件工作流。這些 Skills 需要 Stitch MCP server、環境設定與相應憑證，部分模組之間也有依賴關係。

如果工作流程已經以 Google Stitch 為主要設計平台，它會很有價值；但我的網站直接在 GitHub Pages 維護，沒有先進 Stitch 再轉回程式碼的需要。因此目前不安裝，也不為了使用 Skill 額外架設 MCP。

## 八、Vercel Web Design Guidelines：最值得列入候選的輕量稽核

[Vercel Web Design Guidelines](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) 本身很短，主要流程是在每次稽核時取得最新版 Web Interface Guidelines，再針對指定檔案輸出精簡的 `file:line` 問題清單。

它不負責選風格，也不會主動重寫網站，因此比較不會和學術紙張風衝突。它適合做第二道無障礙、表單、鍵盤操作與介面品質檢查。缺點是每次需要連網取得規則，而且既有的 code review 與 UI UX Pro Max 已涵蓋部分內容。結論是「可考慮安裝」，但不是必要核心。

## 九、Nothing Design Skill：視覺語言明確，但方向不符

[Nothing Design Skill](https://github.com/dominikmartn/nothing-design-skill) 模仿 Nothing 品牌的單色、工業、點陣與儀表風格，包含 Space Grotesk、Space Mono、Doto、機械式 toggle 與分段進度條。

這是一套「指定品牌風格」，不是一般品質檢查工具。它的 OLED 黑、點陣與工業介面會削弱目前的暖白紙張、襯線標題與學術期刊感，因此不安裝。即使未來想做科技感頁面，也應該在單一實驗專案中局部使用。

## 十、Garden Skills：只挑需要的花，不搬走整座花園

[Garden Skills](https://github.com/ConardLi/garden-skills) 是一個集合，包含 `web-design-engineer`、`beautiful-article`、圖片生成、簡報與本地知識檢索等。它不是一個單一用途 Skill，因此是否適合取決於選哪個模組。

目前已經有 `beautiful-article`，適合把 URL、PDF、DOCX 或筆記整理成有明確編輯結構的長文。`web-design-engineer` 的設計稽核則與現有工具重疊；圖片生成已有內建 image generation；知識檢索也已有 knowledge-base。因此不安裝整包，只保留現有文章模組。

## 安裝決策矩陣

| 決策層級 | Skills | 原因 |
|---|---|---|
| 保留並使用 | UI UX Pro Max、redesign-existing-projects、beautiful-article | 分別處理研究視覺化、既有網站稽核與長文編輯 |
| 可選的下一套 | Vercel Web Design Guidelines | 輕量、偏品質稽核，不強迫改風格 |
| 有專案才裝 | GSAP Skills、Impeccable、Stitch Skills | 分別需要動畫專題、大型設計治理或 Stitch 工作流 |
| 目前不裝 | Anthropic Frontend Design、Hallmark、Nothing Design、Taste／Garden 其餘模組 | 重複、改動幅度過大或風格不符 |

## 我的使用規則

為了避免設計 Skills 彼此干擾，後續每個任務只指定一個主要設計 Skill，再搭配一個品質檢查 Skill：

```text
既有網站改善
→ redesign-existing-projects
→ 必要時用 web-design-guidelines 做第二次稽核

研究 Dashboard／資料視覺化
→ ui-ux-pro-max
→ 統計與訊號結果仍由研究 Skills 驗證

長篇研究科普文章
→ beautiful-article 的編輯流程
→ 發布時沿用個人網站既有文章架構
```

這樣的分工比「十套全部啟用」更容易追蹤，也更能保持網站一致。設計工具可以協助把研究說清楚，但圖表是否誠實、推論是否合理、引用是否正確，仍必須回到資料、方法與原始來源。

---

資料查核日期：2026-08-11。功能與安裝方式以各 repository 的官方 README／SKILL.md 為準。
