<!-- SIMPLE -->

畫面上出現一個箭頭，玩家要朝箭頭指的方向滑動——大部分時候是這樣沒錯，但有一半的機率，箭頭是「反的」：真正該滑的方向跟箭頭指的方向剛好相反。玩家永遠不知道下一題是不是反的，只能每一題重新判斷。

<div class="flanker-demo">
  <div class="flanker-status" aria-live="polite">準備好測試你的抑制控制能力了嗎？</div>
  <div class="flanker-stage">
    <div class="flanker-stimulus"></div>
  </div>
  <button class="flanker-start">開始測驗 (10 題)</button>
  <div class="flanker-result" hidden></div>
</div>

## 兩條路徑在打架

這個作業測的是**抑制控制（Inhibitory Control）**——大腦壓下「自動、直覺反應」以完成正確目標行為的能力。背後的理論想法是：反應的產生來自兩條互相競爭的路徑——一條是看到刺激就自動快速激活的「直接路徑」，一條是需要刻意判斷、主動抑制錯誤反應的「刻意路徑」。當箭頭是反的，直接路徑會想照箭頭方向滑，刻意路徑則要出來喊停、糾正方向——這個「喊停」需要花時間，不是瞬間發生的。

## 一致 vs. 不一致，差的那段時間就是抑制的成本

- **一致（Congruent）**：滑動方向跟箭頭方向相同，直覺反應剛好是對的，不太需要抑制。
- **不一致（Incongruent）**：滑動方向跟箭頭方向相反，直覺反應是錯的，需要主動抑制。

不一致比一致慢多少（一致性效果，Congruency Effect），大致反映了抑制控制要花多少額外力氣。

## 為什麼這個能力跟運動介入研究有關

抑制控制是執行功能最核心的成分之一，也是運動與認知研究裡最常被檢視的指標。國立中央大學認知神經科學研究所的研究團隊，曾用類似的反應時間測驗評估職業運動員與一般大學生在注意力、工作記憶上的差異，發現規律訓練者在這類需要快速反應與抑制干擾的測驗上表現不同（Chang et al., 2024）——這也呼應了本作業想回答的問題：規律運動是否也能提升「該踩剎車時踩得住」的能力？

> 這個作業每一題都在問同一個問題：當直覺是錯的，你需要多久才能把它糾正過來？

<!-- PROFESSIONAL -->

方向感作業（Conflict Task）是 CIPH 認知評估套件中用於測量**抑制控制（Inhibitory Control）**的核心作業，屬於經典認知衝突典範（如 Simon task）之變體。

<div class="flanker-demo">
  <div class="flanker-status" aria-live="polite">準備好測試你的抑制控制能力了嗎？</div>
  <div class="flanker-stage">
    <div class="flanker-stimulus"></div>
  </div>
  <button class="flanker-start">開始測驗 (10 題)</button>
  <div class="flanker-result" hidden></div>
</div>

## 理論框架

理論基礎為**「激活—抑制」雙歷程模型（Activation-Suppression Dual-Process Model）**：反應之產生來自兩條競爭路徑——由刺激自動快速激活的**直接路徑**，與需要有意識決策、主動抑制錯誤反應的**刻意路徑**。這種自上而下的抑制並非瞬間發生，而是一個需要時間投入、對抗自動反應路徑的主動控制歷程（Ridderinkhof, 2002）。依 Diamond（2013）之執行功能框架，抑制控制包含反應抑制（Response Inhibition）與干擾控制（Interference Control）兩個次成分，本作業主要測量後者。

## 作業設計與核心指標

作業以藍色箭頭（Congruent，滑動方向與箭頭相同）與紅色箭頭（Incongruent，滑動方向與箭頭相反）50/50 隨機呈現，防止受試者發展預期性動作定勢。核心指標：

- **一致性效果（Congruency Effect）**＝RT(Incongruent) − RT(Congruent)：抑制控制效率之基礎指標，值越大代表抑制優勢反應的成本越高。
- **Delta Plot 斜率**：以 Vincentizing 法將 RT 分布分位數化，觀察衝突效果隨處理時間的變化——負斜率代表抑制機制隨處理時間推進而成功啟動（較成熟之認知控制型態）；正斜率則相反。
- **Gratton Effect（衝突適應）**：前一試驗為高衝突時，當前試驗的干擾效果減小的現象，反映大腦依近期經驗動態調整控制資源，以線性混合效應模型（RT ~ CurrentCondition × PrevCondition, random intercept by subject）檢驗交互項是否顯著。
- **錯誤速度指標（Error Speed Index）＝RT(error)/RT(correct)**：<1 提示衝動性錯誤（自動反應未被抑制），>1 提示困惑性錯誤（決策猶豫）。

## 分析取向

異常值排除依作業特定標準：RT<200ms 判為預期反應（生理上不可能於此時間內完成衝突辨識與抑制）；個人化異常值以「個人 Mean+3SD」為界，排除順序為缺值→預期反應→個人化異常值。前後測比較之外，Congruency Effect 之差異分數應先以 Shapiro-Wilk 檢定常態性；若違反常態假設（如角度精確度類指標常見），應同時報告 Wilcoxon 符號等級檢定並以其為主要解讀依據，而非僅依賴 t 檢定。

## 為何值得放進運動介入研究

抑制控制是執行功能文獻中效果量最常被檢視、也最常呈現顯著介入效果的成分之一。國立中央大學認知神經科學研究所團隊（Chang et al., 2024）以穿戴式裝置量測平台，比較 14 位大學甲組女子足球選手與 12 位無規律運動習慣之女大學生，發現兩組在肢體肌肉量與多項認知功能分數（包含注意力與工作記憶之反應時間）上存在顯著差異，且一個月心率資料之平均心率中位數與認知功能分數呈顯著負相關。該研究提供了「規律訓練族群與久坐族群在快速反應／抑制類作業上確實可能存在差異」的實證參照，但樣本為運動員與大學生之橫斷比較，並非介入研究，解讀時不應直接類推至介入前後之因果效果。

## 完整分析 SOP

本文聚焦於作業設計與構念詮釋；完整的資料前處理、離群值排除規則與逐步分析流程，請見 [方向感作業資料分析指南](https://hackmd.io/@TingWu/rkkc_zZQMe)（HackMD）。

## References

Chang, C.-K., Chen, Y.-L., &amp; Juan, C.-H. (2024). Predicting sports performance of elite female football players through smart wearable measurement platform. *Progress in Brain Research, 286*, 1–31. https://doi.org/10.1016/bs.pbr.2024.04.002

Diamond, A. (2013). Executive functions. *Annual Review of Psychology, 64*, 135–168. https://doi.org/10.1146/annurev-psych-113011-143750

Ridderinkhof, K. R. (2002). Micro- and macro-adjustments of task set: Activation and suppression in conflict tasks. *Psychological Research, 66*(4), 312–323. https://doi.org/10.1007/s00426-002-0104-7
