<!-- SIMPLE -->
# 貝氏因果推論學習筆記 05：隨機化不只是抽籤——從估計目標到區組設計

> **每週課程紀錄｜2026/10/16**
> 這週把「怎麼分組」和「想估計什麼」接在一起：隨機化的核心不是每個人機率都一樣，而是研究者事先知道並遵守分派機制。

[回到統計學習地圖](#/learning/statistics) · [上一篇：Fisher 隨機化檢定](#/post/bayesian-causal-inference-week-04)

## 好心分組，為什麼可能造成偏差？

假設醫師把看起來最可能受益的人優先安排治療。這在臨床直覺上可能合理，但治療組與對照組從一開始就不同。最後的兩組平均差混合了治療效果與選擇機制，不能只靠增加樣本數消除。

因此，要解讀效果，必須先問：每位受試者如何進入某一組？哪一些分派向量可能出現？機率是否已知？

## Estimand 和 estimator 不一樣

- **Estimand**：科學上真正想知道的量，例如這群人的平均處置效果。
- **Estimator**：用觀察資料估計該目標的計算規則，例如處置組平均減對照組平均。
- **Estimate**：把這次資料放進 estimator 後得到的數值。

先把問題寫成 estimand，才能判斷某個 estimator 是否對應研究問題。若關心中位數效果、受益比例或個體異質性，單純比較平均數可能不是同一件事。

## 為什麼平均效果比較容易估？

每位受試者只能看到 `Y(1)` 或 `Y(0)`，所以個人的兩個潛在結果如何配對，也就是聯合分布，無法從單次平行組試驗直接觀察。

平均因果效果只需要兩個邊際平均：所有人的 `Y(1)` 平均與 `Y(0)` 平均。隨機化能讓兩個觀察組提供這些邊際平均的資訊，卻不能還原某一位受試者缺少的反事實。

## CRE 和 Bernoulli 隨機化

- **完全隨機化（CRE）**：先固定處置組與控制組人數，再隨機決定誰進哪一組。
- **Bernoulli 隨機化**：每個人獨立以某個機率接受處置，因此最後組別人數本身也是隨機的。

兩者都是隨機化，但 assignment space 不同。分析與重抽樣必須配合真正採用的設計。

## 不等機率時不能直接平均

隨機化不代表所有人接受處置的機率相同。若不同受試者的機率 `eᵢ` 不同，觀察樣本會過度代表高機率者。Horvitz–Thompson estimator 以機率倒數加權，補償這種不均衡：

<div class="article-equation">τ̂HT = (1/n) Σᵢ [ZᵢYᵢobs/eᵢ − (1−Zᵢ)Yᵢobs/(1−eᵢ)]</div>

這個公式的重點不是背誦，而是提醒：估計方式必須尊重設計中每個觀察被看見的機率。

## 區組設計：先處理已知差異

若基線能力、年齡或疾病程度很重要，可以先把相似受試者分在同一區組，再於各區組內隨機分派。這通常能降低嚴重不平衡的機會，並提高精確度。

若原始研究在區組內分派，隨機化檢定也只能在各區組內重新洗牌。忽略區組、把所有標籤混在一起，等於分析了一個沒有真正執行過的實驗。

## 對我的研究有什麼提醒？

設計運動介入時，我需要在分析前寫清楚：

1. 主要 estimand 是全體平均效果，還是特定族群效果？
2. 分派是否依年齡、性別、基線認知或心肺適能區組？
3. 實際執行是否偏離原先 assignment mechanism？
4. 缺失、退出與遵從性是否改變目標效果？
5. 分析程式的重抽樣與標準誤是否符合設計？

## 本週帶走的重點

因果推論不是看到資料後才開始。Estimand、assignment mechanism 與 estimator 必須彼此對齊；隨機化的價值來自已知設計，而區組、機率與限制都必須完整保留到分析階段。

## 課程來源與延伸閱讀

- Chang, M.-C. (2026, October 16). *Randomization mechanisms, Neymanian inference, and blocking* [Course lecture and recordings]. National Central University.
- Ding, P. (2024). *A first course in causal inference*. Chapman and Hall/CRC. [https://arxiv.org/abs/2305.18793](https://arxiv.org/abs/2305.18793)

> 本文依課堂錄音、作業與講義整理，不是課程逐字稿；公式應連同分派機制與適用條件一起使用。

<!-- PROFESSIONAL -->
# 貝氏因果推論學習筆記 05：Estimand、Assignment Mechanism 與 Design-Based Estimation

[回到統計學習地圖](#/learning/statistics)

## 1. Estimand 先於 estimator

Estimand 是由科學問題定義的目標量；estimator 是觀察資料的函數。以 finite-population average treatment effect 為例：

<div class="article-equation">τ = (1/n) Σᵢ [Yᵢ(1) − Yᵢ(0)]</div>

在適當隨機設計下，difference-in-means 可估計此線性 estimand。但 median of individual effects 與 difference in medians 一般不相等；非線性 estimand 不能直接套用平均效果的推理。

## 2. Marginal 與 joint information

ATE 僅依賴 `Y(1)` 與 `Y(0)` 的兩個 marginal means。個體效果分布與精確的 `S²(τ)` 則需要同一單位兩個潛在結果的 joint pairing。平行組試驗能由隨機化辨識邊際平均，卻無法辨識未觀察的 joint association。

因此，Neyman variance：

<div class="article-equation">Var(τ̂) = S²(1)/n₁ + S²(0)/n₀ − S²(τ)/n</div>

含有不可直接識別的 `S²(τ)`。忽略最後一項所得的常見變異數估計通常保守；效果異質性與 joint structure 仍是推論限制。

## 3. CRE、BRE 與條件關係

CRE 固定 `ΣZᵢ=n₁`，在合法向量上進行隨機化。Bernoulli randomization 則令各 `Zᵢ` 獨立服從 Bernoulli 分布，使處置人數為隨機變數。在給定實際處置人數的條件下，特定等機率 BRE 可與 CRE 的條件分布對應，但兩者原始 assignment mechanisms 仍不同。

## 4. General randomization 與 Horvitz–Thompson

若個體處置機率 `eᵢ=P(Zᵢ=1)` 已知且不相等，可用：

<div class="article-equation">τ̂HT = (1/n) Σᵢ {ZᵢYᵢobs/eᵢ − (1−Zᵢ)Yᵢobs/(1−eᵢ)}</div>

因 `E[ZᵢYᵢ(1)/eᵢ]=Yᵢ(1)`，對照項亦然，故在指定設計下 `E_Z(τ̂HT)=τ`。這是 design unbiasedness；不表示單次 estimate 沒有變異，也不消除 outcome missingness 或執行偏差。

## 5. Blocking 是 restricted randomization

區組設計先依 pre-treatment covariates 建立 strata，再在各 block 內隨機化。其目的包括提高基線平衡與估計精確度。分析時應：

- 以 block-specific effects 依設計權重彙整；
- 於 block 內進行 randomization resampling；
- 使用與設計相容的標準誤；
- 報告區組變項、各區組分配規則與偏離情形。

## 6. 從設計到分析的對齊表

| 問題 | 必須記錄的資訊 |
|---|---|
| 想估計什麼？ | estimand、目標族群、時間點、結果尺度 |
| 如何分派？ | assignment probabilities、限制、區組與層化 |
| 如何估計？ | estimator、權重、標準誤與重抽樣規則 |
| 能推論到哪裡？ | finite／superpopulation、納入條件與外推限制 |

## 7. 與 Bayesian inference 的關係

Bayesian analysis 可以對未知潛在結果、參數與 treatment-effect heterogeneity 建模；design information 仍應進入 likelihood、prior interpretation 或 posterior predictive checks。若模型忽略真正的 assignment mechanism，再完整的 posterior computation 也不會自動恢復設計型因果解釋。

## 課程來源與參考文獻

- Chang, M.-C. (2026, October 16). *Randomization mechanisms, Neymanian inference, and blocking* [Course lecture and recordings]. National Central University.
- Ding, P. (2024). *A first course in causal inference*. Chapman and Hall/CRC. [https://arxiv.org/abs/2305.18793](https://arxiv.org/abs/2305.18793)

> **範圍聲明：**本文為設計型因果推論的學習紀錄。實際分析須依研究方案、assignment log、缺失機制與 estimand 選擇相符的方法。
