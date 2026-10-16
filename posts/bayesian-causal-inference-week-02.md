<!-- SIMPLE -->
# 貝氏因果推論學習筆記 02：沒有隨機實驗，傾向分數能幫上什麼忙？

> **每週課程紀錄｜2026/09/22**
> 這一週從隨機實驗走向觀察性資料：當研究者不能決定誰接受介入時，如何讓比較更公平？

[回到統計學習地圖](#/learning/statistics) · [上一篇：潛在結果與因果思考](#/post/bayesian-causal-inference-week-01)

## 先從運動與 HRV 的問題想起

假設資料顯示「有運動習慣的人 HRV 較高」。這是一個有用的觀察，卻不能直接證明運動造成 HRV 上升。經常運動的人可能同時較年輕、睡眠較佳、較少抽菸，或原本健康狀況就不同。這些介入前差異若同時影響運動習慣與 HRV，就是混淆。

真正的問題不是「能不能跑一個更複雜的模型」，而是：資料中是否存在背景足夠相近、但運動暴露不同的人，讓我們能建立合理比較？

## 傾向分數是在估計什麼？

傾向分數是某人在已知介入前特徵 `X` 下，接受處置的機率：

<div class="article-equation">e(X) = P(Z = 1 | X)</div>

它把年齡、性別、基線健康、既有疾病等多個共變項，整理成一個「在這些背景條件下接受介入的傾向」。接著可以配對、分層或加權，比較傾向分數接近的人。

但它不是把觀察研究瞬間變成隨機試驗。它只能處理模型中已測量、放入且處理合理的變項；沒有量到的混淆仍然存在。

## 兩個不能略過的條件

### 1. 條件交換性

在給定足夠的介入前共變項後，處置分派不再系統性地與潛在結果相關。白話說，就是同樣背景的人之間，誰接受介入不能還藏著另一個沒有處理的重要原因。

### 2. 重疊性

每一種納入研究的背景，都必須同時存在接受與未接受介入的可能。如果所有嚴重個案都接受治療、所有輕症都未接受，就沒有真正可比的對照。

<div class="article-equation">0 &lt; e(X) &lt; 1</div>

若傾向分數幾乎沒有重疊，硬做加權通常會產生極端權重。此時可能要限縮研究族群、改變目標效果或重新思考研究設計，而不是只更換統計軟體。

## 有限母體與超母體回答不同問題

- **有限母體觀點**：想知道這次納入的受試者，平均因果效果是多少；潛在結果視為固定，隨機性主要來自分派。
- **超母體觀點**：把樣本視為來自更大的族群，希望推論到未觀察的人；除了分派，也要處理抽樣與母體模型的不確定性。

所以「結果能不能外推」不是看到顯著 p 值就能回答。研究對象如何被招募、目標族群如何定義，和採用哪個模型一樣重要。

## 我會怎麼檢查一份傾向分數分析？

1. 變項是否都是介入前測量？
2. 是否解釋為什麼選擇這些混淆變項？
3. 配對或加權後，兩組共變項是否真的平衡？
4. 傾向分數分布是否有足夠重疊？
5. 是否檢查極端權重與結果對分析選擇的敏感度？
6. 結論是否承認未測量混淆仍可能存在？

## 本週帶走的重點

傾向分數不是因果保證書，而是建立可比性的工具。它的可信度取決於研究問題、變項時間順序、交換性與重疊性，以及平衡診斷是否充分。先判斷「誰能和誰比較」，再計算效果，會比先跑模型再找解釋可靠。

## 課程來源與延伸閱讀

- Chang, M.-C. (2026, September 22). *Bayesian causal inference* [Course lecture and recordings]. National Central University.
- Ding, P. (2024). *A first course in causal inference*. Chapman and Hall/CRC. [Author and book information](https://arxiv.org/abs/2305.18793)
- Rosenbaum, P. R., & Rubin, D. B. (1983). The central role of the propensity score in observational studies for causal effects. *Biometrika, 70*(1), 41–55. [https://doi.org/10.1093/biomet/70.1.41](https://doi.org/10.1093/biomet/70.1.41)

> 本文依課程講義、錄音與個人 NotebookLM 限定來源整理，不是課程逐字稿。因果結論仍須回到原始研究設計、資料與假設。

<!-- PROFESSIONAL -->
# 貝氏因果推論學習筆記 02：傾向分數、重疊性與推論範圍

[回到統計學習地圖](#/learning/statistics) · [上一篇](#/post/bayesian-causal-inference-week-01)

## 1. 從 assignment mechanism 到觀察性研究

令 `Z ∈ {0,1}` 為處置，`Y(1), Y(0)` 為潛在結果，`X` 為介入前共變項。隨機試驗由研究設計給定 `P(Z)`；觀察性研究的處置機制未知，且 `Z` 往往與 `X` 及潛在結果相關。未經設計或識別假設的兩組平均差，因此通常只是 association。

## 2. Propensity score 的角色

<div class="article-equation">e(X) = P(Z = 1 | X)</div>

Rosenbaum 與 Rubin 證明，在適當條件下，傾向分數是 balancing score：

<div class="article-equation">Z ⟂ X | e(X)</div>

實務上可用 matching、stratification、inverse-probability weighting 或 weighting for overlap 等方式建立加權後的偽母體。重點不在 propensity model 的分類準確率，而在加權或配對後的共變項平衡。

## 3. 識別條件

常見平均因果效果的識別需要：

1. **Consistency／well-defined treatment**：觀察到的結果與實際接受處置的相應潛在結果一致。
2. **Conditional exchangeability**：`{Y(1),Y(0)} ⟂ Z | X`。
3. **Positivity／overlap**：對目標族群內的 `X=x`，有 `0 < P(Z=1|X=x) < 1`。

這些條件不能僅由模型配適指標證明。交換性需要領域知識與測量設計辯護；positivity 則要同時檢查結構性違反與有限樣本中的實務違反。

## 4. 估計目標會改變權重

- ATE 權重：處置組約為 `1/e(X)`，對照組約為 `1/[1-e(X)]`。
- ATT 權重：以已接受處置者為目標族群。
- Overlap estimand：把重點放在兩組皆可能接受的共同支持區域。

當極端 propensity score 造成不穩定權重時，不能只機械式截尾；應說明截尾是否改變 estimand，以及新目標族群是誰。

## 5. Finite population 與 superpopulation

有限母體推論把目前 `n` 個單位的潛在結果視為固定，重點是 assignment mechanism 下的隨機性。超母體推論則把單位視為從某個生成分布抽樣而來，推論範圍超出目前樣本，因而需要額外的 sampling 與 model assumptions。

此差異會影響 estimand、標準誤及外推語言。針對研究內部受試者的設計式不偏估計，不能直接等同對其他年齡、疾病程度或場域的 population effect。

## 6. 分析報告最低要求

- 以 DAG、時間順序或領域知識說明共變項選擇；
- 報告處理前後 standardized mean differences，而非只報 p 值；
- 顯示 propensity score／權重分布與 common support；
- 診斷極端權重、effective sample size 與變異數估計；
- 進行不同模型、截尾規則及未測量混淆的敏感度分析；
- 使用符合 estimand 的效果與限制語言。

## 7. 與 Bayesian causal inference 的銜接

Bayesian model 可以對 outcome model、propensity model 或缺失潛在結果表達參數不確定性；但 posterior 不會自動建立 exchangeability 或 positivity。識別條件仍來自設計與科學假設。下一階段要繼續區分：哪些不確定性可由 posterior 描述，哪些是模型外的 identification uncertainty。

## 課程來源與參考文獻

- Chang, M.-C. (2026, September 22). *Bayesian causal inference* [Course lecture and recordings]. National Central University.
- Ding, P. (2024). *A first course in causal inference*. Chapman and Hall/CRC. [https://arxiv.org/abs/2305.18793](https://arxiv.org/abs/2305.18793)
- Rosenbaum, P. R., & Rubin, D. B. (1983). The central role of the propensity score in observational studies for causal effects. *Biometrika, 70*(1), 41–55. [https://doi.org/10.1093/biomet/70.1.41](https://doi.org/10.1093/biomet/70.1.41)

> **範圍聲明：**本文是個人學習紀錄，不是課堂教材的替代品。傾向分數方法不能排除未量測混淆，也不應單憑模型輸出宣稱因果。
