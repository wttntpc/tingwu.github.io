<!-- SIMPLE -->

很多人把數據分析想成「把資料交給 AI，請它選一個統計方法」。但真正可靠的分析，其實早在執行 t test、ANOVA 或 regression 之前就開始了。

> **先說結論**：AI 可以協助整理問題、寫程式與找錯誤，但一套可重現的研究流程必須留下問題、資料版本、排除條件、程式版本、統計假設與結果限制。只有最終表格，不能算完整分析。

## 全流程長什麼樣？

```text
研究問題
  ↓
研究設計與分析計畫
  ↓
原始資料與資料字典
  ↓
資料品質檢查
  ↓
正式分析與模型診斷
  ↓
效果量、信賴區間與敏感度分析
  ↓
可重現圖表與報告
  ↓
版本保存與公開範圍確認
```

這條流程中，AI 可以參與每一步，但每一步需要的輸入與成功標準不同。

## 第一步：把研究問題寫成可以分析的形式

以我的研究方向為例，「運動對認知有沒有幫助？」太寬泛。更可分析的問題會是：

> 在大學生中，較高 VO₂peak 是否與抑制控制作業的反應時間及準確率相關？這個關係是否在控制年齡、性別與身體組成後仍存在？

這一句已經說明研究對象、主要預測因子、結果變項與可能共變項。AI 可以幫我指出缺少的部分，但不能替我把原本沒有收集的變項加進研究。

## 第二步：分析前先寫計畫

正式分析前至少決定：

- 主要與次要結果是什麼？
- 一位參與者有幾筆資料，哪些觀察是獨立的？
- 遺漏值怎麼處理？
- 反應時間太快或太慢的排除標準是什麼？
- 主要模型與敏感度分析是什麼？
- 如果結果不顯著，要如何解釋？

預先註冊的目的不是保證研究一定正確，而是把事前假設與看完資料後才產生的探索分開（Nosek et al., 2018）。如果分析方法後來必須改變，也可以改，但需要說明原因。

## 第三步：保護原始資料

原始資料應該保留不動。清理與衍生變項由程式重新產生：

```text
data/raw/        # 唯讀原始資料
data/processed/  # 由程式產生
src/01_clean.py
src/02_analyze.py
outputs/         # 圖表與表格
```

如果直接在 Excel 原始檔中刪除列、改變數字，過幾個月通常無法重建當時做了什麼。Wilson 等人（2017）建議以純文字格式、程式化步驟、版本控制與清楚資料結構支持科學運算。

## 第四步：先檢查資料，再跑統計

分析前的最低檢查包括：

- 每個欄位的型態、單位與允許範圍。
- 參與者 ID 是否重複或遺失。
- 缺失值使用什麼代碼。
- 各組樣本數是否符合預期。
- 離群值是輸入錯誤、生理上可能，還是分析上極端？
- 重複量測的時間順序是否正確。

對 HRV 與 EEG 而言，數字能被讀入不代表訊號品質合格。AI 可以找出極端值，但偽影、裝置限制與生理合理性仍需要領域判斷。

## 第五步：統計方法要對應研究設計

同樣是比較兩組，可能使用獨立樣本 t test、配對 t test、Mann–Whitney U test、mixed model 或其他方法。選擇取決於：

- 組別是否獨立。
- 是否有重複量測。
- 結果變項的分布與尺度。
- 共變項與資料階層。
- 研究主要想估計什麼效果。

AI 如果不知道資料結構，只看到「幫我比較 pre 和 post」，很容易做出外觀合理但設計錯誤的分析。

## 第六步：不要只看 p 值

美國統計學會指出，p 值不能衡量假設為真的機率，也不應單獨決定科學結論（Wasserstein & Lazar, 2016）。報告至少應包含：

- 各組描述統計。
- 效果量或模型估計值。
- 信賴區間。
- 模型假設與診斷。
- 樣本數、排除與遺漏情形。
- 主要分析與探索性分析的區別。

「p > .05」不等於兩組相同，也不等於研究沒有價值；它可能代表效果接近零，也可能只是估計不精確。

## 第七步：讓結果可以重新產生

Sandve 等人（2013）提出的可重現原則包括記錄每個結果如何產生、避免手動資料操作、保存程式版本與中間結果。我會要求最終報告中的圖表由程式輸出，而不是手動複製數字後重新畫圖。

每個結果至少能回答：

```text
輸入資料版本是什麼？
使用哪一個 commit？
執行哪個程式？
排除了多少資料，為什麼？
軟體與套件版本是什麼？
```

## AI 在每一步扮演什麼角色？

| 階段 | AI 可以做 | 研究者必須確認 |
|---|---|---|
| 問題 | 找出模糊概念、提出可測量版本 | 問題是否符合研究目的 |
| 設計 | 產生分析計畫草稿與檢查清單 | 主要假設、排除與因果界線 |
| 資料 | 寫資料驗證程式、產生資料字典 | 單位、編碼與生理合理性 |
| 分析 | 寫可重跑程式與診斷圖 | 模型適用性及結果解釋 |
| 報告 | 整理表格、APA 文字與限制 | 數字、引用、語氣與責任 |

## 帶走三個重點

1. 分析流程始於研究問題與設計，不是統計檢定。
2. 原始資料、程式、參數與排除紀錄必須分開保存。
3. AI 的每個產出都要能回到資料、程式或文獻驗證。

> **一句話總結**：可重現研究不是讓 AI 再回答一次，而是讓另一位研究者能用同一份資料與程式重新得到結果。

## 參考文獻（APA 7th）

Munafò, M. R., Nosek, B. A., Bishop, D. V. M., Button, K. S., Chambers, C. D., Percie du Sert, N., Simonsohn, U., Wagenmakers, E.-J., Ware, J. J., & Ioannidis, J. P. A. (2017). A manifesto for reproducible science. *Nature Human Behaviour, 1*, Article 0021. https://doi.org/10.1038/s41562-016-0021

Nosek, B. A., Ebersole, C. R., DeHaven, A. C., & Mellor, D. T. (2018). The preregistration revolution. *Proceedings of the National Academy of Sciences, 115*(11), 2600–2606. https://doi.org/10.1073/pnas.1708274114

Sandve, G. K., Nekrutenko, A., Taylor, J., & Hovig, E. (2013). Ten simple rules for reproducible computational research. *PLOS Computational Biology, 9*(10), e1003285. https://doi.org/10.1371/journal.pcbi.1003285

Wasserstein, R. L., & Lazar, N. A. (2016). The ASA statement on p-values: Context, process, and purpose. *The American Statistician, 70*(2), 129–133. https://doi.org/10.1080/00031305.2016.1154108

Wilson, G., Bryan, J., Cranston, K., Kitzes, J., Nederbragt, L., & Teal, T. K. (2017). Good enough practices in scientific computing. *PLOS Computational Biology, 13*(6), e1005510. https://doi.org/10.1371/journal.pcbi.1005510

---

本文是一般研究方法介紹；實際分析仍需依研究設計、資料結構與領域規範調整。

<!-- PROFESSIONAL -->

AI 輔助研究的品質不應以「是否成功產生程式與 p 值」判斷，而應以整條 claim–data–code–result 鏈是否可追溯、可診斷與可重跑判斷。以下流程適用於行為資料、HRV、EEG 與一般觀察性研究，但各訊號仍需要專屬品質控制。

> **證據定位**：本文整合可重現研究與統計報告原則，並提供實務工作流；不是對某一套 AI 平台的效能評估。

## Stage 0：研究問題與 estimand

分析前先定義要估計的量，而不是先選檢定：

```yaml
population: 大學生
exposure: VO2peak（連續變項）
outcome: 抑制控制作業 median reaction time
contrast: VO2peak 每增加 5 mL/kg/min 的平均差異
covariates: age, sex, body composition
timepoint: baseline
analysis_unit: participant
```

這可避免把「有相關嗎」交給 AI 自行補上族群、時間點與比較方式。對重複量測或 trial-level 資料，analysis unit 尤其重要；把每個 trial 當成獨立樣本會造成 pseudoreplication。

## Stage 1：protocol 與分析意圖

Nosek 等人（2018）強調，預先註冊有助於區分事前檢驗與事後探索。最低分析計畫應包含：

- primary/secondary outcomes 與時間點。
- inclusion/exclusion criteria。
- sample-size justification。
- 缺失資料策略。
- transformation 與 outlier rule。
- primary model、contrasts 與 covariates。
- multiplicity 控制。
- assumption checks 與 sensitivity analyses。

Lakens（2022）指出，樣本數可以依精確度、最小效果、資源限制、期望效果或其他明確目標決定；關鍵是說明理由，而不是只使用慣例數字。

若分析計畫改變，應在 deviation log 記錄時間、原因、是否在看過結果後決定，以及對結論的影響。

## Stage 2：immutable raw data 與資料契約

原始資料設定為 read-only，所有更動由程式產生。資料契約至少包括：

| Field | Type | Unit | Allowed values | Missing code | Derivation |
|---|---|---|---|---|---|
| participant_id | string | — | unique | none | source |
| vo2peak | float | mL/kg/min | plausible range defined in protocol | NA | device output/QC |
| rt_ms | float | ms | task-specific window | NA | raw seconds × 1000 |
| rmssd | float | ms | > 0 after artifact QC | NA | validated NN intervals |

資料版本可以用 checksum、release ID 或不可變路徑記錄。任何手動修正都要進入 correction table，而不是直接覆蓋 cell。

## Stage 3：資料品質與盲化檢查

先檢查 structure，再看研究效果：

1. schema、型態、單位與唯一鍵。
2. join 前後列數與 unmatched IDs。
3. 缺失模式與各階段樣本數。
4. impossible values 與重複紀錄。
5. 時間順序、裝置時區與同步。
6. signal-specific quality flags。

對 PPG/HRV，需另記錄 motion artifact、偵測失敗、有效 BBI 比例、量測長度、姿勢與呼吸；對 EEG，需記錄壞頻道、濾波、重參考、ICA 決策與 epoch rejection。AI 可執行規則，但不能從沒有 waveform 的 summary CSV 判定訊號品質。

## Stage 4：探索性分析與正式分析隔離

EDA 的目的是發現資料結構與錯誤，不應無痕地改寫主要假設。建議分開：

```text
notebooks/eda/            # 探索，不產生正式數字
src/confirmatory/         # 依計畫執行
src/sensitivity/          # 替代規格
outputs/confirmatory/     # 正式表圖
outputs/exploratory/      # 明確標示探索
```

如果 EDA 發現偏態而改用 robust model，應說明這是預定決策規則或事後調整，而不是把結果重新包裝成原先計畫。

## Stage 5：模型選擇與診斷

模型選擇至少對應以下資訊：

- outcome distribution 與 link function。
- independent、paired、clustered 或 repeated observations。
- fixed/random effects 與階層。
- covariate 的時序與因果角色。
- nonlinear relation 與 interaction 是否事前指定。
- residual、influence、convergence 與 collinearity diagnostics。

AI 應輸出「為何選擇」與「什麼條件下不適用」，而不只是程式碼。診斷失敗時，優先檢查資料與模型規格，不應只為得到 p < .05 不斷更換方法。

## Stage 6：效果估計、區間與不確定性

Wasserstein 與 Lazar（2016）及 Greenland 等人（2016）都反對把 p 值當成單一科學裁決。報告應綁定：

```text
estimate + confidence/credible interval + units + analysis population
+ model specification + assumptions + missingness + multiplicity
```

例如「β = −8.4 ms per 5 mL/kg/min VO₂peak, 95% CI [−14.2, −2.6]」比「達顯著」提供更多資訊。若區間很寬，應承認不精確；若要主張等效或最小重要差異，需要事先定義 margin。

## Stage 7：敏感度分析

根據實際風險選擇，而不是排列所有可能模型：

- 不同合理 outlier rule。
- complete-case 與適當 missing-data 方法。
- participant-level summary 與 trial-level mixed model。
- 含／不含有爭議 covariate。
- 對 HRV 進行平均心率或量測品質相關調整。
- 對多重比較採用不同控制策略。

主要結論若只在單一任意規格成立，應降低確定性。

## Stage 8：可重現 pipeline

Sandve 等人（2013）建議記錄每項結果如何產生、避免手動步驟、保存程式與中間結果。實作上可設計一個命令：

```bash
python src/run_pipeline.py --config configs/main.yaml
```

並產生：

```text
run_manifest.json
├─ input_hash
├─ git_commit
├─ environment
├─ parameters
├─ exclusions
├─ sample_counts
└─ output_hashes
```

圖表與 APA 報告文字應從同一個結果物件產生，降低手動複製造成的不一致。

## Stage 9：AI 的受控介入點

| AI action | Required input | Required output | Verification |
|---|---|---|---|
| 選擇候選模型 | design schema、estimand | 候選與排除理由 | 統計專業審查 |
| 產生清理程式 | data dictionary、規則 | deterministic code、tests | 列數與例外案例 |
| 解釋結果 | verified result object | bounded prose | 數字一致性與因果語氣 |
| 找文獻 | search contract | DOI/PMID/URL | 資料庫解析與全文定位 |
| 修改 repo | clean status、scope | diff、tests、commit | code review 與遠端核對 |

任何 AI 產出的 simulated value、example code 與真實結果必須清楚分開。若 AI 無法存取必要資料，就應輸出 `unknown`，不能補出合理數字。

## Stage 10：release checklist

- 研究問題與 estimand 一致。
- 每個圖表數字可回到 result object。
- 主要與探索性分析明確標示。
- 樣本數在流程各階段一致。
- exclusions、missingness 與 sensitivity 有紀錄。
- DOI 與引用支持逐項確認。
- repo 不含 token、個資與未授權 PDF。
- README 提供最小重跑方式。
- 公開限制與資料取得條件清楚。

## 參考文獻（APA 7th）

Greenland, S., Senn, S. J., Rothman, K. J., Carlin, J. B., Poole, C., Goodman, S. N., & Altman, D. G. (2016). Statistical tests, p values, confidence intervals, and power: A guide to misinterpretations. *European Journal of Epidemiology, 31*(4), 337–350. https://doi.org/10.1007/s10654-016-0149-3

Lakens, D. (2022). Sample size justification. *Collabra: Psychology, 8*(1), Article 33267. https://doi.org/10.1525/collabra.33267

Munafò, M. R., Nosek, B. A., Bishop, D. V. M., Button, K. S., Chambers, C. D., Percie du Sert, N., Simonsohn, U., Wagenmakers, E.-J., Ware, J. J., & Ioannidis, J. P. A. (2017). A manifesto for reproducible science. *Nature Human Behaviour, 1*, Article 0021. https://doi.org/10.1038/s41562-016-0021

Nosek, B. A., Ebersole, C. R., DeHaven, A. C., & Mellor, D. T. (2018). The preregistration revolution. *Proceedings of the National Academy of Sciences, 115*(11), 2600–2606. https://doi.org/10.1073/pnas.1708274114

Sandve, G. K., Nekrutenko, A., Taylor, J., & Hovig, E. (2013). Ten simple rules for reproducible computational research. *PLOS Computational Biology, 9*(10), e1003285. https://doi.org/10.1371/journal.pcbi.1003285

Wasserstein, R. L., & Lazar, N. A. (2016). The ASA statement on p-values: Context, process, and purpose. *The American Statistician, 70*(2), 129–133. https://doi.org/10.1080/00031305.2016.1154108

Wilson, G., Bryan, J., Cranston, K., Kitzes, J., Nederbragt, L., & Teal, T. K. (2017). Good enough practices in scientific computing. *PLOS Computational Biology, 13*(6), e1005510. https://doi.org/10.1371/journal.pcbi.1005510

---

本文提供研究流程框架，不替代領域統計諮詢、研究倫理審查或資料管理計畫。正式分析必須以實際 protocol、資料結構與診斷結果為準。
