<!-- SIMPLE -->

一條 EEG 曲線看起來忽高忽低，但肉眼很難回答：裡面有多少 10 Hz alpha？20 Hz 活動只出現在前半段，還是持續存在？頻率是否從慢逐漸變快？

FFT 與小波分析都把複雜訊號和一組規則波形比較，卻保留不同資訊：**FFT 擅長回答整段有哪些頻率；小波則進一步回答這些頻率何時出現。**

> 閱讀指引：先用下方工具比較三種合成訊號。若要設定 EEG 分析參數，再閱讀專業版的 Nyquist frequency、頻率解析度、窗函數、Morlet cycles、基線與邊緣效應。

## 先從取樣開始

EEG 儀器並不是連續保存電壓，而是每秒量測很多次。若 sampling rate 是 250 Hz，代表每秒有 250 個樣本。理想條件下，可辨識的最高頻率是 sampling rate 的一半，也就是 Nyquist frequency：

<div class="math-block" role="math" aria-label="Nyquist frequency equals sampling rate divided by two">f<sub>Nyquist</sub> = f<sub>s</sub> / 2</div>

因此，250 Hz 取樣無法可靠表示超過 125 Hz 的成分。實際系統還需在取樣前使用 anti-aliasing filter；僅在分析後刪除高頻，不能逆轉已發生的 aliasing。

## FFT：把訊號和很多頻率逐一比對

Fourier transform 的直覺很像拿一組不同速度的正弦波與餘弦波，逐一和資料做內積：

- 模板頻率與資料吻合時，相乘後會同向累積，係數較大。
- 不吻合時，正負值互相抵銷，係數較小。

Discrete Fourier Transform（DFT）是離散資料的數學形式；Fast Fourier Transform（FFT）是有效率計算 DFT 的演算法。FFT 不是另一種不同的頻譜，而是更快得到相同 DFT 結果的方法。

## FFT 最容易被誤解的三件事

### 1. 它不知道「何時」出現

FFT 使用整個分析區段。一段 10 Hz 只出現 0.5 秒，和 10 Hz 持續整段，在頻譜上都可能有 10 Hz 峰值，但其大小與展寬不同；單看整段頻譜無法知道事件時間。

### 2. 記錄越長，頻率格點越細

頻率格點間距約為：

<div class="math-block" role="math" aria-label="frequency bin spacing equals sampling rate divided by number of samples, or one divided by duration">Δf = f<sub>s</sub> / N = 1 / T</div>

2 秒資料的格點間距是 0.5 Hz，10 秒則是 0.1 Hz。這是數學格點，不等於能在雜訊中分辨兩個鄰近神經振盪的實際能力。

### 3. 補零不會增加真實資訊

zero padding 會讓頻譜曲線更密、更容易讀取峰值位置，但沒有增加觀察時間，因此不會創造新的實質頻率解析度。

## Windowing 與 spectral leakage

FFT 會把分析片段視為可週期重複。如果片段兩端接不起來，邊界突跳會把能量散到附近頻率，形成 spectral leakage。Hann 等 taper 讓兩端平滑靠近零，可減少 leakage，但也會改變峰值寬度與振幅；沒有一個窗函數對所有問題都最好。

Welch PSD 會把長資料切成重疊小段、每段加窗後計算 periodogram，再加以平均。它通常比單次 periodogram 穩定，但小段越短，頻率格點越粗。

## 小波：加入「何時出現」

小波是一段有中心、會衰減的短波。分析時把它沿時間移動，並改變尺度或中心頻率，計算每個時間與頻率位置的相似度。EEG 常用 complex Morlet wavelet，因為它可以同時估計振幅／功率與相位。

小波沒有免費得到完美解析度：

- wavelet 較短、cycles 較少：較容易定位「何時發生」，但頻率較模糊。
- wavelet 較長、cycles 較多：頻率較精細，但事件開始與結束會被時間平滑。

## 動手比較 FFT 與小波

<div class="tf-demo" data-time-frequency-demo>
  <fieldset class="tf-scenarios">
    <legend>選擇合成訊號</legend>
    <button type="button" data-signal="steady" aria-pressed="true">穩定 10 Hz</button>
    <button type="button" data-signal="bursts" aria-pressed="false">兩段短暫 burst</button>
    <button type="button" data-signal="chirp" aria-pressed="false">頻率逐漸升高</button>
  </fieldset>
  <label class="tf-cycle-control"><span>Morlet cycles：<output data-cycle-value>6</output></span><input type="range" min="3" max="12" step="1" value="6" data-cycle-slider></label>
  <div class="tf-plot-grid">
    <figure><figcaption>時間訊號</figcaption><canvas width="720" height="210" data-time-plot role="img" aria-label="合成時間序列"></canvas></figure>
    <figure><figcaption>FFT：整段頻率內容</figcaption><canvas width="720" height="210" data-fft-plot role="img" aria-label="合成訊號的傅立葉功率頻譜"></canvas></figure>
    <figure class="tf-scalogram"><figcaption>Morlet wavelet：時間 × 頻率</figcaption><canvas width="720" height="300" data-wavelet-plot role="img" aria-label="合成訊號的小波時間頻率圖"></canvas></figure>
  </div>
  <p class="tf-demo-note" data-tf-note role="status">FFT 會在 10 Hz 顯示集中峰值；小波圖則顯示它持續整段時間。調整 cycles 比較時間與頻率的模糊程度。</p>
</div>
<p class="demo-caveat">工具使用固定公式產生 3 秒、128 Hz 的合成資料。顏色代表相對 wavelet power，只用於教學，不是 EEG 診斷、顯著性檢定或軟體驗證基準。</p>

## 如何選方法？

| 研究問題 | 優先考慮 | 原因 |
|---|---|---|
| 一段穩定 resting EEG 有哪些頻率？ | FFT／Welch PSD | 直接、成熟、便於比較頻帶功率 |
| 刺激後 theta 何時增強？ | STFT／wavelet | 保留時間資訊 |
| 短暫 burst 或頻率逐漸改變？ | wavelet／其他 time-frequency 方法 | 能追蹤非平穩變化 |
| 快節律振幅受哪個慢頻率調節？ | PAC／HHSA 等 | 需要 carrier 與 modulation 的關係 |

延伸理解最後一列，可閱讀[從 EMD、瞬時頻率到 HHSA](#/post/hhsa-nonlinear-eeg)。

## 一份不容易漏步驟的 EEG 檢查表

1. sampling rate 與 anti-aliasing filter 是否足以涵蓋目標頻率？
2. 分析區段長度是否支援所需頻率格點與低頻週期數？
3. 是否處理壞道、眼動、肌電、動作與 line noise？
4. FFT 使用哪個 taper、segment length、overlap 與 PSD scaling？
5. wavelet 使用哪個中心頻率、cycles 或 temporal／spectral FWHM？
6. 是否說明 padding、edge trimming 與 cone of influence？
7. event-related power 使用何種 baseline（ratio、percent 或 dB）？
8. time × frequency × channel 的多重比較如何控制？
9. 結果是否同時呈現個體差異、效果量與不確定性？

### 延伸閱讀

- [我的 EEG, ERP NotebookLM](https://notebook.google.com/notebook/20b5bdeb-f540-4ee3-82fa-818ec3f08aa9)（可能需要登入與權限）
- [EEG 前處理不是按下按鈕](#/post/eeg-preprocessing-principles)
- [從 EMD、瞬時頻率到 HHSA](#/post/hhsa-nonlinear-eeg)

<!-- PROFESSIONAL -->

FFT、STFT 與 wavelet transform 都可視為把訊號投影到一組分析函數，但其基底的時間支撐與參數化方式不同。方法選擇應由 estimand 決定：global spectrum、event-related power、phase consistency、burst timing 或 cross-frequency structure 不是同一個問題。

## 1. DFT 與 FFT

對長度 N、sampling interval Δt 的離散訊號 x[n]，DFT 定義為：

<div class="math-block" role="math" aria-label="discrete Fourier transform">X[k] = Σ<sub>n=0</sub><sup>N−1</sup> x[n] e<sup>−i2πkn/N</sup>,　k = 0, …, N−1</div>

其反轉換為：

<div class="math-block" role="math" aria-label="inverse discrete Fourier transform">x[n] = (1/N) Σ<sub>k=0</sub><sup>N−1</sup> X[k] e<sup>i2πkn/N</sup></div>

X[k] 是 complex coefficient；magnitude、phase、amplitude spectrum、power spectrum 與 power spectral density（PSD）需依資料單位、雙邊／單邊頻譜及正規化規則另行定義。FFT 只是以較低計算複雜度求得 DFT，不改變這些定義。

### Sampling、Nyquist 與 aliasing

離散頻率格點為 f<sub>k</sub> = kf<sub>s</sub>/N，格點間距 Δf = f<sub>s</sub>/N = 1/T。對實值訊號，負頻率與正頻率呈 conjugate symmetry，通常報告 0 至 f<sub>s</sub>/2 的單邊譜。

高於 Nyquist frequency 的訊號會折返到較低頻率，形成 aliasing。這是 acquisition 問題，需由充分 sampling rate 與類比 anti-aliasing filter 預防；後處理 low-pass 無法判斷某個低頻究竟是真訊號或已 alias 的高頻。

## 2. Finite window、leakage 與 zero padding

實際分析等同把無限訊號乘上一個有限觀察窗。時間域相乘在頻域變成 convolution，因此 rectangular window 的頻率響應會使能量擴散。若正弦頻率不恰好落在 DFT bin，或片段邊界不連續，spectral leakage 更明顯。

Taper 可降低 sidelobes，但會加寬 main lobe；這是 dynamic range 與頻率分離能力的取捨。報告「有使用 Hann window」仍不夠，還需說明 epoch／segment 長度、overlap、detrending、demeaning 與 scaling。

zero padding 把額外零值接到資料尾端，使 DFT 在更密的頻率位置取樣，相當於對既有 spectrum 做 interpolation。原始觀察時間 T 沒有增加，因此不能把補零後的細格點當成更高的獨立頻率解析度。

## 3. Periodogram 與 Welch PSD

Periodogram 以單一有限片段的 Fourier magnitude squared 估計功率。Welch（1967）把資料分成可能重疊的 segments、逐段 taper 與計算 modified periodogram，再平均以降低估計變異：

<div class="math-block" role="math" aria-label="Welch power spectral density is the mean of modified periodograms">Ŝ<sub>xx</sub>(f) = (1/L) Σ<sub>ℓ=1</sub><sup>L</sup> P̃<sub>ℓ</sub>(f)</div>

增加平均段數通常讓 PSD 較平滑、variance 較低；縮短 segment 卻會增大 Δf。overlap 也不會使 segments 完全獨立。Welch PSD 適合相對穩定的 resting／continuous EEG 摘要，但仍是分析片段內的平均表徵。

## 4. STFT：固定窗的 time-frequency transform

STFT 對中心時間 τ 附近的資料乘上固定窗 w(t−τ)，再做 Fourier transform：

<div class="math-block" role="math" aria-label="short time Fourier transform">STFT<sub>x</sub>(τ,f) = ∫ x(t)w(t−τ)e<sup>−i2πft</sup>dt</div>

短窗提高 temporal localization、降低 spectral precision；長窗相反。因同一窗長套用所有頻率，若研究同時涵蓋低 theta 與高 gamma，固定解析度可能不符合各頻率的週期尺度。

## 5. Continuous Morlet wavelet transform

一般 continuous wavelet transform（CWT）為：

<div class="math-block" role="math" aria-label="continuous wavelet transform">W<sub>x</sub>(a,b) = (1/√a) ∫ x(t) ψ<sup>*</sup>((t−b)/a) dt</div>

a 是 scale、b 是時間位移、ψ 是 mother wavelet。Complex Morlet wavelet 可視為 complex sinusoid 乘上 Gaussian envelope：

<div class="math-block" role="math" aria-label="complex Morlet wavelet is a complex sinusoid inside a Gaussian envelope">ψ(t;f<sub>0</sub>) = e<sup>i2πf<sub>0</sub>t</sup> e<sup>−t²/(2σ<sub>t</sub>²)</sup></div>

若用 n cycles 參數化，常見關係為 σ<sub>t</sub> = n/(2πf<sub>0</sub>)；cycles 增加會擴大 temporal width 並縮小 spectral width。不同軟體對「cycles」、support、normalization 與 frequency-domain Gaussian 的定義可能不同。Cohen（2019）建議用 temporal 與 spectral full-width at half-maximum（FWHM）直接描述 smoothing，較容易重現。

complex coefficient W 包含 magnitude 與 phase：|W|² 可形成 time-frequency power，arg(W) 可用於 phase-based measures。功率增加不等同 phase locking；若要區分 induced 與 evoked activity，trial averaging 的順序必須符合問題。

## 6. Baseline normalization

event-related time-frequency power 常相對基線表達。例如 decibel normalization：

<div class="math-block" role="math" aria-label="decibel power change equals ten log ten of power divided by baseline power">P<sub>dB</sub>(t,f) = 10 log<sub>10</sub>[P(t,f) / P<sub>baseline</sub>(f)]</div>

ratio、percent change、dB 與 baseline subtraction 不是可隨意互換的顯示選項。基線若含條件差異、anticipatory activity、artifact 或過少週期，會把偏差帶到整張圖。分析應報告 baseline window、先在 trial 或 participant 層級轉換、以及 averaging 順序。

## 7. Edge effects 與 cone of influence

卷積需要訊號邊界外的資料，但實際 epoch 有限，因此常以 zero、reflection 或其他方式 padding。越低頻、cycles 越多，wavelet 越長，受邊緣影響的範圍越大。Torrence 與 Compo（1998）用 cone of influence 標示 edge effects 不可忽略的區域。

padding 只是定義邊界外如何延伸，不會創造真實觀察。若 epoch 太短，低頻分析可能整段都被邊緣影響；應延長 epoch、縮小分析範圍或放棄該低頻，而不是只裁掉圖的最外側幾個點。

## 8. Time-frequency inference 不是看熱圖選亮點

一張 channel × time × frequency 圖包含大量相關比較。先看圖再選 ROI 並用相同資料檢定，會產生 circular analysis。較穩健做法包括：

- 預先指定通道、時間與頻率 ROI；
- 使用獨立 localizer 或 cross-validation 定義 ROI；
- 對完整搜尋空間使用 permutation／cluster-based correction，並清楚說明 cluster statistic 回答的是區域層級問題；
- 報告 participant-level 分布、effect size 與 uncertainty，而非只呈現 group heatmap；
- 對 cycles／FWHM、baseline、padding 與 artifact threshold 做敏感度分析。

## 9. 方法優缺點總表

| 方法 | 優點 | 缺點 | 典型用途 |
|---|---|---|---|
| FFT periodogram | 快速、數學透明、保留 magnitude 與 phase | 高變異、不保留時間 | 單段頻率成分與 phase |
| Welch PSD | 降低 PSD 變異、實務成熟 | 分段平均犧牲 Δf，仍不定位事件時間 | resting EEG、band power |
| STFT | 簡單的 time-frequency 表徵 | 所有頻率共用固定窗 | 頻帶範圍較窄、固定時間尺度事件 |
| Morlet wavelet | 適應不同頻率週期、同時取得 power 與 phase | cycles／FWHM、edge、baseline 與 normalization 影響大 | event-related oscillation、burst timing |
| HHT／HHSA | 資料驅動瞬時頻率；HHSA 額外分離 carrier × AM | mode mixing、端點、參數與推論標準較不成熟 | 非平穩振盪與振幅調變的補充分析 |

## 10. 互動工具

<div class="tf-demo" data-time-frequency-demo>
  <fieldset class="tf-scenarios">
    <legend>選擇合成訊號</legend>
    <button type="button" data-signal="steady" aria-pressed="true">穩定 10 Hz</button>
    <button type="button" data-signal="bursts" aria-pressed="false">兩段短暫 burst</button>
    <button type="button" data-signal="chirp" aria-pressed="false">頻率逐漸升高</button>
  </fieldset>
  <label class="tf-cycle-control"><span>Morlet cycles：<output data-cycle-value>6</output></span><input type="range" min="3" max="12" step="1" value="6" data-cycle-slider></label>
  <div class="tf-plot-grid">
    <figure><figcaption>時間訊號</figcaption><canvas width="720" height="210" data-time-plot role="img" aria-label="合成時間序列"></canvas></figure>
    <figure><figcaption>FFT：整段頻率內容</figcaption><canvas width="720" height="210" data-fft-plot role="img" aria-label="合成訊號的傅立葉功率頻譜"></canvas></figure>
    <figure class="tf-scalogram"><figcaption>Morlet wavelet：時間 × 頻率</figcaption><canvas width="720" height="300" data-wavelet-plot role="img" aria-label="合成訊號的小波時間頻率圖"></canvas></figure>
  </div>
  <p class="tf-demo-note" data-tf-note role="status">FFT 會在 10 Hz 顯示集中峰值；小波圖則顯示它持續整段時間。調整 cycles 比較時間與頻率的模糊程度。</p>
</div>
<p class="demo-caveat">本工具以直接 DFT 與教學用 Morlet convolution 即時計算。它刻意省略正式 EEG pipeline 的 taper、PSD scaling、trial aggregation、baseline 與統計推論，不能用於驗證研究程式。</p>

## APA 7th 參考文獻

Bruns, A. (2004). Fourier-, Hilbert- and wavelet-based signal analysis: Are they really different approaches? *Journal of Neuroscience Methods, 137*(2), 321–332. https://doi.org/10.1016/j.jneumeth.2004.03.002

Cohen, M. X. (2019). A better way to define and describe Morlet wavelets for time-frequency analysis. *NeuroImage, 199*, 81–86. https://doi.org/10.1016/j.neuroimage.2019.05.048

Delorme, A., & Makeig, S. (2004). EEGLAB: An open source toolbox for analysis of single-trial EEG dynamics including independent component analysis. *Journal of Neuroscience Methods, 134*(1), 9–21. https://doi.org/10.1016/j.jneumeth.2003.10.009

Torrence, C., & Compo, G. P. (1998). A practical guide to wavelet analysis. *Bulletin of the American Meteorological Society, 79*(1), 61–78. https://doi.org/10.1175/1520-0477%281998%29079%3C0061%3AAPGTWA%3E2.0.CO%3B2

Welch, P. D. (1967). The use of fast Fourier transform for the estimation of power spectra: A method based on time averaging over short, modified periodograms. *IEEE Transactions on Audio and Electroacoustics, 15*(2), 70–73. https://doi.org/10.1109/TAU.1967.1161901

## 素材與證據來源說明

本文以我的 [EEG, ERP NotebookLM](https://notebook.google.com/notebook/20b5bdeb-f540-4ee3-82fa-818ec3f08aa9) 中〈Basics of Time-Frequency Analysis: FFT and Coherence〉課程教材作為主題順序起點。該教材沒有 DOI，且未涵蓋 Nyquist、spectral leakage、zero padding、Morlet cycles、baseline、cone of influence 與多重比較的完整方法，因此本文另回到上述同行評審原始來源核對並補足。未轉載私人課堂錄音、投影片或原始 PDF。
