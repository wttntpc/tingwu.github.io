<!-- SIMPLE -->

我們常常用「哪個頻段變強、變弱」來描述腦波：alpha 變強代表放鬆、beta 變強代表警醒。這種分析方式很直覺，但它有一個假設：**每個頻段是各自獨立在變化的**。真實的大腦可能不是這樣運作的。

## 腦波之間其實會「互相調節」

近年的研究發現，慢的腦波節律（例如 theta）會影響快的腦波節律（例如 gamma）的振幅大小——這種現象叫做「跨頻耦合」（cross-frequency coupling）。它被認為是大腦把「大範圍、慢速的網路活動」跟「局部、快速的神經運算」串起來的一種機制（Canolty &amp; Knight, 2010）。

如果分析方法只看單一頻段各自的強弱（傳統的頻譜分析），就會完全錯過這種頻段之間互相調節的訊息。

<div class="cfc-demo" id="cfcDemo">
  <canvas id="cfcCanvas" width="640" height="220" role="img" aria-label="跨頻耦合示意圖：慢波調節快波振幅"></canvas>
  <div class="cfc-controls">
    <label for="cfcSlider">耦合強度</label>
    <input type="range" id="cfcSlider" min="0" max="100" value="70">
    <span id="cfcValue">70%</span>
  </div>
  <p class="rt-demo-status">藍色是慢波，青色是快波——拖動滑桿看快波的振幅怎麼被慢波「調節」。拉到 0% 時兩者互不相關，快波振幅固定不變；拉越高，快波的忽大忽小就越明顯跟著慢波的節奏走。</p>
</div>
<p class="demo-caveat">⚠️ 數學示意圖，用固定公式即時運算模擬耦合強度，非真實腦波記錄。</p>

## HHSA：同時看「加法」和「乘法」關係

Holo-Hilbert Spectral Analysis（HHSA）是中央大學認知神經科學研究所團隊發展的分析方法，設計目的就是解決這個限制（Huang et al., 2016）。簡單說：

- 傳統方法大多只能處理頻段「各自變化、加總起來」的情況（加法關係）
- HHSA 額外能捕捉頻段「一個影響另一個振幅大小」的情況（乘法關係，也就是跨頻耦合）

這讓分析結果能呈現更完整的大腦動態，而不只是「哪個頻段比較強」這麼單一的描述。

## 為什麼這跟運動科學有關

一篇 2025 年的回顧文章明確指出：像 HHSA 這樣的非線性 EEG 分析方法，目前**還沒有被應用在運動與運動科學研究領域**，但很有潛力揭露傳統線性方法看不到的神經機制（Kao et al., 2025）。這也是為什麼我在分析 12 週有氧運動介入前後的靜息態腦波時，選擇把 HHSA 納入分析架構——不是因為它比較新潮，而是因為現有方法可能真的漏掉了一些東西。

## 但也要誠實看待限制

方法更進階，不代表結果一定會更漂亮。一篇系統性回顧整理了 54 篇「運動介入 × 靜息態腦波」研究後發現，跨研究的結果其實相當不一致，且多數研究樣本偏小、方法也不夠標準化（Gramkow et al., 2020）。所以即使用了更敏感的分析方法，解讀結果時仍然要保持謹慎，不宜過度推論。

<!-- PROFESSIONAL -->

傳統頻譜分析（如 Welch's PSD、傳統小波分析）多建立在**加成性展開**（additive expansion）的假設上：訊號被拆解為多個頻段成分，並假設這些成分彼此獨立疊加。這個假設在處理非線性、非穩態的生理訊號時有明顯限制，因為它無法呈現頻段之間的**乘法性交互作用**（multiplicative interaction）。

## 跨頻耦合：被傳統方法忽略的訊息

Canolty 與 Knight（2010）的回顧指出，phase-amplitude 跨頻耦合（CFC）的強度會依任務而異、隨感覺／動作／認知事件快速改變，且與學習表現相關。其功能性意義在於：高頻活動反映局部皮質運算，低頻節律則跨腦區同步、由外部刺激與內在認知事件驅動——CFC 可能是連結「大尺度、行為時間尺度的腦網路活動」與「局部、快速皮質運算」的機制。這正是純粹頻段功率分析無法捕捉的資訊。（下方「簡單白話版」有一個可拖動滑桿的即時示範）

## HHSA 的技術定位

Holo-Hilbert Spectral Analysis（Huang et al., 2016）以巢狀的 Empirical Mode Decomposition（EMD）＋ Hilbert-Huang Transform（HHT）為基礎，同時處理：

| 維度 | 傳統頻譜分析 | HHSA |
|---|---|---|
| 加成性（intra-mode／inter-mode 疊加） | ✓ | ✓ |
| 乘法性（跨尺度耦合、相位鎖定調變） | ✗ | ✓ |
| 穩態假設 | 通常需要 | 不需要 |
| 線性假設 | 通常需要 | 不需要 |

「Holo」字首即代表這是一個同時具備加成性與乘法性表徵能力的多維度頻譜表示法。

## 應用缺口：運動與運動科學領域尚未使用

Kao、Liang、Wang 與 Moreau（2025）在 *Biological Psychology* 發表的觀點文章中系統性回顧了運動科學領域現行的線性 EEG 方法，並明確指出跨頻耦合與 HHSA 這兩項進階非線性技術「尚未被應用於運動與運動科學領域」（yet to be applied），但具有揭露傳統線性方法所忽略之神經機制的潛力。這代表在運動介入研究中導入 HHSA，本身即具方法學新穎性，而非單純的分析工具替換。

## 方法選擇不能取代研究設計的嚴謹性

Gramkow 等人（2020）針對「靜息態 EEG × 運動介入」研究的系統性回顧（納入 54 篇研究、1,445 名受試者）發現：多數研究以傳統頻率分析為主要方法，跨研究結果高度不一致，且鮮少校正多重比較；研究品質普遍偏低、樣本量偏小，降低了結果的可信度。這篇回顧的結論值得謹記：**分析方法的進階程度，不能替代樣本規模、假設驗證與重複驗證的重要性**。導入 HHSA 等非線性方法時，仍應搭配透明的品質控制流程、明確的先驗假設，以及對效果量與不確定性的誠實呈現，而非僅因方法較新穎就預設會得到更顯著的結果。

## References

Canolty, R. T., &amp; Knight, R. T. (2010). The functional role of cross-frequency coupling. *Trends in Cognitive Sciences, 14*(11), 506–515. https://doi.org/10.1016/j.tics.2010.09.001

Gramkow, M. H., Hasselbalch, S. G., Waldemar, G., &amp; Frederiksen, K. S. (2020). Resting state EEG in exercise intervention studies: A systematic review of effects and methods. *Frontiers in Human Neuroscience, 14*, Article 155. https://doi.org/10.3389/fnhum.2020.00155

Huang, N. E., Hu, K., Yang, A. C. C., Chang, H.-C., Jia, D., Liang, W.-K., Yeh, J. R., Kao, C.-L., Juan, C.-H., Peng, C. K., Meijer, J. H., Wang, Y.-H., Long, S. R., &amp; Wu, Z. (2016). On Holo-Hilbert spectral analysis: A full informational spectral representation for nonlinear and non-stationary data. *Philosophical Transactions of the Royal Society A, 374*(2065), Article 20150206. https://doi.org/10.1098/rsta.2015.0206

Kao, S.-C., Liang, W.-K., Wang, C.-H., &amp; Moreau, D. (2025). Beyond linear measures: Revealing hidden neural dynamics in sports and exercise cognition with non-linear EEG. *Biological Psychology, 201*, Article 109126. https://doi.org/10.1016/j.biopsycho.2025.109126
