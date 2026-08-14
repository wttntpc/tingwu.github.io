<!-- SIMPLE -->

研究資料常常不是「找不到」，而是同一件事散落在太多地方：PDF 在 Zotero、分析流程在 HackMD、AI 摘要在 NotebookLM、程式在 GitHub，最後卻沒有人知道哪一份才是最新版。

> **先說結論**：我不要求所有東西都放在同一個工具，而是替每一類內容指定唯一的正式位置。Zotero 管文獻，HackMD 管研究過程，NotebookLM 管限定來源的閱讀與比較，GitHub 管程式與版本。

## 四個工具不是四份備份

| 工具 | 我把什麼放進去？ | 它回答的問題 |
|---|---|---|
| Zotero | 文獻書目、DOI、PDF、標籤與閱讀註記 | 這篇研究是什麼？我要如何引用？ |
| HackMD | 操作步驟、會議紀錄、資料清理決定與研究日誌 | 我當時為什麼這樣做？ |
| NotebookLM | 經過選擇的文獻集合與跨來源問答 | 這批來源彼此如何相同或不同？ |
| GitHub | 程式碼、README、設定檔、測試與版本歷史 | 哪一版程式產生這個結果？ |

這種分工符合 FAIR 原則的精神：研究成果應該容易被找到、取得、互通與再利用，並留下來源與版本資訊（Wilkinson et al., 2016）。但 FAIR 不等於把所有資料公開；涉及參與者資料、個資或授權 PDF 時，仍應限制存取。

## Zotero：文獻的正式戶籍

Zotero 最重要的不是「存 PDF」，而是讓每篇文獻擁有可引用的書目紀錄。我的做法是：

1. 優先以 DOI、PMID 或期刊頁面建立正式 item。
2. PDF 作為該 item 的附件，不單獨漂浮。
3. 使用 collection 區分研究專案，用 tag 標示主題或閱讀狀態。
4. 在筆記中記下研究設計、樣本、主要結果及限制。

Zotero 官方文件也建議讓附件依附於具有書目 metadata 的 parent item，因為孤立 PDF 無法完整使用引用與搜尋功能。

## HackMD：研究過程的實驗日誌

HackMD 適合記錄還在形成中的內容，例如：

- HRV 前處理的排除條件。
- EEG 壞頻道與 ICA 處理紀錄。
- 某次會議決定改用哪個統計模型。
- 分析失敗時看到的錯誤訊息與解法。
- GitHub repo 的使用教學與 Table of Contents。

它不是正式書目資料庫，也不應保存 token 或可識別參與者資料。筆記中引用文獻時，我會放 Zotero key、DOI 或固定連結，讓讀者能回到來源。

## NotebookLM：針對一批來源進行比較

NotebookLM 適合處理「我已經選好的資料」。例如，把 10 篇 HRV 與心肺適能研究放入同一個 notebook，再問：

- 各研究的 HRV 量測時間是否一致？
- 哪些使用 ECG，哪些使用 PPG？
- 哪些研究控制呼吸、姿勢與時間？
- 結論互相衝突的原因可能是什麼？

Google 官方說明指出，NotebookLM 的回答可根據所選來源提供行內引用，點擊後能回到原文位置。不過，引用功能只幫助定位，不等於完成研究品質評讀；如果來源本身選得偏，答案也會跟著偏。

## GitHub：可執行研究的版本紀錄

GitHub 保存的是能被重跑與檢查的研究物件：

```text
project/
├─ README.md
├─ data_dictionary.md
├─ src/
│  ├─ 01_import.py
│  ├─ 02_clean.py
│  └─ 03_analysis.py
├─ tests/
├─ outputs/
└─ environment.yml
```

Sandve 等人（2013）指出，即使程式只有很小的改動，也可能改變研究結果，因此自訂程式應使用版本控制。GitHub commit 讓我能指出「這張圖由哪一版程式產生」，而不只是保留一個叫做 `final_v3_really_final.py` 的檔案。

## 四個工具如何互相連結？

我會替每個研究專案設定一個共同名稱，例如：

```text
project_id: HRV-resting-v2
```

然後在四個地方互相放連結：

- Zotero collection 描述欄：放 GitHub 與 HackMD。
- HackMD 開頭：放 repo、Zotero collection 名稱與 NotebookLM。
- GitHub README：放公開 HackMD 與研究文獻管理方式。
- NotebookLM 說明：記錄來源選取日期、Zotero collection 與分析 repo。

> **重要觀念**：連結不是複製。正式內容只維護一份，其他工具只放入口與摘要。

## 什麼不能放進公開 GitHub？

- 未去識別化的參與者資料。
- Telegram token、API key、密碼或 cookie。
- 未取得公開權利的論文 PDF。
- 含有姓名、學號、帳號或照片的原始截圖。
- 私人 HackMD 的完整匯出檔，除非已逐段確認可公開。

NotebookLM 也屬於外部服務。Google 表示一般使用者的內容不會直接用於基礎模型訓練，除非主動提供回饋；但研究者仍需遵守研究倫理、學校政策、著作權與資料使用同意，不能因此把敏感研究資料直接上傳。

## 帶走三個重點

1. 每種研究物件只有一個正式保存位置。
2. 四個工具用 project ID、DOI 與固定連結互相指向。
3. 雲端方便不等於適合存個資；公開與私人資料必須分層。

> **一句話總結**：好的研究知識庫不是把所有東西塞進同一個平台，而是任何人都能沿著連結找到來源、決策與程式版本。

## 參考文獻（APA 7th）

Sandve, G. K., Nekrutenko, A., Taylor, J., & Hovig, E. (2013). Ten simple rules for reproducible computational research. *PLOS Computational Biology, 9*(10), e1003285. https://doi.org/10.1371/journal.pcbi.1003285

Wilkinson, M. D., Dumontier, M., Aalbersberg, I. J., Appleton, G., Axton, M., Baak, A., Blomberg, N., Boiten, J.-W., da Silva Santos, L. B., Bourne, P. E., Bouwman, J., Brookes, A. J., Clark, T., Crosas, M., Dillo, I., Dumon, O., Edmunds, S., Evelo, C. T., Finkers, R., . . . Mons, B. (2016). The FAIR Guiding Principles for scientific data management and stewardship. *Scientific Data, 3*, Article 160018. https://doi.org/10.1038/sdata.2016.18

Google. (n.d.). *Learn about NotebookLM*. Retrieved August 14, 2026, from https://support.google.com/notebooklm/answer/16164461

GitHub. (n.d.). *Repositories documentation*. Retrieved August 14, 2026, from https://docs.github.com/en/repositories

HackMD. (n.d.). *HackMD Tutorial Book*. Retrieved August 14, 2026, from https://hackmd.io/tutorials

Zotero. (n.d.). *The basics*. Retrieved August 14, 2026, from https://www.zotero.org/support/quick_start_guide

---

本文介紹的是研究資訊架構，不代表資料放入特定平台後就自動符合 FAIR、研究倫理或個資規範。

<!-- PROFESSIONAL -->

研究知識管理的核心問題不是缺少儲存空間，而是缺少 artifact ownership、provenance 與跨系統識別規則。當書目、方法筆記、AI 摘要、程式與輸出散落於多個平台時，若每個平台都保存一份可編輯副本，就會形成版本漂移與無法追溯的引用鏈。

本文提出一個四層架構：Zotero 作為 bibliographic system of record，HackMD 作為 decision log 與操作筆記，NotebookLM 作為 bounded synthesis workspace，GitHub 作為 executable research record。

> **證據定位**：這是依 FAIR、可重現運算研究原則與各工具官方功能建立的個人資訊架構，不是四工具效能比較研究。

## 一、先定義研究物件，而不是先選 App

| Artifact | Canonical system | 最低必要 metadata | 是否適合公開 |
|---|---|---|---|
| 文獻書目 | Zotero | DOI/PMID、作者、年份、期刊、item key | 書目通常可；PDF 視授權 |
| 閱讀筆記 | Zotero／HackMD | source ID、locator、摘要者、日期 | 依內容與版權 |
| 方法與決策紀錄 | HackMD | project ID、日期、決定、理由、負責者 | 去識別後可選擇公開 |
| 限定來源綜整 | NotebookLM | corpus、加入日期、來源版本、問題 | 不含敏感材料才可 |
| 程式與設定 | GitHub | commit SHA、license、環境、輸入輸出規格 | 可公開或 private repo |
| 原始研究資料 | 受控儲存 | 資料版本、權限、倫理與同意限制 | 通常不可直接公開 |
| 衍生資料與結果 | 受控儲存／GitHub release | 生成程式 SHA、參數、時間 | 視再識別與授權風險 |

這張表刻意把「原始研究資料」排除在四個便利工具的預設公開流程外。可重現性不是把所有資料公開，而是清楚說明哪些資料可取得、以何種條件取得，以及哪一版程式處理了哪一版輸入。

## 二、Zotero：bibliographic authority

Zotero item 應該是文獻身份的正式來源。最低規則包括：

1. 以 DOI、PMID、ISBN 或正式期刊頁面建立 parent item。
2. PDF、補充資料與網頁快照附屬於 parent item。
3. 在 Extra 或 note 中保存必要 identifier，不以檔名代替書目。
4. collections 表示專案或閱讀集合；tags 表示跨專案屬性。
5. 引用匯出由 Zotero 完成，但 DOI 解析與全文支持仍需人工核對。

Zotero 的 collections 類似播放清單：同一 item 可以出現在多個 collection，而不產生多份文獻副本。這很適合 HRV、EEG、認知功能等彼此交疊的研究主題。

## 三、HackMD：decision provenance

HackMD 不只保存「最後 SOP」，也應保存決策形成過程。建議每篇分析筆記使用以下表頭：

```yaml
project_id: HRV-resting-v2
status: active
data_version: raw-2026-07-31
code_repo: https://github.com/wttntpc/...
code_commit: abc1234
zotero_collection: HRV / Resting
notebooklm_corpus_date: 2026-08-14
owner: Ting-Ting Wu
last_verified: 2026-08-14
```

每個重要分析變更再記錄：日期、舊方法、新方法、原因、影響哪些輸出、是否需要重跑。這些資訊就是 provenance，而不是只保留一段現在看起來正確的教學。

## 四、NotebookLM：bounded synthesis，不是 source of record

NotebookLM 的優勢是以所選來源回答並提供可點擊的行內引用。它適合：

- 比較研究設計、樣本與量測條件。
- 建立主題矩陣與衝突清單。
- 找出某項主張可能位於哪篇來源。
- 對既定 corpus 產生初步摘要或問題清單。

但 notebook 不應成為正式引用來源。正確的鏈結仍是：

```text
AI answer → NotebookLM citation locator → original paper → Zotero item → article claim
```

如果只引用 AI 回答，就失去原作者、研究設計與上下文。NotebookLM 也可能因來源選取、OCR、切分或檢索而漏掉相反證據。

## 五、GitHub：executable provenance

Sandve 等人（2013）與 Wilson 等人（2017）都強調，分析程式、資料處理與環境應被系統化保存。GitHub repo 建議至少包含：

```text
README.md                 # 問題、資料、快速開始、限制
CITATION.cff              # 軟體引用資訊
LICENSE                   # 可再利用範圍
data/README.md            # 資料來源與取得條件，不一定放資料
docs/data_dictionary.md   # 欄位、單位、缺失碼與衍生規則
src/                      # 按順序編號的分析程式
tests/                    # 可自動驗證的關鍵邏輯
environment.yml           # 套件與版本
outputs/README.md         # 輸出生成方式與是否提交
```

每一份公開圖表應可回到程式 commit、輸入資料版本與參數。若 repo 只放一個 dashboard HTML，卻沒有來源與生成步驟，它比較接近展示成品，而不是可重現研究物件。

## 六、跨平台識別與連結契約

我建議每個專案維護一個 `project-map.md`：

| Field | Example |
|---|---|
| project_id | HRV-resting-v2 |
| GitHub | repo URL + release/commit |
| HackMD | canonical note permalink |
| Zotero | library/collection + key items |
| NotebookLM | notebook ID + corpus freeze date |
| data | controlled path + version |
| public output | article URL/DOI |

文章或 README 只複製必要摘要，完整方法仍回到 canonical note；HackMD 不貼整份程式，而是連到 commit；NotebookLM 不保存唯一文獻副本，而是從 Zotero 管理的 corpus 匯入。這可減少多處同步造成的 drift。

## 七、FAIR 與 reproducibility 的差異

Wilkinson 等人（2016）提出 FAIR 原則；Wilkinson 等人（2025）進一步將其延伸至 computational workflows，強調版本、元件、metadata 與執行 provenance。但 FAIR 主要處理「能否找到、取得、理解與再利用」，不保證程式一定能在另一台電腦得到相同結果。

可重現性還需要：

- 明確的軟體環境與隨機種子。
- 不可變的原始資料或資料版本。
- 完整參數、排除條件與執行順序。
- 對中間結果與錯誤的品質控制。
- 將 exploratory 與 confirmatory 分開。

## 八、隱私與權限分層

| 等級 | 範例 | 建議位置 |
|---|---|---|
| Public | README、公開程式、已授權圖表 | 公開 GitHub／網站 |
| Internal | 未完成筆記、內部分析決策 | private HackMD／private repo |
| Confidential | 未公開手稿、合作資料 | 機構核准的受控儲存 |
| Identifiable | 姓名、帳號、生理原始資料、照片 | 嚴格受控環境，不上傳一般 AI 服務 |

Google 的 NotebookLM 隱私說明指出，內容一般不會直接用於基礎模型訓練，除非使用者選擇提供回饋；但這不是研究倫理審查、資料處理協議或著作權授權的替代品。外部服務的允許範圍必須先由研究者與機構政策決定。

## 最低可行工作流

1. Zotero 收錄文獻並確認 DOI。
2. HackMD 建立 project note 與 decisions table。
3. 選定 corpus 後才加入 NotebookLM，記錄 freeze date。
4. GitHub 建立 README、data dictionary、程式與環境。
5. 每次分析輸出附上 data version 與 commit SHA。
6. 公開文章只連結可公開 artifacts，敏感材料留在受控環境。

## 參考文獻（APA 7th）

GitHub. (n.d.). *Repositories documentation*. Retrieved August 14, 2026, from https://docs.github.com/en/repositories

Google. (n.d.). *Learn about NotebookLM*. Retrieved August 14, 2026, from https://support.google.com/notebooklm/answer/16164461

Google. (n.d.). *Privacy and terms of use in NotebookLM*. Retrieved August 14, 2026, from https://support.google.com/notebooklm/answer/17004255

HackMD. (n.d.). *HackMD Tutorial Book*. Retrieved August 14, 2026, from https://hackmd.io/tutorials

Sandve, G. K., Nekrutenko, A., Taylor, J., & Hovig, E. (2013). Ten simple rules for reproducible computational research. *PLOS Computational Biology, 9*(10), e1003285. https://doi.org/10.1371/journal.pcbi.1003285

Wilkinson, M. D., Dumontier, M., Aalbersberg, I. J., Appleton, G., Axton, M., Baak, A., Blomberg, N., Boiten, J.-W., da Silva Santos, L. B., Bourne, P. E., Bouwman, J., Brookes, A. J., Clark, T., Crosas, M., Dillo, I., Dumon, O., Edmunds, S., Evelo, C. T., Finkers, R., . . . Mons, B. (2016). The FAIR Guiding Principles for scientific data management and stewardship. *Scientific Data, 3*, Article 160018. https://doi.org/10.1038/sdata.2016.18

Wilkinson, S. R., Aloqalaa, M., Belhajjame, K., Crusoe, M. R., de Paula Kinoshita, B., Gadelha, L., Garijo, D., Gustafsson, O. J. R., Juty, N., Kanwal, S., Khan, F. Z., Köster, J., Peters-von Gehlen, K., Pouchard, L., Rannow, R. K., Soiland-Reyes, S., Soranzo, N., Sufi, S., Sun, Z., . . . Goble, C. (2025). Applying the FAIR Principles to computational workflows. *Scientific Data, 12*, Article 328. https://doi.org/10.1038/s41597-025-04451-9

Wilson, G., Bryan, J., Cranston, K., Kitzes, J., Nederbragt, L., & Teal, T. K. (2017). Good enough practices in scientific computing. *PLOS Computational Biology, 13*(6), e1005510. https://doi.org/10.1371/journal.pcbi.1005510

Zotero. (n.d.). *Adding files to your Zotero library*. Retrieved August 14, 2026, from https://www.zotero.org/support/attaching_files

Zotero. (n.d.). *The basics*. Retrieved August 14, 2026, from https://www.zotero.org/support/quick_start_guide

---

本文不建議把可識別研究資料或未授權全文上傳至外部 AI 服務；實際資料治理仍應依研究倫理、機構政策及資料使用協議辦理。
