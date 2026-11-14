<!-- SIMPLE -->
# 12 導程 ECG 與 PPG 設備：怎麼和「黃金標準」比較？

很多人說「這支手錶和 ECG 比起來準不準」，但這句話其實有兩個模糊的地方：**ECG 指的是哪一種**，以及「準」是要比較**哪一個數字**。這篇先把兩件事分開，再給你一套可以照著走的比較流程。

延伸閱讀：[Garmin 可以取代 ECG 嗎？](#/post/garmin-ecg-validation-study-design)有更完整的文獻與先導實驗；[從一次心跳開始](#/post/hrv-bbi-rri-ibi-nni)說明 BBI、RRI 與 NNI 的差別。

## 「黃金標準」其實有好幾層

| 層級 | 它是什麼 | 在 HRV 驗證裡的角色 |
|---|---|---|
| 12 導程 ECG | 在身體貼 10 個電極，從 12 個角度記錄心臟電活動 | 臨床判讀節律與波形的標準；常規記錄通常只有約 10 秒 |
| 連續 ECG（研究級） | 持續記錄數分鐘到數小時的 ECG，常用單一或少數導程 | **HRV 驗證實際使用的參考**；從清楚的 R 峰算出心跳間隔 |
| 胸帶 | 用電極偵測心電的胸帶式裝置 | 常被當成「中間參考」，但它本身也需要和 ECG 驗證 |
| 腕式 PPG 手錶 | 用光偵測血管體積變化 | 通常是**被測試的對象**，不是參考 |

所以「和 12 導程 ECG 比較」不一定是最合適的做法。12 導程的 10 秒記錄太短，算不出可靠的 HRV；HRV 常見的短期標準是約 5 分鐘（Task Force, 1996）。更常見的做法是：用 12 導程確認節律是否正常，再用連續 ECG 當 HRV 的參考。

## 為什麼 12 導程不一定比單一導程更適合算 HRV？

HRV 只需要**每一次心跳的 R 峰位置**。只要有一條乾淨、R 波清楚的導程就能算。12 導程的價值在於：

- 看出心律是否正常，有沒有異位心搏或其他節律問題；
- 有標準的電極位置（Kligfield et al., 2007），方便不同研究對照；
- 如果某個導程雜訊太大，可以換看另一個導程。

但它的限制也很實際：運動時 10 個電極與導線容易晃動，受試者的負擔也比較大。

## PPG 為什麼不能直接當 ECG 比？

ECG 記錄的是**心臟的電訊號**，R 峰是很明確的事件。PPG 看的是**血管裡血液量的變化**：心臟收縮後，脈搏波要傳到手腕才被感測到，傳遞時間會受血管硬度、血壓、呼吸與動作影響。因此 PPG 得到的是**脈搏間隔**，這種變異稱為 PRV，不等於 ECG 的 HRV。

有回顧指出，PRV 在靜息、健康成人中與 HRV 較接近，但不應把兩者視為可以直接互換（Schäfer & Vagedes, 2013）。運動、動作或低灌流時，PPG 的訊號品質也可能變差，膚色與活動情境都是研究過的誤差來源（Bent et al., 2020）。

## 比較流程：六步

1. **先寫用途**。你想用這個設備做什麼？觀察自己一個月的趨勢，和研究中取代 ECG，需要的準確度完全不同。
2. **在比較前就定下可接受的誤差界線**。例如「平均偏差不得超過多少、典型誤差不得超過多少」。事後才看數字很容易自圓其說。
3. **兩個設備同時記錄，並對齊時間**。同一段時間、同一個人，兩台時鐘要同步。
4. **兩邊各自做品質控制**。不要用 ECG 的結果去修 PPG 的缺口，反過來也不行。資料遺失的比例本身就是結果。
5. **分三層比較**：心率（HR）→ 逐拍間隔（BBI／RRI）→ HRV 指標（如 RMSSD）。心率準，不代表逐拍間隔準。
6. **分情境報告**：靜息、呼吸控制、運動中、運動後恢復，不要混成一個數字。

## 比較要用什麼統計

只算相關係數不夠。兩個設備可以高度相關，卻一直差一個固定的數值。至少要同時看：

- **平均偏差（bias）**：一個設備平均高估或低估多少；
- **一致性界線（limits of agreement）**：多數個別差異大概落在哪個範圍（Bland & Altman, 1986）；
- **ICC 或 CCC**：排序與數值一致的程度（Koo & Li, 2016；Lin, 1989）；
- **MAE／MAPE**：典型誤差有多大。

同一個人重複量很多次，這些資料**不是獨立的**，需要用重複量測適用的方法（Bland & Altman, 1999）。

## 常見錯誤

- 把胸帶或手錶本身的內建 HRV 數值，當成經過驗證的逐拍資料；
- 兩個設備沒有同步時間，就開始配對心跳；
- 用單一受試者、數萬次心跳，就宣稱「驗證了」；
- 只報相關係數；
- 把靜息的結果拿去支持運動中的使用。

## 今天的小練習

拿你手上的一個設備，用一句話寫下：**用途是什麼、參考是哪一種、誤差界線是多少、在哪個情境測**。寫不出來，就還不能說自己要「驗證」。

<!-- PROFESSIONAL -->
# HRV 設備與參考標準比較：參考階層、方法比較設計與一致性分析

## 估計目標先於統計方法

設備比較的目標應寫成：在指定族群與情境下，測試方法的某項輸出與參考方法的同一項輸出，其差異是否落在**預先定義**的可接受界線內。「HR」「逐拍間隔」與「HRV 指標」是三個不同的 estimand，應分開判定。詳細的三層架構與公開研究整理見[Garmin–ECG 方法比較](#/post/garmin-ecg-validation-study-design)。

## 參考方法階層

| 方法 | 量測事件 | 適用 | 主要限制 |
|---|---|---|---|
| 12 導程 ECG | 心室去極化（R 波）及完整波形 | 節律判讀、確認異位搏動、決定導程與電極位置（Kligfield et al., 2007） | 常規記錄通常僅約 10 秒，不足以估計短期 HRV；運動時電極與導線易受動作影響 |
| 連續 ECG（單導程或 Holter 類型） | R 峰 → RRI | HRV 的實務參考；可記錄 5 分鐘以上的區段（Task Force, 1996） | 仍需 R 峰偵測、異位搏動處理與人工檢視；不是無誤差 |
| 胸帶 | 電極偵測 R 峰 | 運動情境的中間參考；靜息 RR 間隔曾與 ECG 比較（Giles et al., 2016） | 驗證結果依型號與情境而異，需先與 ECG 驗證才能當參考 |
| 腕式 PPG | 脈搏波特徵點 → PPI／BBI | 受測方法 | 量測的是 PRV，受脈搏傳遞、動作、灌流與廠商演算法影響（Bent et al., 2020；Schäfer & Vagedes, 2013） |

「黃金標準」是**相對於用途**的說法。若目的是比較 RMSSD，參考應是經過品質控制的連續 ECG RRI，而不是 12 導程的 10 秒記錄。

## 設計

1. **同步記錄**。兩設備同時開始，使用共同的事件標記或可驗證的時間對齊，並報告殘餘時間偏移。
2. **情境分層**。靜息、控制呼吸、動作與恢復分開設計與分析；每個情境各自預先指定界線。
3. **分析單位**。受試者是獨立單位；同一人的大量心搏、多個窗口不是獨立樣本。
4. **各自獨立的 QC**。參考與測試各自偵測、標記、處理異常搏動；若用一方的結果修正另一方，會使一致性被高估。
5. **缺失資料是結果**。報告每個情境中測試方法缺失或被排除的比例，而不是只分析存活的資料。
6. **逐拍配對**。先預先指定配對窗口，再比較 BBI；未配對的搏動（漏拍、多拍）要另外計數。

## 一致性分析

- **Bias 與 limits of agreement**：說明平均偏差與個別差異範圍（Bland & Altman, 1986）；重複量測資料需考慮受試者內變異（Bland & Altman, 1999）。
- **比例偏差**：檢查差異是否隨指標大小改變；RMSSD 與 SDNN 這類偏態指標常需轉換後再分析。
- **ICC 與 CCC**：明確寫出 ICC 的類型與模型（Koo & Li, 2016）；CCC 同時反映相關與偏離對角線的程度（Lin, 1989）。
- **誤差量**：MAE、RMSE、MAPE，與預先定義的界線比較。
- **相關係數**：只能作輔助；高相關不能代表可互換。

## PPG 特有的誤差來源

動作、灌流、膚色與佩戴鬆緊、廠商濾波與插補、脈搏特徵點的選取，以及脈搏傳遞時間的變化，都可能造成 PPI 與 RRI 不同（Bent et al., 2020；Schäfer & Vagedes, 2013）。因此測試報告需附上：設備型號、韌體、演算法版本、取樣率、是否使用廠商摘要值或原始間隔，以及每個逐拍資料的品質旗標。

## 最低報告項目

- 設備、韌體、演算法與取樣率；ECG 的導程與電極位置、濾波與 R 峰偵測方法；
- 受試者特徵、量測情境、持續時間與姿勢；
- 同步方法與配對規則；
- 各方 QC 規則、排除與缺失比例；
- 預先指定的界線與選擇理由；
- bias、LoA（含信賴區間）、ICC／CCC 類型、MAE 與重複量測處理方式；
- 結果不能外推的族群、情境與指標。

請同時對照近年的 HRV 報告指引（Quigley et al., 2024；Carter et al., 2026）檢查是否有遺漏項目。

## 證據界線

本文是學習與設計框架，不是設備驗證結論。任何特定型號與指標的可用性，都需要回到對應研究的族群、情境與樣本大小逐項核對。

## 參考文獻（APA 7th）

- Bent, B., Goldstein, B. A., Kibbe, W. A., &amp; Dunn, J. P. (2020). Investigating sources of inaccuracy in wearable optical heart rate sensors. *npj Digital Medicine, 3*, Article 18. https://doi.org/10.1038/s41746-020-0226-6
- Bland, J. M., &amp; Altman, D. G. (1986). Statistical methods for assessing agreement between two methods of clinical measurement. *The Lancet, 327*(8476), 307–310. https://doi.org/10.1016/S0140-6736(86)90837-8
- Bland, J. M., &amp; Altman, D. G. (1999). Measuring agreement in method comparison studies. *Statistical Methods in Medical Research, 8*(2), 135–160. https://doi.org/10.1177/096228029900800204
- Carter, J. R., Jenkins, N. D. M., Bigalke, J. A., Robinson, A. T., Keller-Ross, M. L., Greaney, J. L., Fonkoue, I. T., Fadel, P. J., Macefield, V. G., Charkoudian, N., Levine, B. D., &amp; Joyner, M. J. (2026). Guidelines for rigor and reproducibility of heart rate variability within human cardiovascular research. *American Journal of Physiology-Heart and Circulatory Physiology, 331*(3), H918–H943. https://doi.org/10.1152/ajpheart.00041.2026
- Giles, D., Draper, N., &amp; Neil, W. (2016). Validity of the Polar V800 heart rate monitor to measure RR intervals at rest. *European Journal of Applied Physiology, 116*(3), 563–571. https://doi.org/10.1007/s00421-015-3303-9
- Kligfield, P., Gettes, L. S., Bailey, J. J., Childers, R., Deal, B. J., Hancock, E. W., van Herpen, G., Kors, J. A., Macfarlane, P., Mirvis, D. M., Pahlm, O., Rautaharju, P., &amp; Wagner, G. S. (2007). Recommendations for the standardization and interpretation of the electrocardiogram: Part I: The electrocardiogram and its technology. *Circulation, 115*(10), 1306–1324. https://doi.org/10.1161/CIRCULATIONAHA.106.180200
- Koo, T. K., &amp; Li, M. Y. (2016). A guideline of selecting and reporting intraclass correlation coefficients for reliability research. *Journal of Chiropractic Medicine, 15*(2), 155–163. https://doi.org/10.1016/j.jcm.2016.02.012
- Lin, L. I.-K. (1989). A concordance correlation coefficient to evaluate reproducibility. *Biometrics, 45*(1), 255–268. https://doi.org/10.2307/2532051
- Quigley, K. S., Gianaros, P. J., Norman, G. J., Jennings, J. R., Berntson, G. G., &amp; de Geus, E. J. C. (2024). Publication guidelines for human heart rate and heart rate variability studies in psychophysiology—Part 1: Physiological underpinnings and foundations of measurement. *Psychophysiology, 61*(9), Article e14604. https://doi.org/10.1111/psyp.14604
- Schäfer, A., &amp; Vagedes, J. (2013). How accurate is pulse rate variability as an estimate of heart rate variability? *International Journal of Cardiology, 166*(1), 15–29. https://doi.org/10.1016/j.ijcard.2012.03.119
- Task Force of the European Society of Cardiology and the North American Society of Pacing and Electrophysiology. (1996). Heart rate variability: Standards of measurement, physiological interpretation, and clinical use. *European Heart Journal, 17*(3), 354–381.

> 本頁為學習導引，不構成醫療建議，也不是特定設備的驗證結論。
