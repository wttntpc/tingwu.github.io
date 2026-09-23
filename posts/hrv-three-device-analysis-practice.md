<!-- SIMPLE -->
# 從 BBI／RRI 到可比較的 HRV：我的 Garmin、Portable ECG 與 BIOPAC 分析實作

> <strong>HRV 學習實作篇｜2026 年 9 月分析紀錄</strong><br>
> 這篇文章整理我目前在 `HRV_0910` 專案中真正做過的步驟、初步看見的現象，以及仍不能下結論的地方。它的目標不是證明某一台設備「準」或「不準」，而是示範如何把三種來源不同的心搏資料放進一條可檢查的分析流程。

[回到 HRV 學習地圖](#/post/hrv-learning-map) · [先讀：BBI、RRI、IBI 與 NNI](#/post/hrv-bbi-rri-ibi-nni) · [研究設計篇：Garmin 可以取代 ECG 嗎？](#/post/garmin-ecg-validation-study-design)

<figure class="article-figure">
  <img src="assets/hrv-three-device-analysis-workflow.svg" alt="Garmin、Portable ECG 與 BIOPAC 經共同時間窗、品質控制、敏感度分析及分層推論形成 HRV 分析流程" loading="lazy">
  <figcaption>目前的分析主線：三種設備先轉成可比較的心搏間隔，再以共同時間窗、逐拍 QC 與敏感度分析建立可解釋結果。</figcaption>
</figure>

## 我現在真正想回答的問題

這個專案同時記錄三種設備：Garmin Forerunner 255、Portable ECG 與 BIOPAC ECG。最初的問題看似簡單：「手錶用 PPG 算出的 BBI，可以相信到什麼程度？」實際開始分析後，我才發現這句話至少包含四個不同問題：

1. 三台設備在同一段時間內，是否記到相近數量的心搏間隔？
2. 平均心率與 Mean NN 是否接近？
3. SDNN、RMSSD 等逐拍變異指標是否也接近？
4. 靜坐時成立的結果，在身體活動時還成立嗎？

這四題不能用同一個「相關係數」回答。平均心率接近，不代表每一拍的位置都正確；每拍誤差很小，也可能被 RMSSD 放大。因此目前的專案更像一個**設備比較與分析流程的先導研究**。

## 實驗如何安排？

目前資料來自兩位先導參與者。三台設備在同一次流程中同步記錄五個情境：

1. 睜眼靜坐（活動前）
2. 閉眼靜坐（活動前）
3. 依 100 bpm 節奏原地踏步
4. 睜眼靜坐（活動後）
5. 閉眼靜坐（活動後）

每個情境擷取開始後第 20–320 秒，共 300 秒。前 20 秒不納入，是希望避開剛切換姿勢或指令時的短暫不穩定。三台設備必須使用相同分析窗，否則差異可能只是比較了不同的生理時段。

## 三台設備量到的其實不完全一樣

| 設備 | 原始來源 | 分析取得的間隔 | 目前能檢查什麼？ |
|---|---|---|---|
| Garmin Forerunner 255 | 腕部 PPG 經裝置內部演算法處理 | BBI 與寫入時間戳 | 可檢查間隔值、缺口與時間戳；看不到原始 PPG 波形及演算法 |
| Portable ECG | 官方軟體匯出的三導程 ECG；目前使用 Lead II | 相鄰 R peaks 的 RRI | 可回看波形、候選 R peaks 並逐拍人工複核 |
| BIOPAC | Lead II 原始 ECG，取樣率 1000 Hz | 相鄰 R peaks 的 RRI | 可檢查原始電壓、濾波、找峰與逐拍間隔 |

ECG 偵測的是心臟去極化的電活動；腕式 PPG 偵測的是周邊血容量變化。兩者都跟心搏有關，卻不是同一個物理事件。PPG 還受到脈搏傳遞時間、末梢灌流、配戴方式與動作的影響，所以把 BBI 直接稱為 ECG 的 RRI 替代品並不嚴謹。

## 從原始波形到 RRI：為什麼 ECG 也不是按一下就完成？

Portable ECG 與 BIOPAC 都需要從連續波形找出 R peak。目前程式使用相同的偵測主線：

- 以三階 Butterworth 5–25 Hz band-pass 做零相位濾波；
- 以 `find_peaks` 尋找候選 R peak；
- 相鄰候選峰至少相隔 0.30 秒；
- prominence 門檻設為濾波後訊號標準差的 1.5 倍；
- 相鄰兩個 R peaks 的時間差換算為 RRI（ms）。

採用相同偵測邏輯，有助於減少「兩台 ECG 只是因分析演算法不同而看起來不一致」的情況。不過，這些門檻仍是目前專案設定，不是放諸四海皆準的標準。正式研究還需要逐段視覺檢查、記錄人工修正，並測試其他合理參數是否改變結果。

## 品質控制不是把不喜歡的數字刪掉

目前逐拍 QC 先做「標記」，保留原始資料與每一個決策，再決定某拍是否進入指標計算：

- **生理範圍旗標**：間隔小於 300 ms 或大於 1500 ms。
- **局部變化旗標**：與前 5 拍中位數相比，變化達 20% 以上。
- **Garmin 時間戳缺口旗標**：相鄰寫入時間超過 1.5 秒。

Garmin 的時間戳可能代表「這筆 BBI 何時被裝置寫出」，不一定就是該心搏發生的精確時刻，所以 gap 不能自動等同漏拍。這正是要保留原始值、旗標原因與人工審查紀錄的理由。

目前也同時比較三種處理方式：全部保留、刪除被標記的間隔、刪除後以線性方法插補。這叫做**敏感度分析**。如果某個結論只在其中一種處理方式成立，就要承認它對資料清理選擇敏感，而不能包裝成穩定的生理發現。

## 現在計算了哪些 HRV 指標？

| 層次 | 指標 | 目前學到的解讀重點 |
|---|---|---|
| 基本速度 | Mean NN、Mean HR | 平均值可能很接近，卻掩蓋少量錯拍或漏拍 |
| 時域 | SDNN、RMSSD、pNN50 | SDNN 受記錄長度影響；RMSSD 對相鄰拍誤差特別敏感 |
| 頻域 | LF、HF、LF/HF | 需要說明內插、重取樣、PSD 方法與頻帶；LF/HF 不宜直接稱為交感／副交感平衡 |
| 非線性視覺 | Poincaré plot、SD1、SD2 | SD1 描述短期散布，與 RMSSD 有密切數學關係；SD2 描述較長軸向散布 |

頻域分析目前可選擇兩條路：先以 cubic spline 將不規則間隔重取樣為 4 Hz，再以 Welch 方法估計功率；或直接以 Lomb–Scargle 分析不規則取樣序列。兩種方法的絕對功率尺度不能混著比較，因此方法必須固定並完整報告。

## 目前看見了什麼？又不能說什麼？

在四個靜態情境中，三台設備的 Mean HR 與 Mean NN 呈現相近趨勢；兩台 ECG 的逐拍數量也很接近，Garmin 某些窗口的 interval count 略少。相較平均值，SDNN 與 RMSSD 的設備差異更明顯，Garmin 在這組先導資料的靜態窗口呈現較高的趨勢。進入原地踏步後，設備間差異與處理方法敏感性都明顯增加。

這些現象符合「平均心率比逐拍變異更容易量準」與「PPG 在動作中更容易受到偽影影響」的預期，但目前**只能稱為先導觀察**：

- 只有 2 位參與者，不能代表更廣泛族群。
- 四個靜態情境形成 8 個視窗，但它們仍巢狀於同 2 個人，不能假裝是 8 位獨立受試者。
- 目前的 ICC、MAPE 與 Bland–Altman 結果適合用來偵錯與規劃正式研究，不適合據此宣布設備可以互換。
- 動作情境每人只有一個窗口，且偽影、同步與找峰問題交纏，應優先檢查波形與可用率，而不是急著解讀自律神經。

因此，最安全的現階段結論是：**流程已能辨認靜態與動作條件的差異，也能指出平均指標與變異指標並非同一層次；但它尚未完成 Garmin 的正式效度驗證。**

## 這次實作讓我真正學到的六件事

1. **BBI 數值與寫入時間戳要分開理解。** 時間戳跳動不一定等於心搏漏失。
2. **ECG 是參考方法，不是免除 QC 的完美答案。** 電極、濾波、找峰與人工複核都會影響 RRI。
3. **平均值接近不代表 HRV 接近。** RMSSD、SD1 等短期變異指標會放大逐拍誤差。
4. **動作與靜息必須分層。** 把兩者混成一個平均值，會掩蓋 PPG 最重要的使用限制。
5. **資料清理本身就是研究決策。** 保留、刪除或插補需要留下版本與敏感度結果。
6. **先導研究的價值是找到問題。** 它用來測流程、估計變異與規劃樣本，不是提早宣布最終答案。

## 下一步要如何把它升級成研究？

1. 先定義主要用途與接受界線：個人趨勢監測、研究量測或運動即時回饋需要不同誤差標準。
2. 增加參與者，讓人而不是心搏或窗口成為樣本數規劃核心。
3. 加入共同同步事件並檢查 clock drift，再進行 beat-to-beat matching。
4. 預先註冊主要指標、QC 規則與敏感度分析，避免看完結果才選最漂亮的方法。
5. 將靜息與動作分開建模，對重複量測使用 repeated-measures Bland–Altman 或 mixed-effects model。
6. 報告資料可用率、被標記比例、最長缺口、人工修正比例與逐情境失敗案例。
7. 建立獨立人工複核流程，評估 R peak 與 artifact 判定的一致性。

## 給讀者的實作檢查表

在計算 HRV 以前，先問自己：我看過原始波形嗎？三台設備真的對到同一段時間嗎？每一個刪除與插補能追溯嗎？活動和休息是否分開？我的樣本數是「人」還是被誤算成很多心搏？如果這五題尚未回答，先不要急著解讀交感、副交感或健康狀態。

## 參考文獻（APA 7th）

- Bent, B., Goldstein, B. A., Kibbe, W. A., & Dunn, J. P. (2020). Investigating sources of inaccuracy in wearable optical heart rate sensors. *npj Digital Medicine, 3*, Article 18. https://doi.org/10.1038/s41746-020-0226-6
- Bland, J. M., & Altman, D. G. (1986). Statistical methods for assessing agreement between two methods of clinical measurement. *The Lancet, 327*(8476), 307–310. https://doi.org/10.1016/S0140-6736(86)90837-8
- Koo, T. K., & Li, M. Y. (2016). A guideline of selecting and reporting intraclass correlation coefficients for reliability research. *Journal of Chiropractic Medicine, 15*(2), 155–163. https://doi.org/10.1016/j.jcm.2016.02.012
- Laborde, S., Mosley, E., & Thayer, J. F. (2017). Heart rate variability and cardiac vagal tone in psychophysiological research: Recommendations for experiment planning, data analysis, and data reporting. *Frontiers in Psychology, 8*, Article 213. https://doi.org/10.3389/fpsyg.2017.00213
- Quigley, K. S., Gianaros, P. J., Norman, G. J., Jennings, J. R., Berntson, G. G., & de Geus, E. J. C. (2024). Publication guidelines for human heart rate and heart rate variability studies in psychophysiology—Part 1: Physiological underpinnings and foundations of measurement. *Psychophysiology, 61*(9), Article e14604. https://doi.org/10.1111/psyp.14604
- Schäfer, A., & Vagedes, J. (2013). How accurate is pulse rate variability as an estimate of heart rate variability? A review on studies comparing photoplethysmographic technology with an electrocardiogram. *International Journal of Cardiology, 166*(1), 15–29. https://doi.org/10.1016/j.ijcard.2012.03.119
- Shaffer, F., & Ginsberg, J. P. (2017). An overview of heart rate variability metrics and norms. *Frontiers in Public Health, 5*, Article 258. https://doi.org/10.3389/fpubh.2017.00258
- Task Force of the European Society of Cardiology and the North American Society of Pacing and Electrophysiology. (1996). Heart rate variability: Standards of measurement, physiological interpretation, and clinical use. *European Heart Journal, 17*(3), 354–381. https://pubmed.ncbi.nlm.nih.gov/8737210/

> <strong>資料、隱私與證據界線：</strong>本文依作者本機 `HRV_0910` 專案的實驗說明、分析程式、彙總輸出與最新版研究簡報整理。網站與 GitHub 僅放方法、概念圖及不具識別性的整體方向；原始生理訊號、實驗照片、逐拍資料與可識別紀錄均未上傳。本文是兩人先導資料的學習紀錄，不構成醫療建議或產品效度聲明。

<!-- PROFESSIONAL -->
# 三設備 HRV 先導分析：從量測鏈、artifact QC 到重複量測一致性推論

## 文章定位與證據層級

本文記錄 `HRV_0910` 專案目前的 reproducible analysis prototype。資料由 Garmin Forerunner 255、Portable ECG 與 BIOPAC ECG 同步取得，核心任務是建立可稽核的資料轉換、時間窗、R-peak detection、interval QC、HRV feature extraction 與 method-comparison 流程。由於目前只有 2 位參與者，本專案可支持 pipeline verification、failure-mode discovery 與後續樣本規劃，不能支持產品層級的 criterion-validity 宣稱。

[回到 HRV 學習地圖](#/post/hrv-learning-map) · [概念基礎：BBI、RRI、IBI 與 NNI](#/post/hrv-bbi-rri-ibi-nni) · [正式驗證研究設計](#/post/garmin-ecg-validation-study-design)

<figure class="article-figure">
  <img src="assets/hrv-three-device-analysis-workflow.svg" alt="三設備 HRV 先導分析的量測、時間窗、品質控制、敏感度與推論流程" loading="lazy">
  <figcaption>分析架構。裝置輸出先各自轉成 interval-level 資料，再於共同時間窗進行 QC、feature extraction 與條件分層比較。</figcaption>
</figure>

## 研究問題與設計

先導流程包含 2 位參與者、3 種設備與 5 個連續情境：EO(pre)、EC(pre)、PA(100 bpm)、EO(post)、EC(post)。每個情境以開始後 20–320 s 為固定 300 s 分析窗。此設計同時提供四個靜態窗口與一個動作窗口，適合測試 wearable PPG 在 signal regime 改變時的失敗模式，但目前不能把 condition-level observations 當成獨立受試者。

需要分離的 estimands 至少有：

1. **Availability**：裝置能否在預定窗口持續輸出可用 intervals？
2. **Rate-level agreement**：window-level Mean HR 與 Mean NN 的差異。
3. **Variability-level agreement**：SDNN、RMSSD、pNN50、LF、HF、SD1、SD2 的差異。
4. **Beat-level agreement**：在完成可靠同步與 event matching 後，每一個 BBI 與 ECG RRI 的誤差、漏拍、重複與錯配率。

目前已建立前三層的探索性輸出；第四層仍受 Garmin timestamp 語義、共同同步事件與原始 PPG 不可見性限制。

## 三種量測鏈與可觀察性差異

### Garmin PPG-BBI

Garmin JSON 提供 BBI 與 Unix timestamp。程式將時間轉為 Asia/Taipei，依情境切窗，再產生 interval-level audit table。重要限制是 BBI 已經由封閉演算法產生，無法回到原始 PPG pulse waveform 或確認 pulse fiducial point；timestamp 更可能是 output/update time，而非精確 pulse occurrence time。因此 Garmin 的 interval magnitude 與 timestamp gap 應分開審查。

### Portable ECG

原始資料由官方 Thoth viewer 匯出 CSV，含 RTC、Lead I／II／III 及 PPG 欄位；目前選擇 `ECG_L2_uV`。廠商匯出前已套用 0.15–50 Hz band-pass 與 60 Hz notch，分析端再針對 R-peak detection 使用 5–25 Hz zero-phase band-pass。這代表「共同找峰演算法」不等於「完全相同的前端訊號鏈」，方法報告時必須保留這項差異。

### BIOPAC ECG

BIOPAC `.mat` 內含連續電壓與 inter-sample interval；本資料取樣率為 1000 Hz，使用 Lead II。BIOPAC 沒有可直接與 Garmin 對應的絕對時間戳，因此目前以紀錄起點與估計 offset 進行時間窗對齊。正式 beat-level validation 應加入共同硬體事件或同步標記，並估計 session 內 clock drift。

## ECG R-peak detection 與 interval 建構

兩套 ECG 的 analysis-side detector 目前共同使用：三階 Butterworth 5–25 Hz band-pass、`sosfiltfilt` 零相位處理、`find_peaks`、0.30 s refractory distance，以及 1.5 × filtered-signal SD 的 prominence threshold。若候選 R-peak 時間為 <i>t<sub>i</sub></i>，則：

<div class="article-equation">RRI<sub>i</sub> = (t<sub>i</sub> − t<sub>i−1</sub>) × 1000 ms</div>

統一 detector 可降低 algorithm-induced disagreement，但不能取代視覺複核。後續應建立：raw waveform、filtered waveform、candidate peaks、manual action 與 final intervals 的 immutable audit trail，並抽樣評估 peak detection sensitivity、positive predictive value 及 reviewer agreement。

## Interval QC：旗標、處理與估計目標要分開

現行規則包含：

| 規則 | 門檻 | 適用設備 | 角色 |
|---|---:|---|---|
| Physiological range | 300–1500 ms | 三設備 | 標記極端 interval |
| Local change | 相對前 5 拍中位數 ≥20% | 三設備 | 標記局部突變 |
| Timestamp gap | >1.5 s | Garmin | 標記輸出延遲、缺口或潛在漏寫 |

`qc_any_flag` 用於呈現所有被標記事件；是否排除則應由另一個 `qc_exclude_flag` 決定。這種分離避免「取消排除」被誤解為「資料沒有品質問題」。目前 sensitivity analysis 比較 `keep_all`、`delete_only` 與 `delete_interpolate`；插補採線性法，避免 cubic spline 在單拍 artifact 附近 overshoot。cubic spline 保留給頻域分析的均勻重取樣，兩種 interpolation 的目的不應混用。

下一版 QC 應補上 ectopic-beat classification、consecutive artifact run、window-level usable proportion、longest gap 與 pre-specified window exclusion threshold。規則的 300–1500 ms 與 20% 是現行 operational thresholds，不應宣稱為普遍最佳值。

## Feature extraction 與方法相依性

對每個 participant × condition × device 計算：interval count、Mean NN、Mean HR、SDNN、RMSSD、pNN50、LF、HF、LF/HF、SD1 與 SD2。核心時域公式為：

<div class="article-equation">SDNN = SD(NN<sub>1</sub>, …, NN<sub>n</sub>)</div>
<div class="article-equation">RMSSD = √［Σ(NN<sub>i+1</sub> − NN<sub>i</sub>)² ÷ (n − 1)］</div>
<div class="article-equation">SD1 = √［Var(ΔNN) ÷ 2］</div>
<div class="article-equation">SD2 = √［2Var(NN) − Var(ΔNN) ÷ 2］</div>

Welch 路徑先用 cubic spline 以 4 Hz 重取樣 interval series，再估計 LF 0.04–0.15 Hz 與 HF 0.15–0.40 Hz；Lomb–Scargle 路徑則直接處理不規則取樣。兩條路徑的 spectral scaling 不同，不能把絕對 LF／HF 數值跨方法直接比較。報告時需寫明 detrending、interpolation、sampling frequency、segment length、overlap、window function 與 integration rule。

LF/HF 不應直接標示為 sympathovagal balance。RMSSD、HF 與 SD1 可受呼吸相關迷走調節影響，但仍依賴呼吸頻率、姿勢、量測長度、心率及資料處理。Quigley 等人（2024）也強調需完整報告硬體、sensor placement、sampling、filtering 與 spectral settings。

## 目前的探索性結果如何解讀？

### 靜態窗口

在 EO/EC 的前後四個靜態窗口，三設備的 Mean HR 與 Mean NN 呈高度接近的描述性模式；BIOPAC 與 Portable ECG 的 interval count 接近，Garmin 在部分窗口較少。Garmin SDNN 呈小幅正向偏差，RMSSD 的正向偏差更明顯；兩台 ECG 的 SDNN 與 RMSSD 較接近。這與 PRV 在休息時通常較接近 HRV、但短期變異可能被高估的文獻方向相容（Schäfer & Vagedes, 2013），但相容不等於證實。

現有輸出以 8 個 static participant-condition windows 計算 bias、LoA、MAPE 與 ICC(2,1)。這些數字是有用的 pipeline diagnostic，卻有三個統計限制：第一，8 個窗口巢狀於 2 個人；第二，ICC 在極小且異質樣本中非常不穩定；第三，普通 Bland–Altman 假設獨立差值，未處理 repeated measures。正式研究應提供 participant-level replication，使用 repeated-measures Bland–Altman 或 multilevel model，並為 bias 與 LoA 提供 confidence intervals。

### 動作窗口

PA(100 bpm) 中，三設備的 interval count、Mean NN 與 HRV features 分歧增加；QC 處理方式對 SDNN、RMSSD 與頻域指標的影響也較大。此結果應先視為 motion-related failure signal，而非自主神經差異。需要依序排查 ECG R-peak detection、PPG motion artifact、Garmin availability、時間對齊與 window stationarity。每人僅一個動作窗口，任何 ICC 或 LoA 都不具穩定推論基礎。

## 現階段可以與不可以寫的結論

| 可支持的敘述 | 尚不可支持的敘述 |
|---|---|
| 已建立三設備的共同時間窗、QC、指標與報告流程 | Garmin 已通過正式 HRV 效度驗證 |
| 靜態與動作資料呈現不同誤差模式 | 目前的 ICC 可代表一般族群可靠度 |
| Mean HR／Mean NN 與 SDNN／RMSSD 必須分層判定 | 高相關或平均接近代表設備可以互換 |
| QC 方法選擇會影響動作窗口的結果 | 單一 20% 門檻是所有情境的最佳清理規則 |
| 現有先導資料可協助 protocol 與樣本規劃 | Garmin PPG 在所有運動狀態皆不可信 |

## 升級為 confirmatory method-comparison study

1. **Protocol freeze**：預先指定 index device、reference、族群、情境、primary estimand、acceptance bounds 與 exclusion rules。
2. **同步**：建立共同事件標記，估計 offset 與 drift；將 beat matching tolerance 寫入 SAP。
3. **樣本規劃**：以 participants 為主要獨立單位，納入 repeated windows 的 intraclass dependence 與 device failure rate。
4. **資料可用性**：accuracy 與 availability 分開；不能只分析兩台都成功輸出的漂亮片段。
5. **盲化複核**：ECG peak reviewer 不看 Garmin 結果；保留 inter-rater agreement 與 adjudication。
6. **分層分析**：靜息、動作、恢復分開；必要時納入 heart rate、呼吸、膚色、腕圍、配戴與 fitness moderator。
7. **一致性推論**：報告 bias、repeated-measures LoA 與 CI；ICC 必須列出 model、type、definition 與 CI；相關僅作補充。
8. **穩健性**：比較 QC 規則、delete／interpolate、Welch／Lomb–Scargle 與不同 window length，並標記 confirmatory／exploratory。

## 可重現資料架構建議

```text
raw/          原始裝置檔（唯讀、受保護，不上傳公開網站）
config/       情境時間、設備資訊、韌體與分析參數
interim/      R peaks、BBI/RRI、同步與 QC flags
derived/      participant × condition × device 的 HRV features
reports/      QC flow、波形抽查、敏感度與一致性報告
code/         裝置別 ingestion + 共用分析函式 + 測試
provenance/   軟體版本、執行時間、輸入雜湊與變更紀錄
```

目前三支獨立分析程式便於單獨搬移，但 QC 與 feature 公式存在重複碼；下一步可在維持裝置別 ingestion adapter 的同時，將經測試的 interval-QC、metric calculation 與 reporting core 抽成共用模組，以降低三支程式設定不同步的風險。

## 參考文獻（APA 7th）

- Bent, B., Goldstein, B. A., Kibbe, W. A., & Dunn, J. P. (2020). Investigating sources of inaccuracy in wearable optical heart rate sensors. *npj Digital Medicine, 3*, Article 18. https://doi.org/10.1038/s41746-020-0226-6
- Bland, J. M., & Altman, D. G. (1986). Statistical methods for assessing agreement between two methods of clinical measurement. *The Lancet, 327*(8476), 307–310. https://doi.org/10.1016/S0140-6736(86)90837-8
- Koo, T. K., & Li, M. Y. (2016). A guideline of selecting and reporting intraclass correlation coefficients for reliability research. *Journal of Chiropractic Medicine, 15*(2), 155–163. https://doi.org/10.1016/j.jcm.2016.02.012
- Laborde, S., Mosley, E., & Thayer, J. F. (2017). Heart rate variability and cardiac vagal tone in psychophysiological research: Recommendations for experiment planning, data analysis, and data reporting. *Frontiers in Psychology, 8*, Article 213. https://doi.org/10.3389/fpsyg.2017.00213
- Quigley, K. S., Gianaros, P. J., Norman, G. J., Jennings, J. R., Berntson, G. G., & de Geus, E. J. C. (2024). Publication guidelines for human heart rate and heart rate variability studies in psychophysiology—Part 1: Physiological underpinnings and foundations of measurement. *Psychophysiology, 61*(9), Article e14604. https://doi.org/10.1111/psyp.14604
- Schäfer, A., & Vagedes, J. (2013). How accurate is pulse rate variability as an estimate of heart rate variability? A review on studies comparing photoplethysmographic technology with an electrocardiogram. *International Journal of Cardiology, 166*(1), 15–29. https://doi.org/10.1016/j.ijcard.2012.03.119
- Shaffer, F., & Ginsberg, J. P. (2017). An overview of heart rate variability metrics and norms. *Frontiers in Public Health, 5*, Article 258. https://doi.org/10.3389/fpubh.2017.00258
- Task Force of the European Society of Cardiology and the North American Society of Pacing and Electrophysiology. (1996). Heart rate variability: Standards of measurement, physiological interpretation, and clinical use. *European Heart Journal, 17*(3), 354–381. https://pubmed.ncbi.nlm.nih.gov/8737210/

> <strong>Provenance 與隱私聲明：</strong>本文以本機專案的 `read.md`、三支裝置分析程式、step-by-step 教學資料、彙總 CSV、QC HTML 與 2026-09-23 版研究簡報交叉核對。原始 ECG／PPG、逐拍資料、實驗照片與個別參與者結果均未複製至公開 GitHub。文中門檻與初步模式描述的是目前 pipeline state，不是醫療建議、已註冊 protocol 或最終產品效度結論。
