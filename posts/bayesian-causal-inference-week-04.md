<!-- SIMPLE -->
# 貝氏因果推論學習筆記 04：只靠隨機分派，如何得到精確 p 值？

> **每週課程紀錄｜2026/10/13**
> 這週進入 Fisher 隨機化檢定：不先假設結果服從常態分布，而是回到實驗「原本如何隨機分派」。

[回到統計學習地圖](#/learning/statistics) · [上一篇：二元結果、SUTVA 與因果圖](#/post/bayesian-causal-inference-week-03)

## 把實驗重新洗牌

想像一項運動介入研究，把受試者隨機分成運動組與控制組。研究完成後，兩組認知分數不同。Fisher 的問題是：如果運動對每一個人其實都完全沒有影響，光靠當初的隨機分派，出現目前這麼大差異的機率有多高？

做法像把組別標籤重新洗牌，但每一次洗牌都必須遵守原始實驗設計。例如原本固定 10 人運動、10 人控制，重抽時仍要保持 10 比 10。

## 什麼是「嚴格虛無假設」？

Fisher sharp null 假設處置對每位受試者都沒有影響：

<div class="article-equation">H₀ᶠ: Yᵢ(1) = Yᵢ(0)，對所有 i</div>

它比「平均效果為零」更強。平均效果為零仍可能有人受益、有人變差；sharp null 則說每個人的效果都是零。

強假設帶來一個重要優點：在虛無假設下，我們可以用已觀察結果補齊每個人的另一個反事實，然後對所有合法分派重新計算統計量。

## p 值從哪裡來？

1. 計算實際資料的統計量，例如兩組平均差。
2. 依原始隨機化規則重新分派組別。
3. 每次重分派都重新計算統計量。
4. 看有多少次結果至少和實際觀察一樣極端。

因此，這個 p 值的參考分布來自研究設計，而不是先假設母體一定常態。這並不表示方法「沒有任何假設」；它仍要求隨機分派機制清楚且真正被遵守。

## 組合太多怎麼辦？

樣本增加後，所有合法分派可能多到無法逐一列舉。此時可隨機抽取大量合法分派，用蒙地卡羅方法近似 p 值。抽取次數愈多，模擬誤差通常愈小；分析時應記錄亂數種子與抽樣次數，讓結果可以重現。

## 選哪一個統計量？

- 平均差：對位置平移直觀，但可能受極端值影響。
- Studentized statistic：把效果與標準誤一起考慮。
- Wilcoxon rank-sum：著重排序，對極端值較不敏感。
- Kolmogorov–Smirnov：可偵測整體分布形狀差異。

不能看完資料後挑出 p 值最小的那一個，卻把它當作唯一事先規劃的分析。比較安全的做法是事前指定主要統計量、進行多重比較校正，或把「挑選規則」本身也納入整個隨機化流程。

## 這能回答所有問題嗎？

不能。Fisher randomization test 很適合回答「這組資料與完全無個體效果是否相容」，但單一 p 值不會告訴我們效果多大、個體差異如何，也不能取代信賴區間或後驗分布。研究報告仍應呈現效果估計、分布與研究限制。

## 本週帶走的重點

隨機化不是資料收完後的裝飾，而是推論的來源。分析必須尊重真實 assignment mechanism；如果原本有區組、固定組別人數或不等分派機率，重新抽樣也必須照同一套規則。

## 課程來源與延伸閱讀

- Chang, M.-C. (2026, October 13). *Complete randomized experiments and Fisher randomization tests* [Course lecture and recordings]. National Central University.
- Ding, P. (2024). *A first course in causal inference*. Chapman and Hall/CRC. [https://arxiv.org/abs/2305.18793](https://arxiv.org/abs/2305.18793)
- Wu, J., & Ding, P. (2021). Randomization tests for weak null hypotheses in randomized experiments. *Journal of the American Statistical Association, 116*(536), 1898–1913. [https://arxiv.org/abs/1809.07419](https://arxiv.org/abs/1809.07419)

> 本文依課程講義、錄音與作業整理，不是課程逐字稿。檢定結果必須和原始隨機化設計一起解讀。

<!-- PROFESSIONAL -->
# 貝氏因果推論學習筆記 04：Fisher 隨機化檢定、Sharp Null 與統計量選擇

[回到統計學習地圖](#/learning/statistics)

## 1. 設計型推論的起點

在有限母體觀點下，潛在結果表視為固定，隨機性來自指派向量 `Z`。完全隨機化實驗固定處置組人數 `n₁`，合法指派共有：

<div class="article-equation">M = C(n, n₁)</div>

在 CRE 下，每一合法向量等機率；若實驗使用其他設計，機率權重也必須改用該設計的 `P(Z=z)`。

## 2. Fisher sharp null

<div class="article-equation">H₀ᶠ: Yᵢ(1) = Yᵢ(0)，∀i</div>

由於 sharp null 可補齊所有缺失潛在結果，任一候選指派 `z` 下的統計量 `T(z,Y)` 都可被計算。單側隨機化 p 值可寫成：

<div class="article-equation">pᶠʳᵗ = Σ_z P(Z=z) I{T(z,Y) ≥ Tobs}</div>

在 CRE 中，這等同極端指派數除以全部合法指派數。其 exactness 來自已知 assignment mechanism，而不是 outcome distribution 的參數假設。

## 3. Monte Carlo approximation

當 `M` 太大時，從 `P(Z)` 抽取 `R` 個合法指派，計算：

<div class="article-equation">p̂ = [1 + Σᵣ I{Tᵣ ≥ Tobs}] / (R + 1)</div>

加一修正可避免有限次模擬得到零 p 值。應報告 `R`、亂數種子、雙尾定義與重抽樣限制，並確認抽樣器尊重原始區組或不等機率設計。

## 4. Test statistic 對 alternative 的敏感性

平均差、studentized statistic、rank statistic 與 KS statistic 對不同 alternative 有不同 power。統計量應依研究問題、尺度與預期偏離形式預先選擇，而不是依觀察資料挑選最有利結果。

若分析同時考察多個統計量，可：

- 事前指定 primary statistic；
- 使用 Bonferroni 等 multiplicity correction；
- 定義 combined statistic，例如每次合法分派皆重新執行同一個選擇程序，使資料依賴選擇被納入 reference distribution。

## 5. Sharp null 與 weak null 不同

Fisher sharp null 要求所有 unit-level effects 為零；Neyman weak null 通常只限制平均效果為零。一般 FRT 對 sharp null exact，不代表對任意 weak null 與異質效果都能直接維持相同型一錯誤性質。後續需要 studentization、漸近理論或其他方法處理。

## 6. 報告建議

完整報告至少包含：randomization design、合法 assignment space、統計量、單尾或雙尾規則、exact enumeration 或 Monte Carlo 次數、效果估計，以及 sharp null 與研究問題的對應限制。

## 課程來源與參考文獻

- Chang, M.-C. (2026, October 13). *Complete randomized experiments and Fisher randomization tests* [Course lecture and recordings]. National Central University.
- Ding, P. (2024). *A first course in causal inference*. Chapman and Hall/CRC. [https://arxiv.org/abs/2305.18793](https://arxiv.org/abs/2305.18793)
- Wu, J., & Ding, P. (2021). Randomization tests for weak null hypotheses in randomized experiments. *Journal of the American Statistical Association, 116*(536), 1898–1913. [https://arxiv.org/abs/1809.07419](https://arxiv.org/abs/1809.07419)

> **範圍聲明：**本文為課程學習紀錄。FRT 的有效性取決於正確的 assignment mechanism；不能把一般置換操作一律稱為設計型隨機化推論。
