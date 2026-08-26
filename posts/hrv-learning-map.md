<!-- SIMPLE -->
# HRV 學習地圖：從自律神經、感測設備到指標解讀

HRV（心率變異度）描述相鄰心搏間隔隨時間的變化，不是單純看平均心率高或低。ECG 通常以 R 峰取得 RR interval；手錶多用 PPG 偵測脈搏波得到 pulse-to-pulse interval。兩者並不完全等同，尤其在運動、動作或訊號品質不佳時。

## 建議的五級路徑

1. **100 生理**：竇房結、心臟傳導、自律神經、呼吸性竇性心律不整與壓力反射。
2. **200 設備**：ECG、胸帶與腕式 PPG 的訊號來源、取樣、佩戴與限制。
3. **300 資料**：R peak／pulse peak、RR／BBI、異常搏動、遺漏、偽影與校正。
4. **400 指標**：mean NN、SDNN、RMSSD、頻域、Poincaré plot、entropy 與 DFA。
5. **500 解讀**：控制姿勢、時間、呼吸、年齡、運動、藥物與量測長度，避免把單一指標直接等同交感或副交感活動。

## 複習方式

每次分析先畫出原始訊號、心搏偵測與間隔序列，再說明刪除與插補規則，最後才看 HRV 指標。比較休息與運動、不同體適能或運動習慣時，應先確認量測條件與資料品質是否可比。

> HRV 可以反映心臟自主調節的部分面向，但不是壓力、健康或「交感／副交感平衡」的單一診斷工具。

## 每日學習進度

1. [從一次心跳開始：BBI、RRI、IBI 與 NNI 到底有什麼不同？](#/post/hrv-bbi-rri-ibi-nni)（2026-08-26）

<!-- PROFESSIONAL -->
# HRV 學習地圖：從自律神經、感測設備到指標解讀

## 每日學習進度

1. [從一次心跳開始：BBI、RRI、IBI 與 NNI 到底有什麼不同？](#/post/hrv-bbi-rri-ibi-nni)（2026-08-26）

## 量測鏈

HRV 推論依賴完整鏈條：心臟電生理與神經調節 → ECG 或 PPG 感測 → 心搏偵測 → NN interval 品質控制 → 指標估計 → 研究設計與統計解釋。腕式 PPG 在靜止情境可能具有實用性，但 pulse interval 受到脈搏傳導、周邊血流與動作偽影影響，不應無條件視為 ECG RR interval。

| 層級 | 核心內容 | 必須報告 |
|---|---|---|
| 生理 | 迷走調節、呼吸、壓力反射與節律來源 | 姿勢、呼吸、時間與族群 |
| 取得 | ECG／PPG、取樣率、感測位置與同步 | 裝置、韌體、協定與量測長度 |
| 清理 | 峰值、異常搏動、偽影、排除與插補 | 演算法、門檻、人工檢視與排除比例 |
| 特徵 | 時域、頻域、Poincaré、entropy、DFA | 公式、單位、視窗與參數 |
| 推論 | 組內變化、組間差異與混淆控制 | 效果量、區間、敏感度與限制 |

## 指標解讀原則

RMSSD 與高頻 HRV 常用於描述呼吸相關的心臟迷走調節，但仍受呼吸、量測條件與資料處理影響。SDNN 的意義高度依賴記錄長度。LF/HF 不宜直接稱為「交感／副交感平衡」。非線性指標需要足夠資料、明確參數與重測信度評估；較複雜不代表較具生理特異性。

## 起始來源（APA 7th）

- Task Force of the European Society of Cardiology and the North American Society of Pacing and Electrophysiology. (1996). Heart rate variability: Standards of measurement, physiological interpretation, and clinical use. *European Heart Journal, 17*(3), 354–381. https://pubmed.ncbi.nlm.nih.gov/8737210/
- Laborde, S., Mosley, E., & Thayer, J. F. (2017). Heart rate variability and cardiac vagal tone in psychophysiological research: Recommendations for experiment planning, data analysis, and data reporting. *Frontiers in Psychology, 8*, 213. https://doi.org/10.3389/fpsyg.2017.00213
- Quigley, K. S., Gianaros, P. J., Norman, G. J., Jennings, J. R., Berntson, G. G., & de Geus, E. J. C. (2024). Publication guidelines for human heart rate and heart rate variability studies in psychophysiology—Part 1: Physiological underpinnings and foundations of measurement. *Psychophysiology, 61*(9), e14604. https://doi.org/10.1111/psyp.14604
