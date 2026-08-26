<!-- SIMPLE -->
# 從一次心跳開始：BBI、RRI、IBI 與 NNI 到底有什麼不同？

> **HRV 每日學習 01｜難度：入門**  
> 今天的目標不是背四個縮寫，而是能看見一欄「心搏間隔」資料時，先問清楚：它由什麼設備取得、用哪個特徵點計算，以及是否經過品質控制。

[回到 HRV 學習地圖](#/post/hrv-learning-map) · [延伸閱讀：從手錶 PPG 到 HRV](#/post/garmin-raw-data-hrv)

## 先想一個問題

手錶輸出一個 `750 ms` 的間隔，我們可以直接把它寫成 RR interval 嗎？

**不一定。** `750 ms` 只告訴我們兩個事件相隔多久，還沒有告訴我們事件是 ECG 的 R peak、PPG 的脈搏波特徵點，還是經過裝置演算法處理後的結果。名詞應跟著量測來源走。

## 一張表先分清楚

| 名詞 | 白話意思 | 常見訊號來源 | 使用時要注意 |
|---|---|---|---|
| IBI（inter-beat interval） | 相鄰兩次心搏事件之間的時間 | 廣義名稱，來源需另寫 | 不能只寫 IBI 而省略設備與偵測方式 |
| BBI（beat-to-beat interval） | 逐拍間隔 | 用法依裝置與文獻而異；Garmin 用它稱腕式 PPG 的脈搏間隔 | 應寫成 `PPG-BBI`，避免被誤認為 ECG |
| RRI（R–R interval） | ECG 上相鄰兩個 R peak 的時間差 | ECG | 只有來源真的是 ECG R peak 時，才適合稱 RRI |
| NNI（normal-to-normal interval） | 相鄰正常竇性心搏形成、且經品質控制的間隔 | 通常指清理後的 ECG RRI | 原始 RRI 不會因為存進分析軟體就自動成為 NNI |
| PPI（pulse-to-pulse interval） | PPG 上相鄰脈搏波特徵點的時間差 | PPG | 它的變異稱 PRV，不能無條件等同 ECG-HRV |

最安全的寫法不是爭論某個縮寫「只能」有一種用法，而是完整寫出：

> 本研究使用腕式 PPG，在每個脈搏波選定的特徵點之間計算逐拍間隔（PPG-derived BBI）。

## RRI 怎麼算？

假設 ECG 偵測到兩個相鄰 R peak：

- 第一個 R peak：`12,450 ms`
- 第二個 R peak：`13,200 ms`

則：

`RRI = 13,200 − 12,450 = 750 ms`

瞬時心率可換算為：

`HR = 60,000 ÷ RRI(ms) = 60,000 ÷ 750 = 80 bpm`

反過來，若心率是 `60 bpm`，一個心搏週期約為 `1,000 ms`。若心率是 `100 bpm`，則約為 `600 ms`。

> **別忘了：**偵測到 `N` 個 R peaks，只會形成 `N − 1` 個 RRI。心率與間隔是倒數關係，因此「先平均每拍心率」和「先平均間隔再換算」不一定得到完全相同的數值。

## 為什麼 PPG 間隔不能直接叫 RRI？

ECG 記錄的是心臟電氣活動；R peak 是心室去極化相關的明顯特徵。PPG 則在手腕等周邊位置觀察每次心搏後到達的血容量脈搏波。它們測到的不是同一個物理事件。

從心臟電氣活動到手腕脈搏波，中間還經過心室射血、血管傳導與周邊循環。動作、接觸壓力、末梢灌流、流汗與演算法也可能改變 PPG 特徵點的位置。因此，靜息時 PPG 與 ECG 的結果可能相近，並不代表在運動或訊號不佳時仍可互換。

較精確的研究用語是：

- ECG：`RRI`，清理後可形成 `NNI`，其變異通常稱 HRV。
- PPG：`PPI` 或清楚標示的 `PPG-BBI`，其變異較嚴謹地稱 PRV。

## 原始 RRI 如何成為 NNI？

`原始訊號 → peak detection → 原始間隔 → 品質檢查 → 正常竇性間隔 → HRV 指標`

品質檢查至少要分開辨識：

1. **多偵測（extra detection）**：雜訊或其他波形被錯認成一個 R peak，產生不合理的短間隔。
2. **漏偵測（missed detection）**：真正的 R peak 沒被找到，形成異常長間隔。
3. **異位心搏（ectopic beat）**：這是真實但不是正常竇房結節律的心搏，不能當成單純偵測錯誤。
4. **動作或接觸偽影**：訊號受到移動、電極或光學接觸等因素干擾。
5. **長時間缺口（long gap）**：連續資料不存在；不能用複製前一筆或跨越長缺口插值來製造心搏。

若保留了原始 ECG，研究者可以回到波形確認 R peak；只有 interval 序列時，能判斷的資訊較少。自動演算法可以協助標記，但 Quigley 等人（2024）與 Laborde 等人（2017）都強調視覺檢查與透明報告的重要性。刪除、替換或插補多少資料，都應留下紀錄。

## 五個常見錯誤

1. 把所有裝置輸出的間隔都稱為 RR interval。
2. 認為原始 RRI 就等於 NNI。
3. 對 BBI 再做一次 `diff()`，把相鄰間隔的差誤當成 BBI。
4. 用 forward fill 補滿缺失 BBI，因而憑空製造心搏。
5. 只看最後的 RMSSD 或 SDNN，卻沒有檢查原始波形、間隔序列與修正比例。

## 今天的自我檢核

請先不看答案，回答下面三題：

1. 手錶 PPG 輸出的 `800 ms` 為什麼不應直接稱為 ECG RRI？
2. 兩個 R peak 分別在 `5.20 s` 與 `6.00 s`，RRI 與瞬時心率是多少？
3. 一個異常長間隔可能由哪兩類完全不同的原因造成？

<details>
<summary>完成後再展開參考答案</summary>

1. PPG 偵測的是周邊脈搏波特徵點，不是 ECG 的 R peak；還可能受到脈搏傳導及光學訊號品質影響。
2. `6.00 − 5.20 = 0.80 s = 800 ms`；`60,000 ÷ 800 = 75 bpm`。
3. 可能是真正漏偵測一個心搏，也可能是生理上的節律異常或連續訊號缺失；必須回到波形與情境判斷。

</details>

## 今天完成到什麼程度才算學會？

您應該能用自己的話完成這句話：

> 我取得的間隔來自 ______ 設備，以 ______ 作為每拍特徵點；原始間隔經過 ______ 品質控制後，才用來計算 ______。

下一篇將從這條量測鏈往前追：**心臟為什麼不是節拍器？從竇房結、交感與副交感神經理解心搏間隔的變化。**

## 參考文獻（APA 7th）

- Garmin Health. (n.d.). *Garmin enhanced BBI: An example night*. https://www8.garmin.com/garminhealth/news/Garmin-Enhanced-BBI_Final.pdf
- Georgiou, K., Larentzakis, A. V., Khamis, N. N., Alsuhaibani, G. I., Alaska, Y. A., & Giallafos, E. J. (2018). Can wearable devices accurately measure heart rate variability? A systematic review. *Folia Medica, 60*(1), 7–20. https://doi.org/10.2478/folmed-2018-0012
- Laborde, S., Mosley, E., & Thayer, J. F. (2017). Heart rate variability and cardiac vagal tone in psychophysiological research: Recommendations for experiment planning, data analysis, and data reporting. *Frontiers in Psychology, 8*, Article 213. https://doi.org/10.3389/fpsyg.2017.00213
- Lipponen, J. A., & Tarvainen, M. P. (2019). A robust algorithm for heart rate variability time series artefact correction using novel beat classification. *Journal of Medical Engineering & Technology, 43*(3), 173–181. https://doi.org/10.1080/03091902.2019.1640306
- Quigley, K. S., Gianaros, P. J., Norman, G. J., Jennings, J. R., Berntson, G. G., & de Geus, E. J. C. (2024). Publication guidelines for human heart rate and heart rate variability studies in psychophysiology—Part 1: Physiological underpinnings and foundations of measurement. *Psychophysiology, 61*(9), Article e14604. https://doi.org/10.1111/psyp.14604
- Shaffer, F., & Ginsberg, J. P. (2017). An overview of heart rate variability metrics and norms. *Frontiers in Public Health, 5*, Article 258. https://doi.org/10.3389/fpubh.2017.00258
- Task Force of the European Society of Cardiology and the North American Society of Pacing and Electrophysiology. (1996). Heart rate variability: Standards of measurement, physiological interpretation and clinical use. *Circulation, 93*(5), 1043–1065. https://doi.org/10.1161/01.CIR.93.5.1043

> **資料與查核說明：**本文先以作者的 HRV NotebookLM 資料庫定位跨來源內容，再回到方法指引與來源書目整理。NotebookLM 是檢索工具，不是證據本身；本文為持續更新的學習筆記，重要研究決策仍應核對原始全文與設備文件。

<!-- PROFESSIONAL -->
# 從量測事件到可分析的 NN interval：BBI、RRI、IBI 與 NNI

## 操作型定義

令第 `i` 個 ECG R peak 的時間為 `tᵣ(i)`：

`RRI(i) = tᵣ(i+1) − tᵣ(i)`

若兩個相鄰 QRS complex 均源自竇房結去極化，並已處理技術偽影、錯誤峰值與不適合納入的異常搏動，該間隔才可納入 NNI 序列。NNI 因此不是另一種感測器輸出，而是經生理判定與品質控制後的分析構念。

令第 `i` 個 PPG pulse fiducial point 的時間為 `tₚ(i)`：

`PPI(i) = tₚ(i+1) − tₚ(i)`

部分裝置與文獻將此輸出稱為 BBI。研究報告應把縮寫綁定到操作型定義，例如 `wrist-PPG-derived BBI`，並將其變異標示為 PRV。這可避免把周邊脈搏到達時間的變化誤併入 ECG 所定義的 RRI。

## 心率與心搏週期不是線性轉換

`HR(i) = 60,000 / interval(i)`

因為此關係為倒數函數，`mean[60,000 / interval(i)]` 一般不等於 `60,000 / mean[interval(i)]`。方法中應說明報告的是逐拍瞬時心率平均，或由平均心搏週期換算的心率。

## RR 到 NN 的品質控制邏輯

| 問題 | 序列上的可能表現 | 優先查核 | 不應直接做的事 |
|---|---|---|---|
| Extra detection | 一個真實週期被切成數個短間隔 | 回看原始 ECG 與 peak labels | 把它當成真實高 HRV |
| Missed detection | 一個間隔約為鄰近週期的倍數 | 回看是否存在未標記的 R peak | 未說明就均分或插值 |
| Ectopic beat | 短—長或其他節律改變 | QRS／P wave 形態與節律是否重置 | 當成單純技術 artifact |
| Misaligned detection | peak 位置偏移，successive differences 異常 | peak fiducial point 是否一致 | 只靠固定生理門檻判定 |
| Long gap | 一段連續資料不存在 | 配戴、動作、設備與時間戳 | forward fill 或跨長缺口製造資料 |

Lipponen 與 Tarvainen（2019）示範以隨時間變動的 successive-RR-difference 門檻分類 extra、missed、misaligned 與 ectopic beats；這是可重現的方法範例，不代表所有 ECG、胸帶或 PPG 資料都能直接套用相同參數。自動標記後仍應依研究設計進行波形或序列審查，並保存原始資料與修正紀錄。

## 最低報告項目

一份可重現的 HRV／PRV 方法至少應記錄：

1. 訊號來源、裝置型號、感測位置與取樣資訊。
2. 每拍使用的 fiducial point 與 peak-detection 方法。
3. interval 的名稱與操作型定義。
4. extra、missed、ectopic、misaligned 與 gap 的判定方式。
5. 人工檢查、自動校正、刪除及插補規則。
6. 原始與有效 interval 數、有效時間、修改比例及最長缺口。
7. HRV 或 PRV 指標、分析視窗、軟體與版本。

## 證據界線

靜息條件下部分穿戴裝置的 PRV 與 ECG-HRV 指標可呈現良好一致性，但這是特定裝置、指標、族群與量測情境下的效度結果，不是 PPI 與 RRI 在生理或數學上完全相同的證明。運動、動作、周邊灌流改變或節律異常時，這項假設尤其需要重新驗證。

參考文獻與自我檢核題同 SIMPLE 版。本文的下一步是把這些定義套用到一小段真實或模擬 interval 序列，練習標記 extra detection、missed detection、ectopic beat 與 long gap。
