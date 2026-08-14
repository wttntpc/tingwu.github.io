<!-- SIMPLE -->

一項研究得到 `p < .05`，只能說資料與指定的虛無假設較不相容，不能回答「差異有多大」「估計有多準」或「這個差異是否值得在意」。要回答這些問題，需要把**效果量、信賴區間與樣本數規劃**放在一起看。

> 本文是「數據整理與統計分析」系列第 4 篇。重點不是追求最大的效果，而是事先定義值得回答的問題，並收集足以提供有用精確度的資料。

## 效果量回答「差多少」

效果量可分成兩種：

- **原始效果量**：保留研究單位，例如反應時間減少 25 ms、VO₂peak 增加 2.4 mL·kg⁻¹·min⁻¹。
- **標準化效果量**：把差異除以某種變異尺度，例如 Cohen’s d、Hedges’ g 或相關係數 r。

若原始單位容易理解，通常應優先報告。標準化效果適合跨量表比較或統合分析，但其大小會受分母、研究族群變異與設計影響，不能把 `d = 0.5` 自動解讀成任何領域都「中等且重要」。

## 信賴區間回答「有多不確定」

以下皆為虛構示例。假設運動介入後，認知分數的組間平均差是 3 分：

| 結果 | 可以怎麼理解 |
|---|---|
| 3 分，95% CI [2, 4] | 估計相對精確，與零差異不相容 |
| 3 分，95% CI [−5, 11] | 估計不精確，重要好處、無差異與可能壞處都不能排除 |
| 3 分，95% CI [1, 5]，重要門檻為 8 分 | 可能統計顯著，但仍低於事前定義的實務重要程度 |

95% CI 不是「真實效果有 95% 機率位於這個區間」。較精確的頻率學派解讀是：若不斷重複相同程序，所建構的區間長期約有 95% 會涵蓋真實參數。

## 先定義最小值得在意的效果

樣本數規劃不能只說「前人都收 30 人」。應先思考 smallest effect size of interest（SESOI）：小於多少的差異，即使存在也不會改變理論或實務決策？

SESOI 可以來自：

- 臨床或運動實務上的最小重要改變；
- 測量工具能可靠辨識的差異；
- 理論預測或資源效益門檻；
- 高品質先前研究與統合分析；
- 利害關係人的決策需求。

不能等看完結果後，再把剛好觀察到的效果定義成「重要」。

## 樣本數不是只有 power analysis 一種理由

Lakens（2022）整理多種樣本數論證方式，包括：

1. 幾乎涵蓋完整且有限的母體；
2. 受資源限制，並誠實評估可回答的範圍；
3. 事前檢定力分析；
4. 規劃估計精確度，例如目標 CI 寬度；
5. 採用有明確來源與限制的經驗法則；
6. 明確承認沒有充分的樣本數理由。

其中經驗法則或沒有充分理由通常較弱，但透明揭露仍比事後虛構理由更好。

所以「樣本數越大越好」不是完整答案。樣本數要和研究目標、設計、預期變異、流失、重複測量相關與多重結果一起規劃。

## Power 不是研究為真的機率

若設定 80% power，意思是：假設指定的母體效果真的存在，且模型條件成立，長期重複研究時約有 80% 能依規則檢出。它不是：

- 這項研究有 80% 機率正確；
- 顯著結果有 80% 機率是真的；
- 不顯著結果有 20% 機率是假陰性。

研究完成後，也不建議用同一份資料的觀察效果計算 observed post-hoc power 來解釋 p 值，因為它通常只是把原結果重新編碼。

## 建議一起報告

```text
實際分析 N
＋ 每組描述統計
＋ 原始尺度效果
＋ 明確命名的標準化效果量
＋ 95% CI
＋ 確切 p 值
＋ 事前定義的重要效果門檻
＋ 樣本數規劃依據
```

### 延伸閱讀

- [統計不顯著後，要算 Post-hoc Power 嗎？](#/post/post-hoc-power-confidence-interval)
- [我的 Statistics and Research Methods NotebookLM](https://notebook.google.com/notebook/14a8e333-8feb-462f-b7e3-54d36eef200a)

<!-- PROFESSIONAL -->

效果估計、區間估計與樣本數論證應共享同一個 estimand。若研究的主要問題是組間平均改變差，效果量、CI 與 power／precision calculation 都應對應相同的設計、對比與變異結構，而不是各自使用軟體最容易輸出的指標。

## 原始效果與標準化效果

對兩組平均數而言，常見原始效果為：

```text
Δ = mean₁ − mean₂
```

標準化平均差則以某種標準差作為分母。Cohen’s d 與 Hedges’ g 的差別之一，是後者加入小樣本偏差校正。配對設計還可能以差值標準差、原始分數標準差或其他分母標準化，因此只寫 `d` 不足以重現或比較結果。

Lakens（2013）建議清楚報告效果量的定義與計算方式。跨研究比較時，研究族群越異質，標準差可能越大，即使原始差異相同，標準化效果也可能變小。因此：

- 實務可解讀時優先保留原始尺度；
- 標準化效果需命名版本與分母；
- 不以固定 small／medium／large 門檻取代領域意義；
- 效果量也要附不確定性區間。

## CI 是相容範圍，不是二元檢定附件

CI 可協助判斷資料能否區分：

- practically important benefit；
- effects close to zero；
- practically important harm。

區間很窄且落在預先定義的等效界線內，與「不存在重要差異」相容；但若要正式主張等效，仍需依預先規劃的 equivalence design 與相應檢定。區間很寬時，結論應是 imprecise／inconclusive，而非 negative study。

Cumming（2014）主張以 estimation、CI、replication 與 meta-analytic thinking 補足只依賴 NHST 的研究文化。這不代表 CI 不受模型假設與選擇性分析影響；若分析流程偏誤，漂亮的區間仍可能精確地估計錯誤目標。

## 事前樣本數規劃的輸入

傳統 a priori power analysis 至少需要：

```text
研究設計與主要檢定
α 與單／雙尾設定
目標 power
具有理據的母體效果或 SESOI
變異、相關、ICC 或事件率等設計參數
預期流失、缺失與不遵從
多重主要結果或比較策略
```

最不穩定的輸入通常是預期效果。直接採用一篇小型先導研究的 observed effect，容易因抽樣誤差與出版偏差高估效果，進而低估所需樣本。應優先使用實務門檻、保守情境、統合證據或一段合理效果範圍，並做 sensitivity analysis。

## Power-based 與 precision-based planning

Power-based planning 問的是：「若指定效果存在，設計以既定規則檢出的長期機率是多少？」Precision-based planning 則問：「為了讓 CI 寬度小到能支持決策，需要多少資訊？」

若研究主要目標是估計 VO₂peak 平均改變，而不是做零假設拒絕決策，以目標 CI 寬度規劃可能更貼近問題。若目標是檢驗交互作用，則樣本數計算必須直接針對交互作用及其重複量測相關結構，不能以簡單兩組 d 代替。

## 固定樣本數時仍要誠實論證

受限於特定班級、罕見族群或設備容量時，樣本數可能先被資源決定。這不表示無法論證，而是應報告：

1. 可取得的最大 N 與限制來源；
2. 在多個合理效果下的 power sensitivity；
3. 最小可達顯著效果與預期 CI 精確度；
4. 哪些科學問題仍可回答，哪些不能；
5. 將分析定位為估計、探索、可行性或正式驗證。

Lakens（2022）強調，樣本數理由應服務於研究的推論目標，而不是套用單一慣例。

## 與 post-hoc power 的界線

合理的研究後分析包括以固定 N、α 與目標 power 計算 detectable effect，或描述不同假設效果下的敏感度。問題出在把同一資料的 observed effect 帶回公式，計算 observed power，再用它解釋同一個 p 值。詳細區分可見[事後檢定力專文](#/post/post-hoc-power-confidence-interval)。

## 報告範本

> 本研究的主要 estimand 為組間平均改變差。樣本數於收案前依事先定義的最小重要差異、預期變異、雙尾 α、目標 power、前後測相關及預期流失規劃。結果將報告原始平均差、Hedges’ g、各自的 95% CI、實際分析 N 與確切 p 值。所有輸入值與來源應依真實研究補入，不能以此範本代替分析紀錄。

## APA 7th 參考文獻

Cumming, G. (2014). The new statistics: Why and how. *Psychological Science, 25*(1), 7–29. https://doi.org/10.1177/0956797613504966

Greenland, S., Senn, S. J., Rothman, K. J., Carlin, J. B., Poole, C., Goodman, S. N., & Altman, D. G. (2016). Statistical tests, P values, confidence intervals, and power: A guide to misinterpretations. *European Journal of Epidemiology, 31*(4), 337–350. https://doi.org/10.1007/s10654-016-0149-3

Lakens, D. (2013). Calculating and reporting effect sizes to facilitate cumulative science: A practical primer for t-tests and ANOVAs. *Frontiers in Psychology, 4*, Article 863. https://doi.org/10.3389/fpsyg.2013.00863

Lakens, D. (2022). Sample size justification. *Collabra: Psychology, 8*(1), Article 33267. https://doi.org/10.1525/collabra.33267

## 素材來源說明

本文以我的 [Statistics and Research Methods NotebookLM](https://notebook.google.com/notebook/14a8e333-8feb-462f-b7e3-54d36eef200a) 作為知識整理起點，再依公開方法學文獻核對內容與引用。未上傳或公開 Notebook 中的私人教材檔案。
