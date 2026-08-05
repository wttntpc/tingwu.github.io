<!-- SIMPLE -->

穿戴裝置匯出的資料，看起來可能只是一串數字，但背後記錄的是心臟在自律神經調節下，每一拍之間很細微的時間變化。我們使用的是手錶的光體積變化描記法（photoplethysmography, PPG）：手錶以光線感測手腕血流脈動，再估算每次脈搏之間的間隔。

## HRV、交感與副交感神經

心率變異度（HRV）不是「心跳快不快」，而是相鄰心搏間隔變化的程度。交感神經可把身體推向動員與應付挑戰的狀態；副交感神經，尤其迷走神經，則參與安靜、恢復與逐拍調節。兩套系統會隨呼吸、姿勢、睡眠、壓力、疾病與運動共同改變心跳。

因此，HRV 不是一個可直接讀成「交感幾分、副交感幾分」的平衡計。以短時間靜息資料而言，RMSSD 與 Poincaré plot 的 SD1 常用來描述快速、較偏向迷走神經調節的變異；SD2 則描述較長尺度的整體變異，不能單獨視為純交感指標。

## 手錶 PPG 看見的是脈搏，不是心電圖

ECG 量到心臟的電活動，PPG 量到血液脈波抵達手腕時造成的光學變化。兩者不是同一訊號。人在安靜、配戴穩定且訊號品質良好時，PPG 的脈搏間隔可用於部分 HRV 分析；運動中則容易受到手臂動作、接觸壓力、汗水與灌流變化干擾。因此，本研究會保留品質控管與資料缺口，不把手錶產出的每個數字都當成有效心搏。

## 用 Poincaré plot 看見逐拍變化

Poincaré plot 把第 n 個心搏間隔放在橫軸、第 n+1 個放在縱軸。點雲越窄，表示相鄰兩拍的短期變化較小；沿斜線拉得越長，代表較長尺度的變異較大。請切換下列三組教學情境，觀察點雲與指標如何一起改變。

<div class="poincare-demo" data-poincare-demo>
  <div class="poincare-controls" role="group" aria-label="Poincaré plot 比較情境">
    <button type="button" data-comparison="rest-recovery" aria-pressed="true">休息 vs. 運動後</button>
    <button type="button" data-comparison="fitness" aria-pressed="false">心肺適能高 vs. 低</button>
    <button type="button" data-comparison="habit" aria-pressed="false">規律運動 vs. 久坐</button>
  </div>
  <div class="poincare-grid" data-poincare-grid></div>
  <p class="poincare-note" data-poincare-note></p>
</div>
<p class="demo-caveat">⚠️ 圖中是為了說明形狀而產生的模擬資料，不是本研究結果，也不是診斷工具。族群平均趨勢不能預測單一個人；年齡、呼吸、姿勢、藥物、量測時間與資料品質都可能改變 HRV。運動情境指停止運動後的早期恢復，並假設已排除明顯 PPG 動作雜訊。</p>

現有研究常把「較高心肺適能或規律運動者在標準化靜息量測下，呈現較高的迷走神經相關 HRV」作為假設，但結果會受族群與方法影響。尤其「久坐」不等同於「沒有運動」；系統性回顧對久坐時間與 HRV 的關係仍未得到一致結論，因此圖中的久坐比較只用來形成可檢驗問題，而不是宣告既定差異。

## 一列空白不一定代表壞掉

不同指標並不會在同一時間更新。心率、血氧、壓力指標和每次心跳間隔，都有自己的時間戳記。若直接把它們填滿成一張整齊表格，反而可能製造不存在的資料。

## 一列空白不一定代表壞掉

假設某一秒記錄到新的血氧值，但沒有新的心率值，合併後的心率欄就會是空白。這只代表「該時間點沒有新的心率觀測」，不一定表示裝置故障。

建立共同時間軸可以方便閱讀，但必須保留哪些值是真正的新觀測，哪些只是為了顯示而延續前一筆。

## BBI 為什麼不能補值？

BBI 是兩次心跳之間的時間。如果上一筆 BBI 被複製到後面幾列，看起來資料變完整了，實際上卻憑空增加了幾次不存在的心跳。這會直接改變心率變異度（HRV）的計算。

因此，BBI 不應使用向前填補或一般插值。真正的 BBI 筆數應回到原始 JSON 計算，而不是看合併後表格有多少非空格子。

<div class="bbi-demo" id="bbiDemo">
  <div class="bbi-timeline" id="bbiTimeline" role="img" aria-label="BBI 心跳間隔時間軸示意圖"></div>
  <div class="bbi-controls" role="radiogroup" aria-label="處理方式切換">
    <button type="button" class="bbi-mode-btn" id="bbiModeGap" data-mode="gap" aria-pressed="true">保留缺口（正確）</button>
    <button type="button" class="bbi-mode-btn" id="bbiModeFill" data-mode="fill" aria-pressed="false">前向填補（錯誤示範）</button>
  </div>
  <div class="bbi-result">RMSSD：<b id="bbiRmssd">–</b> ms　<span id="bbiCount"></span></div>
  <p class="rt-demo-status" id="bbiStatus">目前顯示：保留缺口，只用同一段連續心跳的間隔計算 RMSSD。</p>
</div>
<p class="demo-caveat">⚠️ 示範用資料為模擬數值，非真實受試者記錄；用來呈現「向前填補如何無中生有製造心跳、進而扭曲 RMSSD」這個概念，RMSSD 為即時計算而非預先寫死的數字。</p>

## 有十分鐘資料，不代表十分鐘都完整

第一筆到最後一筆相差十分鐘，只能說明首末跨度。中間可能有斷線或長時間沒有新資料。做 HRV 前，要先按照時間順序找出資料缺口，把資料切成連續片段，再從單一片段中建立分析視窗。

> 整齊的表格不一定是可靠的資料。生理訊號分析最重要的，是保留真實時間與真實缺口。

<!-- PROFESSIONAL -->

Garmin raw JSON 可包含 HeartRate、BBI、SpO₂ 與 Stress 等資料流。各資料流具有獨立 timestamp 與不同更新節奏，因此轉換工作的目的不是強迫所有指標同步，而是在保留原始時間結構的前提下，建立可檢查的分析資料。

## 從自律神經到腕式 PPG 的測量鏈

HRV 是連續心搏間期的變異，受交感與副交感調節、呼吸、壓力反射、姿勢、代謝需求及晝夜節律等因素共同影響。急性運動及運動後早期恢復常見迷走神經撤退、心率上升，以及 RMSSD、SD1 與 SD2 下降；但單一 HRV 指標不應被解讀成某一神經分支的直接讀值。特別是 SD2 反映較長尺度的整體變異，LF 或 LF/HF 也不宜簡化為純交感活動或「交感／副交感平衡」。

本研究使用腕式手錶 PPG，而非 ECG。PPG 偵測周邊血容量脈動，得到的是 pulse-to-pulse interval；ECG 則由 R wave 得到 RR/NN interval。PPG 與 ECG 之間還隔著脈波傳導與感測演算法，因此本文在泛稱時使用 BBI，只有在訊號來源與異位心搏處理符合定義時才稱 NN interval。腕式 PPG 在靜息或低活動時較適合進行 HRV 估計，活動強度增加時的動作雜訊會降低效度；研究比較應優先採用固定姿勢、固定時段、足夠穩定的分析窗，並報告裝置型號、韌體、配戴位置與 artifact 規則。

## Poincaré plot 與比較假設

Poincaré plot 以 `BBI(n)` 為 x 軸、`BBI(n+1)` 為 y 軸。垂直於 identity line 的 SD1 描述短期逐拍變異，且在標準定義下 `SD1 = RMSSD / √2`；沿 identity line 的 SD2 描述較長尺度的變異。點雲形狀可快速顯示離群值、週期結構與變異範圍，但正式分析仍應使用數值指標與預先指定的品質門檻。

<div class="poincare-demo" data-poincare-demo>
  <div class="poincare-controls" role="group" aria-label="Poincaré plot 比較情境">
    <button type="button" data-comparison="rest-recovery" aria-pressed="true">休息 vs. 運動後</button>
    <button type="button" data-comparison="fitness" aria-pressed="false">心肺適能高 vs. 低</button>
    <button type="button" data-comparison="habit" aria-pressed="false">規律運動 vs. 久坐</button>
  </div>
  <div class="poincare-grid" data-poincare-grid></div>
  <p class="poincare-note" data-poincare-note></p>
</div>
<p class="demo-caveat">⚠️ 這是參數化的教學模擬，不代表實際效果量。圖內「運動後」指 early recovery，不是運動中的腕式 PPG；「適能」應由 VO₂peak/VO₂max 等預先定義指標分組，「運動習慣」與「久坐時間」也必須分開操作化。</p>

若要把這些圖變成研究問題，可預先指定三類比較：(1) 同一受試者靜息與運動後恢復，採重複量測；(2) 依 VO₂peak/VO₂max 定義的心肺適能組別；(3) 依加速度計或問卷分別定義的運動量與久坐時間。主要結果可包含 mean BBI、mean HR、RMSSD、SDNN、SD1、SD2 與有效 BBI 比例；模型至少考慮年齡、性別、呼吸、姿勢、量測時段、藥物與裝置品質。先檢驗連續型 VO₂peak、身體活動量或久坐時間，通常比事後把人切成「高／低」更能保留資訊。

## 先確認資料流、欄位與單位

每筆生理觀測至少要同時具有 timestamp 與數值：

| 資料流 | 典型欄位 | 單位或意義 |
|---|---|---|
| HeartRate | `heartRate` | bpm |
| BBI | `bBI` | ms |
| SpO₂ | `spo2` | % |
| Stress | `stress` | 裝置定義的壓力指標 |
| Time | `timestamp` | Unix epoch milliseconds |

timestamp 應先以 `unit="ms"`、`utc=True` 解析，再轉換到研究所需時區：

```python
time_utc = pd.to_datetime(timestamp, unit="ms", utc=True)
time_taipei = time_utc.dt.tz_convert("Asia/Taipei")
```

直接將 epoch milliseconds 當成本地時間，或忘記指定毫秒單位，都可能造成整批資料錯位。檔名時間只能協助核對，不能取代每筆觀測的 timestamp。

## Outer merge 保留的是時間聯集

將資料流以 timestamp 進行 outer merge 後，每列代表至少有一個資料流在該時間產生新觀測。空白表示其他資料流當下沒有更新，不等於遺失或損壞。

HeartRate、SpO₂ 或 Stress 若為了顯示用途延續最近值，必須明確標示這是衍生值；分析原始取樣點時仍應回到未填補資料。

## BBI 不可 forward fill

BBI 代表逐拍心搏間期。forward fill 會把同一心搏間期複製到其他資料流的 timestamp，製造不存在的觀測並扭曲 HRV。每個檔案至少應驗證：

```text
wide CSV 中非空的原始 BBI 筆數
= raw JSON 的 BBI 筆數
```

若兩者不同，需先確認寬表是否曾經填補、去重或在合併時遺失資料。

## 更新頻率不是固定採樣率

BBI 隨每次心搏出現，HR、SpO₂ 與 Stress 也可能以不同間隔更新。應以相鄰原始 timestamp 差值描述中位更新間隔，同時檢查最大 gap、重複 timestamp、時間倒退與長時間無更新。平均更新頻率正常，不能證明整段連續。

## HRV 視窗不得跨越資料缺口

正確流程是：

```text
raw BBI
→ 依 timestamp 排序
→ 檢查重複、倒退與大 gap
→ 切分連續 segment
→ 在單一 segment 內建立 HRV 視窗
→ 進行 artifact QC
→ 計算 RMSSD、SDNN 等預先指定指標
```

若兩個 segment 中間有斷點，分析視窗不能從前一段借資料、跨過缺口，再由下一段補足。跨檔案合併時也應預設建立新 segment，並檢查重疊或中斷。

## 分析單位是受試者，不是每一筆感測值

raw data 中的數百筆 BBI 或 HR 不是數百位獨立受試者。較合理的分析表通常讓一列代表「一位受試者 × 一個條件 × 一個有效時間窗」，並包含 BBI 數、最大缺口、artifact 比例、視窗有效性及 HRV 摘要。

所有 QC 門檻、視窗長度與主要 HRV 指標應在查看組間結果前決定，並以不同 artifact 門檻或有效視窗規則進行敏感度分析。資料清理的目的不是讓結果顯著，而是讓每一個分析值都能回到真實觀測與時間來源。

## 參考資料

- [Garmin：腕式光學心率與 HRV 技術說明](https://www.garmin.com/en-AU/garmin-technology/health-science/heart-rate-monitoring/)
- [Garmin Health：Enhanced BBI 白皮書](https://www8.garmin.com/garminhealth/news/Garmin-Enhanced-BBI_Final.pdf)
- [Heart rate variability: measurement and emerging use](https://pmc.ncbi.nlm.nih.gov/articles/PMC7238479/)
- [穿戴式 PPG 在實驗室與日常情境的效度評估](https://pmc.ncbi.nlm.nih.gov/articles/PMC12403079/)
- [運動後 HRV 與 Poincaré plot 變化](https://pmc.ncbi.nlm.nih.gov/articles/PMC7878503/)
- [運動訓練與 HRV：系統性回顧與統合分析](https://pmc.ncbi.nlm.nih.gov/articles/PMC11250637/)
- [久坐時間與 HRV：系統性回顧與統合分析](https://pmc.ncbi.nlm.nih.gov/articles/PMC8391190/)
