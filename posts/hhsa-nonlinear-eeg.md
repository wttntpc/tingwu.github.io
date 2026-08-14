<!-- SIMPLE -->

腦波分析常把訊號拆成 delta、theta、alpha、beta 與 gamma，再比較各頻段的功率。這能回答「整段訊號有哪些節律」，卻不一定能回答另外兩個問題：**頻率是否隨時間改變？一個快節律的振幅，是否跟著較慢節律起伏？**

Holo-Hilbert Spectral Analysis（HHSA）就是為這類非平穩、具有振幅調變的訊號而發展的方法。它不是用來取代所有 FFT 或小波分析，而是增加一種觀察訊號的角度。

> 閱讀指引：先用白話版理解「載波 × 調幅」；若要實作或評讀論文，再切換到專業版查看 EMD、IMF、瞬時頻率與分析流程。

## 先分清楚：非平穩不等於非線性

- **非平穩（non-stationary）**：訊號的平均、變異或頻率內容會隨時間改變。例如閉眼後 alpha 增強，或一次短暫刺激只在特定時間引發振盪。
- **非線性（nonlinear）**：系統的輸出不能只用輸入的線性加總解釋，例如一個節律會調節另一個節律的振幅。

EEG 經常非平穩，但「看到訊號在變」本身不能證明產生它的神經系統具有某種非線性機制。方法可以揭露候選結構，生理意義仍需研究設計、對照條件與統計檢驗支持。

## FFT、小波與 HHSA 分別在看什麼？

可以把一段音樂想成研究訊號：

- **FFT／功率頻譜**像曲目統計：告訴你低音與高音各有多少，但不保留它們何時出現。
- **STFT／小波**像時間軸：告訴你某個頻率大約在哪一段變強。
- **HHSA**再多問一層：高頻「音量包絡」是否用另一個較慢頻率在起伏？

因此，這些方法不是單純的新舊排名，而是回答不同問題。想先理解 FFT 與小波，可閱讀[FFT 與小波分析：從整段頻譜到時間－頻率地圖](#/post/fft-wavelet-eeg-time-frequency)。

## EMD：讓資料自己長出振盪成分

Empirical Mode Decomposition（EMD）不先指定固定的正弦波或母小波，而是利用訊號的局部極大值、極小值與包絡線，反覆執行 sifting，將資料分成數個 Intrinsic Mode Functions（IMFs）與趨勢項（Huang et al., 1998）。

白話地說，每個 IMF 是資料中一個相對單純的振盪尺度。較快的成分通常先被取出，較慢的成分與趨勢留在後面。不過 IMF 並不是自動等同於傳統 EEG 頻段，也不保證每一個 IMF 都有獨立的神經來源。

## 從 IMF 得到瞬時振幅與瞬時頻率

將 IMF 表示成隨時間改變的振幅與相位後，可以得到：

- **瞬時振幅**：這個節律在該時刻有多強。
- **瞬時相位**：目前位於一個週期的哪個位置。
- **瞬時頻率**：相位在該時刻改變得多快。

這就是 Hilbert-Huang Transform（HHT）的核心概念。它保留頻率隨時間變動的資訊，不必把整段資料硬塞成固定頻率的正弦波組合。

## 跨頻耦合：慢節律調節快節律

phase-amplitude coupling（PAC）描述慢節律的相位與快節律振幅之間的關係。Canolty 與 Knight（2010）提出，這可能是大尺度網路活動與局部快速運算溝通的機制之一；但非正弦波形、濾波方式與共同事件也可能製造看似耦合的圖樣，因此不能看到 PAC 就直接推論神經溝通。

<div class="cfc-demo" id="cfcDemo">
  <canvas id="cfcCanvas" width="640" height="220" role="img" aria-label="跨頻耦合數學示意圖：慢波相位調節快波振幅"></canvas>
  <div class="cfc-controls">
    <label for="cfcSlider">耦合強度</label>
    <input type="range" id="cfcSlider" min="0" max="100" value="70">
    <span id="cfcValue">70%</span>
  </div>
  <p class="rt-demo-status">藍色代表慢節律，青色代表快節律。拖動滑桿，觀察快波的振幅包絡如何跟著慢波相位起伏。</p>
</div>
<p class="demo-caveat">此圖由固定公式產生，是概念示範，不是真實 EEG，也不是耦合顯著性檢定。</p>

## HHSA 為什麼需要「兩層」分解？

第一層 EMD 先拆出載波振盪並計算其瞬時頻率；第二層再對每個載波的振幅包絡做 EMD，找出包絡本身的調變頻率（Huang et al., 2016）。結果形成兩個頻率軸：

| 頻率軸 | 白話意義 | 例子 |
|---|---|---|
| 載波頻率（carrier frequency） | 被觀察的快節律 | 16 Hz 振盪 |
| 調幅頻率（AM frequency） | 快節律的振幅以多快速度變大、變小 | 振幅每秒起伏 3 次 |

若 16 Hz 載波被 3 Hz 包絡調節，Holo-Hilbert spectrum 會把能量放在「carrier 16 Hz × AM 3 Hz」附近。這比只有一條頻率軸的功率譜更直接呈現振幅調變結構。

## HHSA 能帶來什麼，又不能保證什麼？

可能的優點：

- 不先用固定頻帶切割資料，分解能跟隨局部時間尺度。
- 同時呈現載波與調幅頻率，而非只看 sidebands 或單一頻段功率。
- 可保留耦合強度隨時間變化的資訊。
- Juan 等人（2021）的模擬與視覺神經 entrainment 研究顯示，HHSA 能呈現動態振幅調變，並減少非正弦波諧波對部分傳統 PAC 分析的干擾。

不能保證：

- HHSA 不會自動消除雜訊、眼動、肌電或動作偽影。
- 圖上出現峰值不等於生理耦合已被證明，也不代表因果方向。
- EMD 仍會受到 mode mixing、端點效應、停止條件及 masking／noise-assisted 參數影響。
- 更精細的圖不一定帶來更穩定、可重現或可跨研究比較的結果。

## 放進運動與認知研究時，建議怎麼做？

Kao 等人（2025）指出，非線性 EEG 與跨頻方法在運動與運動認知研究仍有明顯應用缺口。這使 HHSA 具有探索價值，但「研究少」同時代表標準流程、效應穩定性與可重現性仍待建立。

一個較穩健的順序是：

1. 先完成 EEG 前處理、偽影處理與品質報告。
2. 明確定義主要通道、時段、carrier × AM 區域與結果指標。
3. 用合成訊號確認 pipeline 能找回已知的載波與調幅。
4. 記錄 EMD 版本、停止規則、mask 或 noise-assisted 參數。
5. 使用無耦合與保留自相關結構的 surrogate data 建立虛無分布。
6. 控制通道、時間與頻率格點造成的多重比較。
7. 同時報告效果量、不確定性與敏感度分析，不只展示顏色最亮的區域。

因此，我把 HHSA 定位為：**用來檢驗傳統頻譜可能忽略之振幅調變結構的補充方法，而不是保證產生新發現的黑盒子。**

### 延伸閱讀

- [我的 HHT & Prof. Liang Course NotebookLM](https://notebook.google.com/notebook/6866e69a-9e32-4a5a-a1ff-8cc3f5b13d12)（可能需要登入與權限）
- [EEG 前處理不是按下按鈕](#/post/eeg-preprocessing-principles)
- [FFT 與小波分析](#/post/fft-wavelet-eeg-time-frequency)

<!-- PROFESSIONAL -->

HHSA 的技術價值不是籠統的「非線性分析」，而是把傳統一維頻率或二維時間－頻率表徵，擴充為可分離 carrier frequency 與 amplitude-modulation frequency 的表徵。要正確評估它，需先理解 EMD、mono-component 表徵、瞬時頻率與第二層振幅分解。

## 1. EMD 與 IMF

EMD 將訊號分解為有限個 IMF 與殘差：

<div class="math-block" role="math" aria-label="x of t equals the sum of intrinsic mode functions plus a residual">x(t) = Σ<sub>j=1</sub><sup>J</sup> c<sub>j</sub>(t) + r<sub>J</sub>(t)</div>

原始 EMD 以局部極值建立上下包絡，計算其局部平均並反覆 sifting。傳統 IMF 判準包括：

1. 全訊號的零交叉數與極值數相同或最多相差 1；
2. 由局部極大值與極小值形成之上下包絡，其局部平均接近 0。

這些條件使 IMF 接近可定義瞬時相位的 narrow-band／mono-component 成分，但 EMD 是經驗性、資料驅動的演算法；IMF 的統計與生理唯一性不能由定義本身保證（Huang et al., 1998）。

## 2. analytic signal 與瞬時頻率

對 IMF c<sub>j</sub>(t) 施作 Hilbert transform，可構成 analytic signal：

<div class="math-block" role="math" aria-label="analytic signal equals the intrinsic mode function plus i times its Hilbert transform">z<sub>j</sub>(t) = c<sub>j</sub>(t) + iℋ{c<sub>j</sub>(t)} = a<sub>j</sub>(t)e<sup>iφ<sub>j</sub>(t)</sup></div>

<div class="math-block" role="math" aria-label="instantaneous frequency equals one over two pi times the derivative of phase">f<sub>j</sub>(t) = (1 / 2π) · dφ<sub>j</sub>(t) / dt</div>

其中 a<sub>j</sub>(t) 為瞬時振幅、φ<sub>j</sub>(t) 為 unwrap 後相位。部分 HHSA 實作使用 direct quadrature（DQ）估計振幅與相位，以處理特定數值問題；論文應明確報告採用 Hilbert transform、normalized Hilbert transform 或 DQ，而不能只寫「計算瞬時頻率」。相位微分會放大雜訊，因此平滑、取樣率、低振幅時段與邊界處理都會影響結果。

## 3. 第二層 EMD：從 carrier 到 AM frequency

第一層得到的每個 IMF 可寫為：

<div class="math-block" role="math" aria-label="intrinsic mode function equals amplitude times cosine phase">c<sub>j</sub>(t) = a<sub>j</sub>(t) cos[φ<sub>j</sub>(t)]</div>

HHSA 再對振幅函數 a<sub>j</sub>(t) 做第二層 EMD：

<div class="math-block" role="math" aria-label="amplitude envelope equals a sum of modulation modes plus residual">a<sub>j</sub>(t) = Σ<sub>k=1</sub><sup>K</sup> a<sub>jk</sub>(t) cos[Φ<sub>jk</sub>(t)] + R<sub>j</sub>(t)</div>

第一層相位導數形成 carrier frequency f<sub>c</sub>；第二層相位導數形成 AM frequency f<sub>AM</sub>。能量可投影到 H(f<sub>AM</sub>, f<sub>c</sub>, t)，再沿時間積分或加總為二維 marginal HHS。由於包絡需比載波變化慢，有效區域通常滿足 f<sub>AM</sub> &lt; f<sub>c</sub>（Huang et al., 2016）。

Juan 等人（2021）的實作以 masking EMD 配合 DQ，並將低於指定 AM 閾值的能量折疊至最低 bin。這類顯示與 binning 規則會改變圖面，必須在方法中報告，不能視為 HHSA 自動固定的標準。

## 4. 為何 FFT 會出現 sidebands？

對簡單 amplitude-modulated signal：

<div class="math-block" role="math" aria-label="amplitude modulated carrier signal">x(t) = [1 + m cos(2πf<sub>m</sub>t)] cos(2πf<sub>c</sub>t)</div>

利用三角恆等式可展開成 f<sub>c</sub> 與 f<sub>c</sub> ± f<sub>m</sub> 三個加成頻率。FFT 能看見 sidebands，但只看一維頻譜時，sidebands 也可能被誤解為三個獨立振盪。HHSA 的目標是把 f<sub>m</sub> 明確放到 AM 軸，保留其與 carrier 的配對。

這不代表 Fourier 或小波「錯誤」。若問題是穩態頻率成分、phase、coherence 或已知頻帶功率，傳統方法通常更成熟、計算透明且便於跨研究比較。

## 5. 方法比較

| 方法 | 基底／分解 | 主要輸出 | 適合問題 | 主要限制 |
|---|---|---|---|---|
| FFT／Welch PSD | 固定正弦／餘弦 | 全段頻譜／PSD | 整段有哪些頻率與功率？ | 不保留發生時間；受窗與穩態近似影響 |
| STFT | 固定時間窗內 FFT | time × frequency | 頻率何時改變？ | 固定窗造成時間－頻率解析度取捨 |
| Morlet wavelet | 縮放、平移的小波 | time × frequency | 短暫振盪何時出現？ | cycle／FWHM、邊緣、基線與平滑選擇影響結果 |
| HHT | EMD + Hilbert／DQ | instantaneous frequency × time | 資料驅動的非平穩振盪 | mode mixing、端點與演算法選擇 |
| HHSA | 第二層 EMD + Hilbert／DQ | AM frequency × carrier frequency × time | 載波振幅由何種慢頻率調節？ | 維度高、參數多、推論與跨研究標準仍有限 |

## 6. Mode mixing 與 noise-assisted variants

Mode mixing 指單一 IMF 含有差異很大的時間尺度，或同一尺度分散到不同 IMF。EEMD 透過多次加入不同白噪音後做 EMD，再對 ensemble averaging，利用噪音提供較均勻的時間－頻率參考（Wu & Huang, 2009）。CEEMDAN 與 improved CEEMDAN 進一步改善完整重建與殘留噪音問題（Colominas et al., 2014）。

但 noise-assisted 不等於無參數：噪音幅度、ensemble 次數、停止條件、隨機種子與計算成本都需報告。masking EMD 則需要 mask frequency／amplitude 規則。不同變體產生的 IMF 不能假定完全可互換。

## 7. 建議的可重現分析流程

1. **定義 estimand**：例如特定 condition difference 的 HHS power，而非先看圖再選亮區。
2. **EEG 品質控制**：記錄通道、參考、濾波、artifact rejection／ICA、可用時長與排除。
3. **正向模擬**：建立無調幅、已知調幅、非正弦波與短暫 burst，量化 false positive 與 recovery error。
4. **鎖定分解器**：EMD 變體、停止條件、mask、noise amplitude、ensemble 次數與 seed。
5. **鎖定頻率投影**：carrier／AM bins、power normalization、低頻 collapse 與時間 marginal 規則。
6. **surrogate inference**：選擇能破壞目標耦合但保留必要自相關／功率結構的 surrogate。
7. **multiplicity control**：對 channel × time × carrier × AM 搜尋空間預先指定 ROI 或使用適合的 permutation／cluster 方法。
8. **敏感度分析**：更換合理參數、邊界裁切、分解變體與 artifact 門檻，檢查結論是否穩定。
9. **報告不確定性**：提供個體分布、效果量、區間估計與完整分析碼，而非只放 group-average heatmap。

## 8. 研究解讀的邊界

HHS power 表示特定 carrier 的振幅包絡含有特定 AM 頻率成分。它不單獨回答：哪一個腦區驅動另一個腦區、耦合是否具方向性、是否由同一個刺激事件共同造成、或變化是否導致認知表現。若要回答這些問題，仍需空間資訊、對照設計、方向性模型、行為關聯與外部驗證。

對運動介入而言，HHSA 特別適合作為預先定義或清楚標示的探索性補充分析。Gramkow 等人（2020）顯示運動介入靜息 EEG 文獻存在小樣本、方法異質與結果不一致；採用更高維方法時，更需要縮小假設空間與報告穩健性。

## APA 7th 參考文獻

Canolty, R. T., & Knight, R. T. (2010). The functional role of cross-frequency coupling. *Trends in Cognitive Sciences, 14*(11), 506–515. https://doi.org/10.1016/j.tics.2010.09.001

Colominas, M. A., Schlotthauer, G., & Torres, M. E. (2014). Improved complete ensemble EMD: A suitable tool for biomedical signal processing. *Biomedical Signal Processing and Control, 14*, 19–29. https://doi.org/10.1016/j.bspc.2014.06.009

Gramkow, M. H., Hasselbalch, S. G., Waldemar, G., & Frederiksen, K. S. (2020). Resting state EEG in exercise intervention studies: A systematic review of effects and methods. *Frontiers in Human Neuroscience, 14*, Article 155. https://doi.org/10.3389/fnhum.2020.00155

Huang, N. E., Hu, K., Yang, A. C. C., Chang, H.-C., Jia, D., Liang, W.-K., Yeh, J. R., Kao, C.-L., Juan, C.-H., Peng, C. K., Meijer, J. H., Wang, Y.-H., Long, S. R., & Wu, Z. (2016). On Holo-Hilbert spectral analysis: A full informational spectral representation for nonlinear and non-stationary data. *Philosophical Transactions of the Royal Society A: Mathematical, Physical and Engineering Sciences, 374*(2065), Article 20150206. https://doi.org/10.1098/rsta.2015.0206

Huang, N. E., Shen, Z., Long, S. R., Wu, M. C., Shih, H. H., Zheng, Q., Yen, N.-C., Tung, C. C., & Liu, H. H. (1998). The empirical mode decomposition and the Hilbert spectrum for nonlinear and non-stationary time series analysis. *Proceedings of the Royal Society A: Mathematical, Physical and Engineering Sciences, 454*(1971), 903–995. https://doi.org/10.1098/rspa.1998.0193

Juan, C.-H., Nguyen, K. T., Liang, W.-K., Quinn, A. J., Chen, Y.-H., Muggleton, N. G., Yeh, J.-R., Woolrich, M. W., Nobre, A. C., & Huang, N. E. (2021). Revealing the dynamic nature of amplitude modulated neural entrainment with Holo-Hilbert spectral analysis. *Frontiers in Neuroscience, 15*, Article 673369. https://doi.org/10.3389/fnins.2021.673369

Kao, S.-C., Liang, W.-K., Wang, C.-H., & Moreau, D. (2025). Beyond linear measures: Revealing hidden neural dynamics in sports and exercise cognition with non-linear EEG. *Biological Psychology, 201*, Article 109126. https://doi.org/10.1016/j.biopsycho.2025.109126

Wu, Z., & Huang, N. E. (2009). Ensemble empirical mode decomposition: A noise-assisted data analysis method. *Advances in Adaptive Data Analysis, 1*(1), 1–41. https://doi.org/10.1142/S1793536909000047

## 素材與證據來源說明

本文以我的 [HHT & Prof. Liang Course NotebookLM](https://notebook.google.com/notebook/6866e69a-9e32-4a5a-a1ff-8cc3f5b13d12) 作為主題索引，限定查詢 Huang 等人（2016）、Juan 等人（2021）及相關方法來源，再回到公開期刊與 DOI 紀錄核對。本文未轉載私人課堂錄音、投影片或原始 PDF；分析建議是方法學整理，不是已完成研究結果。
