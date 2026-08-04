<!-- SIMPLE -->

畫面上有幾個方塊，會依序一個個亮起來，中間間隔很短。玩家要記住它們亮起的**順序**，等提示結束後，依**相同順序**依次點擊這些方塊。這是經典「Corsi 積木敲擊測驗」的數位化改編版本，用來測量**視覺空間工作記憶廣度**。

## 記住「內容」還不夠，還要記住「順序」

跟單純記住「有哪些方塊」不同，這個作業要求玩家把一串位置**依序**重現出來——這牽涉到序列編碼與提取的能力，而不只是記憶容量。序列長度（一次要記幾個方塊）從 4 顆到 6 顆不等，長度越長，負荷越重。

## 序列開頭最容易卡住

觀察發現，玩家點擊序列**第一個**方塊所花的時間，通常是六次點擊中最長、也最不穩定的一次。這呼應了記憶研究中常見的「序列位置效應」：序列開頭跟結尾的項目通常記得比較好，但要把記憶「提取出來、開始動作」這個轉換過程，本身就需要額外時間——第一步往往是最難跨出去的一步。

## 把「純粹記憶的時間」跟「純粹動作的時間」分開算

玩家點擊六個方塊的總時間，其實混合了兩件事：腦中提取記憶規劃的時間，跟手指移動、按下去的動作時間。為了更精準地反映記憶歷程本身，會先估計每個人「單純動作有多快」（用最快的 5% 反應時間當基準），再從總反應時間中扣掉這部分動作時間，得到一個更接近「純記憶處理」的指標。

## 為什麼視覺空間工作記憶值得關心

工作記憶是日常生活中「記住待辦事項、跟著多步驟指示做事」的基礎。國立中央大學認知神經科學研究所的研究發現，規律運動的中年女性在工作記憶測驗上，比久坐族群更能維持穩定表現、不隨年齡下滑（Chen et al., 2024）——這正是這類作業想在運動介入研究中回答的問題。

> 記住「有什麼」是一回事，記住「先後順序」又是另一回事——這個作業測的是後者。

<!-- PROFESSIONAL -->

順向點擊作業（Sequence Clicking Task）是 CIPH 認知評估套件中用於測量**視覺空間工作記憶廣度（Visuospatial Working Memory Span）**的作業，為 Corsi Block-Tapping Test 之數位化改編版本。

## 理論框架

視覺空間工作記憶容量——暫時保存並依序重現一串空間位置的能力——對應 Baddeley 工作記憶模型中之視覺空間扣描板（visuospatial sketchpad），Corsi Block-Tapping Test 為此構念之經典標準化測量工具（Kessels et al., 2000）。本作業額外測量**序列處理（Sequential Processing）**：正確重現一串順序、而非僅記住集合內容，所需之序列編碼與提取能力。序列開頭（初始效應／primacy）與結尾（新近效應／recency）項目的記憶表現通常優於中段項目，反映排練與提取策略之差異（序列位置效應，Murdock, 1962）——CIPH 手冊記錄之「序列第一個按鍵反應時間持續為六鍵中最長且變異最大」之現象，與序列起始項目需完成「記憶提取規劃＋動作啟動」雙重歷程之理論預期一致。

## 作業設計與核心指標

序列長度（SetSize）4–6 顆，各 15 題，共 45 題，刺激間隔 200ms。核心指標依處理層次分層：

| 指標 | 對應構念 |
|---|---|
| Accuracy（依 SetSize）| 視覺空間工作記憶廣度 |
| BtnAllRT（單題總反應時間）| 記憶提取＋序列規劃＋動作執行之整合時間（未校正動作成分）|
| Estimated Memory Time | 校正動作時間後之純記憶處理時間 |

**動作時間校正**為此作業之官方進階指標，三步驟：(1) 定義單題總反應時間（正確題逐鍵反應時間加總）；(2) 估計個人動作時間基準（該受試者所有試次中，全部有效按鍵反應時間之最速 5% 中位數）；(3) 計算校正後記憶處理時間 = 總反應時間 − SetSize × 動作時間基準。此設計之目的，是把「反應變快了」拆解成「記憶處理變快」與「純粹動作變快」兩種可能不同的機制，避免把動作速度的改變誤讀為記憶能力的改變。

## 分析取向

QC 採個人 × SetSize 分層之 IQR-based 離群值排除（factor=3.0），文獻依據同路徑終點 II：右偏分布不適用 Mean±kSD（Anagnostou et al., 2020）、IQR 法驗證優於 Mean±SD 法（Garlits et al., 2023）、離群值計算須依難度（序列長度）分層——Busch 等人（2005）以 Corsi Block-Tapping 作業本身證實此點，與本作業之典範直接對應。前後測比較採 Phase × SetSize 二因子受試者內重複量數 ANOVA，僅當交互作用顯著時才進行分層簡單效果 follow-up（Holm-Bonferroni 校正）。動作時間基準依 phase 分別估計（而非合併前後測估計），以避免介入若真的改變了受試者的心理動作速度，透過共用基準值同時污染前後測之記憶處理時間比較。

## 為何值得放進運動介入研究

工作記憶廣度是執行功能核心成分之一，也是老化與認知介入文獻中最常被檢視的指標之一。國立中央大學認知神經科學研究所（Chen et al., 2024）之研究顯示，規律運動之中年女性在工作記憶測驗上較久坐族群更能隨年齡增長維持穩定；另一篇同機構研究（Chang et al., 2024）比較大學甲組女子足球選手與一般女大學生，發現兩組在工作記憶類反應時間測驗上存在顯著差異，且一個月穿戴式裝置量測之平均心率與認知功能分數呈顯著負相關。這些發現共同指向：工作記憶是運動與認知神經科學研究中相對穩定可觀察到組間差異的指標，但兩篇引用研究皆非本研究之介入設計（分別為橫斷比較與運動員 vs. 對照組比較），解讀時仍應以本研究自身之前後測資料為準，不宜直接套用其他研究之效果量作為預期基準。

## References

Anagnostou, E., Dimopoulou, P., Sklavos, S., Zouvelou, V., &amp; Zambelis, T. (2020). Identifying jitter outliers in single fiber electromyography: Comparison of four methods. *Muscle &amp; Nerve, 63*(2), 217–224. https://doi.org/10.1002/mus.27093

Busch, R. M., Farrell, K., Lisdahl-Medina, K., &amp; Krikorian, R. (2005). Corsi Block-Tapping task performance as a function of path configuration. *Journal of Clinical and Experimental Neuropsychology, 27*(1), 127–134. https://doi.org/10.1080/138033990513681

Chang, C.-K., Chen, Y.-L., &amp; Juan, C.-H. (2024). Predicting sports performance of elite female football players through smart wearable measurement platform. *Progress in Brain Research, 286*, 1–31. https://doi.org/10.1016/bs.pbr.2024.04.002

Chen, Y.-L., Chang, C.-C., Lin, M.-P., Lin, C.-C., Chen, P.-Y., &amp; Juan, C.-H. (2024). Association between physical activity, body composition, and cognitive performance among female office workers. *Progress in Brain Research, 286*, 67–87. https://doi.org/10.1016/bs.pbr.2024.01.007

Garlits, J., McAfee, S., Taylor, J.-A., Shum, E., Yang, Q., Nunez, E., Kameron, K., Fenech, K., Rodriguez, J., Torri, A., Chen, J., Sumner, G., &amp; Partridge, M. A. (2023). Statistical approaches for establishing appropriate immunogenicity assay cut points: Impact of sample distribution, sample size, and outlier removal. *The AAPS Journal, 25*(3), Article 37. https://doi.org/10.1208/s12248-023-00806-5

Kessels, R. P. C., van Zandvoort, M. J. E., Postma, A., Kappelle, L. J., &amp; de Haan, E. H. F. (2000). The Corsi Block-Tapping Task: Standardization and normative data. *Applied Neuropsychology, 7*(4), 252–258. https://doi.org/10.1207/S15324826AN0704_8

Murdock, B. B., Jr. (1962). The serial position effect of free recall. *Journal of Experimental Psychology, 64*(5), 482–488. https://doi.org/10.1037/h0045106
