<!-- SIMPLE -->
# HRV Learning Map: From the Autonomic Nervous System and Sensors to Interpreting Indices

HRV (heart rate variability) describes how the intervals between consecutive heartbeats change over time; it is not simply whether the average heart rate is high or low. ECG usually gets the RR interval from R peaks, while watches mostly use PPG to detect the pulse wave and obtain a pulse-to-pulse interval. The two are not entirely equivalent, especially during exercise, movement, or when signal quality is poor.

## A suggested five-level path

1. **100 Physiology**: the sinoatrial node, cardiac conduction, the autonomic nervous system, respiratory sinus arrhythmia, and the baroreflex.
2. **200 Devices**: the signal sources, sampling, wearing, and limitations of ECG, chest straps, and wrist PPG.
3. **300 Data**: R peak/pulse peak, RR/BBI, ectopic beats, missing data, artifacts, and correction.
4. **400 Indices**: mean NN, SDNN, RMSSD, frequency domain, Poincaré plot, entropy, and DFA.
5. **500 Interpretation**: control posture, time, breathing, age, exercise, medication, and recording length, and avoid equating any single index with sympathetic or parasympathetic activity.

## How to review

In each analysis, first plot the raw signal, the beat detection, and the interval series, then explain the deletion and interpolation rules, and only then look at the HRV indices. When comparing rest with exercise, or different fitness levels or exercise habits, first confirm that the measurement conditions and data quality are comparable.

> HRV can reflect some aspects of autonomic cardiac regulation, but it is not a single diagnostic tool for stress, health, or "sympathetic/parasympathetic balance".

## Daily learning progress

0. [Overview: From Wrist PPG to HRV](#/post/garmin-raw-data-hrv) (browse first, then read again once the foundations are in place)
1. [Starting from a Single Heartbeat: What Are the Differences Among BBI, RRI, IBI, and NNI?](#/post/hrv-bbi-rri-ibi-nni) (2026-08-26)
2. [Method focus: Can a Garmin Watch Replace ECG?](#/post/garmin-ecg-validation-study-design) (study design and agreement analysis)
3. [Analysis in practice: How Do Garmin, Portable ECG, and BIOPAC Enter the Same HRV Pipeline?](#/post/hrv-three-device-analysis-practice) (2026-09-23; three devices, QC, and sensitivity analysis)
4. [12-Lead ECG and PPG Devices: How to Compare Them With a Gold Standard](#/post/hrv-device-gold-standard-comparison) (2026-11-14; reference hierarchy, synchronization, agreement statistics)

<!-- PROFESSIONAL -->
# HRV Learning Map: From the Autonomic Nervous System and Sensors to Interpreting Indices

## Daily learning progress

0. [Overview: From Wrist PPG to HRV](#/post/garmin-raw-data-hrv) (browse first, then read again once the foundations are in place)
1. [Starting from a Single Heartbeat: What Are the Differences Among BBI, RRI, IBI, and NNI?](#/post/hrv-bbi-rri-ibi-nni) (2026-08-26)
2. [Method focus: Can a Garmin Watch Replace ECG?](#/post/garmin-ecg-validation-study-design) (study design and agreement analysis)
3. [Analysis in practice: How Do Garmin, Portable ECG, and BIOPAC Enter the Same HRV Pipeline?](#/post/hrv-three-device-analysis-practice) (2026-09-23; three devices, QC, and sensitivity analysis)
4. [12-Lead ECG and PPG Devices: How to Compare Them With a Gold Standard](#/post/hrv-device-gold-standard-comparison) (2026-11-14; reference hierarchy, synchronization, agreement statistics)

## The measurement chain

HRV inference depends on a complete chain: cardiac electrophysiology and neural regulation → ECG or PPG sensing → beat detection → NN-interval quality control → index estimation → study design and statistical interpretation. Wrist PPG may be practical at rest, but pulse intervals are affected by pulse transmission, peripheral blood flow, and motion artifacts, and should not be treated unconditionally as ECG RR intervals.

| Level | Core content | What must be reported |
|---|---|---|
| Physiology | Vagal regulation, breathing, the baroreflex, and sources of rhythm | Posture, breathing, time, and population |
| Acquisition | ECG/PPG, sampling rate, sensor position, and synchronization | Device, firmware, protocol, and recording length |
| Cleaning | Peaks, ectopic beats, artifacts, exclusion, and interpolation | Algorithm, thresholds, manual review, and exclusion proportion |
| Features | Time domain, frequency domain, Poincaré, entropy, DFA | Formulas, units, windows, and parameters |
| Inference | Within-person change, between-group differences, and confounder control | Effect sizes, intervals, sensitivity analyses, and limitations |

## Principles for interpreting indices

RMSSD and high-frequency HRV are often used to describe respiration-related cardiac vagal regulation, but they are still affected by breathing, measurement conditions, and data processing. The meaning of SDNN depends heavily on recording length. LF/HF should not be called "sympathetic/parasympathetic balance". Nonlinear indices need enough data, explicit parameters, and a test–retest reliability assessment; being more complex does not mean being more physiologically specific.

## Starting sources (APA 7th)

- Task Force of the European Society of Cardiology and the North American Society of Pacing and Electrophysiology. (1996). Heart rate variability: Standards of measurement, physiological interpretation, and clinical use. *European Heart Journal, 17*(3), 354–381. https://pubmed.ncbi.nlm.nih.gov/8737210/
- Laborde, S., Mosley, E., &amp; Thayer, J. F. (2017). Heart rate variability and cardiac vagal tone in psychophysiological research: Recommendations for experiment planning, data analysis, and data reporting. *Frontiers in Psychology, 8*, 213. https://doi.org/10.3389/fpsyg.2017.00213
- Quigley, K. S., Gianaros, P. J., Norman, G. J., Jennings, J. R., Berntson, G. G., &amp; de Geus, E. J. C. (2024). Publication guidelines for human heart rate and heart rate variability studies in psychophysiology—Part 1: Physiological underpinnings and foundations of measurement. *Psychophysiology, 61*(9), e14604. https://doi.org/10.1111/psyp.14604
