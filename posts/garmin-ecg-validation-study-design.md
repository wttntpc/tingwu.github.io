<!-- SIMPLE -->
# Garmin 可以取代 ECG 嗎？從公開證據到兩人三設備先導實驗

> **HRV 方法學專題｜科普版**
> 這篇文章不會只回答「Garmin 準不準」，而是把公開驗證研究與我們目前的兩人三設備先導實驗放在一起，回答一個更科學的問題：在特定型號、族群、量測情境與指標下，Garmin 的誤差是否小到足以支援預定用途？

[回到 HRV 學習地圖](#/post/hrv-learning-map) · [先讀：BBI、RRI、IBI 與 NNI](#/post/hrv-bbi-rri-ibi-nni) · [三設備分析實作](#/post/hrv-three-device-analysis-practice) · [全景導讀：從手錶 PPG 到 HRV](#/post/garmin-raw-data-hrv)

<figure class="article-figure">
  <img src="assets/garmin-ecg-validation-workflow.svg" alt="Garmin PPG 與 ECG 方法比較研究由用途、同步量測、品質控制到三層一致性判定的流程" loading="lazy">
  <figcaption>Garmin–ECG 驗證流程。HR、逐拍間隔與 HRV 是三個不同層級；通過前一層不代表後一層也通過。</figcaption>
</figure>

## 先把問題問對：驗證的不是品牌，而是一種用途

「Garmin 準嗎？」就像問「一把尺準嗎？」資訊仍然不夠。我們至少需要知道：

- 哪一款 Garmin、什麼韌體與演算法？
- 使用腕式 PPG、胸帶 ECG，還是手錶已計算好的摘要值？
- 量測靜息、睡眠、運動中，還是運動後恢復？
- 比較平均心率、逐拍間隔，還是 RMSSD、SDNN 等 HRV 指標？
- 用來觀察自己的長期趨勢，還是要取代研究級 ECG？

因此，合理的研究結論應該是：

> 在某一族群與量測條件下，某一型號及版本產生的某項指標，與預先指定的 ECG 參考值相比，誤差是否符合該用途的接受界線。

它不應被簡化成「Garmin 已經驗證」或「PPG 可以取代 ECG」。

## 三層驗證不能混在一起

### 第一層：心率 HR

平均心率或每秒心率主要描述一段時間內跳得多快。少量心搏位置誤差經平均後可能互相抵消，因此 HR 很準，不代表逐拍間隔也同樣準。

### 第二層：逐拍間隔 BBI／RRI

ECG 以相鄰 R peaks 取得 RRI；腕式 PPG 以周邊脈搏波特徵點取得 PPI 或裝置所稱的 BBI。HRV 對逐拍誤差敏感，因此最好先檢查 Garmin 是否出現漏拍、多拍、錯位或長缺口。

### 第三層：HRV／PRV 指標

RMSSD、SDNN、頻域與非線性指標對錯誤的敏感程度不同。某裝置可以準確估計平均 HR 或較慢的整體變化，卻在 RMSSD 等短期逐拍變化指標上只有中等一致性。每一個指標都要分開判定。

## 現有研究告訴我們什麼？

| 研究 | 情境與設備 | 可量化的主要發現 | 不能外推到哪裡？ |
|---|---|---|---|
| [Williams 等人（2023）](https://doi.org/10.22489/CinC.2023.237) | 27名年輕健康成人；Garmin Venu 2／Health Snapshot 與 ECG 同步2分鐘 | 自由呼吸時RHR：<i>r</i>=.99、bias −0.5 bpm、LoA −3.9至2.9 bpm；RMSSD：<i>r</i>=.85、bias −1.6 ms、LoA −32.6至29.5 ms、APE中位數20.3% | 兩分鐘、靜息且族群年輕；不能代表運動、睡眠、Forerunner 255或臨床用途 |
| [Theurl 等人（2023）](https://doi.org/10.1093/ehjdh/ztad022) | 263人，含心肌梗塞、中風與對照；Garmin vivoactive 4 PPG 與1000 Hz ECG 仰臥同步30分鐘 | mean HR、SDANN、VLF一致性很高（CCC分別為.9998、.9617、.9613）；RMSSD與DFA-α1僅中等（.6617、.5919） | 僅標準化仰臥靜息，且結果具有指標差異；不能把mean HR的準確度外推到所有HRV指標 |
| [Dial 等人（2025）](https://doi.org/10.14814/phy2.70527) | 13名健康成人、536個夜晚；Garmin Fenix 6等裝置對照Polar H10 ECG | Garmin夜間HRV的CCC為.87、MAPE為10.52% ± 8.63%；研究並因演算法時間窗不明而未納入Garmin RHR比較 | 536晚巢狀於13人；裝置摘要值不是逐拍BBI驗證，也不能代表白天活動 |
| [Merrigan 等人（2023）](https://doi.org/10.1080/1091367X.2022.2161820) | 8名健康成人；Garmin Fenix 6、胸帶等與多導程ECG比較運動中的每秒HR | Fenix 6於三種較穩定活動的MAPE為4.23%–5.44%、CCC為.76–.96；Tabata在所有裝置中誤差最差 | 驗證的是運動中HR，不是逐拍HRV；不可用來宣稱運動中RMSSD有效 |

這些結果看似不同，其實回答的是不同問題。型號、量測時間、姿勢、呼吸、動作、族群和指標都不同。真正應學到的不是替品牌打分數，而是閱讀研究條件。

### Garmin白皮書可以怎麼用？

Garmin Enhanced BBI白皮書說明PPG-BBI、逐拍confidence與缺口的技術概念，也展示一名男性在一晚睡眠中以Venu 2 Plus對照Firstbeat Bodyguard 2 ECG的結果。它適合用來理解資料欄位和廠商演算法，但不是獨立的群體驗證研究。即使一晚包含數萬個beats，研究單位仍只有一位受試者；不能把大量心搏當成大量獨立樣本，也不能據此推廣至其他型號、族群或運動情境。

## 我們目前的兩人三設備先導實驗

我們同步使用 Garmin Forerunner 255（腕式PPG-BBI）、BIOPAC Lead II ECG與Portable ECG，收集2位參與者在睜眼、閉眼、原地踏步100 bpm、運動後睜眼及閉眼五個情境的資料。每個情境取開始後20–320秒，共300秒。四個靜態情境形成8個 participant-condition paired windows；原地踏步只有2個窗口。

這是一項**流程驗證與失敗模式探索**，不是產品效度試驗。下列數值來自2026-10-02版彙總輸出；bias一律定義為「Garmin − ECG」。傳統LoA以8個靜態窗口計算，尚未處理同一人多次量測的相依性，因此只能描述目前資料，不能當作母群體的95%推論區間。

### 靜息結果：平均速度接近，不代表逐拍變異可以互換

| 指標 | Garmin vs BIOPAC：bias（描述性LoA） | MAPE | Garmin vs Portable ECG：bias（描述性LoA） | MAPE |
|---|---:|---:|---:|---:|
| Mean HR | +0.08 bpm（−0.22至+0.39） | 0.16% | +0.01 bpm（−0.11至+0.12） | 0.05% |
| Mean NN | −0.88 ms（−4.07至+2.31） | 0.16% | −0.14 ms（−1.02至+0.73） | 0.05% |
| SDNN | +1.69 ms（−0.03至+3.41） | 7.57% | +1.80 ms（+0.85至+2.75） | 8.42% |
| RMSSD | +5.32 ms（+1.74至+8.89） | 30.34% | +5.32 ms（+1.93至+8.72） | 30.25% |

這張表揭示三個層次：

1. **平均心率層次表現最好。** 在目前8個靜態窗口中，Mean HR與Mean NN幾乎重疊。
2. **SDNN有小幅正向偏差。** Garmin在靜息窗口平均高約1.7–1.8 ms，但這仍只是兩人的描述性結果。
3. **RMSSD最值得警惕。** Garmin平均高約5.3 ms；因參考值本身不大，MAPE約30%。即使ICC約.83、兩人的高低排序大致保留，也不能因此說兩種方法可互換。兩位參與者間的差異很大，可能讓相關或ICC看起來漂亮，卻掩蓋固定偏差。

BIOPAC與Portable ECG給出的靜息結果方向幾乎相同，這支持目前分析流程具有一定內部一致性；但它仍不能替代更多參與者、完整人工R-peak複核與正式同步驗證。

### 原地踏步結果：目前應視為「失敗警報」

在2個原地踏步窗口中，三設備的兩人平均輸出已明顯分開：Garmin、BIOPAC與Portable ECG的Mean HR分別為97.61、105.21與113.15 bpm；RMSSD分別為25.53、73.19與67.97 ms。因為只有2個窗口，且其中一個人的ECG衍生結果出現極端變動，這些平均值**不能被解讀成運動生理反應或裝置效度估計**。

QC敏感度分析更清楚地指出問題：BIOPAC動作窗口的兩人平均RMSSD由保留全部的136.54 ms降至刪除後插補的66.14 ms；Portable ECG則由267.95 ms降至63.73 ms。Garmin在現行三種QC路徑皆維持25.53 ms，這不代表Garmin沒有偽影，而可能反映PPG-BBI已先經過無法看見的裝置演算法，或目前規則沒有捕捉其失敗型態。

因此，動作資料目前最有價值的用途不是比較誰比較準，而是暴露四個待解問題：共同同步事件、clock drift、ECG R-peak人工複核、以及Garmin輸出缺口與confidence欄位的語義。

## 對照2026年HRV指引：我們做到什麼、還缺什麼？

[Carter 等人（2026）](https://doi.org/10.1152/ajpheart.00041.2026)建議實驗室HRV研究優先使用ECG、至少250 Hz取樣、固定姿勢與環境、使用至少5分鐘穩態窗口、監測呼吸，並以自動偵測加上人工視覺確認處理心搏。對穿戴式裝置則應報告型號、輸入訊號、韌體／演算法版本及已知限制。

| 已做到 | 仍需補強 |
|---|---|
| BIOPAC採Lead II、1000 Hz；三設備同時量測；分析窗口固定為5分鐘；靜息與動作分層 | 只有2位參與者；20秒穩定期短於指引建議；未同步量測呼吸；缺共同硬體事件與drift估計；韌體與配戴紀錄仍需資料字典化；人工R-peak複核需建立盲化及一致性紀錄 |

另一個重要限制是**型號可移植性**：上述公開研究使用Venu 2／2S、vivoactive 4或Fenix 6，而我們使用Forerunner 255。感測器、佩戴、韌體與演算法不同，因此文獻只能提供方法與合理預期，不能替Forerunner 255直接背書。

## 為什麼「高度相關」仍可能不準？

假設 ECG 測得五個人的 RMSSD 是 `20、30、40、50、60 ms`，Garmin 全部多估 `15 ms`，得到 `35、45、55、65、75 ms`。兩組數值的相關可以非常高，因為排名完全相同；但每個人的 Garmin 都固定多了15 ms，兩種方法並不能直接互換。

所以驗證研究不能只報 Pearson 或 Spearman 相關。[Bland 與 Altman（1986）](https://doi.org/10.1016/S0140-6736(86)90837-8)提出的方法比較觀點提醒我們，至少還要回答：

- **Bias（平均偏差）**：Garmin 平均高估或低估多少？
- **95% limits of agreement（LoA）**：大多數個別差異可能落在哪個範圍？
- **MAE／RMSE**：典型誤差有多大？是否被少數大誤差拉高？
- **CCC／ICC**：排序和數值接近程度合起來如何？使用的是哪種ICC？
- **Proportional bias**：數值愈高時，誤差是否也愈大？

最重要的是：這些誤差是否小於研究開始前定義的「可接受界線」。如果沒有先定義用途與界線，研究容易只剩下「看起來相關不錯」。

## 如果由我設計一項 Garmin–ECG 驗證研究

### 步驟一：先寫用途與主要結果

示範研究問題：

> 在健康成人標準化靜息測量中，Garmin腕式PPG產生的BBI、RMSSD與SDNN，與同步ECG產生的RRI、RMSSD與SDNN是否具有足以支援個人趨勢監測的一致性？

這句話已限定族群、情境、設備來源、指標與用途。若目標是臨床診斷或運動即時回饋，需要另一套更嚴格、情境不同的驗證。

### 步驟二：選擇受試者，而不是只追求很多心搏

每個人可貢獻數百個心搏，但真正的獨立樣本仍主要是「人」。若20人各有500拍，不能假裝有10,000位受試者。樣本應涵蓋預定使用族群的重要差異，例如年齡、性別、膚色、腕圍、心肺適能與節律狀態；是否納入心律不整則應依研究目的事先決定。

### 步驟三：兩部設備必須同步

Garmin和ECG應在同一人、同一時段記錄。研究需要保存共同開始事件或同步標記、時區與時間戳精度，並檢查裝置是否逐漸產生 clock drift。僅把兩段「差不多同一時間」的摘要值放在一起，無法驗證逐拍間隔。

### 步驟四：把情境分開

可先做一個最小可行研究：標準化靜息、固定姿勢與自發呼吸，分別分析5分鐘視窗；再增加坐姿、站姿、受控呼吸、運動與恢復。這些情境不能混成一個平均結果，因為動作、周邊灌流與呼吸會改變PPG品質及生理變異。

### 步驟五：兩條訊號各自做品質控制

- ECG：保存原始波形、R-peak標記、異位心搏與人工修正紀錄。
- Garmin：保存原始BBI、時間戳、confidence flag、缺口與韌體版本；若只能取得摘要值，要明確承認無法檢查逐拍錯誤。
- 兩端使用相同分析視窗，但不能為了讓結果更漂亮而只刪除Garmin不利的片段。
- 報告每人、每情境的有效時間、有效間隔比例、刪除與校正比例及最長缺口。

### 步驟六：依序分析

1. 畫兩條時間序列，確認同步與遺漏。
2. 比較每拍事件配對與 interval error。
3. 對每個人、每個情境、每個固定視窗計算HR與HRV。
4. 畫 identity plot 與 Bland–Altman plot。
5. 報告 bias、LoA及其信賴區間，再補充MAE、CCC或指定ICC。
6. 檢查誤差是否隨數值、動作、姿勢、呼吸或族群特徵改變。
7. 以預先指定的接受界線，逐指標、逐情境下結論。

## 一個很小但重要的研究練習

請先替自己的研究填完這五格：

| 決策 | 我的規劃 |
|---|---|
| 預定用途 | 個人趨勢／研究量測／即時運動／臨床輔助？ |
| Garmin資料 | 型號、韌體、PPG-BBI或裝置摘要？ |
| ECG參考 | 設備、導程、取樣率與R-peak方法？ |
| 主要指標 | BBI error、RMSSD、SDNN，或其他？ |
| 可接受誤差 | 根據用途，多少bias與LoA才可接受？ |

若這五格尚未填完，還不適合先決定統計檢定或樣本數。

## 今天應該帶走的結論

Garmin 不是單純的「準」或「不準」。公開研究與我們的先導資料都顯示：**平均心率、Mean NN、SDNN與RMSSD必須逐層判斷；靜息結果不能外推到動作；保留個人趨勢不等於數值可與ECG互換。**目前Forerunner 255在兩人的靜息窗口中能貼近ECG的平均速度，但RMSSD呈現約5.3 ms正偏差與約30% MAPE；動作窗口則仍有同步、偽影與QC問題。因此現階段最合理的結論是「流程已找出可用與失敗的層次」，而不是「Garmin已經通過驗證」。

## 核心參考文獻（APA 7th）

- Bland, J. M., & Altman, D. G. (1986). Statistical methods for assessing agreement between two methods of clinical measurement. *The Lancet, 327*(8476), 307–310. https://doi.org/10.1016/S0140-6736(86)90837-8
- Carter, J. R., Jenkins, N. D. M., Bigalke, J. A., Robinson, A. T., Keller-Ross, M. L., Greaney, J. L., Fonkoue, I. T., Fadel, P. J., Macefield, V. G., Charkoudian, N., Levine, B. D., & Joyner, M. J. (2026). Guidelines for rigor and reproducibility of heart rate variability within human cardiovascular research. *American Journal of Physiology-Heart and Circulatory Physiology, 331*(3), H918–H943. https://doi.org/10.1152/ajpheart.00041.2026
- Dial, M. B., Hollander, M. E., Vatne, E. A., Emerson, A. M., Edwards, N. A., & Hagen, J. A. (2025). Validation of nocturnal resting heart rate and heart rate variability in consumer wearables. *Physiological Reports, 13*, Article e70527. https://doi.org/10.14814/phy2.70527
- Garmin Health. (2023). *Garmin enhanced BBI: An example night*. https://www8.garmin.com/garminhealth/news/Garmin-Enhanced-BBI_Final.pdf
- Merrigan, J. J., Stovall, J. H., Stone, J. D., Stephenson, M., Finomore, V. S., & Hagen, J. A. (2023). Validation of Garmin and Polar devices for continuous heart rate monitoring during common training movements in tactical populations. *Measurement in Physical Education and Exercise Science, 27*(3), 234–247. https://doi.org/10.1080/1091367X.2022.2161820
- Theurl, F., Schreinlechner, M., Sappler, N., Toifl, M., Dolejsi, T., Hofer, F., Massmann, C., Steinbring, C., Komarek, S., Mölgg, K., Dejakum, B., Böhme, C., Kirchmair, R., Reinstadler, S., & Bauer, A. (2023). Smartwatch-derived heart rate variability: A head-to-head comparison with the gold standard in cardiovascular disease. *European Heart Journal – Digital Health, 4*(3), 155–164. https://doi.org/10.1093/ehjdh/ztad022
- Williams, K., Jamieson, A., Chaturvedi, N., Hughes, A., & Orini, M. (2023). Validation of wearable derived heart rate variability and oxygen saturation from Garmin's Health Snapshot. *Computing in Cardiology, 50*, 1–4. https://doi.org/10.22489/CinC.2023.237

> **資料與查核說明：**公開研究均回到論文或正式學術紀錄核對；NotebookLM只作為檢索介面。先導結果來自本機專案的彙總CSV與QC敏感度輸出，網站不公開原始生理訊號、逐拍資料或個別結果。本文不代表醫療建議，也不能把兩人的探索性結果或特定型號研究外推至所有Garmin裝置。

<!-- PROFESSIONAL -->
# Garmin–ECG 方法比較：公開文獻、兩人先導結果與正式驗證路徑

## 研究定位

這是一項 repeated-measures method-comparison study，而不是一般「兩組是否有差」的研究。ECG是參考方法；腕式Garmin PPG是index method。研究目的不是檢定兩者平均值是否無顯著差異，而是估計個別差異的大小、分布、條件依賴性與不確定性，再依預定用途判定是否可接受。

### 三個應分開的estimands

1. **HR-level agreement**：同一時間窗的Garmin與ECG心率差。
2. **Beat-interval agreement**：已配對PPG pulse與ECG R peak後，BBI/PPI和RRI的差；同時估計漏拍、多拍與錯配率。
3. **Feature-level agreement**：同一有效視窗中，Garmin-PRV與ECG-HRV之RMSSD、SDNN或其他指標差。

不能用HR-level結果替feature-level效度背書；也不能由單一指標推論整套HRV有效。

## 現行先導資料集與分析意圖

目前資料來自2位參與者、3種設備與5個連續情境：EO(pre)、EC(pre)、原地踏步100 bpm、EO(post)、EC(post)。Index method為Garmin Forerunner 255輸出的PPG-BBI；兩個reference streams為BIOPAC Lead II ECG與Portable ECG。各情境採開始後20–320秒的300秒視窗。

現階段分析意圖是**exploratory／descriptive**：驗證ingestion、時間切窗、R-peak detection、interval QC、feature extraction與報告流程，並定位失敗模式。它不是預先註冊的confirmatory validation，也沒有研究前設定的acceptance bounds。

| 分析層級 | 現況 | 可支持的用途 |
|---|---|---|
| Rate level | 已比較Mean HR與Mean NN | 檢查共同時間窗與平均速度是否接近 |
| Feature level | 已比較SDNN、RMSSD並完成描述性agreement輸出 | 找出指標特異性偏差與QC敏感性 |
| Beat level | 尚未完成可靠共同事件與逐拍matching | 目前不能估計每拍誤差、漏拍或錯配率 |
| Population level | 僅2位參與者 | 只能支援pipeline verification，不能進行產品效度宣稱 |

## 靜態窗口的探索性agreement結果

靜態分析包含2人 × 4情境，共8個participant-condition windows。下表的bias為Garmin − reference；LoA是把8個窗口暫時當成獨立值計算的傳統描述值，**未校正重複量測，也沒有LoA的confidence intervals**。

| Reference | Metric | n windows | Bias | 描述性95% LoA | MAPE | ICC(2,1) |
|---|---|---:|---:|---:|---:|---:|
| BIOPAC | Mean HR | 8 | +0.083 bpm | −0.220至+0.385 | 0.163% | .9999 |
| BIOPAC | Mean NN | 8 | −0.876 ms | −4.067至+2.314 | 0.163% | .9998 |
| BIOPAC | SDNN | 8 | +1.694 ms | −0.026至+3.414 | 7.570% | .9874 |
| BIOPAC | RMSSD | 8 | +5.316 ms | +1.739至+8.892 | 30.342% | .8294 |
| Portable ECG | Mean HR | 8 | +0.010 bpm | −0.106至+0.125 | 0.050% | .99999 |
| Portable ECG | Mean NN | 8 | −0.142 ms | −1.016至+0.732 | 0.050% | .99999 |
| Portable ECG | SDNN | 8 | +1.796 ms | +0.847至+2.746 | 8.417% | .9882 |
| Portable ECG | RMSSD | 8 | +5.322 ms | +1.928至+8.716 | 30.253% | .8302 |

這組數字不適合用「ICC很高」一句帶過。Mean HR與Mean NN的原始單位誤差很小；SDNN的bias仍小但MAPE上升；RMSSD則同時出現約+5.3 ms的固定方向偏差與約30% MAPE。RMSSD的ICC約.83主要表示這2位參與者的相對排序仍有保留，並不消除absolute disagreement。這正是方法比較研究必須同時報告bias、LoA、原始單位誤差與一致性係數的理由。

兩個ECG reference對Garmin所得的靜態bias十分接近，可視為目前analysis-side implementation的交叉檢查。不過BIOPAC與Portable ECG並非完全獨立的真值：它們各有前端濾波、電極、同步及R-peak detection誤差，因此不能以「兩個參考都同意」取代waveform review與beat matching。

## 動作窗口與QC敏感度：先診斷失敗，再談效度

原地踏步只有2個participant windows，不足以估計可解讀的LoA或ICC。描述性輸出中，Garmin、BIOPAC與Portable ECG的兩人平均Mean HR分別為97.61、105.21與113.15 bpm；RMSSD為25.53、73.19與67.97 ms。跨設備差異同時混合了真實心率、動作偽影、R-peak detection、Garmin availability與時間對齊問題，不能解讀成自主神經差異。

QC method sensitivity進一步顯示：

- BIOPAC動作窗口的平均RMSSD由`keep_all`的136.54 ms降至`delete_interpolate`的66.14 ms；
- Portable ECG由267.95 ms降至63.73 ms；
- Garmin在目前三條QC路徑均為25.53 ms。

Garmin結果對現行QC規則「不變」，不等於沒有motion artifact。更可能的解釋包括：裝置端已進行未知處理、錯誤interval未被現行range／local-change規則標記，或availability failure在輸出前已被隱藏。正式研究應將accuracy與availability分開，並把raw／flagged／excluded／interpolated四種狀態留在可稽核資料表中。

## 與公開證據的整合解讀

我們的靜息結果方向與公開研究的「metric-specific agreement」一致，但不能視為複製成功。[Williams 等人（2023）](https://doi.org/10.22489/CinC.2023.237)在2分鐘自由呼吸中觀察到RHR的窄LoA，但RMSSD的LoA達−32.6至29.5 ms、APE中位數20.3%；[Theurl 等人（2023）](https://doi.org/10.1093/ehjdh/ztad022)亦發現mean HR的CCC為.9998，而RMSSD僅.6617。這些研究與本先導資料共同指出：時間平均能抵消部分逐拍錯誤，短期變異指標則會放大它們。

[Dial 等人（2025）](https://doi.org/10.14814/phy2.70527)的13人、536夜研究顯示Garmin夜間HRV的CCC為.87、MAPE為10.52% ± 8.63%，同時暴露裝置摘要時間窗不透明的問題；[Merrigan 等人（2023）](https://doi.org/10.1080/1091367X.2022.2161820)則顯示Fenix 6在較穩定活動的HR誤差較低，但Tabata的分歧最大。這兩者支持「情境與演算法輸出層級必須分開驗證」，卻都不能直接驗證Forerunner 255的逐拍BBI。

## 依2026指引進行gap analysis

[Carter 等人（2026）](https://doi.org/10.1152/ajpheart.00041.2026)提出的最新HRV嚴謹性指引，可直接用來審查目前protocol：

| Domain | 目前狀態 | 正式研究的修正 |
|---|---|---|
| Input signal | Garmin PPG-BBI＋兩套ECG；BIOPAC Lead II、1000 Hz | 完整記錄Portable ECG取樣、兩套ECG前端濾波與Garmin韌體／演算法版本 |
| Window | 固定300秒，符合最低5分鐘長度 | 將穩定期由20秒提高至預先指定且合理的時間；指引建議理想上約10分鐘 |
| Respiration | 未同步納入目前分析 | 記錄呼吸率與深度，避免把呼吸造成的RMSSD／HF改變誤判為裝置偏差 |
| Context | 靜息與動作已分層 | 標準化姿勢、時段、溫度、咖啡因、酒精、餐食與前次運動並記錄偏離 |
| Beat review | 已有自動R-peak與review輸出格式 | 完成盲化人工複核、adjudication與reviewer agreement |
| Synchronization | 目前以紀錄起點／時間資訊切窗 | 加入共同硬體事件，估計offset與session內clock drift |
| Inference | 目前為2人描述性輸出 | 以participant為樣本規劃核心，使用repeated-measures Bland–Altman或multilevel model |

指引也提醒HRV不適合被直接稱為交感活性或「交感／副交感平衡」。即使未來Garmin與ECG在RMSSD上達到方法一致，也只能支持相應訊號與指標的可用性，不能自動升級成特定自主神經機制的證明。

## 建議的可重現研究架構

| 元件 | 預先指定內容 |
|---|---|
| Population | 年齡範圍、健康／臨床狀態、節律、性別與膚色涵蓋；排除條件與理由 |
| Index method | Garmin型號、感測模式、腕側、佩戴位置、韌體、SDK／匯出方式、confidence定義 |
| Reference | ECG設備、導程、取樣率、電極位置、同步方式、R-peak演算法與人工審查 |
| Conditions | 穩定期、姿勢、呼吸、時段、室溫、咖啡因／運動限制、各階段持續時間 |
| Outcomes | 一個主要指標；其餘預先標記次要或探索性，避免多重比較後選最好結果 |
| Acceptance | 對bias、LoA、有效資料率或分類表現設定用途導向的接受界線 |
| Missingness | 無輸出、低信心、artifact及參與者退出各自的定義與處理 |

## 資料結構與時間對齊

至少保存三張表：

```text
participants: participant_id, age_band, sex, skin_tone, wrist, fitness, rhythm_status
beats: participant_id, condition, device, timestamp, interval_ms, quality_flag, qc_action
windows: participant_id, condition, window_id, device, valid_seconds, valid_intervals,
         missing_prop, corrected_prop, mean_hr, rmssd, sdnn
```

原始設備時間戳應先轉成同一時基。以共同事件或硬體同步校準offset，並檢查記錄後段是否出現drift。若只能對齊分鐘摘要，研究問題必須降級為window-level comparison，不能宣稱完成beat-level validation。

## 品質控制不能讓參考方法和測試方法互相污染

ECG的R peaks可依原始波形人工複核；Garmin BBI若沒有原始PPG波形，只能依時間序列、quality/confidence及預先規則處理。應保存：

- untouched raw資料；
- 每一個被標記、刪除、替換或插補的事件；
- automatic-only與human-reviewed結果的版本；
- paired-window納入流程與各階段樣本數；
- 因低品質排除後，樣本特徵是否改變。

若只分析「兩部設備都有完整資料」的片段，可能高估現實可用性。因此accuracy和availability應分開報告：前者問有輸出時多接近ECG，後者問實際有多少時間能產生可用輸出。

## 核心統計分析

對每位受試者的一個預先指定paired summary，令Garmin值為 <i>G<sub>i</sub></i>、ECG值為 <i>E<sub>i</sub></i>：

<div class="article-equation"><i>d<sub>i</sub></i> = <i>G<sub>i</sub></i> − <i>E<sub>i</sub></i></div>
<div class="article-equation"><i>m<sub>i</sub></i> = (<i>G<sub>i</sub></i> + <i>E<sub>i</sub></i>) / 2</div>
<div class="article-equation">bias = mean(<i>d<sub>i</sub></i>)</div>
<div class="article-equation">95% LoA = bias ± 1.96 × SD(<i>d<sub>i</sub></i>)</div>

Bland–Altman圖以 <i>m<sub>i</sub></i> 為橫軸、<i>d<sub>i</sub></i> 為縱軸。除了bias和LoA，應提供其信賴區間並檢查proportional bias及異質變異。HRV常右偏；若差異隨量級增加，可預先規劃log scale分析並把結果解釋為ratio或百分比，而不是事後選擇較好看的尺度。

### 其他指標的角色

- **MAE／RMSE**：描述誤差大小，但不顯示誤差方向；RMSE對大誤差更敏感。
- **MAPE**：容易理解，但分母很小時不穩定；須同時報告原始單位誤差。
- **Lin's CCC**：同時考慮precision與accuracy，仍不能取代bias與LoA。
- **ICC**：必須寫明模型、單一或平均量測、consistency或absolute agreement及信賴區間。
- **Correlation**：只描述共同變動，不證明數值可互換；只能作補充。

### 重複量測與偽重複

每位受試者有多個beats、windows或nights時，觀測值彼此相關。不可把所有心搏放進普通Bland–Altman或相關分析，假裝它們相互獨立。可依研究問題採用：

- 每位受試者、每情境先形成一個paired summary；或
- repeated-measures Bland–Altman；或
- mixed-effects model估計固定bias、條件效應與participant random effects。

夜間研究尤其要分清「13位受試者、536晚」的兩層資訊；大量夜晚增加個體內精確度，但不能完全取代更多受試者所提供的個體間代表性。

## 建議的分析順序

```text
資料可用性與排除流程
→ 同步與beat matching診斷
→ 原始差值分布與視覺化
→ bias與95% LoA（含CI）
→ CCC／指定ICC、MAE、RMSE
→ proportional bias與異質變異
→ condition／population interaction
→ QC與缺失敏感度分析
→ 對照預先接受界線
```

敏感度分析可比較：低信心BBI納入與排除、未校正與校正、2分鐘與5分鐘、正常與受控呼吸、仰臥與坐姿、靜息與運動，以及不同韌體版本。這些分析需先區分confirmatory與exploratory。

## 樣本數怎麼規劃？

不要從「相關係數顯著」倒推樣本數，也不要把每拍當獨立樣本。先決定主要estimand與希望LoA有多精確，再利用預期差值標準差、每位重複次數、群內相關與可能失敗率進行模擬或專用方法比較樣本數估計。若尚無差值分布，可先做pilot估計變異與資料可用率；pilot的接受界線仍應由使用目的決定，而不是由pilot結果反向設定。

## 最低報告清單

1. Garmin型號、韌體、資料欄位、演算法可見程度與匯出日期。
2. ECG參考系統、採樣、導程、同步及R-peak審查。
3. 族群、情境、姿勢、呼吸、時間與配戴方式。
4. HR、interval、HRV三層中實際驗證了哪一層。
5. 每個指標的分析視窗、公式、單位及轉換。
6. artifact、ectopy、missing、confidence與排除流程。
7. participant與paired observation數量，避免只報大量beats。
8. bias、LoA與CI；CCC／ICC模型；MAE／RMSE及相關作補充。
9. 預先接受界線、主要／次要分析及所有未通過結果。
10. 僅對實際型號、版本、族群、情境、指標與用途下結論。

## 可直接改寫成研究計畫的主要問題

> 本研究旨在評估［Garmin型號與版本］於［族群］在［條件］下所產生之［PPG-BBI／RMSSD／SDNN］，相較同步［ECG參考系統］之criterion validity。主要estimand為［bias與95% LoA／其他］，並以研究前依［預定用途］設定之［接受界線］判定是否具有可接受一致性。次要分析評估姿勢、呼吸、運動強度、訊號品質及個體特徵是否改變方法間差異。

本文已納入目前兩人先導實驗的探索性結果，但它仍不是正式效度研究的最終結論。下一階段需依設備輸出能力、倫理審查、預定族群與主要用途，預先建立protocol、資料字典、接受界線與統計分析計畫；正式研究也應把confirmatory與exploratory分析清楚分開。

## 參考文獻（APA 7th）

- Bland, J. M., & Altman, D. G. (1986). Statistical methods for assessing agreement between two methods of clinical measurement. *The Lancet, 327*(8476), 307–310. https://doi.org/10.1016/S0140-6736(86)90837-8
- Carter, J. R., Jenkins, N. D. M., Bigalke, J. A., Robinson, A. T., Keller-Ross, M. L., Greaney, J. L., Fonkoue, I. T., Fadel, P. J., Macefield, V. G., Charkoudian, N., Levine, B. D., & Joyner, M. J. (2026). Guidelines for rigor and reproducibility of heart rate variability within human cardiovascular research. *American Journal of Physiology-Heart and Circulatory Physiology, 331*(3), H918–H943. https://doi.org/10.1152/ajpheart.00041.2026
- Coste, A., Millour, G., & Hausswirth, C. (2025). A comparative study between ECG- and PPG-based heart rate sensors for heart rate variability measurements: Influence of body position, duration, sex, and age. *Sensors, 25*(18), Article 5745. https://doi.org/10.3390/s25185745
- Dial, M. B., Hollander, M. E., Vatne, E. A., Emerson, A. M., Edwards, N. A., & Hagen, J. A. (2025). Validation of nocturnal resting heart rate and heart rate variability in consumer wearables. *Physiological Reports, 13*, Article e70527. https://doi.org/10.14814/phy2.70527
- Garmin Health. (2023). *Garmin enhanced BBI: An example night*. https://www8.garmin.com/garminhealth/news/Garmin-Enhanced-BBI_Final.pdf
- Georgiou, K., Larentzakis, A. V., Khamis, N. N., Alsuhaibani, G. I., Alaska, Y. A., & Giallafos, E. J. (2018). Can wearable devices accurately measure heart rate variability? A systematic review. *Folia Medica, 60*(1), 7–20. https://doi.org/10.2478/folmed-2018-0012
- Laborde, S., Mosley, E., & Thayer, J. F. (2017). Heart rate variability and cardiac vagal tone in psychophysiological research: Recommendations for experiment planning, data analysis, and data reporting. *Frontiers in Psychology, 8*, Article 213. https://doi.org/10.3389/fpsyg.2017.00213
- Merrigan, J. J., Stovall, J. H., Stone, J. D., Stephenson, M., Finomore, V. S., & Hagen, J. A. (2023). Validation of Garmin and Polar devices for continuous heart rate monitoring during common training movements in tactical populations. *Measurement in Physical Education and Exercise Science, 27*(3), 234–247. https://doi.org/10.1080/1091367X.2022.2161820
- Quigley, K. S., Gianaros, P. J., Norman, G. J., Jennings, J. R., Berntson, G. G., & de Geus, E. J. C. (2024). Publication guidelines for human heart rate and heart rate variability studies in psychophysiology—Part 1: Physiological underpinnings and foundations of measurement. *Psychophysiology, 61*(9), Article e14604. https://doi.org/10.1111/psyp.14604
- Theurl, F., Schreinlechner, M., Sappler, N., Toifl, M., Dolejsi, T., Hofer, F., Massmann, C., Steinbring, C., Komarek, S., Mölgg, K., Dejakum, B., Böhme, C., Kirchmair, R., Reinstadler, S., & Bauer, A. (2023). Smartwatch-derived heart rate variability: A head-to-head comparison with the gold standard in cardiovascular disease. *European Heart Journal – Digital Health, 4*(3), 155–164. https://doi.org/10.1093/ehjdh/ztad022
- Williams, K., Jamieson, A., Chaturvedi, N., Hughes, A., & Orini, M. (2023). Validation of wearable derived heart rate variability and oxygen saturation from Garmin's Health Snapshot. *Computing in Cardiology, 50*, 1–4. https://doi.org/10.22489/CinC.2023.237

> **資料與查核說明：**本文以作者指定的HRV NotebookLM資料庫定位研究，再回到論文或正式學術紀錄核對設計、設備、樣本、分析與主要數值；NotebookLM是檢索介面，不是證據本身。先導結果來自本機專案的彙總CSV與QC敏感度輸出，網站不公開原始生理訊號、逐拍資料或個別結果。本文不代表醫療建議，也不能把兩人的探索性結果或特定型號研究外推至所有Garmin裝置。
