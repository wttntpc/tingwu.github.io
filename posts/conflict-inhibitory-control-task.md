<!-- SIMPLE -->

畫面每次會出現一支指向上、下、左或右的箭頭。**藍色箭頭要往箭頭指的方向滑；紅色箭頭則要往完全相反的方向滑。**兩種條件各占一半並隨機出現，玩家必須先辨認顏色規則，再決定動作方向。

<div class="conflict-demo">
  <p class="conflict-rule"><span class="condition-swatch condition-blue"></span>藍色：同方向　<span class="condition-swatch condition-red"></span>紅色：反方向</p>
  <div class="conflict-status" aria-live="polite">準備好測試你的抑制控制能力了嗎？</div>
  <div class="conflict-stage">
    <div class="conflict-stimulus" aria-hidden="true"></div>
  </div>
  <button type="button" class="conflict-start">開始測驗（10 題）</button>
  <div class="conflict-result" hidden></div>
</div>

## 兩條路徑在打架

這個作業測的是**抑制控制（Inhibitory Control）**——大腦壓下「自動、直覺反應」以完成正確目標行為的能力。背後的理論想法是：反應的產生來自兩條互相競爭的路徑——一條是看到刺激就自動快速激活的「直接路徑」，一條是需要刻意判斷、主動抑制錯誤反應的「刻意路徑」。當箭頭是反的，直接路徑會想照箭頭方向滑，刻意路徑則要出來喊停、糾正方向——這個「喊停」需要花時間，不是瞬間發生的。

## 一致 vs. 不一致，差的那段時間就是抑制的成本

- **一致（Congruent）**：藍色箭頭；滑動方向跟箭頭方向相同，直覺反應剛好是對的，不太需要抑制。
- **不一致（Incongruent）**：紅色箭頭；滑動方向跟箭頭方向相反，需要壓下照箭頭滑動的自動反應。

不一致比一致慢多少（一致性效果，Congruency Effect），大致反映了抑制控制要花多少額外力氣。

## 為什麼這個能力跟運動介入研究有關

抑制控制是執行功能最核心的成分之一，也是運動與認知研究裡最常被檢視的指標。國立中央大學認知神經科學研究所的研究團隊，曾用類似的反應時間測驗評估職業運動員與一般大學生在注意力、工作記憶上的差異，發現規律訓練者在這類需要快速反應與抑制干擾的測驗上表現不同（Chang et al., 2024）——這也呼應了本作業想回答的問題：規律運動是否也能提升「該踩剎車時踩得住」的能力？

> 這個作業每一題都在問同一個問題：當直覺是錯的，你需要多久才能把它糾正過來？

<!-- PROFESSIONAL -->

方向感作業（Conflict Task）是 CIPH 認知評估套件中用於測量**抑制控制（Inhibitory Control）**的核心作業，屬於經典認知衝突典範（如 Simon task）之變體。

<div class="conflict-demo">
  <p class="conflict-rule"><span class="condition-swatch condition-blue"></span>藍色：同方向　<span class="condition-swatch condition-red"></span>紅色：反方向</p>
  <div class="conflict-status" aria-live="polite">準備好測試你的抑制控制能力了嗎？</div>
  <div class="conflict-stage">
    <div class="conflict-stimulus" aria-hidden="true"></div>
  </div>
  <button type="button" class="conflict-start">開始測驗（10 題）</button>
  <div class="conflict-result" hidden></div>
</div>

## 理論框架

理論基礎為**「激活—抑制」雙歷程模型（Activation-Suppression Dual-Process Model）**：反應之產生來自兩條競爭路徑——由刺激自動快速激活的**直接路徑**，與需要有意識決策、主動抑制錯誤反應的**刻意路徑**。這種自上而下的抑制並非瞬間發生，而是一個需要時間投入、對抗自動反應路徑的主動控制歷程（Ridderinkhof, 2002）。依 Diamond（2013）之執行功能框架，抑制控制包含反應抑制（Response Inhibition）與干擾控制（Interference Control）兩個次成分；依本作業的設計說明，主要測量的是**反應抑制**。

## 作業設計與核心指標

作業以藍色箭頭（Congruent，滑動方向與箭頭相同）與紅色箭頭（Incongruent，目標方向為箭頭旋轉 180°）50/50 隨機呈現。箭頭可指向 0°、90°、180° 或 270°，實際滑動角度則記錄於 `SwipeAngle`。核心指標：

- **反應時間與準確率**：`ReactionTime` 原始單位為秒，分析時換算為毫秒；`IsCorrect` 轉為 0／1 準確率。
- **一致性效果（Congruency Effect）**＝RT(Incongruent) − RT(Congruent)：正值越大代表抑制優勢反應的時間成本越高。準確率效果則為 Accuracy(Incongruent) − Accuracy(Congruent)，負值代表不一致條件的準確率較低。
- **Delta Plot 斜率**：以 Vincentizing 法將 RT 分布分位數化，觀察衝突效果隨處理時間的變化——負斜率代表抑制機制隨處理時間推進而成功啟動（較成熟之認知控制型態）；正斜率則相反。
- **Gratton Effect（衝突適應）**：前一試驗為高衝突時，當前試驗的干擾效果減小的現象，反映大腦依近期經驗動態調整控制資源，以線性混合效應模型（RT ~ CurrentCondition × PrevCondition, random intercept by subject）檢驗交互項是否顯著。
- **錯誤速度指標（Error Speed Index）＝RT(error)/RT(correct)**：<1 提示衝動性錯誤（自動反應未被抑制），>1 提示困惑性錯誤（決策猶豫）。
- **角度偏差（Angle Deviation）**：先依顏色規則計算目標滑動角度，再用環形角度差處理跨越 0°／360° 的情況，用來觀察動作精確度與速度—準確度權衡。

## 分析取向

異常值排除依作業特定標準：RT<200ms 判為預期反應（生理上不可能於此時間內完成衝突辨識與抑制）；個人化異常值以「個人 Mean+3SD」為界，排除順序為缺值→預期反應→個人化異常值。前後測比較之外，Congruency Effect 之差異分數應先以 Shapiro-Wilk 檢定常態性；若違反常態假設（如角度精確度類指標常見），應同時報告 Wilcoxon 符號等級檢定並以其為主要解讀依據，而非僅依賴 t 檢定。

## 為何值得放進運動介入研究

抑制控制是執行功能文獻中效果量最常被檢視、也最常呈現顯著介入效果的成分之一。國立中央大學認知神經科學研究所團隊（Chang et al., 2024）以穿戴式裝置量測平台，比較 14 位大學甲組女子足球選手與 12 位無規律運動習慣之女大學生，發現兩組在肢體肌肉量與多項認知功能分數（包含注意力與工作記憶之反應時間）上存在顯著差異，且一個月心率資料之平均心率中位數與認知功能分數呈顯著負相關。該研究提供了「規律訓練族群與久坐族群在快速反應／抑制類作業上確實可能存在差異」的實證參照，但樣本為運動員與大學生之橫斷比較，並非介入研究，解讀時不應直接類推至介入前後之因果效果。

## 完整分析 SOP

本文聚焦於作業設計與構念詮釋；完整的資料欄位、前處理、離群值排除規則與逐步分析流程，請見 [方向感作業資料分析指南](https://hackmd.io/zVej9JtsSrejGwV1oEO-ww?both)（HackMD，v1.6）。

## References

Chang, C.-K., Chen, Y.-L., &amp; Juan, C.-H. (2024). Predicting sports performance of elite female football players through smart wearable measurement platform. *Progress in Brain Research, 286*, 1–31. https://doi.org/10.1016/bs.pbr.2024.04.002

Diamond, A. (2013). Executive functions. *Annual Review of Psychology, 64*, 135–168. https://doi.org/10.1146/annurev-psych-113011-143750

Ridderinkhof, K. R. (2002). Micro- and macro-adjustments of task set: Activation and suppression in conflict tasks. *Psychological Research, 66*(4), 312–323. https://doi.org/10.1007/s00426-002-0104-7
