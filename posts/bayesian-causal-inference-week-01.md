<!-- SIMPLE -->
# 貝氏因果推論學習筆記 01：兩組平均數不同，為什麼還不等於因果效果？

> **每週課程紀錄｜白話版**
> 這是我的貝氏因果推論學習系列第一篇。第一週還沒有急著套用 Bayes 公式，而是先建立因果推論的語言：如果我想說「某個介入造成了改變」，究竟需要比較什麼，又需要哪些研究設計與假設？

[回到統計學習地圖](#/learning/statistics) · [瀏覽數據分析文章](#/blog/data-analysis)

## 這週我想回答的三個問題

1. 為什麼看到兩組平均數不同，不能立刻說是治療造成的？
2. 「如果同一個人沒有接受這個介入，結果會怎樣？」為什麼是因果推論的核心？
3. 隨機分派、混淆變項與因果圖，分別在解決什麼問題？

## 從一個 TMS 研究問題開始

假設我想研究真正的經顱磁刺激（Active TMS）是否能改善記憶表現。我把刺激條件記為 `Z`，刺激後的記憶分數記為 `Y`：

- `Z = 1`：接受 Active TMS；
- `Z = 0`：接受 Sham TMS；
- `Y`：刺激後的記憶測驗分數。

最直覺的做法，是比較 Active TMS 組與 Sham TMS 組的平均分數。如果前者平均高 2 分，我能不能說「TMS 讓記憶增加 2 分」？答案取決於兩組為什麼會不同。

如果受試者是隨機分派，兩組在介入前較有機會保持可比；如果是受試者自行選擇，原本記憶能力、年齡、疾病嚴重度或參與動機都可能同時影響分組和結果。此時看到的差異可能混合了真正的治療效果與原先就存在的組間差異。

## 因果問題其實是在比較兩個世界

對同一位受試者 `i`，可以想像兩個潛在結果：

- `Yᵢ(1)`：這個人接受 Active TMS 時的記憶分數；
- `Yᵢ(0)`：同一個人接受 Sham TMS 時的記憶分數。

個人的因果效果可以寫成：

<div class="article-equation">τᵢ = Yᵢ(1) − Yᵢ(0)</div>

問題是，同一個人在同一個時間只能接受其中一種條件。我們可以看到 `Yᵢ(1)` 或 `Yᵢ(0)`，卻不能同時看到兩者。沒有被觀察到的那個結果，就是反事實（counterfactual）。

這讓我理解到：因果推論不是單純找出「誰的分數比較高」，而是在用研究設計與統計方法，估計那個永遠缺少一半的比較。

## 隨機分派做了什麼？

隨機分派不是保證每一次實驗的兩組都完全相同，也不是讓每一位受試者的反事實突然出現。它真正提供的是：在重複隨機分派的概念下，治療分配不再由受試者原本的特徵系統性決定。

因此，兩組平均值的差異可以用來估計平均因果效果：

<div class="article-equation">平均因果效果 = 平均的 Y(1) − 平均的 Y(0)</div>

簡單地說，隨機分派讓「拿不同的人互相比較」更接近「比較同一群人在兩種可能世界中的結果」。它是在平均層次解決問題，不是在個人層次重建不可觀察的結果。

## 相關、迴歸與因果不是同一件事

相關與迴歸很有用，但它們首先描述的是變項之間如何一起變動。即使迴歸模型寫成：

<div class="article-equation">Y = α + βZ + ε</div>

`β` 也不會因為出現在迴歸式中，就自動變成因果效果。當 `Z` 是二元分組時，`β` 等於兩組平均數之差；它究竟只是組間關聯，還是可以解釋成因果效果，取決於分派機制與研究假設。

同一個統計公式，可能有完全不同的科學意義。

## 混淆變項：一條讓比較失真的後門路徑

假設介入前的記憶能力 `X` 同時影響是否接受 TMS 與最後的記憶表現：

<div class="article-equation">Z ← X → Y</div>

此時 `X` 是混淆變項。若沒有處理它，`Z` 與 `Y` 的關係可能同時包含：

- TMS 對記憶的效果；
- 原本記憶能力造成的差異。

在觀察性研究中，我們常用迴歸調整、配對、傾向分數或加權，嘗試讓治療組與對照組在已觀察到的介入前變項上更可比。但這些方法不會憑空創造真正的隨機分派，也無法自動消除未量測的混淆。

## 不是變項放得愈多愈好

因果圖（DAG）提醒我，不同變項扮演的角色不同：

| 角色 | 結構 | 一般思考方向 |
|---|---|---|
| 混淆變項 | `Z ← X → Y` | 通常需要適當調整 |
| 中介變項 | `Z → M → Y` | 是否調整取決於要估計總效果或直接效果 |
| 碰撞變項 | `Z → C ← Y` | 通常不應任意調整，以免打開原本封閉的路徑 |

這修正了我以前「控制愈多變項，模型就愈嚴謹」的直覺。調整策略應該由因果問題與變項發生的時間順序決定，而不是把所有可取得的欄位一次塞進模型。

## 這和「貝氏」有什麼關係？

這一週的重點仍是因果問題與識別條件，而不是先驗分布或後驗分布。這個順序很重要：Bayesian 方法可以表達未知量的不確定性，也能對缺失的潛在結果建立模型；但再精緻的後驗分布，也不能替代不清楚的介入定義、錯誤的因果圖或無法辯護的識別假設。

我目前把它理解成兩個層次：

1. **先問因果效果能否被資料識別**：研究設計、交換性、一致性與正值性是否合理？
2. **再問如何估計不確定性**：在模型與先驗假設下，資料如何更新我們對因果效果的信念？

## 本週小練習

看到一項「有運動習慣者的 HRV 高於久坐者」的研究時，我會先寫下：

- `Z` 是什麼？運動介入，還是既有運動習慣？
- `Y` 是哪一個 HRV 指標，在哪個時間窗與姿勢量測？
- 哪些介入前變項可能同時影響運動習慣與 HRV？
- 我想估計的是這批受試者的效果，還是更大目標族群的效果？
- 資料支持的是關聯描述，還是有足夠設計與假設支持因果解釋？

## 我目前帶走的重點

因果推論不是把「相關」換成更複雜的統計模型，而是先清楚定義：介入、結果、比較對象、目標效果與使比較成立的條件。隨機分派能以設計建立可比性；觀察性研究則需要更多不可由資料單獨驗證的假設。第一週最重要的學習，不是記住某個公式，而是練習在分析以前先問：「我真正想比較的兩個可能世界是什麼？」

## 課程來源與查核說明

- 國立中央大學 NS5141 課程教材：*Bayesian Causal Inference: Introduction to Causal Thinking*（2026年9月15日）。
- 課堂錄音與補充教材：*Two-Sample Testing through Potential Outcomes & Observational Study Tools*。
- Ding, P. (2024). *A first course in causal inference*. Chapman and Hall/CRC. [https://arxiv.org/abs/2305.18793](https://arxiv.org/abs/2305.18793)

> 本文是依課堂教材與個人 NotebookLM 資料庫整理的原創學習筆記，不是課程逐字稿，也不能取代原始講義。NotebookLM 用於定位內容；公式、概念與例子仍以原始課程資料為主。尚未完成的理解會在後續文章持續修正。

<!-- PROFESSIONAL -->
# 貝氏因果推論學習筆記 01：潛在結果、隨機分派與因果識別

## 文章定位

本篇記錄課程第一階段的因果思考框架。核心不是立即建立 Bayesian model，而是先定義 estimand、釐清 observed association 與 causal effect 的差異，並辨認使因果效果可識別的研究設計與假設。

## 1. 潛在結果與基本問題

對受試者 `i`，令 `Zᵢ ∈ {0,1}` 表示治療分配，`Yᵢ(1)` 與 `Yᵢ(0)` 分別表示在治療與控制條件下的潛在結果。個體因果效果為：

<div class="article-equation">τᵢ = Yᵢ(1) − Yᵢ(0)</div>

觀察結果可寫成：

<div class="article-equation">Yᵢobs = ZᵢYᵢ(1) + (1 − Zᵢ)Yᵢ(0)</div>

由於每位受試者只能暴露於一種條件，另一個潛在結果無法同時觀察。因果推論的基本問題因此可視為 missing potential outcome problem。

## 2. Estimand：先定義要估計的平均效果

第一週先以這次實際納入的 `n` 位受試者為對象，將潛在結果視為固定，主要隨機性來自治療分派：

<div class="article-equation">τ = (1/n) Σᵢ [Yᵢ(1) − Yᵢ(0)]</div>

如何從有限母體推論到更大母體，是後續 9 月 22 日課程才正式展開的問題；屆時目標可寫成：

<div class="article-equation">PATE = E[Y(1) − Y(0)]</div>

這裡只先預告：兩種框架沒有孰優孰劣，而是回答不同推論範圍。第一週的核心仍是先把介入、潛在結果與平均因果效果定義清楚。

## 3. 隨機分派與 difference-in-means

在 complete randomization 下，若 treatment assignment 與 science table 無關，治療組與控制組平均數差：

<div class="article-equation">τ̂ = Ȳobs₁ − Ȳobs₀</div>

對分派機制取期望時可得到 `E_Z(τ̂) = SATE`。這表示 estimator 在重複隨機分派下以目標效果為中心，而不是宣稱單次實驗的估計值必然等於真實效果。

若每位受試者的分派機率 `πᵢ = P(Zᵢ = 1)` 已知但不相等，可使用與設計相符的 Horvitz–Thompson estimator：

<div class="article-equation">τ̂HT = (1/n) Σᵢ [ZᵢYᵢobs/πᵢ − (1−Zᵢ)Yᵢobs/(1−πᵢ)]</div>

這也說明：估計方法必須對應資料的 assignment mechanism。

## 4. 因果識別的基本條件

將觀察資料解釋為因果效果時，至少要明確討論：

1. **Exchangeability／unconfoundedness**：在無條件或給定介入前共變項 `X` 後，治療分派與潛在結果獨立。
2. **Consistency／SUTVA**：實際接受條件 `z` 時，觀察結果等於 `Y(z)`；同時需排除未定義的多種治療版本與不合理的單位間干擾。
3. **Positivity／overlap**：對目標族群中的相關 `X`，每種治療皆具有非零機率。

這些條件不是由顯著的 p 值或高模型配適度自動證明。它們必須由設計、測量、領域知識與敏感度分析共同辯護。

## 5. 同一個迴歸係數的兩種解釋

對二元 `Z` 擬合：

<div class="article-equation">Yᵢ = α + βZᵢ + εᵢ</div>

OLS 的 `β̂` 等於兩組觀察平均數之差。若沒有因果識別條件，它只描述 association；在適當的隨機化設計或可辯護的條件交換性下，才可能被賦予 causal interpretation。因果意義來自設計與假設，不是來自模型名稱。

## 6. 觀察性研究工具的共同限制

課程介紹的常見策略包括 outcome regression、matching、propensity-score stratification、inverse-probability weighting（IPW）與 doubly robust estimation。它們使用 `X` 的方式不同，但通常仍依賴 conditional exchangeability 與 overlap。

其中 doubly robust 的「雙重穩健」是指：在一般識別條件成立時，outcome model 或 propensity model 其中一個正確設定，估計量仍可能保持一致；它不代表可以抵抗未量測混淆，也不代表兩個模型皆可任意錯設。

若重要未量測混淆仍存在，可能需要 instrumental variables、regression discontinuity、natural experiments 或 sensitivity analysis 等不同策略。每種策略會引入新的、需要被清楚說明的識別假設。

## 7. DAG 對變項調整的提醒

- Confounder 是 treatment 與 outcome 的介入前共同原因，忽略可能產生偏差。
- Mediator 位於 `Z → M → Y` 的因果路徑上；是否調整取決於 estimand 是 total effect 或 direct effect。
- Collider 是兩個變項的共同結果；對 collider conditioning 可能打開原本封閉的非因果路徑。

因此，共變項選擇應由時間順序與因果結構主導，而不是以單變項顯著性、自動 stepwise selection 或「能取得多少就控制多少」決定。

## 8. 與 Bayesian 推論的銜接

Bayesian causal inference 可以對未知參數、缺失潛在結果與模型不確定性建立 posterior distribution，但須區分：

- **Identification**：若擁有無限資料，目標因果效果能否由觀察分布與假設決定？
- **Estimation**：在有限資料下，如何估計效果及其不確定性？

Prior 與 likelihood 可以幫助估計，卻不能自行修復不明確的 treatment、違反 positivity 的資料或未辯護的 causal structure。後續筆記再進一步記錄 Bayesian model 如何將先驗資訊與資料結合。

## 9. 後續每週筆記模板

往後每篇都固定回答六件事：

1. 本週科學問題與 estimand 是什麼？
2. 資料生成或 treatment assignment mechanism 是什麼？
3. 需要哪些 identification assumptions？
4. 模型、prior、likelihood 與 posterior 分別扮演什麼角色？
5. 哪些假設可診斷，哪些只能靠設計、知識或敏感度分析辯護？
6. 如何把方法連回認知神經科學、運動科學、EEG 或 HRV 的研究問題？

## 本週待釐清問題

- Finite-population 與 superpopulation 的 Bayesian 建模方式如何對應？
- Treatment effect heterogeneity 應如何進入 estimand 與階層模型？
- 在 propensity score 極端、overlap 不佳時，應改變 estimand、截尾權重，還是重新界定研究族群？
- Posterior uncertainty 與 identification uncertainty 應如何分開呈現？

## 課程來源

- Chang, M.-C. (2026, September 15). *Bayesian causal inference: Introduction to causal thinking* [Course slides]. National Central University.
- Chang, M.-C. (2026). *Two-sample testing through potential outcomes & observational study tools* [Course supplement]. National Central University.
- Ding, P. (2024). *A first course in causal inference*. Chapman and Hall/CRC. [https://arxiv.org/abs/2305.18793](https://arxiv.org/abs/2305.18793)

> **範圍聲明：**本文為學習紀錄，內容經個人理解重新組織，不是教師講義或錄音的完整重製。尚未回到正式出版品逐條驗證的歷史與文獻資訊，只作課程脈絡提示；研究或引用時應查閱原始來源。
