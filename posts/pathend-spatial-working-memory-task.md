<!-- SIMPLE -->

畫面是一個九宮格，外圍有幾個黑點當作候選終點。格子裡會出現幾支箭頭，玩家要記住每支箭頭的**指向**跟**位置**。記完之後畫面切換到作答階段：一個三角形標出起點，玩家要憑記憶判斷——從起點出發，照著記得的箭頭指向一路走下去，最後會停在哪個黑點。

## 不是每支箭頭都有用

有一個容易被忽略的設計細節：正確路徑不一定用到畫面上出現的所有箭頭——有些箭頭其實是干擾項，路徑根本不會經過它們。這代表玩家不只要記住東西，還要在事後判斷「這支箭頭跟我的路徑有沒有關係」，同時考驗**空間工作記憶**（記住位置與方向）跟**抗干擾能力**（忽略不相關的箭頭）。

## 三個階段，各自代表不同的認知歷程

1. **記憶階段**：把箭頭的位置和方向記下來——花的時間叫「記憶編碼時間」。
2. **在腦中走一遍**：玩家要在腦海裡模擬沿路徑行走的過程，而不是單純回想一張照片——這其實是一種動態的心像操作。
3. **作答與規劃**：判斷終點在哪、點下去——這段時間叫「反應／規劃時間」。

把「記多久」跟「想多久」分開記錄，才能知道介入之後如果變快了，究竟是記憶編碼進步了，還是路徑規劃的思考變快了。

## 難度越高，正確率通常會掉——重點是掉多快

箭頭數量（2／3／4 支）代表要記的東西越多，這是刻意設計的負荷操弄。正確率隨難度上升而下降的速度（負荷效應），某種程度反映了工作記憶容量的極限在哪裡。

> 這個作業要求玩家做一件我們每天都在做、卻很少意識到的事：先把資訊存起來，再靠著記憶在腦中重新走一遍路。

<!-- PROFESSIONAL -->

路徑終點 II 作業（Path Endpoint II Task）是 CIPH 認知評估套件中用於測量**空間工作記憶（Spatial Working Memory）**的作業，同時涉及心像操作（mental simulation）與執行功能之規劃歷程。

## 理論框架

空間工作記憶為暫時保存並操弄視覺空間資訊的能力，是 Baddeley 多成分工作記憶模型中**視覺空間扣描板（visuospatial sketchpad）**之典型測量方式（Baddeley, 2003）。本作業額外要求玩家在腦中「模擬」沿路徑行走的歷程，而非單純提取靜態影像，因此同時涉及動態心像操作；整合多個箭號空間關係並規劃出連貫路徑，則屬於較高階的執行功能歷程。

**重要設計細節**：`ArrowNum`（箭號數量／SetSize）反映的是**記憶編碼負荷**（需要記住的總項目數），而非路徑本身的實際長度——正確路徑不一定包含畫面上出現的所有箭號，部分箭號為無效干擾提示。這使本作業之負荷效應同時混合了工作記憶容量與抗干擾（distractor filtering）兩種歷程，解讀正確率隨 SetSize 下降之趨勢時應留意此點，若需分離兩者，須額外記錄路徑實際使用之箭號數。

## 作業設計與核心指標

作業分四階段：記憶（畫面顯示 SetSize=2/3/4 個箭號）→ 結束記憶（點擊「記住了」）→ 作答（判斷路徑終點）→ 回饋學習。三種難度各 15 題，共 45 題。

| 指標 | 對應構念 |
|---|---|
| Accuracy（依 SetSize）| 空間工作記憶容量、心像操作正確性 |
| memoryTime | 記憶編碼時間與效率 |
| responseTime | 記憶提取＋路徑規劃＋動作執行之整合時間 |
| Accuracy slope | 負荷容忍度：正確率隨難度上升之下降速度 |
| Capacity threshold | 正確率首次跌破 75% 對應之 SetSize，容量上限之粗略估計 |

## 分析取向

QC 採個人 × SetSize 分層之 IQR-based 離群值排除（factor=3.0）。此統計處理方法之文獻依據包括：右偏分布不適用 Mean±kSD（Anagnostou et al., 2020）、IQR 法（factor=3.0）驗證優於 Mean±SD 法（Garlits et al., 2023），以及離群值計算須依難度分層——Busch 等人（2005）以 Corsi Block-Tapping 作業證實空間記憶表現隨路徑配置系統性變化，支持依 SetSize 分層計算 IQR 門檻，避免高負荷條件下正常較慢的合理試驗被誤判為離群值。

前後測比較採 **Phase × SetSize 二因子受試者內重複量數 ANOVA**，同時檢驗介入整體效果、難度操弄有效性，以及介入效果是否因難度而異；僅當交互作用顯著時才進行 SetSize 分層之簡單效果 follow-up，並以 Holm-Bonferroni 校正多重比較。

## 為何值得放進運動介入研究

工作記憶是執行功能三大核心成分之一，也是運動介入文獻中效果量常見中等程度的認知結果。國立中央大學認知神經科學研究所（Chen et al., 2024）的研究發現，規律運動的中年職業婦女在工作記憶等執行功能指標上，較久坐族群更能隨年齡增長維持穩定表現。由於路徑終點 II 同時涉及空間工作記憶與心像操作／規劃歷程，若介入效果存在，理論上應更容易在記憶編碼時間與反應規劃時間兩個分開記錄的指標上，觀察到不同的變化型態，而非僅呈現單一總反應時間的改變。

## References

Anagnostou, E., Dimopoulou, P., Sklavos, S., Zouvelou, V., &amp; Zambelis, T. (2020). Identifying jitter outliers in single fiber electromyography: Comparison of four methods. *Muscle &amp; Nerve, 63*(2), 217–224. https://doi.org/10.1002/mus.27093

Baddeley, A. (2003). Working memory: Looking back and looking forward. *Nature Reviews Neuroscience, 4*(10), 829–839. https://doi.org/10.1038/nrn1201

Busch, R. M., Farrell, K., Lisdahl-Medina, K., &amp; Krikorian, R. (2005). Corsi Block-Tapping task performance as a function of path configuration. *Journal of Clinical and Experimental Neuropsychology, 27*(1), 127–134. https://doi.org/10.1080/138033990513681

Chen, Y.-L., Chang, C.-C., Lin, M.-P., Lin, C.-C., Chen, P.-Y., &amp; Juan, C.-H. (2024). Association between physical activity, body composition, and cognitive performance among female office workers. *Progress in Brain Research, 286*, 67–87. https://doi.org/10.1016/bs.pbr.2024.01.007

Garlits, J., McAfee, S., Taylor, J.-A., Shum, E., Yang, Q., Nunez, E., Kameron, K., Fenech, K., Rodriguez, J., Torri, A., Chen, J., Sumner, G., &amp; Partridge, M. A. (2023). Statistical approaches for establishing appropriate immunogenicity assay cut points: Impact of sample distribution, sample size, and outlier removal. *The AAPS Journal, 25*(3), Article 37. https://doi.org/10.1208/s12248-023-00806-5
