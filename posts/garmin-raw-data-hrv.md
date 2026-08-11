<!-- SIMPLE -->

心率變異度（heart rate variability, HRV）描述的不是「一分鐘跳幾下」，而是每一次正常心搏之間的時間是否會隨呼吸、姿勢、壓力、運動與恢復產生細微變化。健康的心臟不是固定節拍器；但「HRV 越高越健康」也不是放諸四海皆準的定律。量測來源、時間長度、呼吸、年齡、藥物、疾病與資料品質，都會改變數值與解讀（Quigley et al., 2024; Shaffer & Ginsberg, 2017）。

> **先記住三句話**：HRV 是心搏間期的變異，不是平均心率；腕式手錶 PPG 量到的是脈搏波，因此嚴格說是 PRV；任何指標都必須連同設備、姿勢、呼吸、量測長度與資料清理方式一起解讀。

<figure class="article-figure">
  <img src="assets/hrv-ecg-ppg-measurement-chain.png" alt="ECG 由相鄰 R 波得到 RRI，腕式 PPG 由相鄰脈搏波得到 BBI；脈搏到達時間與動作、壓力及汗水使兩者不能直接畫上等號" loading="lazy">
  <figcaption>ECG-HRV 與 PPG-PRV 的測量鏈概念圖。這是教學示意，不是原始實驗資料；PPG 與 ECG 之間還隔著脈搏到達時間與裝置演算法。</figcaption>
</figure>

## 一、先分清楚 BBI、RR、NN、PPI 與 PRV

這些縮寫都和「兩拍之間」有關，但來源不同。

| 名稱 | 定義 | 訊號來源 | 單位 |
|---|---|---|---|
| IBI／BBI | 相鄰兩次心搏或脈搏事件的時間差；是較廣義的逐拍間隔名稱 | 依設備而定 | ms |
| RR interval（RRI） | ECG 中相鄰兩個 R 波尖峰的時間差 | ECG | ms |
| NN interval（NNI） | 經人工／演算法確認為正常竇性心搏、排除異位心搏與偵測錯誤後的 RR interval | 經清理的 ECG | ms |
| PPI | 相鄰兩個周邊脈搏波特徵點的時間差 | PPG、壓力脈波 | ms |
| PRV | PPI／PPG-BBI 序列的變異 | PPG | 依指標而定 |
| HRV | 通常指 ECG RR／NN 序列的變異；日常產品常把 PRV 也稱作 HRV | 以研究定義為準 | 依指標而定 |

Garmin 的 Enhanced BBI 文件把腕式 PPG 相鄰脈搏壓力波之間的時間稱為 BBI。這個命名可以使用，但研究報告仍應明寫「BBI 由腕式 PPG 取得」，避免讓讀者誤以為是 ECG RRI（Garmin Health, n.d.）。

### RR interval 與瞬時心率怎麼計算？

若心搏時間是 `0、800、1630、2410 ms`，相鄰時間相減後得到 `800、830、780 ms`：

```text
interval(i) = beat_time(i+1) − beat_time(i)
instantaneous HR (bpm) = 60,000 / interval (ms)
```

800 ms 約等於 75 bpm，但心率與心搏間期是倒數關係，不是線性關係。四個 beat timestamps 只能產生三個 intervals；不能用一段資料的平均心率反推出逐拍間隔，因為真正構成 HRV 的正是被平均掉的逐拍變化。

如果 Garmin 原始資料已提供 `bBI`，該欄位本身就是 interval，不要再次計算 `diff(bBI)` 當成 BBI。相鄰 BBI 的差值是 RMSSD 等 successive-difference 指標的中間步驟。

## 二、HRV 從哪裡來：交感、副交感與呼吸

竇房結會自發產生心搏，自律神經則持續調整放電速度。副交感神經主要經迷走神經釋放乙醯膽鹼，對竇房結的調節較快速，因此能在數拍之間產生明顯變化；交感神經主要透過去甲腎上腺素與 β-腎上腺素受體調節，反應通常較慢。安靜休息時常見較強的迷走調節；面對站立、運動或壓力時，迷走撤退與交感活化會共同改變心率（Quigley et al., 2024）。

呼吸是短期 HRV 的重要來源。吸氣時心率常加快、呼氣時減慢，形成呼吸性竇性心律不整（respiratory sinus arrhythmia, RSA）。HF power、RMSSD 與 SD1 常被用來描述快速、偏迷走神經調節的變異，但仍會受呼吸頻率、深度與平均心率影響。當呼吸慢於 0.15 Hz（約每分鐘 9 次）時，呼吸相關波動甚至可能從傳統 HF 頻帶移到 LF 頻帶。

> **重要修正**：HRV 是竇房結對多重調節的結果，不是直接量到神經放電。交感與副交感也不是永遠此消彼長；兩者可以同時增加、同時降低或各自變化。因此，不能把 HRV 當成「交感幾分、副交感幾分」的儀表板。

## 三、設備與原理：ECG、胸帶與手錶 PPG

### ECG 與 ECG 胸帶

ECG 透過皮膚電極量到心臟去極化與復極化造成的電位差。R 波通常尖銳、定位清楚，適合建立 RRI；研究級多導程或單導程 ECG 還能回看波形，分辨漏偵測、重複偵測、早搏與心律不整。能輸出原始 ECG 的胸帶介於實驗室 ECG 與消費型裝置之間：較方便，但仍要驗證取樣率、電極接觸、演算法與使用情境。

### 腕式 PPG

PPG 使用 LED 照射皮膚，再由光電二極體量測反射光的變化。每次心搏把壓力波傳到手腕，局部血容量與吸光特性隨之改變，形成脈搏波。裝置在波形上找出相鄰脈搏特徵點，便得到 PPI／BBI 與 PRV。

PPG 的優點是非侵入、容易長時間配戴，適合睡眠或日常追蹤；限制是它量到周邊血流，不是心臟電活動。ECG R 波到手腕脈搏抵達之間有 pulse arrival time，且會受血壓、血管彈性、溫度、呼吸與姿勢影響。動作、汗水、皮膚灌流與接觸壓力還可能改變波形或造成漏拍、假拍（Dewig et al., 2024; Georgiou et al., 2018）。

| 情境 | 腕式 PPG 的合理用途 | 主要風險 |
|---|---|---|
| 安靜坐姿／仰臥 | 可估計部分 PRV 指標，適合重複追蹤 | 呼吸、姿勢、接觸壓力仍需控制 |
| 睡眠 | 可取得較長、動作較少的趨勢資料 | 睡眠分期、演算法、缺失區段與跨夜條件不同 |
| 運動後靜止恢復 | 可在停止動作、訊號穩定後分析 | 不能把結果當成運動中的即時 HRV |
| 跑步、重訓或 HIIT 當下 | 心率可能仍有實用性；PRV 須非常謹慎 | 運動偽影、汗水、握力與週邊灌流造成峰值錯誤 |
| 心律不整或臨床診斷 | 不應只靠消費型 PPG-HRV 下結論 | PRV 與 ECG-HRV 可能明顯不一致 |

Garmin Health Snapshot 的小型驗證研究在安靜、正常呼吸下，RMSSD 與 SDNN 和 ECG 呈良好相關；但只有 27 位健康成人，而且控制呼吸時誤差增加，不能外推到所有 Garmin 型號、疾病族群或運動情境（Williams et al., 2023）。另一項使用 Garmin vivoactive 4、心血管疾病患者與健康控制組的研究也顯示，不同指標的一致性差很多：平均心率與部分全域／低頻指標較佳，RMSSD 與 DFA-α1 僅中等一致（Theurl et al., 2023）。

## 四、時域指標：直接在 interval 序列上計算

| 指標 | 定義與單位 | 常見用途 | 解讀限制 |
|---|---|---|---|
| Mean NN／Mean BBI | 有效間隔平均值，ms | 描述整體心搏週期 | 與 mean HR 為倒數關係，不是 HRV 本身 |
| SDNN | 所有有效 NN 的標準差，ms | 描述該紀錄長度內的整體變異 | 強烈依賴紀錄長度；2 分鐘、5 分鐘與 24 小時不可直接套同一常模 |
| RMSSD | 相鄰 NN 差值平方的平均再開根號，ms | 短時迷走相關變異、恢復追蹤 | 對漏拍與錯拍敏感；也受呼吸、mean HR 與資料長度影響 |
| pNN50 | 相鄰 NN 差值大於 50 ms 的比例，% | 描述快速逐拍變異 | 固定 50 ms 門檻會受年齡與平均心率影響，短資料可能不穩定 |
| HRV triangular index | NN histogram 總數除以最高柱高度 | 長時間整體變異 | 受 bin width 與長度影響，不適合很短紀錄 |

RMSSD 的概念式為：

```text
RMSSD = √mean[(NN(i+1) − NN(i))²]
```

一個漏掉的 beat 可能製造異常長 interval；一個被重複偵測的假 beat 會製造兩個異常短 interval。兩者都可能讓 RMSSD 被平方項大幅放大，所以計算公式簡單，不代表前處理可以省略。

## 五、頻域指標：把變異拆成不同速度

頻域分析把 interval 隨時間的波動分解為不同頻率。常見 absolute power 單位為 ms²；normalized units（nu）與百分比則是重新正規化後的相對量，不能與 ms² 混用。

| 頻帶／指標 | 傳統範圍 | 較精確解讀 |
|---|---|---|
| ULF | ≤0.003 Hz | 主要用於 24 小時等長程記錄；短時資料無法穩定估計 |
| VLF | 約 0.0033–0.04 Hz | 需要較長資料；5 分鐘短時記錄不宜做強生理解讀 |
| LF | 0.04–0.15 Hz | 混合反映迷走、交感、壓力感受器反射與約 0.1 Hz 節律；不是純交感指標 |
| HF | 0.15–0.40 Hz | 常對應 RSA 與心臟副交感調節，但必須知道呼吸是否落在此頻帶 |
| LF/HF | LF power ÷ HF power | 一個頻帶比值；不應直接命名為「交感／副交感平衡」 |
| Total power | 所分析頻帶功率總和 | 取決於頻帶定義、方法與紀錄長度 |

Billman（2013）與最新方法學指引都反對把 LF/HF 當成單一的 sympathovagal balance。若研究目的涉及 RSA 或 HF，最好同步記錄呼吸頻率與深度，並清楚報告頻譜方法、重採樣、window、detrending 與頻帶界線。

## 六、非線性指標：不是「更高級的 HRV」，而是不同問題

線性指標問「變異有多少」；非線性方法更關心「變異如何組織、是否規律、是否具有跨時間尺度的相關」。它們可能補充資訊，但對資料長度、參數、偽影與非平穩性更敏感，不能只按軟體預設值輸出後直接解讀（Sassi et al., 2015）。

| 指標 | 它在描述什麼 | 必須報告／注意什麼 |
|---|---|---|
| SD1 | Poincaré plot 垂直 identity line 的短軸離散；`SD1 = RMSSD / √2` | ms；與 RMSSD 高度重疊，不是獨立的神經訊號 |
| SD2 | 沿 identity line 的長軸離散，包含較長尺度變異 | ms；受紀錄長度影響，不是純交感指標 |
| SD1/SD2 | 短期相對於較長期變異的幾何比值 | 無單位；不能直接命名為自律神經平衡 |
| ApEn | 序列模式的規律性／不可預測性 | 對 N、embedding dimension `m`、tolerance `r` 與自我匹配敏感 |
| SampEn | 與 ApEn 類似，但排除自我匹配，通常較少偏差 | 仍依賴 N、`m`、`r`；不同設定不能直接比較 |
| DFA-α1 | 短尺度 detrended fluctuation 的分形相關 | 報告 scale range、視窗、artifact correction；不是交感或副交感的直接量 |
| DFA-α2 | 較長尺度的分形相關 | 通常需要比 α1 更多資料；短片段估計不穩定 |
| Correlation dimension（D₂） | 相空間中動態系統複雜度的估計 | 需要足夠長且近似平穩的序列；短 wearable 片段容易失真 |
| RQA | recurrence plot 中重複狀態的比例與線段結構 | 必須報告 embedding、delay、threshold 與 recurrence 定義 |

ApEn／SampEn 數字較大通常表示在指定參數下較不規律，但不能跨研究忽略參數與資料長度直接比高低。DFA 的 α 值描述相關結構，也不能簡化為「越接近某個數字就越健康」。歐洲心律相關學會的 joint position statement 指出，非線性方法具有研究價值，但臨床工具化仍需要更充分的前瞻性驗證（Sassi et al., 2015）。

## 七、用 Poincaré plot 看見逐拍變化

Poincaré plot 把 `interval(n)` 放在橫軸、`interval(n+1)` 放在縱軸。窄而短的點雲表示逐拍與較長尺度變異都較少；短軸變寬主要反映 successive differences 增加；沿 identity line 拉長則代表較長尺度的 spread 增加。離群點也可能只是漏拍、假拍或動作偽影，不一定是生理發現。

<div class="poincare-demo" data-poincare-demo>
  <div class="poincare-controls" role="group" aria-label="Poincaré plot 比較情境">
    <button type="button" data-comparison="rest-recovery" aria-pressed="true">休息 vs. 運動後</button>
    <button type="button" data-comparison="fitness" aria-pressed="false">心肺適能高 vs. 低</button>
    <button type="button" data-comparison="habit" aria-pressed="false">規律運動 vs. 久坐</button>
  </div>
  <div class="poincare-grid" data-poincare-grid></div>
  <p class="poincare-note" data-poincare-note></p>
</div>
<p class="demo-caveat">⚠️ 圖中是參數化模擬資料，不是研究結果或診斷工具。「運動後」指停止運動後的早期恢復，且假設已排除明顯 PPG 動作偽影。族群趨勢不能預測個人；心肺適能應由 VO₂peak／VO₂max 定義，規律運動與久坐時間也應分開測量。</p>

## 八、量測標準化：先讓比較公平

短期 HRV 常使用約 5 分鐘的穩定片段；少於 5 分鐘屬 ultra-short-term。超短資料不是一律不能用，但只能使用在相同長度、相同設備、相同指標且已有相應驗證的情境，不能把 Garmin 2 分鐘 SDNN 與 24 小時 Holter SDNN 常模直接比較（Task Force, 1996; Shaffer & Ginsberg, 2017）。

正式研究至少應固定並報告：

1. 設備品牌、型號、韌體、訊號類型、取樣率與資料取得方式。
2. 量測長度、時段、時區、姿勢、休息適應時間與環境溫度。
3. 自發或控制呼吸，以及是否同步記錄呼吸頻率／深度。
4. 量測前運動、睡眠、餐食、咖啡因、酒精、尼古丁與藥物規則。
5. 年齡、性別、BMI、心肺適能、疾病與可能影響心律的藥物。
6. 有效 beat／BBI 數、缺失比例、最長 gap、artifact 偵測與校正方法。
7. 分析軟體、版本、參數、頻帶、非線性設定與主要 outcome。

> **跨設備原則**：同一研究盡量使用相同型號與相同演算法。Apple、Garmin、Oura 或其他裝置即使都輸出 RMSSD，也可能使用不同取樣率、睡眠區段、品質篩選與專有演算法；數字同名不等於測量完全相同。

## 九、Garmin raw BBI：缺口與 artifact 要分開處理

HeartRate、BBI、SpO₂ 與 Stress 具有不同 timestamp 和更新節奏。outer merge 後的空白只表示該資料流當下沒有新觀測，不一定是裝置故障。為顯示而延續上一筆 HR，必須另標示為衍生值；不能把相同做法套到 BBI。

BBI 不可 forward fill。把上一個 BBI 複製到其他 timestamps，會憑空製造心搏並扭曲 HRV。真正偵測到的單一錯拍／漏拍可以依預先指定方法分類與校正，但這不同於跨越長時間缺口插值。Quigley et al.（2024）建議報告刪除或替換的比例、較長資料遺失，並在 substantial editing（例如超過 1%）時做敏感度分析；Lipponen 與 Tarvainen（2019）則提供可重現的自適應 artifact 分類方法。

<div class="bbi-demo" id="bbiDemo">
  <div class="bbi-timeline" id="bbiTimeline" role="img" aria-label="BBI 心跳間隔時間軸示意圖"></div>
  <div class="bbi-controls" role="radiogroup" aria-label="處理方式切換">
    <button type="button" class="bbi-mode-btn" id="bbiModeGap" data-mode="gap" aria-pressed="true">保留缺口（正確）</button>
    <button type="button" class="bbi-mode-btn" id="bbiModeFill" data-mode="fill" aria-pressed="false">前向填補（錯誤示範）</button>
  </div>
  <div class="bbi-result">RMSSD：<b id="bbiRmssd">–</b> ms　<span id="bbiCount"></span></div>
  <p class="rt-demo-status" id="bbiStatus">目前顯示：保留缺口，只用同一段連續心跳的間隔計算 RMSSD。</p>
</div>
<p class="demo-caveat">⚠️ 示範用資料為模擬值。目的在呈現 forward fill 如何製造不存在的心搏；這不代表所有 artifact 都只能刪除。單一異常 beat 的修正應依原始波形、預先指定規則與敏感度分析處理。</p>

## 十、Peer-review 後的結論

> **較精確的寫法**：Garmin 腕式 PPG 可在靜止、睡眠或標準化休息情境提供有用的 BBI／PRV 趨勢，但效度依裝置、指標、族群與情境而異。它不應無條件等同 ECG-HRV，更不適合把運動中的短期、頻域或非線性數值直接當作自律神經分支的讀值。研究應優先保留原始時間結構、控制呼吸與姿勢、揭露 artifact 與缺失、在同設備內做重複量測，並把 HRV 視為多因子調節的結果，而不是單一健康分數。

這段結論經兩層查核：先以使用者 NotebookLM「HRV」notebook 的 48 份來源建立證據地圖，再用方法學審稿問題逐項反駁十個高風險說法；最後回到 PubMed、學會指引、出版社與機構典藏核對主要書目與 DOI。NotebookLM 用於跨來源檢索，不取代原始論文。

## 參考文獻（APA 7th）

- Billman, G. E. (2013). The LF/HF ratio does not accurately measure cardiac sympatho-vagal balance. *Frontiers in Physiology, 4*, Article 26. https://doi.org/10.3389/fphys.2013.00026
- Dewig, H. G., Cohen, J. N., Renaghan, E. J., Leary, M. E., Leary, B. K., Au, J. S., & Tenan, M. S. (2024). Are wearable photoplethysmogram-based heart rate variability measures equivalent to electrocardiogram? A simulation study. *Sports Medicine, 54*(11), 2927–2934. https://doi.org/10.1007/s40279-024-02066-5
- Garmin Health. (n.d.). *Garmin enhanced BBI: An example night*. https://www8.garmin.com/garminhealth/news/Garmin-Enhanced-BBI_Final.pdf
- Georgiou, K., Larentzakis, A. V., Khamis, N. N., Alsuhaibani, G. I., Alaska, Y. A., & Giallafos, E. J. (2018). Can wearable devices accurately measure heart rate variability? A systematic review. *Folia Medica, 60*(1), 7–20. https://doi.org/10.2478/folmed-2018-0012
- Kantrowitz, A. B., Ben-David, K., Morris, M., Wittels, H. L., Wishon, M. J., McDonald, S. M., Renaghan, E. J., Feigenbaum, L. A., & Wittels, S. H. (2025). Pulse rate variability is not the same as heart rate variability: Findings from a large, diverse clinical population study. *Frontiers in Physiology, 16*, Article 1630032. https://doi.org/10.3389/fphys.2025.1630032
- Lipponen, J. A., & Tarvainen, M. P. (2019). A robust algorithm for heart rate variability time series artefact correction using novel beat classification. *Journal of Medical Engineering & Technology, 43*(3), 173–181. https://doi.org/10.1080/03091902.2019.1640306
- Quigley, K. S., Gianaros, P. J., Norman, G. J., Jennings, J. R., Berntson, G. G., & de Geus, E. J. C. (2024). Publication guidelines for human heart rate and heart rate variability studies in psychophysiology—Part 1: Physiological underpinnings and foundations of measurement. *Psychophysiology, 61*(9), Article e14604. https://doi.org/10.1111/psyp.14604
- Richman, J. S., & Moorman, J. R. (2000). Physiological time-series analysis using approximate entropy and sample entropy. *American Journal of Physiology-Heart and Circulatory Physiology, 278*(6), H2039–H2049. https://doi.org/10.1152/ajpheart.2000.278.6.H2039
- Sassi, R., Cerutti, S., Lombardi, F., Malik, M., Huikuri, H. V., Peng, C.-K., Schmidt, G., & Yamamoto, Y. (2015). Advances in heart rate variability signal analysis: Joint position statement by the e-Cardiology ESC Working Group and the European Heart Rhythm Association co-endorsed by the Asia Pacific Heart Rhythm Society. *Europace, 17*(9), 1341–1353. https://doi.org/10.1093/europace/euv015
- Shaffer, F., & Ginsberg, J. P. (2017). An overview of heart rate variability metrics and norms. *Frontiers in Public Health, 5*, Article 258. https://doi.org/10.3389/fpubh.2017.00258
- Task Force of the European Society of Cardiology and the North American Society of Pacing and Electrophysiology. (1996). Heart rate variability: Standards of measurement, physiological interpretation and clinical use. *Circulation, 93*(5), 1043–1065. https://doi.org/10.1161/01.CIR.93.5.1043
- Theurl, F., Schreinlechner, M., Sappler, N., Toifl, M., Dolejsi, T., Hofer, F., Massmann, C., Steinbring, C., Komarek, S., Mölgg, K., Dejakum, B., Böhme, C., Kirchmair, R., Reinstadler, S., & Bauer, A. (2023). Smartwatch-derived heart rate variability: A head-to-head comparison with the gold standard in cardiovascular disease. *European Heart Journal – Digital Health, 4*(3), 155–164. https://doi.org/10.1093/ehjdh/ztad022
- Williams, K., Jamieson, A., Chaturvedi, N., Hughes, A., & Orini, M. (2023). Validation of wearable derived heart rate variability and oxygen saturation from the Garmin’s Health Snapshot. *Computing in Cardiology, 50*, 1–4. https://doi.org/10.22489/CinC.2023.237

<!-- PROFESSIONAL -->

本篇以 Garmin 腕式 PPG 匯出的 beat-to-beat interval（BBI）為主要資料情境，目的不是把消費型穿戴裝置包裝成臨床 ECG，而是建立一條可重現的分析鏈：明確定義測量構念、保留原始時間與缺口、分開處理 peak-detection artifact 與真正 missing segment，再選擇和資料長度、設備效度及研究問題相符的 HRV／PRV 指標。

<figure class="article-figure">
  <img src="assets/hrv-ecg-ppg-measurement-chain.png" alt="ECG RRI 與腕式 PPG BBI 量測鏈及 PPG 的動作、接觸壓力和汗水干擾" loading="lazy">
  <figcaption>概念圖：ECG 的 electrical fiducial point 與 PPG 的 peripheral pulse fiducial point 不同；pulse arrival time variability 與訊號處理使 PRV 不能被假定為 HRV。</figcaption>
</figure>

## 一、測量構念與操作型定義

令第 `i` 個 ECG R peak 時間為 `tᵣ(i)`，則 `RRI(i) = tᵣ(i+1) − tᵣ(i)`；經波形審查、異位心搏與偵測錯誤處理後的正常竇性 interval 才稱 `NNI(i)`。令 PPG 上選定的 pulse fiducial point 時間為 `tₚ(i)`，則 `PPI(i) = tₚ(i+1) − tₚ(i)`。Garmin 文件把腕式 PPG PPI 稱為 BBI，故本文使用 `PPG-BBI`，並將其變異稱 PRV。

```text
RRI(i) = tR(i+1) − tR(i)
PPI(i) = tP(i+1) − tP(i)
tP(i) = tR(i) + PAT(i)
PPI(i) = RRI(i) + PAT(i+1) − PAT(i)
```

最後一式說明，即使每個 R wave 都產生可偵測的 peripheral pulse，只要 pulse arrival time（PAT）逐拍改變，PPI 就不會等於 RRI。PAT 受 pre-ejection period、pulse transit time、血壓與 arterial compliance 等因素影響；再加上 PPG peak detection error，PRV 與 ECG-HRV 的差距並非單純固定 offset（Dewig et al., 2024）。

單一 interval 與瞬時心率換算為 `HR = 60,000 / interval(ms)`。由於此轉換是雙曲線，分析 heart period 與分析 bpm 並不等價；應保留原始 interval series，並同時報告 mean HR／mean interval，避免 HRV 組間差異只是平均心率差異的數學結果（Quigley et al., 2024）。

## 二、神經生理：HRV 是效應器輸出，不是神經活動本身

竇房結 intrinsic pacemaking 受到 cardiac vagal 與 sympathetic efferent modulation。Vagal acetylcholine 作用於 M2 receptors、增加 GIRK potassium conductance，時程較快；sympathetic norepinephrine 主要作用於 β₁ receptors 與 cAMP pathway，時程較慢。RSA 主要來自 respiratory-linked cardiac parasympathetic control，但也受 central respiratory drive、baroreflex、呼吸深度、速率、lung volume 與 mean heart period 影響（Quigley et al., 2024）。

因此應使用「cardiac parasympathetic control 的間接指標」等有邊界的語言，不宜把 RMSSD、HF 或 SD1 寫成 vagal nerve firing。LF 包含 vagal、sympathetic 與 baroreflex contributions；LF/HF 不具單一、可逆的兩分支平衡解釋（Billman, 2013）。高 HRV 常和較有彈性的調節相關，但 arrhythmia、nonstationarity 或 detection error 也可能產生異常高值；研究不應把高／低 HRV 直接等同健康／疾病。

## 三、設備層：研究級 ECG、胸帶與腕式 PPG

Quigley et al.（2024）建議可行時優先 ECG，並完整報告 amplifier、filter、lead configuration、sampling rate、software 與 fiducial-point detection。ECG 的優勢不只是 R wave 時間解析度，也包括能回到原始波形區分 ectopy、missed R wave 與 false detection。單導程 ECG 胸帶若經代表性條件驗證，可作為移動研究的折衷，但不能只依品牌宣稱。

反射式腕式 PPG 以 LED 與 photodiode 量測組織血容量造成的光吸收／反射變化。實際誤差來源至少包括 motion artifact、sensor-skin contact pressure、汗水、低灌流、溫度、膚色與感測器／演算法差異。PPG 的 HR accuracy 不能自動證明 millisecond-level PRV accuracy；研究應驗證目標 HRV metric，而不是只驗證平均心率。

Garmin Health Snapshot 在 27 位健康成人、兩分鐘靜息資料中，normal breathing 下 RMSSD／SDNN 與 ECG 有良好相關，但樣本小、時間短且 controlled breathing 下誤差增加（Williams et al., 2023）。Theurl et al.（2023）在標準化 30 分鐘同步測量中發現 Garmin vivoactive 4 的 mean HR、SDANN、VLF concordance 較高，RMSSD 與 DFA-α1 僅中等。這證明 device validity 是「裝置 × 韌體 × 指標 × 族群 × 情境」的屬性，不能用一次 validation 宣稱所有輸出都有效。

## 四、線性 HRV／PRV 指標與公式

設有效 interval 為 `NN₁ … NNₙ`，平均為 `NN̄`：

```text
SDNN = √[Σ(NNi − NN̄)² / (N − 1)]
RMSSD = √[Σ(NN(i+1) − NNi)² / (N − 1)]
pNN50 = 100 × count(|NN(i+1) − NNi| > 50 ms) / (N − 1)
SD1 = RMSSD / √2
SD2 = √(2 × SDNN² − 0.5 × RMSSD²)
```

SDNN integrates variability observable within the recording window；視窗越長，納入的 slower oscillations 越多，因此 24 h SDNN、5 min SDNN 與 2 min SDRR 不可交換常模。RMSSD、pNN50 與 SD1 偏重 successive beat variation，但仍受 respiration、heart period、artifact 與資料長度影響。SD2 是較長尺度的 Poincaré spread，不是 pure sympathetic index；SD1/SD2 只描述兩個幾何尺度的相對關係。

## 五、頻域估計與可辨識範圍

傳統頻帶為 ULF ≤0.003 Hz、VLF 約 0.0033–0.04 Hz、LF 0.04–0.15 Hz、HF 0.15–0.40 Hz。absolute power 通常為 ms²，normalized unit 與 relative power 是不同 estimand。估計前必須說明 irregular interval series 的處理方式，例如 interpolation + FFT／autoregressive model，或直接使用 Lomb–Scargle；不同方法可能得到不同 power。

最低可辨識頻率受視窗長度限制。約 5 min window 可用於常見 LF／HF short-term analysis，但 VLF 在此長度內只有很少 cycles，不適合強生理解讀；ULF 需要長程記錄。若 respiration <0.15 Hz，RSA power 會落入 LF，因此不記錄呼吸就把 HF 當作完整 vagal activity、或把 LF 增加當作 sympathetic activation，皆可能錯誤。

## 六、非線性與複雜度指標

### Poincaré geometry

Poincaré plot 是 lag-1 return map `(NNᵢ, NNᵢ₊₁)`。SD1 與 RMSSD 數學相連，SD2 與 SDNN／RMSSD 共同決定。它既是 visualization 也是量化方法，但離群形狀必須先排除 ectopy 和 detection artifact。

### Entropy

Approximate entropy（ApEn）估計長度 `m` 的相似模式在增加一個樣本後仍相似的程度，包含 self-matches，因而有 finite-sample bias。Sample entropy（SampEn）排除 self-matches，通常較少偏差，但兩者都依賴資料長度 `N`、embedding dimension `m` 與 tolerance `r`。因此必須報告 `N, m, r`，並在相同長度、相同 preprocessing 下比較（Richman & Moorman, 2000）。

### DFA

Detrended fluctuation analysis 將 integrated demeaned interval series 分段，在各 scale 去除局部趨勢，檢查 fluctuation function 與 scale 的 log–log slope。`α1` 描述預先指定短尺度，`α2` 描述較長尺度；scale boundary、資料長度、運動強度與 artifact correction 都會改變估計。DFA-α1 可用於 exercise physiology 的研究假設，但不是可直接讀取的 sympathetic／parasympathetic score。

### Correlation dimension 與 RQA

Correlation dimension（D₂）以 delay embedding 重建 phase space，再估計 correlation sum 隨 radius 的 scaling；結果依 embedding dimension、delay、radius region、資料量與 stationarity。Recurrence quantification analysis（RQA）則把狀態間距離是否低於 threshold 畫成 recurrence matrix，可產生 recurrence rate、determinism、diagonal-line length、laminarity 等指標。兩者參數自由度高，不適合在短、缺失多、未驗證的 wrist-PPG 片段上當作穩定 biomarker。

Sassi et al.（2015）的 position statement 將 entropy、fractal correlations 與 nonlinear dynamics 視為可能補充傳統 HRV 的工具，但強調臨床效用仍有限。這些指標不能因為「非線性」三字就被視為更接近真實 ANS。

## 七、互動式 Poincaré 假設生成器

<div class="poincare-demo" data-poincare-demo>
  <div class="poincare-controls" role="group" aria-label="Poincaré plot 比較情境">
    <button type="button" data-comparison="rest-recovery" aria-pressed="true">休息 vs. 運動後</button>
    <button type="button" data-comparison="fitness" aria-pressed="false">心肺適能高 vs. 低</button>
    <button type="button" data-comparison="habit" aria-pressed="false">規律運動 vs. 久坐</button>
  </div>
  <div class="poincare-grid" data-poincare-grid></div>
  <p class="poincare-note" data-poincare-note></p>
</div>
<p class="demo-caveat">⚠️ 此圖只用於形成研究假設。正式設計應把 VO₂peak／VO₂max、身體活動與久坐時間作為連續變項優先分析，並考慮年齡、性別、mean HR、呼吸、姿勢、時段、藥物與 wearable quality。</p>

## 八、資料品質、缺失與 artifact correction

```text
raw PPG-BBI + timestamp
→ sort and deduplicate
→ unit/range/clock validation
→ detect timestamp gaps and create segment_id
→ identify implausible or misdetected beats within each segment
→ retain raw, flagged, corrected series separately
→ form fixed-length valid windows within one segment
→ compute prespecified metrics
→ sensitivity analysis across QC thresholds
```

Forward fill BBI 會製造新 beats，永遠不應做。短暫 isolated false／missed detection 可以根據 raw waveform 或已驗證的 time-varying threshold 分類，再用明確規則修正；長 gap 則應切 segment，而不是用 spline 跨越。Quigley et al.（2024）要求報告 deleted／replaced beats 和較長資料損失，並在 substantial editing 時檢驗結果是否由 editing 驅動。Lipponen 與 Tarvainen（2019）的演算法以 successive difference distribution 建立自適應門檻並分類 extra、missed、ectopic 與 long／short beats，是可引用的方法範例，但仍需依資料來源驗證。

<div class="bbi-demo" id="bbiDemo">
  <div class="bbi-timeline" id="bbiTimeline" role="img" aria-label="BBI 心跳間隔時間軸示意圖"></div>
  <div class="bbi-controls" role="radiogroup" aria-label="處理方式切換">
    <button type="button" class="bbi-mode-btn" id="bbiModeGap" data-mode="gap" aria-pressed="true">保留缺口（正確）</button>
    <button type="button" class="bbi-mode-btn" id="bbiModeFill" data-mode="fill" aria-pressed="false">前向填補（錯誤示範）</button>
  </div>
  <div class="bbi-result">RMSSD：<b id="bbiRmssd">–</b> ms　<span id="bbiCount"></span></div>
  <p class="rt-demo-status" id="bbiStatus">目前顯示：保留缺口，只用同一段連續心跳的間隔計算 RMSSD。</p>
</div>

## 九、分析表與統計單位

Garmin raw JSON 的 HeartRate、BBI、SpO₂、Stress 各有獨立 timestamp。outer merge 保留時間聯集，空白表示當下未更新；不可把 merged rows 當成等距 sample，也不可把數百個 BBI 當成數百位受試者。較合理的 analysis table 是一列代表「participant × condition × valid window」，另存 `n_intervals`、valid duration、missing proportion、artifact proportion、maximum gap、device／firmware、respiration、posture 與 HRV metrics。

主要 outcome、window length、QC threshold 與 artifact method 應在查看組間差異前預先指定。組間分析宜同時檢查 mean HR／mean interval，並優先保留 VO₂peak、physical activity、sedentary time 等連續資訊；若以高低組呈現，需事先定義 cut-point 並避免把觀察關聯寫成運動造成 HRV 改變。

## 十、方法學 peer-review 結論

1. 將文章中的「HRV 越高越健康」改為 context-dependent association。
2. 移除 LF＝sympathetic、LF/HF＝sympathovagal balance、SD1/SD2＝ANS balance 的直接等號。
3. 全文區分 ECG-HRV 與 PPG-PRV，並說明 PAT variability。
4. 把 Garmin validation 限定在實際型號、族群、姿勢、時間與指標。
5. 要求同步或至少報告 respiration，特別是 HF／RSA 解讀。
6. 不交換 2 min、5 min、24 h 的 SDNN 或 normative values。
7. 運動中 wrist PPG 以 motion-artifact-sensitive data 處理，不沿用靜息效度。
8. 非線性指標完整揭露 N、scale／embedding／threshold 與 artifact correction。
9. 不把跨品牌同名 metric 視為同一測量程序。
10. 保留 raw、flagged、corrected versions，報告 editing proportion 並做 sensitivity analysis。

## 參考文獻（APA 7th）

- Billman, G. E. (2013). The LF/HF ratio does not accurately measure cardiac sympatho-vagal balance. *Frontiers in Physiology, 4*, Article 26. https://doi.org/10.3389/fphys.2013.00026
- Dewig, H. G., Cohen, J. N., Renaghan, E. J., Leary, M. E., Leary, B. K., Au, J. S., & Tenan, M. S. (2024). Are wearable photoplethysmogram-based heart rate variability measures equivalent to electrocardiogram? A simulation study. *Sports Medicine, 54*(11), 2927–2934. https://doi.org/10.1007/s40279-024-02066-5
- Garmin Health. (n.d.). *Garmin enhanced BBI: An example night*. https://www8.garmin.com/garminhealth/news/Garmin-Enhanced-BBI_Final.pdf
- Georgiou, K., Larentzakis, A. V., Khamis, N. N., Alsuhaibani, G. I., Alaska, Y. A., & Giallafos, E. J. (2018). Can wearable devices accurately measure heart rate variability? A systematic review. *Folia Medica, 60*(1), 7–20. https://doi.org/10.2478/folmed-2018-0012
- Kantrowitz, A. B., Ben-David, K., Morris, M., Wittels, H. L., Wishon, M. J., McDonald, S. M., Renaghan, E. J., Feigenbaum, L. A., & Wittels, S. H. (2025). Pulse rate variability is not the same as heart rate variability: Findings from a large, diverse clinical population study. *Frontiers in Physiology, 16*, Article 1630032. https://doi.org/10.3389/fphys.2025.1630032
- Lipponen, J. A., & Tarvainen, M. P. (2019). A robust algorithm for heart rate variability time series artefact correction using novel beat classification. *Journal of Medical Engineering & Technology, 43*(3), 173–181. https://doi.org/10.1080/03091902.2019.1640306
- Quigley, K. S., Gianaros, P. J., Norman, G. J., Jennings, J. R., Berntson, G. G., & de Geus, E. J. C. (2024). Publication guidelines for human heart rate and heart rate variability studies in psychophysiology—Part 1: Physiological underpinnings and foundations of measurement. *Psychophysiology, 61*(9), Article e14604. https://doi.org/10.1111/psyp.14604
- Richman, J. S., & Moorman, J. R. (2000). Physiological time-series analysis using approximate entropy and sample entropy. *American Journal of Physiology-Heart and Circulatory Physiology, 278*(6), H2039–H2049. https://doi.org/10.1152/ajpheart.2000.278.6.H2039
- Sassi, R., Cerutti, S., Lombardi, F., Malik, M., Huikuri, H. V., Peng, C.-K., Schmidt, G., & Yamamoto, Y. (2015). Advances in heart rate variability signal analysis: Joint position statement by the e-Cardiology ESC Working Group and the European Heart Rhythm Association co-endorsed by the Asia Pacific Heart Rhythm Society. *Europace, 17*(9), 1341–1353. https://doi.org/10.1093/europace/euv015
- Shaffer, F., & Ginsberg, J. P. (2017). An overview of heart rate variability metrics and norms. *Frontiers in Public Health, 5*, Article 258. https://doi.org/10.3389/fpubh.2017.00258
- Task Force of the European Society of Cardiology and the North American Society of Pacing and Electrophysiology. (1996). Heart rate variability: Standards of measurement, physiological interpretation and clinical use. *Circulation, 93*(5), 1043–1065. https://doi.org/10.1161/01.CIR.93.5.1043
- Theurl, F., Schreinlechner, M., Sappler, N., Toifl, M., Dolejsi, T., Hofer, F., Massmann, C., Steinbring, C., Komarek, S., Mölgg, K., Dejakum, B., Böhme, C., Kirchmair, R., Reinstadler, S., & Bauer, A. (2023). Smartwatch-derived heart rate variability: A head-to-head comparison with the gold standard in cardiovascular disease. *European Heart Journal – Digital Health, 4*(3), 155–164. https://doi.org/10.1093/ehjdh/ztad022
- Williams, K., Jamieson, A., Chaturvedi, N., Hughes, A., & Orini, M. (2023). Validation of wearable derived heart rate variability and oxygen saturation from the Garmin’s Health Snapshot. *Computing in Cardiology, 50*, 1–4. https://doi.org/10.22489/CinC.2023.237
