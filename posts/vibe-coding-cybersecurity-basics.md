<!-- SIMPLE -->

「我一句程式碼都不會寫，但用 Cursor / Claude 只花了三天就把網站做出來了！」

在當今「Vibe Coding」的浪潮下，AI 讓所有人都能用自然語言寫出能動、能跑的軟體產品。然而，YouTube 創作者 Gary Chen 在他的資安教學影片《給非技術人員的資安教學，Vibe Coding 必學的基本功》中，開宗明義拋出了一記當頭棒喝：

> **「功能會動，絕對不代表可以上線。」**

## 為什麼「功能會動」不等於「可以上線」？

影片開頭提到了社群熱議的 **What'Sub 事件**：知名創作者團隊的成員（非工程師背景）花費半年、投入資金，完全透過 AI「Vibe Coding」打造出一款 AI 影音字幕工具。產品上線後立刻爆紅，流量與讚譽湧入；但隨之而來的，卻是資安社群陸續回報的重大漏洞——包含後台管理端點暴露、使用者電子郵件等個人資料未受保護、資料庫權限未上鎖等問題。

這個事件不是在嘲笑用 AI 寫程式的人，而是一面非常真實的鏡子：
* **AI 善於「實現功能」**：你跟 AI 說「我要一個讓使用者登入看影片的按鈕」，AI 會寫出一個能按、能跳轉的頁面。
* **AI 幾乎不會主動「替你防守」**：AI 不會通靈猜測你背後有哪些機密資料、不知道誰該看誰的檔案，更不會主動幫你檢查「隔壁老王能不能透過改網址看到其他人的私人字幕」。

資安不是電影裡綠色終端機飛快跳動的駭客攻防，用最白話的方式說：**資安就是「鎖好你家的門窗，確認誰可以進哪間房間」**。

---

## 🚀 上線前的「5 個靈魂拷問」

在把任何 AI 做出的產品公開給大眾、開放註冊之前，請務必像安全檢查員一樣，問自己以下這五個關鍵問題：

| 檢查維度 | 核心提問 | 白話情境與檢查重點 |
|---|---|---|
| **1. 核心資產** | **哪些東西被偷會出大事？** | 使用者密碼、真實姓名、Email、信用卡資訊、後台金鑰（API Key）、資料庫連線字串。這些東西必須放在最高安全級別的保管箱裡。 |
| **2. 存取權限** | **誰能碰哪些資料？** | 使用者 A 能不能看見使用者 B 的專案？一般會員能不能偷偷呼叫管理員專屬的刪除按鈕？資料庫有沒有開啟「行級安全性規則（RLS）」？ |
| **3. 信任邊界** | **哪一段是你管不到的？** | 你的程式串接了哪些第三方服務（如金流綠界/Stripe、OpenAI API、外部插件）？當對方的伺服器斷線或回傳假資料時，你的網站會不會直接崩潰洩漏系統底層錯誤？ |
| **4. 業務規則** | **哪些規則絕對不能被打破？** | 例如「沒付錢絕對不能下載高清檔」、「餘額為零不能再扣款」、「每分鐘同一 IP 只能發送 10 次驗證碼」。前端按鈕藏起來不夠，伺服器後端必須嚴格驗證。 |
| **5. 暴露大門** | **外面有哪些門是開著的？** | 是不是留了測試用、沒有加密碼的後台頁面（如 `/admin`、`/test`）？跨網域存取（CORS）是不是偷懶設定成「允許所有人存取（*）」？ |

只要任何一題的答案是模糊的，這套系統在網路上就宛如「門窗大開的無人金庫」，任何懂得按 F12 打開瀏覽器開發者工具的人，都能隨意進出。

---

## 🛠️ 看不懂程式碼，怎麼補漏洞？非技術人員的「4 步驟修補法」

很多朋友會問：「我又不是資工系畢業，我也看不懂幾千行的 Python 或 JavaScript，我怎麼知道有沒有漏洞？知道了又怎麼修？」

Gary Chen 在影片中示範了一套非常接地氣的修補心法，結合了現代的**靜態代碼安全掃描工具（如 Codex Security Plugin 等）**與你身邊的 AI 助手：

```
[ 步驟 1：掃描與報警 ] ➔ 執行自動化安全工具，匯出漏洞報告
         │
         ▼
[ 步驟 2：請 AI 當白話翻譯官 ] ➔ 「請用白話告訴我這個弱點的嚴重性與攻擊方式」
         │
         ▼
[ 步驟 3：最小化安全修補 ] ➔ 「請在不破壞現有功能的前提下，提供最小修改補丁」
         │
         ▼
[ 步驟 4：雙重驗證閉環 ] ➔ 重新掃描確認警報消失 ＋ 手動點擊確認功能正常
```

1. **第一步：使用掃描工具取得報告**：藉由市面上的資安外掛或檢查工具，對專案專案進行全盤掃描，工具會列出 High（高危）、Medium（中度）、Low（低危）等不同等級的警示。
2. **第二步：把報告內容餵給 AI**：複製報告中的警告文字與對應程式檔，直接向 AI 提問：*「我是非技術背景，請用白話告訴我這段報告指出的安全性風險是什麼？駭客可能會怎麼利用這個漏洞攻擊我？」*
3. **第三步：請 AI 給予最小更動的修補補丁**：清楚指示 AI：*「請在不修改原有業務邏輯與介面功能的前提下，為這段程式碼加入安全性防護與輸入驗證，並只給我需要更換的程式碼區塊。」*
4. **第四步：重新掃描與驗證**：修補完畢後，再次執行掃描工具確認紅字警報是否消除，並在瀏覽器中親手操作一次該功能，確認沒有因為資安修補而導致正常功能被誤殺。

---

## 💡 結語：AI 降低了開發門檻，但拉高了「責任意識」

「Vibe Coding」是這個時代送給非技術人員最棒的禮物，它讓創意與產品可以在幾天內落地。但當你的作品開始有真實用戶註冊、開始儲存別人的個資或資料時，你就已經不再只是個「玩 AI 的創作者」，而是一位**「資料受託人」**。

把這五個問題當成你的上線 Check-list，讓你的產品不僅「酷炫好用」，更能成為讓人安心信任的強韌系統。

## 參考文獻 / 影片來源

* Gary Chen. (2026, September). *給非技術人員的資安教學，Vibe Coding 必學的基本功* [Video]. YouTube. https://www.youtube.com/watch?v=t9WA-BkLUps

---

<!-- PROFESSIONAL -->

在以大型語言模型（LLM）為核心的「Vibe Coding」與 Agentic Engineering 範式轉移中，軟體生產力的邊際成本正快速歸零。然而，伴隨程式碼自動生成普及而來的，是顯著的**「認知失諧與架構安全赤字（Architectural Security Deficit）」**。

本篇專案筆記深入探討 YouTube 創作者 Gary Chen 所剖析的非工程背景開發者資安盲區，以實際發生的 **What'Sub 工具事件** 為個案研究，將影片中提出的啟發式觀念提升為系統化的軟體工程**威脅建模（Threat Modeling）**與**縱深防禦（Defense-in-Depth）**實務。

---

### 1. 個案研究：What'Sub 事件與 AI 輔助開發的「安全幻覺」

2026 年 8 月，非工程背景創作者透過 LLM 輔助開發的 AI 字幕工具 What'Sub 迅速竄紅，但隨即被資安社群揭發多項嚴重弱點：
* **後台路由無鑑權暴露**：依賴前端路徑隱藏（Security through Obscurity），後端 API 未實施強制身分驗證與角色授權。
* **資料庫存取控制缺失**：在 BaaS 架構（如 Supabase / Firebase）中未配置或錯誤配置行級安全性策略（Row Level Security, RLS），致使匿名客戶端可直接透過公網端點遍歷存取敏感個資。
* **憑證外洩與配置不當**：服務端私鑰（Service Role Key）誤植於前端打包檔案中。

**工程本質反思**：
LLM 具備強大的局部語法合成能力，但其目標函數聚焦於「通過當前的輸入提示測試」（Pass-the-prompt），缺乏全域系統邊界（System Boundaries）、惡意輸入假設與非功能性需求（Non-Functional Requirements）的全局架構意識。

---

### 2. 產品上線前五大威脅建模維度（Threat Modeling Framework）

針對無伺服器（Serverless）與 BaaS 現代 Web 架構，將上線前檢查抽象為五大防禦構面：

```
               ┌──────────────────────────────────────────────┐
               │              對外暴露面 (Surface)             │
               │  [公開端點 / 跨域 CORS / 速率限制 Rate Limit]   │
               └──────────────────────┬───────────────────────┘
                                      │
                                      ▼
               ┌──────────────────────────────────────────────┐
               │           邊界與身份授權 (AuthN / AuthZ)       │
               │   [最小權限原則 / Row Level Security (RLS)]   │
               └──────────────────────┬───────────────────────┘
                                      │
                                      ▼
               ┌──────────────────────────────────────────────┐
               │           業務規則不變式 (Invariants)         │
               │   [後端強驗證 / 狀態機防篡改 / 額度防刷限制]   │
               └──────────────────────┬───────────────────────┘
                                      │
                                      ▼
               ┌──────────────────────────────────────────────┐
               │              核心資產保護 (Assets)           │
               │   [密鑰管理 .env / 個資加密 / 審計日誌 Audit]   │
               └──────────────────────────────────────────────┘
```

#### A. 核心資產分級與密鑰管理（Data Classification & Secret Management）
* **嚴格分離環境變數**：禁止將 `SERVICE_ROLE_KEY`、資料庫密碼或支付閘道私鑰硬編碼在原始碼中。
* **前端暴露最小化**：客戶端僅允許注入受 RLS 政策嚴格約束的公開金鑰（如 `SUPABASE_ANON_KEY`），其餘特權操作必須透過具備身分驗證的 Serverless API 端點轉發。

#### B. 存取控制與最小特權原則（Broken Object Level Authorization, BOLA/IDOR 防範）
* **資料庫層級防禦（Database-Level Defense）**：所有資料表必須顯式執行：
  ```sql
  ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Users can only read own projects"
  ON public.user_projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
  ```
* **禁止客戶端直通未經授權的 RPC/Mutation**：避免使用者透過變造請求酬載中的 `user_id` 存取其他租戶資源。

#### C. 第三方依賴與信任邊界（Supply Chain & External Dependencies）
* **零信任輸入驗證**：來自第三方 Webhook（如綠界金流、Stripe）的通知必須驗證數位簽章（HMAC Signature），不可僅信任 HTTP 請求本體。
* **相依套件弱點稽核**：定期執行 `npm audit` 或 Dependabot 掃描，預防惡意套件注入（Software Supply Chain Attacks）。

#### D. 業務邏輯防禦不變式（Business Logic & Rate Limiting）
* **後端身分與額度校驗**：不能僅在前端按鈕加入 `disabled` 來防範重複送出或未付款下載；後端業務邏輯必須以事務（Transaction）或原子操作檢查使用者額度與權限。
* **速率限制（Rate Limiting）**：對外公開的 AI 呼叫或認證端點，必須在邊緣伺服器或反向代理端加入 IP / User ID 頻率限制，防範暴力破解與 API 額度耗竭攻擊（Denial of Wallet）。

#### E. 暴露面收斂與防禦性標頭（Attack Surface Reduction）
* **嚴格 CORS 政策**：禁止在生產環境設定 `Access-Control-Allow-Origin: *`，應精確鎖定生產網域名稱。
* **生產環境除錯模式關閉**：關閉詳細堆疊追蹤（Stack Traces），避免伺服器檔案路徑與資料庫結構外洩。

---

### 3. 自動化靜態安全審計（SAST）與高風險特徵識別

在 CI/CD 或本機開發流程中導入自動化安全審計工具（如 Semgrep、Codex Security Scanner 或 SonarQube），可及早攔截常見的危險代碼模式：

```
[源碼 commit] ➔ [靜態安全掃描 SAST] ➔ [風險等級分流 (High/Med/Low)] ➔ [阻斷高危部署]
```

* **High Risk 1: 硬編碼密鑰（Secret Leakage）**
  * 偵測特徵：代碼中出現高熵字串（High-entropy strings）、常見金鑰前綴（如 `sk-`、`AKIA...`、`eyJh...`）。
* **High Risk 2: 不安全的直接物件引用（IDOR / Missing Auth Guard）**
  * 偵測特徵：API 路由直接接收客戶端傳遞的 `id` 進行資料庫查詢，而未將該 `id` 與目前 Session 之 `auth.uid()` 進行交叉比對。

---

### 4. 人機協作的四步驟安全修補管線（LLM-Assisted Remediation Loop）

對於非傳統軟體背景的開發者，應建立閉環式（Closed-loop）的安全修補流程：

1. **情境化檢傷（Contextual Triage）**：
   將 SAST 報告的 CWE（Common Weakness Enumeration）識別碼與受影響程式碼區塊作為 Context，要求 LLM 分析威脅向量（Threat Vector）與潛在利用途徑。
2. **最小侵入式修補（Least-Invasive Remediation）**：
   提示詞約束 LLM 採納縱深防禦標準（如 OWASP Top 10 Guidelines），以增加防禦性守衛（Guard Clauses）為主，避免大幅度重構導致功能退化（Regression）。
3. **安全審計回歸（Security Regression Scanning）**：
   重跑靜態掃描工具，確認特定規則警報已由警示轉為通過（Pass）。
4. **功能驗收測試（Functional Verification）**：
   執行自動化單元測試或手動冒煙測試（Smoke Test），確認現有業務邏輯完全未受影響。

---

### 5. 總結

Vibe Coding 讓個人的創造力不受限於程式語法，但軟體工程的本質從未改變：**一個架構健全的產品，其價值不僅建立在「在正確的情況下做對的事」，更建立在「在遭遇惡意與異常時不犯致命的錯」**。將資安思維前置於產品規劃與上線驗收，是每位 AI 時代開發者的必備修養。

## 參考文獻 (References)

* Chen, G. (2026, September). *給非技術人員的資安教學，Vibe Coding 必學的基本功* [Video]. YouTube. https://www.youtube.com/watch?v=t9WA-BkLUps
* OWASP Foundation. (2021). *OWASP Top 10: 2021 - The Ten Most Critical Web Application Security Risks*. https://owasp.org/Top10/
* Shostack, A. (2014). *Threat Modeling: Designing for Security*. John Wiley & Sons.
