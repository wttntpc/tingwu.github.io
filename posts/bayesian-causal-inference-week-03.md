<!-- SIMPLE -->
# 貝氏因果推論學習筆記 03：從風險差到因果圖——哪些變數該控制？

> **每週課程紀錄｜2026/09/29**
> 這週從「兩組成功率差多少」一路走到「為什麼不能把所有變數都塞進迴歸」。真正的重點是：數字如何比較，取決於研究問題；變數是否調整，取決於因果位置。

[回到統計學習地圖](#/learning/statistics) · [上一篇：傾向分數](#/post/bayesian-causal-inference-week-02) · [下一篇：Fisher 隨機化檢定](#/post/bayesian-causal-inference-week-04)

## 同一份二元資料，可以有三種說法

當結果只有「有／沒有」兩類，例如有沒有收到面試邀請、運動介入後是否達到臨床改善，可以用三種常見尺度描述組間差異。

- **Risk difference（RD）**：兩組機率直接相減，回答「多了幾個百分點」。
- **Risk ratio（RR）**：兩組機率相除，回答「是幾倍」。
- **Odds ratio（OR）**：先比較每組成功與失敗的勝算，再把兩個勝算相除。

若處置組成功率是 20%，對照組是 10%，RD 是 10 個百分點、RR 是 2；OR 則是 `(0.20/0.80) ÷ (0.10/0.90) = 2.25`。三者都正確，但說的不是同一件事。只有結果很罕見時，OR 才可能接近 RR；常見結果若把 OR 說成風險倍數，容易誇大直覺差異。

## 履歷實驗：關聯數字如何連回研究設計？

[Bertrand 與 Mullainathan（2004）](https://doi.org/10.1257/0002828042002561) 在 4,870 份虛構履歷上隨機安排具有不同種族暗示的姓名；課堂以其中 2 × 2 表說明白人姓名組 235 份、非裔姓名組 157 份收到回覆，並比較 RD、RR 與 OR。由於姓名是在相同品質履歷間隨機配置，差異的因果解釋來自設計，而不只是 OR 大於 1。

Fisher 精確檢定則問：如果姓名與回覆完全無關，在固定表格邊際總數下，看到目前或更極端配置的機率多小？小 p 值表示資料與虛無假設不相容；大 p 值只代表證據不足，不能證明兩組完全一樣。

## 潛在結果：每個人都有兩個可能世界

令 `Yᵢ(1)` 表示第 i 個單位接受處置的結果，`Yᵢ(0)` 表示不接受處置的結果。個體因果效果是：

<div class="article-equation">τᵢ = Yᵢ(1) − Yᵢ(0)</div>

但同一單位在同一時點只能處於一種條件，因此只能觀察其中一個結果。觀察值可以寫成：

<div class="article-equation">Yᵢobs = ZᵢYᵢ(1) + (1−Zᵢ)Yᵢ(0)</div>

這也提醒我，「同一個人」不一定等於因果推論中的「同一個 unit」。若服藥前後隔了時間，疲勞、疾病歷程與環境都可能改變，不能直接把兩次結果當成同一時刻兩個平行世界。

## SUTVA：處置不能只寫成「有」或「沒有」

SUTVA 通常包含兩個核心要求：

1. **無干擾（no interference）**：別人的處置不會改變我的結果。
2. **處置版本一致**：同一個處置標籤不能暗中包含差異很大的版本。

例如「每週運動三次」仍不夠清楚：強度、時間、監督方式不同，可能是不同處置版本。團體運動還可能讓參與者彼此影響，違反無干擾。SUTVA 不是一句形式假設，而是要求研究者把介入與研究單位定義清楚。

## 哪些變數該控制？先畫因果圖

「變數愈多，模型愈完整」是危險直覺。

- **混淆變數（confounder）**：處置與結果的共同原因，通常需要適當調整。
- **對撞變數（collider）**：處置與結果的共同結果；控制它可能打開原本封閉的非因果路徑，製造偏差。
- **中介變數（mediator）**：位於處置到結果的因果路徑上。是否控制，取決於要估總效果還是直接效果。
- **工具變數（instrument）**：影響處置、但只透過處置影響結果的外生來源；還需要相關性、排除限制與獨立性等強假設。

以運動與情緒研究為例，基線健康可能同時影響運動參與和情緒，是候選混淆變數；運動後 HRV 可能是中介；只招募「完成全部課程的人」可能條件化在受運動與健康共同影響的變數上，形成選擇／對撞偏差。是否控制不能只靠相關係數，要先說清楚因果時間順序與估計目標。

## 本週帶走的重點

1. RD、RR、OR 是不同效果尺度，不能互換名稱。
2. 關聯量能否支持因果解釋，主要取決於設計與識別假設。
3. 潛在結果讓「反事實」被明確寫出來；SUTVA 要求處置與單位定義可辨認。
4. 混淆、對撞與中介的角色不同；不是所有可測量變數都該調整。
5. p 值大不代表虛無假設已被證明。

## 課程來源與延伸閱讀

- Chang, M.-C. (2026, September 29). *Binary outcomes, potential outcomes, and causal diagrams* [Course lecture and recordings]. National Central University.
- Bertrand, M., & Mullainathan, S. (2004). Are Emily and Greg more employable than Lakisha and Jamal? A field experiment on labor market discrimination. *American Economic Review, 94*(4), 991–1013. [https://doi.org/10.1257/0002828042002561](https://doi.org/10.1257/0002828042002561)
- Ding, P. (2024). *A first course in causal inference*. Chapman and Hall/CRC. [https://arxiv.org/abs/2305.18793](https://arxiv.org/abs/2305.18793)
- Greenland, S., Pearl, J., & Robins, J. M. (1999). Causal diagrams for epidemiologic research. *Epidemiology, 10*(1), 37–48. [https://pubmed.ncbi.nlm.nih.gov/9888278/](https://pubmed.ncbi.nlm.nih.gov/9888278/)

> 本文依 9 月 29 日三段課堂錄音與指定教材整理，不是逐字稿。私人錄音與完整教材不公開；研究應用仍須依實際設計、時間順序與可辯護的因果假設判斷。

<!-- PROFESSIONAL -->
# 貝氏因果推論學習筆記 03：Binary Outcomes、SUTVA 與 DAG-Based Adjustment

[回到統計學習地圖](#/learning/statistics) · [上一篇](#/post/bayesian-causal-inference-week-02) · [下一篇](#/post/bayesian-causal-inference-week-04)

## 1. Binary outcome 的效果尺度

令 `Z∈{0,1}` 為處置、`Y∈{0,1}` 為結果，並記 `p₁=P(Y=1|Z=1)`、`p₀=P(Y=1|Z=0)`：

<div class="article-equation">RD = p₁ − p₀；RR = p₁/p₀；OR = [p₁/(1−p₁)] / [p₀/(1−p₀)]</div>

RD 保留絕對風險尺度，適合轉譯為 absolute risk reduction 與 `NNT=1/|RD|`；RR 表示相對風險；OR 在 case-control sampling 與 logistic regression 中有特殊便利性，但只有 rare-outcome 條件下才近似 RR。報告時應同時說明基準風險，避免只呈現相對尺度。

## 2. Fisher exact test 的條件參考分布

在固定 2 × 2 表邊際總數下，左上格計數 `X` 於獨立虛無假設下服從超幾何分布：

<div class="article-equation">P(X=x) = C(m₁,x) C(N−m₁,n₁−x) / C(N,n₁)</div>

課堂以 [Bertrand 與 Mullainathan（2004）](https://doi.org/10.1257/0002828042002561) 的履歷田野實驗連結關聯尺度、Fisher exact test 與 assignment mechanism。檢定的因果意義不是由 2 × 2 表本身產生，而是由履歷條件的隨機配置與處置定義支持。

## 3. Potential outcomes 與觀察方程

個體效果為 `τᵢ=Yᵢ(1)−Yᵢ(0)`；觀察值則是：

<div class="article-equation">Yᵢobs = ZᵢYᵢ(1) + (1−Zᵢ)Yᵢ(0) = Yᵢ(0) + Zᵢτᵢ</div>

這個代數形式類似線性模型，但 `Yᵢ(0)` 與 `τᵢ` 是 unit-specific potential quantities，不等於自動滿足同質斜率的統計誤差模型。若 `Z ⟂ {Y(1),Y(0)}` 由隨機分派成立，difference in observed means 才能對應兩個潛在結果邊際平均的差。

## 4. SUTVA、consistency 與 well-defined intervention

課堂將 SUTVA 拆為 no interference 與處置版本一致。更一般地，consistency 要求當實際接受 `Z=z` 時，觀察結果等於相應潛在結果 `Y(z)`；這裡的 causal consistency 不等於估計量隨樣本增加而收斂的 statistical consistency。

對運動介入而言，頻率、強度、時間、類型、監督與依從性可能構成多個版本；群體課程、社會支持或資訊擴散則可能產生 interference。若這些機制存在，應重新定義 exposure mapping 或目標效果，而不是只把違反 SUTVA 當成討論段落的一句限制。

## 5. DAG 決定 adjustment set

以 `Z` 表示處置、`Y` 表示結果：

- Confounder：`Z ← X → Y`。需阻斷 backdoor path，但不表示所有 pre-treatment covariates 都必然需要納入。
- Collider：`Z → C ← Y`。未條件化時路徑封閉；調整 `C` 或其後代可能造成 collider stratification bias。
- Mediator：`Z → M → Y`。總效果分析通常不應把 `M` 當普通混淆變數調整；直接／間接效果需要額外識別假設。
- Instrument：`W → Z → Y`。除 relevance 外，還需 independence 與 exclusion restriction；2SLS 的可計算性不等於工具有效。

[Greenland、Pearl 與 Robins（1999）](https://pubmed.ncbi.nlm.nih.gov/9888278/) 說明 DAG 可把混淆選擇的結構假設明確化。DAG 不會從資料自動證明方向；它是把領域知識、時間順序與不可檢驗假設放到可批判圖形中的工具。

## 6. 2SLS 與 partial regression 的課堂連結

工具變數的兩階段最小平方法可概念化為：

<div class="article-equation">第一階段：Z = α₀ + α₁W + α₂X + e₁ → Ẑ</div>
<div class="article-equation">第二階段：Y = β₀ + β₁Ẑ + β₂X + e₂</div>

而控制 `X` 後 `Z` 與 `Y` 的 partial association，可由各自對 `X` 迴歸後殘差的關聯理解。這是線性投影的代數直覺，不能取代「X 為何應控制」的因果判斷。

## 7. 對研究設計的實作清單

1. 先定義 unit、treatment versions、outcome time 與 estimand。
2. 依領域知識畫出暫定 DAG，標記 pre-treatment 與 post-treatment variables。
3. 說明每一個 adjustment variable 阻斷哪一條 backdoor path。
4. 檢查 selection criteria、complete-case analysis 是否可能條件化在 collider。
5. 二元結果同時呈現絕對與相對尺度，並附基準風險與不確定性區間。
6. 將不能由資料檢驗的假設列入敏感度分析與限制。

## 課程來源與參考文獻

- Chang, M.-C. (2026, September 29). *Binary outcomes, potential outcomes, and causal diagrams* [Course lecture and recordings]. National Central University.
- Bertrand, M., & Mullainathan, S. (2004). Are Emily and Greg more employable than Lakisha and Jamal? A field experiment on labor market discrimination. *American Economic Review, 94*(4), 991–1013. [https://doi.org/10.1257/0002828042002561](https://doi.org/10.1257/0002828042002561)
- Ding, P. (2024). *A first course in causal inference*. Chapman and Hall/CRC. [https://arxiv.org/abs/2305.18793](https://arxiv.org/abs/2305.18793)
- Greenland, S., Pearl, J., & Robins, J. M. (1999). Causal diagrams for epidemiologic research. *Epidemiology, 10*(1), 37–48. [https://pubmed.ncbi.nlm.nih.gov/9888278/](https://pubmed.ncbi.nlm.nih.gov/9888278/)

> 範圍聲明：本文是課程學習筆記，不是完整的 DAG、mediation 或 IV 教科書章節。模型中「控制了很多變數」不能替代可辯護的因果結構、處置定義與研究設計。
