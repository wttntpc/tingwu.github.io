<!-- SIMPLE -->

研究結果跑出 `p > .05` 時，第一個直覺常是：「是不是樣本太少、檢定力不足？」於是把這次研究觀察到的效果量、樣本數與顯著水準放回軟體，算一個 **post-hoc power（事後檢定力、observed power）**。這個數字看似替不顯著結果補上解釋，實際上通常沒有提供新資訊。

> 一句話先記住：研究前用 power 規劃樣本數很重要；研究後用同一份資料的觀察效果量計算 observed power，通常是循環論證。

本文受到[陳柏威醫師〈當統計不顯著時，我該計算研究的檢力嗎？〉](https://drpwchen.com/posts/ebm-post-hoc-power-analysis/)啟發，並依方法學文獻重新整理成適合一般健康、運動與認知研究的判讀流程。

## Power 原本在回答什麼？

統計檢定力是：假設母體真的存在我們事先指定的效果，在目前研究設計與樣本數下，檢定能正確拒絕虛無假設的機率。常見的 80% power，意思不是「研究結果有 80% 機率是真的」，而是長期重複相同設計時，若指定效果確實存在，約有 80% 的研究會檢出它。

在收資料前，我們可以設定：

- 想偵測的最小重要效果；
- 顯著水準，例如 α = .05；
- 期望檢定力，例如 80% 或 90%；
- 研究設計與預期變異；

再估計需要多少受試者。這是合理的樣本數規劃。

## 為什麼 observed post-hoc power 幫助不大？

研究結束後，如果把「這次剛好觀察到的效果量」帶回 power 公式，p 值與 observed power 其實都由同一組資訊決定：效果估計、標準誤、樣本數及 α。因此，p 值較大時通常會得到較低的 observed power；p 值很小時則通常得到較高的 observed power。

這無法回答我們真正關心的問題：

1. 母體效果真的接近零；
2. 存在重要效果，但這次估計太不精確；
3. 真實效果比原先預期小；
4. 資料變異、遺漏或測量誤差降低了精確度。

低 observed power 只是在換一種方式重述「結果不顯著」，不能分辨以上情況。

## 改看效果量、95% 信賴區間與重要門檻

更實用的方法，是先定義 **最小重要效果**。臨床研究常稱為 MCID；其他領域可稱 SESOI（smallest effect size of interest）或最小實務重要差異。

假設運動介入對認知分數的「值得在意差異」設定為 ±5 分：

| 估計差異與 95% CI | 可以怎麼理解 |
|---|---|
| 1 分，95% CI [−2, 3] | 區間很窄且排除 ±5；資料與「沒有重要差異」相容，但若要正式主張等效，仍應做預先規劃的等效性檢定。 |
| 1 分，95% CI [−8, 10] | 雖然不顯著，但區間包含重要好處與重要壞處；結果是不精確，而不是證明沒有效果。 |
| 6 分，95% CI [1, 11] | 排除 0，且可能超過重要門檻；還要結合量表、偏差與研究情境判斷。 |
| 2 分，95% CI [0.5, 3.5] | 統計上可能顯著，但整段區間未達 5 分；「有差異」不等於「差異值得在意」。 |

這種讀法同時處理方向、大小與不確定性，比只看 `p < .05` 或 observed power 更接近研究決策。

## 研究做完後，還能做哪些分析？

**第一，效果量敏感度分析。** 固定實際樣本數、α 與目標 power，反推這個設計能穩定偵測的最小效果。它回答的是「這個樣本規模對多大的效果才足夠敏感」，而不是用觀察效果替自己打分數。

**第二，等效性檢定。** 如果研究問題是「兩組差異是否小到可以忽略」，可以預先設定等效界線並使用 TOST。單純 `p > .05` 不能證明兩組等效。

**第三，貝氏分析。** 在清楚說明 prior 與模型的前提下，可比較資料對不同假設提供多少支持；它也不是把不顯著結果自動變成「支持沒有差異」。

## 一個可以直接使用的判讀順序

看到不顯著結果時，我會依序問：

1. 效果估計是多少，方向為何？
2. 95% 信賴區間有多寬？
3. 研究前定義的重要效果門檻是多少？
4. 區間是否仍包含實務上重要的好處或壞處？
5. 研究是否受測量誤差、遺漏值或設計偏差影響？
6. 若要主張「沒有重要效果」，是否採用了等效性或合適的貝氏方法？

> 不顯著不等於沒有差異；寬廣的信賴區間通常代表我們還不知道，而不是兩組已經被證明相同。

### 延伸研究筆記

我也把相關資料整理在這份 [Google Notebook：Post-hoc power 與結果判讀](https://notebook.google.com/notebook/14a8e333-8feb-462f-b7e3-54d36eef200a)。此連結可能需要登入 Google 帳號及相應的瀏覽權限。

<!-- PROFESSIONAL -->

當主要分析得到 non-significant result，研究者有時會將觀察到的效果量、實際樣本數與 α 輸入 power formula，計算 observed post-hoc power，並用低 power 解釋未達顯著。這個做法的核心問題不是「分析發生在研究之後」，而是把高取樣誤差的 observed effect 當成 true population effect，再用同一份資料重新描述原有檢定結果。

本文受[陳柏威醫師的 EBM 文章](https://drpwchen.com/posts/ebm-post-hoc-power-analysis/)啟發，並結合 observed power、confidence interval、SESOI、sensitivity analysis 與 equivalence testing 的方法學文獻重新撰寫。以下內容不是原文轉載。

## 先區分四個容易混用的概念

| 分析 | 已知輸入 | 主要輸出 | 合理用途 |
|---|---|---|---|
| 樣本數規劃（a priori） | α、目標 power、設計、預先論證的效果 | 所需 N | 收案前規劃研究 |
| Power determination | N、α、外部或理論指定的母體效果 | Power | 評估固定設計對特定效果的偵測能力 |
| 效果量敏感度分析 | N、α、目標 power、設計 | 最小可偵測效果 | 樣本數固定時描述設計靈敏度 |
| Observed-effect post-hoc power | N、α、同一樣本的 observed effect | Observed power | 不建議用來解釋同一研究結果 |

因此，不應把所有研究後進行的 power-related calculations 一概視為無效。問題集中在最後一列：以同一份資料的 observed effect 估計同一檢定的 power。

## Observed power 為何是 p 值的回音？

在固定 α 與檢定架構下，檢定統計量由效果估計相對於標準誤的大小決定；observed power 又把這個標準化觀察效果帶入替代假設。因此兩者存在單調的一對一關係。觀察效果受抽樣誤差影響，尤其小樣本估計可能高度不穩定，不能被當作已知母體效果。

這會產生 power approach paradox：越接近虛無效果的資料，會同時產生越大的 p 值與越低的 observed power；研究者再用「power 太低」解釋該 p 值，沒有增加辨識力。反過來，偶然高估效果的研究會得到較小 p 值與較高 observed power，也不代表設計原本具有良好可重現性。

## 不顯著結果至少有兩種不同情況

令 θ 為目標效果、0 為 null value，並預先設定 `−Δ` 與 `+Δ` 為最小實務重要效果界線：

```text
精確地接近零：95% CI 完全位於 [−Δ, +Δ] 內
不精確／未定論：95% CI 同時跨越 0 與至少一個重要效果界線
```

兩者都可能得到 `p > .05`，但科學意義完全不同。前者可排除部分重要效果；後者仍與重要好處、重要壞處或兩者相容。Cochrane Handbook 對結果解釋也強調 point estimate、confidence interval 與決策門檻，而不是只依顯著性二分。

需注意，95% CI 落在重要界線內可作為估計觀點的直觀判讀，但若研究目標是正式證明 practical equivalence，應預先設定 equivalence bounds，並採用 TOST 等等效性檢定。傳統 α = .05 的 TOST 通常對應 90% CI，不能把一般 difference test 的 `p > .05` 直接改寫成等效。

## 研究完成後的合理替代方案

### 1. 報告效果估計與信賴區間

報告 raw effect、standardized effect、95% CI、樣本數與描述統計。解讀時對照事前設定的 MCID 或 SESOI，說明區間是否排除 important benefit、important harm 或兩者。

### 2. 效果量敏感度分析

若實際 N 已固定，可計算在指定 α、設計及 80% power 下能偵測的 minimum detectable effect。以兩獨立組 t test 為例：

```python
from statsmodels.stats.power import tt_ind_solve_power

detectable_d = tt_ind_solve_power(
    effect_size=None,
    nobs1=30,       # 每組 30 人
    alpha=0.05,
    power=0.80,
    ratio=1.0,
    alternative="two-sided"
)
print(detectable_d)
```

這個結果應寫成「在模型假設成立時，本設計對至少此大小的母體效果具有 80% power」，不能寫成「本研究有 80% 機率得到正確答案」。若研究是配對、重複量測、叢集或交互作用設計，必須使用對應模型並納入相關係數、ICC、流失與多重檢定等條件。

### 3. 等效性檢定或貝氏模型

若研究問題要支持 absence of a meaningful effect，可使用以 SESOI 為界的 TOST；若希望比較假設間的相對證據，可使用有明確 prior justification、敏感度檢查與模型診斷的 Bayesian analysis。兩者都需要在研究問題與分析計畫中事先說明，不能在看見不顯著後任意挑選最有利方法。

## 建議的報告文字

不建議寫：

> 結果未達顯著，事後檢定力僅為 34%，顯示研究樣本不足。

可改寫為：

> 組間平均差為 1.2 分，95% CI [−2.4, 4.8]，區間包含虛無值，但未跨越事先定義的 ±5 分最小重要差異。本結果可排除 5 分以上的平均差異；然而，對「兩組實務等效」的推論仍應依預先規劃的等效性檢定，而非 observed post-hoc power。

若區間很寬，則應誠實寫成：

> 平均差為 1.2 分，95% CI [−8.1, 10.5]。區間同時包含重要好處、無差異與重要壞處，因此結果不精確，無法據此主張介入有效、無效或兩組等效。

## 研究判讀清單

1. 樣本數是否在收案前依具有理據的效果門檻規劃？
2. 是否完整報告估計值、95% CI、效果量與實際分析 N？
3. MCID／SESOI 是否在看結果前決定，且具領域依據？
4. CI 是否包含 null、important benefit 或 important harm？
5. 是否誤把 non-significance 寫成 no effect？
6. 若主張 practical equivalence，是否使用預先規劃的 equivalence test？
7. 若做 sensitivity analysis，是否使用固定 N 與目標 power，而非 observed effect？

## 我的 Notebook 與參考資料

- [Google Notebook：Post-hoc power 與結果判讀](https://notebook.google.com/notebook/14a8e333-8feb-462f-b7e3-54d36eef200a)（可能需要登入 Google 帳號及權限）
- [陳柏威醫師：當統計不顯著時，我該計算研究的檢力嗎？](https://drpwchen.com/posts/ebm-post-hoc-power-analysis/)
- [Dziak et al.：The Interpretation of Statistical Power after the Data have been Gathered](https://pmc.ncbi.nlm.nih.gov/articles/PMC7286546/)
- [Heinsberg & Weeks：Post hoc Power is Not Informative](https://pmc.ncbi.nlm.nih.gov/articles/PMC9452450/)
- [Lakens：Equivalence Tests—A Practical Primer](https://pmc.ncbi.nlm.nih.gov/articles/PMC5502906/)
- [Power to Detect What? Considerations for Planning and Evaluating Sample Size](https://pmc.ncbi.nlm.nih.gov/articles/PMC11193916/)
- [Cochrane Handbook：Interpreting results and drawing conclusions](https://training.cochrane.org/handbook/current/chapter-15)
