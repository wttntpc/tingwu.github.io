<!-- SIMPLE -->

這個作業要你做兩件事：**判斷臉上是開心還是難過，並按鍵回答；但如果臉被框上紅色外框，就不要按**。有時候外框是綠色，綠色代表「照常作答」，不用停。

[→ 到互動實驗室試試看](#/lab/stop-signal)（約 7–8 分鐘，結束後會看到你的停止速度）

## 為什麼要設計「紅框」和「綠框」

日常生活中，「停下來」常常來得很突然：開車時前面的人突然煞車、說到一半發現不該說。停止訊號作業（stop-signal task）把這種情境搬進實驗室：

- **多數題目**：看到臉，判斷情緒，按鍵。
- **少數題目**：臉出現後，過一小段時間才冒出**紅框**——這時要把已經準備好的按鍵動作停下來。

重點是「過一小段時間」。紅框來得越晚，越難停住；來得越早，越容易停住。實驗程式會一直微調這段時間，讓你大約有一半的機會停得住——這樣才能估計你「大概需要多久才能把動作煞住」。

## 那綠框是做什麼的？

只看紅框有一個問題：畫面上突然多了一個框，本身就會讓人分心、反應變慢。這和「想停下來」是兩回事。

所以我們另外加入**綠框**：框出現了，但你照常按鍵就好。把「有紅框要停」和「有綠框要繼續」比較，就能把「被框嚇到」的成本，和「真的在抑制動作」的成本分開看。

## 為什麼要用表情當作業內容

你按鍵回答的內容，本身就是表情。這讓我們可以問：**看到開心的臉，和看到難過的臉，停止的速度會不會不同？**

網站上的示範版**只是讓你體驗這個作業長什麼樣子**，題數遠少於正式實驗，不能回答這個問題，也不是任何診斷或能力評估。

## 讀結果時請記得

- 結果頁的「停止速度」是估計值，**越短代表停得越快**；只做一輪的數字會有很大的隨機誤差。
- 如果你在紅框題幾乎都停住了、或幾乎都沒停住，程式不會給你停止速度，因為這種情況下估計不可靠。
- 作業中的臉是 AI 生成的虛構人物，介於難過、中性、開心的各個步驟是影像混合，並非經過評分的情緒強度。

<!-- PROFESSIONAL -->

情緒選擇性停止訊號作業（emotional selective stop-signal task）以停止訊號典範測量**行動抑制（response inhibition）**，並讓 Go 反應的內容本身是情緒表情判斷。互動實驗室中的版本是示範用的精簡實作。

[互動實驗室：停止訊號作業](#/lab/stop-signal)

## 作業結構

- **Go 試驗**：呈現臉孔，受試者依表情（開心／難過）按對應按鍵。
- **Stop 試驗**：臉孔出現後，在可變的停止訊號延遲（stop-signal delay, SSD）之後加上**紅框**，要求抑制已啟動的反應。
- **Continue 試驗**：以相同時間點加上**綠框**，但要求照常反應。

Continue 條件的概念來自在停止訊號作業中加入「繼續 Go」（continue go）條件，用來區分注意力被新刺激捕獲與運動抑制本身（Nguyen et al., 2021）。本作業使用同樣的邏輯：Continue 相對於 Go 的額外反應時間，代表視覺訊號出現本身的成本，可作為與 Stop 試驗比較的對照。紅框與綠框的顏色固定，不在受試者間平衡；Stop 與 Continue 在作業中對應不同的外框顏色，這是設計上的限制。

## SSD 追蹤與練習階段

SSD 採用階梯法（staircase）逐試驗調整：停住則延長 SSD，沒停住則縮短，使 Stop 試驗的成功率逼近約 50%。作業依序包含：僅 Go 練習、含訊號的練習、僅 Go 的基準區塊、SSD 校準區塊，以及正式區塊。校準區塊以較早的反應資料決定正式區塊的起始 SSD。

## SSRT 的估計

停止歷程無法直接觀察，因此以馬賽跑模型（race model）估計**停止訊號反應時間（stop-signal reaction time, SSRT）**：假設 Go 歷程與 Stop 歷程獨立競爭，誰先完成就決定結果。作業採用共識指南所建議的**積分法（integration method）**（Verbruggen et al., 2019）：

1. 將 Go 反應時間由小到大排序，Go 遺漏（omission）以最大反應時間替代；
2. 取第 *n* 個值，*n* 為 Go 試驗數乘上 Stop 試驗中「仍反應」的比例；
3. 以該值減去平均 SSD，得到 SSRT。

## 估計何時不可靠

依共識指南的建議，以下情況不報告 SSRT（Verbruggen et al., 2019）：

- Stop 試驗中仍反應的比例（*p*(respond | signal)）落在 .25 至 .75 之外，或恰為 0 或 1；
- 失敗 Stop 試驗的平均反應時間**不短於** Go 反應時間，表示獨立競爭的假設不成立。

示範版會在結果頁標示這些檢查是否通過；沒有通過時只顯示說明，不給數值。

## 依情緒分開估計的限制

示範版也列出每種表情各自的資料，但每種表情的 Stop 試驗數很少，估計的精確度有限，只適合作為探索性觀察，不能當作情緒差異的證據。

## 刺激與使用限制

- 臉孔為 AI 生成的虛構人物；難過至開心之間的中間步驟是影像混合，並非評定過的情緒強度，也未經效度驗證。
- 瀏覽器端的計時受螢幕更新與輸入裝置延遲影響，不等同於實驗室設備。
- 示範版題數遠少於正式實驗、僅單次施測，結果僅供體驗，不構成任何臨床或能力判斷。

## References

Nguyen, T. V., Balachandran, P., Muggleton, N. G., Liang, W.-K., &amp; Juan, C.-H. (2021). Dynamical EEG indices of progressive motor inhibition and error-monitoring. *Brain Sciences, 11*(4), Article 478. https://doi.org/10.3390/brainsci11040478

Verbruggen, F., Aron, A. R., Band, G. P., Beste, C., Bissett, P. G., Brockett, A. T., Brown, J. W., Chamberlain, S. R., Chambers, C. D., Colonius, H., Colzato, L. S., Corneil, B. D., Coxon, J. P., Dupuis, A., Eagle, D. M., Garavan, H., Greenhouse, I., Heathcote, A., Huster, R. J., … Boehler, C. N. (2019). A consensus guide to capturing the ability to inhibit actions and impulsive behaviors in the stop-signal task. *eLife, 8*, Article e46323. https://doi.org/10.7554/eLife.46323
