<!-- SIMPLE -->

腦電圖（EEG）可以記錄頭皮上的微小電位變化，但原始訊號裡不只有大腦活動，也包含眨眼、肌肉用力、電極接觸不良與環境電流干擾。因此，研究者不能把原始檔直接拿去比較，而要先完成一連串前處理與品質檢查。

## EEG 前處理在做什麼？

可以把它想成整理一段多人同時說話的錄音：我們希望保留與研究問題有關的聲音，同時辨認哪些成分可能來自眨眼、動作或設備。

一個常見流程包括：

1. 載入原始資料與正確的電極位置。
2. 從頭到尾目視檢查資料。
3. 依研究目的進行濾波。
4. 處理不納入腦波分析的眼動電極。
5. 選擇合適的參考電極。
6. 找出明顯失效或雜訊過高的電極。
7. 用 ICA 協助分離眨眼、肌肉與其他雜訊。
8. 在有合理依據時插補被移除的壞道。

## 為什麼不能全部交給自動程式？

自動工具可以快速標示可疑電極或訊號成分，但它不知道研究真正想測量什麼。若門檻太嚴格，可能把有用的腦訊號一起刪掉；太寬鬆則可能留下過多雜訊。

因此，每位受試者都應留下品質紀錄，例如移除了哪些電極、刪除多少獨立成分，以及是否出現特殊狀況。

> EEG 前處理的目標不是讓訊號看起來最漂亮，而是用一致、透明且可說明的方式得到適合回答研究問題的資料。

<!-- PROFESSIONAL -->

EEG 前處理會直接影響後續頻譜、事件相關電位或連結性分析，因此不應被視為一組無條件套用的預設按鈕。以下以 64-channel ANT EEProbe 與 EEGLAB 工作流程為例，說明八個核心階段；實際參數仍須依硬體、研究問題與預先分析計畫調整。

## 一、保留原始資料並確認中繼資訊

載入原始 `.CNT` 檔後，先確認電極數、採樣率、事件標記與 channel location 是否正確。錯誤的電極座標會使頭皮拓樸圖與後續空間分析失去意義。原始檔應維持唯讀，所有處理產生新的版本。

## 二、目視檢查不是可省略的步驟

在大量自動處理前逐段瀏覽訊號，可發現長時間斷線、飽和、異常漂移與局部突發雜訊。此時的任務是辨認與記錄，而不是立即刪除所有看起來不規則的波形；眼動等結構性雜訊通常留待 ICA 階段處理。

## 三、濾波參數必須回應研究問題

範例流程使用 0.5 Hz high-pass、100 Hz low-pass 與 59–61 Hz notch，以降低基線漂移、高頻雜訊和 60 Hz 電源干擾。若研究關心高頻活動、慢波或 ERP，濾波邊界及轉換帶都可能需要改變。若要降採樣，通常應先完成適當的 anti-aliasing low-pass filter。Widmann、Schröger 與 Maess（2015）系統性整理了濾波器型態、截止頻率與 roll-off 如何影響訊號失真，並提醒濾波本身也可能製造偽跡（filter artifact），選擇時必須報告依據，而非套用套裝軟體的預設值。

<div class="filter-demo" id="filterDemo">
  <canvas id="filterCanvas" width="640" height="220" role="img" aria-label="高通／低通濾波即時示範"></canvas>
  <div class="filter-controls">
    <label for="hpSlider">高通 High-pass</label>
    <input type="range" id="hpSlider" min="0" max="20" value="0" step="1">
    <span id="hpValue">0.0 Hz</span>
  </div>
  <div class="filter-controls">
    <label for="lpSlider">低通 Low-pass</label>
    <input type="range" id="lpSlider" min="20" max="100" value="100" step="5">
    <span id="lpValue">100 Hz</span>
  </div>
  <p class="rt-demo-status" id="filterStatus">灰色為原始訊號（含慢速飄移＋10 Hz 節律＋58 Hz 類線雜訊）；彩色為即時運算後的濾波結果。把高通拉高可以去除慢速飄移，但拉太高會連同慢波節律一起削弱；把低通拉低可以去除高頻雜訊，但拉太低連 10 Hz 節律的振幅都會被壓縮。</p>
</div>
<p class="demo-caveat">⚠️ 合成訊號示範單極濾波器（single-pole IIR）之截止頻率效果，非真實 EEG 記錄；實際前處理應使用 EEGLAB 等工具之正式濾波器設計並檢查頻率響應。</p>

## 四、重參考與 EOG 處理

不納入 EEG 分析的 EOG 通道可在重參考前移除。範例採雙側乳突 M1、M2 平均重參考，但參考策略必須符合研究設計；平均參考、乳突參考或其他方案並非可以任意互換。

## 五、壞道判定需留下紀錄

Clean Rawdata 可根據 flatline、channel correlation 與 line-noise 等條件標示可疑通道，其背後的 Artifact Subspace Reconstruction（ASR）概念源自 Mullen 等人（2015）提出的即時腦電分析框架中之 adaptive artifact rejection 方法。範例門檻包含 flatline 5 秒、channel criterion 0.8 與 line-noise criterion 4，但這些數值應視為特定 Pipeline 的設定，不是所有研究的通則。

除了記錄被移除的電極名稱，也要檢查移除比例是否過高。若大量電極失效，插補無法真正恢復已遺失的空間資訊，應考慮將該資料標記為低品質或排除。

## 六、ICA 與 ICLabel 是輔助判斷

獨立成分分析（ICA）可將混合訊號分解為較具獨立性的成分，再由 ICLabel（Pion-Tonachini et al., 2019）提供 Brain、Eye、Muscle、Channel Noise 等分類機率——該分類器以超過 6,000 筆 EEG 紀錄、逾 20 萬個獨立成分之群眾標記資料訓練而成。範例以 Eye、Muscle 或 Channel Noise 機率達 0.8 作為自動標記起點，但仍應搭配成分頭皮圖、頻譜、時間序列與人工確認。

分類機率不是生物學真相。過度依賴單一門檻，可能移除含有真實神經訊號的混合成分。

## 七、最後插補與品質稽核

ICA 與雜訊成分處理完成後，可依原始 montage 使用 spherical spline interpolation（Perrin et al., 1989）補回少量壞道——此方法以球面樣條函數逼近頭皮電位分布，相較薄板樣條法計算更快、在電極稀疏區域也更準確。輸出前至少確認：

- 採樣率、事件標記與電極位置正確。
- 濾波及參考策略有完整紀錄。
- 被移除與插補的通道清單可追蹤。
- ICA 移除成分的數量與理由可查核。
- 每位受試者都有品質表，而不是只留下最終 `.set` 檔。

可重現的 EEG 前處理不等於所有資料使用完全相同的刪除數量，而是所有資料遵循相同、事先說明且能被審查的判斷程序。

## References

Mullen, T. R., Kothe, C. A. E., Chi, Y. M., Ojeda, A., Kerth, T., Makeig, S., Jung, T.-P., &amp; Cauwenberghs, G. (2015). Real-time neuroimaging and cognitive monitoring using wearable dry EEG. *IEEE Transactions on Bio-Medical Engineering, 62*(11), 2553–2567. https://doi.org/10.1109/TBME.2015.2481482

Perrin, F., Pernier, J., Bertrand, O., &amp; Echallier, J. F. (1989). Spherical splines for scalp potential and current density mapping. *Electroencephalography and Clinical Neurophysiology, 72*(2), 184–187. https://doi.org/10.1016/0013-4694(89)90180-6

Pion-Tonachini, L., Kreutz-Delgado, K., &amp; Makeig, S. (2019). ICLabel: An automated electroencephalographic independent component classifier, dataset, and website. *NeuroImage, 198*, 181–197. https://doi.org/10.1016/j.neuroimage.2019.05.026

Widmann, A., Schröger, E., &amp; Maess, B. (2015). Digital filter design for electrophysiological data — a practical approach. *Journal of Neuroscience Methods, 250*, 34–46. https://doi.org/10.1016/j.jneumeth.2014.08.002（線上先行 2014 年 8 月）
