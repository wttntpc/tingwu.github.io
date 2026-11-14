<!-- SIMPLE -->
# 停止訊號作業的來龍去脈：從延遲訊號到賽跑模型

日常生活中，「停下來」常常來得很突然：開車時前方的人突然煞車，或是話說到一半發現不該說。認知科學想問的是：**一個已經開始準備的動作，還來不來得及被取消？取消它需要多久**？停止訊號作業（stop-signal task）就是為了回答這個問題而發展出來的。

延伸閱讀：[互動實驗室](#/lab/stop-signal)。

## 「停止」和「不做」不一樣

如果規則是「看到 X 就不要按」，你從一開始就不會準備動作，這比較像「選擇不做」。停止訊號作業關心的是另一件事：**動作已經在準備了，才出現要你停下來的訊號**。這時大腦要在動作送出之前把它攔住，所以更適合用來研究「抑制」。

## 它是怎麼來的

- **1960 年代的早期做法**：Lappin 與 Eriksen（1966）讓受試者對視覺刺激做反應，但偶爾在刺激之後延遲一小段時間，再給一個訊號要求停止。這個「延遲訊號」的做法，就是後來停止訊號作業的雛形。
- **1980 年代的理論**：Logan 與 Cowan（1984）提出一個理論，把「能不能停下來」寫成一場賽跑，並說明怎麼從資料估計「停下來需要多久」。同年 Logan、Cowan 與 Davis（1984）再把這個模型與估計方法整理成可以實際使用的程序。
- **之後的發展**：這個作業成為研究抑制控制最常用的方法之一（Verbruggen & Logan, 2008）；2019 年，多位研究者合寫了共識指南，說明怎麼設計、怎麼分析、怎麼報告（Verbruggen et al., 2019）。

## 核心想法：一場賽跑

想像大腦裡同時有兩位選手：

- **「Go」選手**：看到刺激後準備按鍵，從刺激出現開始跑。
- **「Stop」選手**：只有在停止訊號出現後才起跑。

誰先跑到終點，就決定結果：Go 先到，動作就送出去（停止失敗）；Stop 先到，動作就被攔下來（停止成功）。

停止訊號出現得越晚，Stop 選手越吃虧，越難停住；出現得越早，越容易停住。

## 「停止速度」為什麼要用估計的

停止成功時，**沒有按鍵，也就沒有任何反應時間可以記錄**。所以沒辦法像平常一樣直接量到「停下來花了多久」。研究者的做法是：用 Go 反應時間的分布、停止訊號出現的時間，以及「有多少次沒停住」，反推 Stop 選手大概需要多久，這個估計值稱為**停止訊號反應時間**（SSRT）。

## SSRT 越短，代表什麼？

數值越短，代表停止歷程越快完成。但它是**模型估計值**，不是直接量到的，而且需要滿足一些前提，才能被信任。它不是診斷工具，也不是一個人固定的「能力分數」。

## 後來的延伸

研究者在這個基本架構上，又問了更多問題：

- **只停止其中一部分動作**：例如同時準備兩個動作，只需要停止其中一個（Aron & Verbruggen, 2008）。這是「選擇性停止」的研究方向。
- **加入對照條件，區分「停止」與「注意到訊號」**：有研究在停止訊號作業中加入「繼續」條件，用來區分注意力被新訊號吸引，與運動抑制本身（Nguyen et al., 2021）。
- **使用情緒刺激**：研究情緒刺激是否影響抑制（Verbruggen & De Houwer, 2007）。

這些延伸版本各自回答不同的問題，不能把它們的結果混在一起解讀。

## 讀停止訊號研究時要問的問題

1. 他們測的是整體的停止，還是選擇性的停止？
2. 有沒有包含對照條件，來控制訊號本身的影響？
3. 每個條件有多少次停止試驗？試驗太少，估計會不穩定。
4. SSRT 的前提有沒有被檢查？

<!-- PROFESSIONAL -->
# 停止訊號作業的背景：從延遲訊號、賽跑模型到 SSRT 的估計

## 歷史與理論脈絡

停止訊號典範的前身是 Lappin 與 Eriksen（1966）在視覺反應時間作業中，於刺激之後延遲呈現訊號以要求停止反應的做法。Logan 與 Cowan（1984）提出「控制行為」（act of control）的理論，將行動抑制形式化為 Go 歷程與 Stop 歷程之間的**賽跑模型（race model）**，並導出估計 Stop 歷程時間的方法；Logan 等人（1984）進一步說明了簡單與選擇反應時間作業下的模型與估計程序。Verbruggen 與 Logan（2008）整理了此典範在認知與神經科學中的應用；Verbruggen 等人（2019）則提出涵蓋設計、分析與報告的共識指南。

## 賽跑模型與其假設

在 Stop 試驗中，Go 歷程於刺激出現時啟動，Stop 歷程於停止訊號延遲（stop-signal delay, SSD）之後啟動。若 Go 歷程先完成，則反應被送出（失敗停止）；若 Stop 歷程先完成，則反應被抑制（成功停止）。

模型的估計仰賴**獨立性假設**：Go 與 Stop 歷程彼此獨立。其可檢驗的推論之一是：失敗停止試驗的反應時間，應比同一條件下 Go 試驗的反應時間短，因為只有較快的 Go 歷程才能搶先完成（Verbruggen et al., 2019）。違反此推論時，SSRT 的估計不應被詮釋。

## SSRT 為何必須估計

成功停止的試驗沒有可觀察的反應，因此 Stop 歷程的完成時間無法直接量測。SSRT 是由 Go 反應時間分布、SSD 與 *p*(respond | signal)（Stop 試驗中仍反應的比例）推論而得的**模型衍生量**，而非直接觀測值。

## 追蹤程序與估計方法

- **SSD 追蹤**：為使 *p*(respond | signal) 接近中間值，許多研究採用逐試驗調整 SSD 的追蹤程序（staircase），成功停止則延長 SSD，失敗則縮短。
- **平均法**：以平均 Go 反應時間減去平均 SSD。
- **積分法（integration method）**：將 Go 反應時間排序，取對應 *p*(respond | signal) 的分位數後減去平均 SSD。共識指南建議採用積分法，並將 Go 遺漏以最大反應時間替代，使 Go 遺漏不致造成估計偏誤（Verbruggen et al., 2019）。

## 何時不應報告 SSRT

依共識指南的建議，下列情況下不宜報告或詮釋 SSRT（Verbruggen et al., 2019）：

- *p*(respond | signal) 明顯偏離中間範圍，或為 0 或 1；
- 失敗停止的反應時間不短於 Go 反應時間，表示獨立性假設不成立；
- 每個條件的 Stop 試驗太少，造成估計不穩定。

## 延伸典範

| 方向 | 問題 | 代表研究 |
|---|---|---|
| 選擇性停止 | 同時準備多個動作，只需停止其中一部分 | Aron 與 Verbruggen（2008） |
| 加入對照條件 | 區分注意力被訊號吸引與運動抑制本身 | Nguyen 等人（2021） |
| 情緒刺激 | 情緒刺激是否影響抑制 | Verbruggen 與 De Houwer（2007） |

各延伸版本的對照條件與估計目標不同，**結果不能直接互相比較**。依刺激類別（如不同情緒）分別估計 SSRT 時，每個類別的 Stop 試驗數會變少，估計的精確度也會降低，通常只適合作為探索性分析。

## 詮釋的限制

- SSRT 是模型估計值，且需要前提成立才能詮釋；
- 其數值受 Go 作業特性、追蹤程序、訊號的顯著性與受試者策略影響；
- 它不是臨床診斷指標，不應單獨用來評斷個人的抑制能力。

## References

Aron, A. R., &amp; Verbruggen, F. (2008). Stop the presses: Dissociating a selective from a global mechanism for stopping. *Psychological Science, 19*(11), 1146–1153. https://doi.org/10.1111/j.1467-9280.2008.02216.x

Lappin, J. S., &amp; Eriksen, C. W. (1966). Use of a delayed signal to stop a visual reaction-time response. *Journal of Experimental Psychology, 72*(6), 805–811. https://doi.org/10.1037/h0021266

Logan, G. D., &amp; Cowan, W. B. (1984). On the ability to inhibit thought and action: A theory of an act of control. *Psychological Review, 91*(3), 295–327. https://doi.org/10.1037/0033-295X.91.3.295

Logan, G. D., Cowan, W. B., &amp; Davis, K. A. (1984). On the ability to inhibit simple and choice reaction time responses: A model and a method. *Journal of Experimental Psychology: Human Perception and Performance, 10*(2), 276–291. https://doi.org/10.1037/0096-1523.10.2.276

Nguyen, T. V., Balachandran, P., Muggleton, N. G., Liang, W.-K., &amp; Juan, C.-H. (2021). Dynamical EEG indices of progressive motor inhibition and error-monitoring. *Brain Sciences, 11*(4), Article 478. https://doi.org/10.3390/brainsci11040478

Verbruggen, F., &amp; De Houwer, J. (2007). Do emotional stimuli interfere with response inhibition? Evidence from the stop signal paradigm. *Cognition and Emotion, 21*(2), 391–403. https://doi.org/10.1080/02699930600625081

Verbruggen, F., &amp; Logan, G. D. (2008). Response inhibition in the stop-signal paradigm. *Trends in Cognitive Sciences, 12*(11), 418–424. https://doi.org/10.1016/j.tics.2008.07.005

Verbruggen, F., Aron, A. R., Band, G. P., Beste, C., Bissett, P. G., Brockett, A. T., Brown, J. W., Chamberlain, S. R., Chambers, C. D., Colonius, H., Colzato, L. S., Corneil, B. D., Coxon, J. P., Dupuis, A., Eagle, D. M., Garavan, H., Greenhouse, I., Heathcote, A., Huster, R. J., … Boehler, C. N. (2019). A consensus guide to capturing the ability to inhibit actions and impulsive behaviors in the stop-signal task. *eLife, 8*, Article e46323. https://doi.org/10.7554/eLife.46323
