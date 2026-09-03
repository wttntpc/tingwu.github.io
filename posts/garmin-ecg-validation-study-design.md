<!-- SIMPLE -->
# Garmin 可以取代 ECG 嗎？從穿戴式裝置驗證學會研究設計與一致性分析

> **HRV 方法學專題｜科普版**
> 這篇文章不會只回答「Garmin 準不準」，而是帶著讀者完成一個更科學的問題：在特定型號、族群、量測情境與指標下，Garmin 的誤差是否小到足以支援預定用途？

[回到 HRV 學習地圖](#/post/hrv-learning-map) · [先讀：BBI、RRI、IBI 與 NNI](#/post/hrv-bbi-rri-ibi-nni) · [全景導讀：從手錶 PPG 到 HRV](#/post/garmin-raw-data-hrv)

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

| 研究 | 情境與設備 | 主要發現 | 不能外推到哪裡？ |
|---|---|---|---|
| Williams 等人（2023） | 27名健康成人；Garmin Venu 2S Health Snapshot 與3導程 ECG 同步2分鐘；正常與慢速受控呼吸 | 正常呼吸時 RHR 誤差較小；RMSSD與SDNN雖呈良好相關，HRV百分比誤差高於RHR；慢速呼吸與較高HRV時誤差增加 | 樣本小且年輕健康；不能代表運動、睡眠或臨床族群 |
| Theurl 等人（2023） | 263人，含心肌梗塞、中風與對照；Garmin vivoactive 4 PPG 與1000 Hz ECG 仰臥同步30分鐘 | mean HR、SDANN、VLF與SD2一致性較高；RMSSD、SD1與DFA-α1僅中等一致 | 僅標準化仰臥靜息，且排除低品質或頻繁PVC資料；不能直接外推自由活動 |
| Dial 等人（2025） | 13名健康成人、536個夜晚；Garmin Fenix 6等裝置對照ECG參考 | Garmin夜間RMSSD的CCC為0.87、MAPE約10.5%；不同裝置差異明顯 | 受試者少、夜晚多，不能把536晚當536位獨立受試者；僅代表睡眠摘要情境 |
| Merrigan 等人（2023） | 8名健康成人；Garmin Fenix 6、胸帶等與多導程ECG比較運動中的每秒HR | 腕式裝置在穩定運動較可用，高強度Tabata誤差較明顯；胸帶整體較佳 | 研究驗證的是運動中HR，不是逐拍HRV；不可拿來宣稱Garmin HRV有效 |

這些結果看似不同，其實回答的是不同問題。型號、量測時間、姿勢、呼吸、動作、族群和指標都不同。真正應學到的不是替品牌打分數，而是閱讀研究條件。

### Garmin白皮書可以怎麼用？

Garmin Enhanced BBI白皮書說明PPG-BBI、逐拍confidence與缺口的技術概念，也展示一名男性在一晚睡眠中以Venu 2 Plus對照Firstbeat Bodyguard 2 ECG的結果。它適合用來理解資料欄位和廠商演算法，但不是獨立的群體驗證研究。即使一晚包含數萬個beats，研究單位仍只有一位受試者；不能把大量心搏當成大量獨立樣本，也不能據此推廣至其他型號、族群或運動情境。

## 為什麼「高度相關」仍可能不準？

假設 ECG 測得五個人的 RMSSD 是 `20、30、40、50、60 ms`，Garmin 全部多估 `15 ms`，得到 `35、45、55、65、75 ms`。兩組數值的相關可以非常高，因為排名完全相同；但每個人的 Garmin 都固定多了15 ms，兩種方法並不能直接互換。

所以驗證研究不能只報 Pearson 或 Spearman 相關。至少還要回答：

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

Garmin 不是單純的「準」或「不準」。已有研究顯示，特定Garmin型號在標準化靜息下可對部分HRV指標提供有用估計；同時也顯示短期變化指標、較高HRV、受控呼吸、睡眠摘要或劇烈動作可能得到不同誤差。若要自己做驗證，最重要的是同步量測、逐層比較、處理重複資料、報告偏差與一致性界限，並在看結果前定義可接受程度。

## 核心參考文獻（APA 7th）

- Dial, M. B., Hollander, M. E., Vatne, E. A., Emerson, A. M., Edwards, N. A., & Hagen, J. A. (2025). Validation of nocturnal resting heart rate and heart rate variability in consumer wearables. *Physiological Reports, 13*, Article e70527. https://doi.org/10.14814/phy2.70527
- Garmin Health. (2023). *Garmin enhanced BBI: An example night*. https://www8.garmin.com/garminhealth/news/Garmin-Enhanced-BBI_Final.pdf
- Merrigan, J. J., Stovall, J. H., Stone, J. D., Stephenson, M., Finomore, V. S., & Hagen, J. A. (2023). Validation of Garmin and Polar devices for continuous heart rate monitoring during common training movements in tactical populations. *Measurement in Physical Education and Exercise Science, 27*(3), 234–247. https://doi.org/10.1080/1091367X.2022.2161820
- Theurl, F., Schreinlechner, M., Sappler, N., Toifl, M., Dolejsi, T., Hofer, F., Massmann, C., Steinbring, C., Komarek, S., Mölgg, K., Dejakum, B., Böhme, C., Kirchmair, R., Reinstadler, S., & Bauer, A. (2023). Smartwatch-derived heart rate variability: A head-to-head comparison with the gold standard in cardiovascular disease. *European Heart Journal – Digital Health, 4*(3), 155–164. https://doi.org/10.1093/ehjdh/ztad022
- Williams, K., Jamieson, A., Chaturvedi, N., Hughes, A., & Orini, M. (2023). Validation of wearable derived heart rate variability and oxygen saturation from Garmin's Health Snapshot. *Computing in Cardiology, 50*, 1–4. https://doi.org/10.22489/CinC.2023.237

> **資料與查核說明：**本文以作者指定的HRV NotebookLM資料庫定位研究，再回到其中收錄的論文全文核對設計、設備、樣本、分析與主要數值。NotebookLM是檢索介面，不是證據本身。本文不代表醫療建議，也不能把特定型號與條件的研究結果外推至所有Garmin裝置。

<!-- PROFESSIONAL -->
# Garmin–ECG 方法比較研究：從 estimand、同步與QC到一致性推論

## 研究定位

這是一項 repeated-measures method-comparison study，而不是一般「兩組是否有差」的研究。ECG是參考方法；腕式Garmin PPG是index method。研究目的不是檢定兩者平均值是否無顯著差異，而是估計個別差異的大小、分布、條件依賴性與不確定性，再依預定用途判定是否可接受。

### 三個應分開的estimands

1. **HR-level agreement**：同一時間窗的Garmin與ECG心率差。
2. **Beat-interval agreement**：已配對PPG pulse與ECG R peak後，BBI/PPI和RRI的差；同時估計漏拍、多拍與錯配率。
3. **Feature-level agreement**：同一有效視窗中，Garmin-PRV與ECG-HRV之RMSSD、SDNN或其他指標差。

不能用HR-level結果替feature-level效度背書；也不能由單一指標推論整套HRV有效。

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

這是一份設計模板，不是已完成研究的結果。真正執行前仍需依設備輸出能力、倫理審查、預定族群與主要用途建立protocol、資料字典與統計分析計畫。

## 參考文獻（APA 7th）

- Coste, A., Millour, G., & Hausswirth, C. (2025). A comparative study between ECG- and PPG-based heart rate sensors for heart rate variability measurements: Influence of body position, duration, sex, and age. *Sensors, 25*(18), Article 5745. https://doi.org/10.3390/s25185745
- Dial, M. B., Hollander, M. E., Vatne, E. A., Emerson, A. M., Edwards, N. A., & Hagen, J. A. (2025). Validation of nocturnal resting heart rate and heart rate variability in consumer wearables. *Physiological Reports, 13*, Article e70527. https://doi.org/10.14814/phy2.70527
- Garmin Health. (2023). *Garmin enhanced BBI: An example night*. https://www8.garmin.com/garminhealth/news/Garmin-Enhanced-BBI_Final.pdf
- Georgiou, K., Larentzakis, A. V., Khamis, N. N., Alsuhaibani, G. I., Alaska, Y. A., & Giallafos, E. J. (2018). Can wearable devices accurately measure heart rate variability? A systematic review. *Folia Medica, 60*(1), 7–20. https://doi.org/10.2478/folmed-2018-0012
- Laborde, S., Mosley, E., & Thayer, J. F. (2017). Heart rate variability and cardiac vagal tone in psychophysiological research: Recommendations for experiment planning, data analysis, and data reporting. *Frontiers in Psychology, 8*, Article 213. https://doi.org/10.3389/fpsyg.2017.00213
- Merrigan, J. J., Stovall, J. H., Stone, J. D., Stephenson, M., Finomore, V. S., & Hagen, J. A. (2023). Validation of Garmin and Polar devices for continuous heart rate monitoring during common training movements in tactical populations. *Measurement in Physical Education and Exercise Science, 27*(3), 234–247. https://doi.org/10.1080/1091367X.2022.2161820
- Quigley, K. S., Gianaros, P. J., Norman, G. J., Jennings, J. R., Berntson, G. G., & de Geus, E. J. C. (2024). Publication guidelines for human heart rate and heart rate variability studies in psychophysiology—Part 1: Physiological underpinnings and foundations of measurement. *Psychophysiology, 61*(9), Article e14604. https://doi.org/10.1111/psyp.14604
- Theurl, F., Schreinlechner, M., Sappler, N., Toifl, M., Dolejsi, T., Hofer, F., Massmann, C., Steinbring, C., Komarek, S., Mölgg, K., Dejakum, B., Böhme, C., Kirchmair, R., Reinstadler, S., & Bauer, A. (2023). Smartwatch-derived heart rate variability: A head-to-head comparison with the gold standard in cardiovascular disease. *European Heart Journal – Digital Health, 4*(3), 155–164. https://doi.org/10.1093/ehjdh/ztad022
- Williams, K., Jamieson, A., Chaturvedi, N., Hughes, A., & Orini, M. (2023). Validation of wearable derived heart rate variability and oxygen saturation from Garmin's Health Snapshot. *Computing in Cardiology, 50*, 1–4. https://doi.org/10.22489/CinC.2023.237

> **資料與查核說明：**本文以作者指定的HRV NotebookLM資料庫定位研究，再回到其中收錄的論文全文核對設計、設備、樣本、分析與主要數值。NotebookLM是檢索介面，不是證據本身。本文不代表醫療建議，也不能把特定型號與條件的研究結果外推至所有Garmin裝置。
