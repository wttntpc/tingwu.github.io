<!-- SIMPLE -->

畫面上方出現 1-2 張「目標圖卡」，下方是 3-5 張「選項圖卡」，每張圖卡都有顏色跟形狀兩個屬性。玩家要從選項中找出正確答案——但「正確答案」的判斷規則，每一題都可能不一樣。

## 兩套規則，玩家要自己判斷該用哪一套

- **規則一（完全匹配）**：如果選項裡有一張顏色、形狀都跟目標圖卡一樣，選它。
- **規則二（完全不同）**：如果沒有完全匹配的選項，就選顏色、形狀都跟目標圖卡不一樣的那張。

作業不會告訴玩家現在該用哪套規則——玩家必須每一題重新判斷，這正是這個作業想測量的能力：**認知彈性（cognitive flexibility）**，也就是在不同規則之間切換的能力。這個作業的設計理念類似神經心理衡鑑中常用的「威斯康辛卡片分類測驗」。

## 兩個關鍵數字：切換代價與難度負荷

- **切換代價（Switching Cost）**＝規則二的反應時間－規則一的反應時間。代表在兩套規則之間切換，需要額外花多少認知資源。
- **難度負荷（Difficulty Effect）**＝選項較多時的反應時間－選項較少時的反應時間。代表選項變多（干擾變多）時，決策變慢了多少。

## 為什麼認知彈性值得關心

認知彈性是執行功能三大核心成分之一（另兩個是抑制控制、工作記憶），跟日常生活中「同時處理好幾件事、遇到計畫改變也能隨機應變」的能力密切相關。國立中央大學認知神經科學研究所團隊 2024 年一篇研究發現，規律運動的中年女性在執行功能測驗上的表現，比久坐族群更能維持穩定，不會隨年齡增長而下滑（Chen et al., 2024）——這也是為什麼運動介入研究會想知道：認知彈性這類執行功能指標，會不會也隨著運動介入而改善。

> 這個作業真正想問的問題很單純：當規則被悄悄換掉時，你多快能發現、多快能跟上？

<!-- PROFESSIONAL -->

圖卡分類作業（Card Sort Task）是 CIPH 認知評估套件中用於測量**認知彈性／集組轉換（Cognitive Flexibility / Set-Shifting）**與**抽象推理／規則推導（Abstract Reasoning / Rule Inference）**的作業，設計理念類似威斯康辛卡片分類測驗（Wisconsin Card Sorting Test, WCST）之精簡數位化版本。

## 理論框架

認知彈性是 Diamond（2013）執行功能三分類架構中的一環，建立於抑制控制與工作記憶之上，代表在互斥規則間切換的能力。Miyake 等人（2000）以潛在變項分析證實，WCST 類作業之表現與「Shifting」（集組轉換）因子關聯最強，支持本作業以雙重規則系統測量集組轉換能力的設計邏輯。

作業採**雙重規則系統**：規則一（Match）——選項中存在顏色與形狀皆與目標圖卡相同者則選之；規則二（Non-match）——若無完全匹配選項，則選顏色與形狀皆不同者。適用規則取決於當題選項組合是否存在完全匹配候選，玩家須每題重新判斷，而非依循固定策略。

## 難度操弄與指標

作業依目標／選項圖卡數量分為 3-card（1 目標／3 選項）與 5-card（2 目標／5 選項）兩種難度，各 15 題，共 30 題。核心指標：

| 指標 | 對應構念 |
|---|---|
| Mean Accuracy | 規則推導正確性 |
| Mean Response Time | 整體決策速度 |
| Switching Cost = RT(Non-match) − RT(Match) | 集組轉換之額外認知資源 |
| Difficulty Effect = RT(5-card) − RT(3-card) | 選項增加對決策速度之負荷成本 |

## 品質控制取向

CIPH 使用手冊未針對本作業提供絕對反應時間門檻。QC 採個人 × Rule × Difficulty 分層之 IQR-based 離群值排除（雙尾，factor = 3.0），依據為：右偏分布不適用 Mean±kSD（Anagnostou et al., 2020），及 IQR 法（factor=3.0）驗證優於 Mean±SD 法（Garlits et al., 2023）。分層邏輯與路徑終點 II 依 SetSize 分層之作法一致，避免高負荷條件下正常較慢的合理試驗被誤判為離群值。

前後測比較採 **Phase × Rule** 與 **Phase × Difficulty** 二因子受試者內重複量數 ANOVA，而非對衍生指標直接做多次獨立配對 t 檢定，以同時檢驗介入之整體效果、操弄有效性，以及介入效果是否因規則／難度而異。

## 為何值得放進運動介入研究

執行功能（含認知彈性）是運動科學文獻中最常被檢視的認知結果之一。國立中央大學認知神經科學研究所（Chen et al., 2024）針對中年職業婦女的研究發現：規律運動組在執行功能與反應時間上，隨年齡增長仍能維持穩定表現，而久坐族群則出現隨齡下滑；該研究並展示以行動應用程式（"the Brain Gym" App）進行認知評估的可行性，與本作業之數位化評估精神一致。這類發現提供了「運動介入應該預期在執行功能指標上看到什麼」的參照基準，但仍須留意：不同作業、不同族群、不同介入強度下的效果量可能有相當差異，不宜直接套用單一研究之效果量作為預期值。

## 完整分析 SOP

本文聚焦於作業設計與構念詮釋；完整的資料前處理、離群值排除規則與逐步分析流程，請見 [圖卡分類作業資料分析指南](https://hackmd.io/@TingWu/rkLEP24Nze)（HackMD）。

## References

Anagnostou, E., Dimopoulou, P., Sklavos, S., Zouvelou, V., &amp; Zambelis, T. (2020). Identifying jitter outliers in single fiber electromyography: Comparison of four methods. *Muscle &amp; Nerve, 63*(2), 217–224. https://doi.org/10.1002/mus.27093

Chen, Y.-L., Chang, C.-C., Lin, M.-P., Lin, C.-C., Chen, P.-Y., &amp; Juan, C.-H. (2024). Association between physical activity, body composition, and cognitive performance among female office workers. *Progress in Brain Research, 286*, 67–87. https://doi.org/10.1016/bs.pbr.2024.01.007

Diamond, A. (2013). Executive functions. *Annual Review of Psychology, 64*, 135–168. https://doi.org/10.1146/annurev-psych-113011-143750

Garlits, J., McAfee, S., Taylor, J.-A., Shum, E., Yang, Q., Nunez, E., Kameron, K., Fenech, K., Rodriguez, J., Torri, A., Chen, J., Sumner, G., &amp; Partridge, M. A. (2023). Statistical approaches for establishing appropriate immunogenicity assay cut points: Impact of sample distribution, sample size, and outlier removal. *The AAPS Journal, 25*(3), Article 37. https://doi.org/10.1208/s12248-023-00806-5

Miyake, A., Friedman, N. P., Emerson, M. J., Witzki, A. H., Howerter, A., &amp; Wager, T. D. (2000). The unity and diversity of executive functions and their contributions to complex "frontal lobe" tasks: A latent variable analysis. *Cognitive Psychology, 41*(1), 49–100. https://doi.org/10.1006/cogp.1999.0734
