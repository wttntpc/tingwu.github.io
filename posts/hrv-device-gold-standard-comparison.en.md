<!-- SIMPLE -->
# 12-Lead ECG and PPG Devices: How to Compare Them With a Gold Standard

People often ask, "How accurate is this watch compared with ECG?" That question is vague in two places: **which ECG is meant**, and **which number** "accurate" refers to. This article separates the two, then gives you a comparison workflow you can follow.

Further reading: [Can a Garmin Watch Replace ECG?](#/post/garmin-ecg-validation-study-design) has the fuller literature and a pilot experiment, and [Starting from a Single Heartbeat](#/post/hrv-bbi-rri-ibi-nni) explains the differences among BBI, RRI, and NNI.

## The "gold standard" has several layers

| Level | What it is | Its role in HRV validation |
|---|---|---|
| 12-lead ECG | Ten electrodes on the body record the heart's electrical activity from 12 angles | The standard for reading rhythm and waveform clinically; a routine recording is usually only about 10 seconds |
| Continuous ECG (research grade) | ECG recorded for minutes to hours, often with one or a few leads | **The reference actually used in HRV validation**; heartbeat intervals are computed from clear R peaks |
| Chest strap | A strap that detects the heart's electrical signal with electrodes | Often used as an "intermediate reference", but it needs to be validated against ECG itself |
| Wrist PPG watch | Uses light to detect changes in blood volume in the vessels | Usually **the device under test**, not the reference |

So "comparing with a 12-lead ECG" is not always the best approach. A 10-second 12-lead recording is too short to give a reliable HRV, and the usual short-term standard for HRV is about 5 minutes (Task Force, 1996). A more common approach is to use the 12-lead to confirm that the rhythm is normal and then use continuous ECG as the HRV reference.

## Why is a 12-lead not necessarily better than a single lead for HRV?

HRV needs only the **position of the R peak for every heartbeat**. One clean lead with a clear R wave is enough. The value of a 12-lead recording lies in:

- seeing whether the rhythm is normal and whether there are ectopic beats or other rhythm problems;
- standard electrode positions (Kligfield et al., 2007), which make different studies easier to compare;
- the option to look at another lead if one lead is too noisy.

Its limits are also practical: during exercise the ten electrodes and leads move easily, and the burden on participants is greater.

## Why can't PPG simply be compared with ECG?

ECG records the **electrical signal of the heart**, and the R peak is a well-defined event. PPG looks at **changes in blood volume in the vessels**: after the heart contracts, the pulse wave has to travel to the wrist before it is sensed, and the travel time is affected by vessel stiffness, blood pressure, breathing, and movement. PPG therefore gives **pulse intervals**, and the variation in them is called PRV, which is not the same as ECG-based HRV.

A review has pointed out that PRV is close to HRV in healthy adults at rest, but the two should not be treated as interchangeable (Schäfer & Vagedes, 2013). During exercise, movement, or low perfusion, the quality of the PPG signal can also deteriorate, and skin tone and activity setting are among the studied sources of error (Bent et al., 2020).

## The comparison workflow: six steps

1. <strong>Write down the purpose first.</strong> What do you want to use the device for? Watching your own trend over a month and replacing ECG in a study require completely different accuracy.
2. <strong>Set the acceptable error limits before comparing.</strong> For example, "mean bias must not exceed this much and typical error must not exceed that much". If you look at the numbers afterward, it is easy to talk yourself into a conclusion.
3. <strong>Record both devices at the same time and align them in time.</strong> Same period, same person, and the two clocks synchronized.
4. <strong>Run quality control on each side separately.</strong> Do not use the ECG result to repair gaps in the PPG, and do not do it the other way around. The proportion of lost data is itself a result.
5. **Compare in three layers**: heart rate (HR), then beat-to-beat intervals (BBI/RRI), then HRV indices (such as RMSSD). An accurate heart rate does not mean accurate beat-to-beat intervals.
6. **Report by condition**: rest, controlled breathing, during exercise, and recovery after exercise. Do not blend them into a single number.

## Which statistics to use for the comparison

A correlation coefficient alone is not enough. Two devices can be highly correlated and still differ by a constant amount. At the very least, look at the following together:

- **Mean bias**: how much one device overestimates or underestimates on average;
- **Limits of agreement**: the range in which most individual differences are likely to fall (Bland & Altman, 1986);
- **ICC or CCC**: how well the ranking and the values agree (Koo & Li, 2016; Lin, 1989);
- **MAE/MAPE**: how large the typical error is.

When the same person is measured many times, those data are **not independent** and need methods suited to repeated measurements (Bland & Altman, 1999).

## Common mistakes

- Treating the built-in HRV values of a chest strap or watch as validated beat-to-beat data;
- Starting to match heartbeats without synchronizing the two devices;
- Declaring something "validated" on a single participant and tens of thousands of heartbeats;
- Reporting only a correlation coefficient;
- Using results at rest to support use during exercise.

## A small exercise for today

Take a device you own and write one sentence: **what the purpose is, which kind of reference is used, what the error limit is, and in which condition it is measured**. If you cannot write it, you are not yet ready to say you are "validating" anything.

<!-- PROFESSIONAL -->
# Comparing HRV Devices With a Reference Standard: Reference Hierarchy, Method-Comparison Design, and Agreement Analysis

## The estimand comes before the statistical method

A device comparison should be framed this way: within a specified population and condition, does the difference between an output of the test method and the same output of the reference method fall within a **pre-specified** acceptable limit? "HR", "beat-to-beat intervals", and "HRV indices" are three different estimands and should be judged separately. For the detailed three-layer framework and a summary of published studies, see [the Garmin–ECG method comparison](#/post/garmin-ecg-validation-study-design).

## Reference method hierarchy

| Method | What is measured | Suitable for | Main limitations |
|---|---|---|---|
| 12-lead ECG | Ventricular depolarization (R wave) and the full waveform | Rhythm interpretation, confirming ectopic beats, deciding on leads and electrode positions (Kligfield et al., 2007) | A routine recording is usually only about 10 seconds, which is not enough to estimate short-term HRV; electrodes and leads are easily disturbed by movement during exercise |
| Continuous ECG (single lead or Holter type) | R peaks → RRI | The practical reference for HRV; segments of 5 minutes or longer can be recorded (Task Force, 1996) | Still requires R-peak detection, ectopic-beat handling, and manual review; it is not error-free |
| Chest strap | Electrode-based R-peak detection | An intermediate reference in exercise settings; resting RR intervals have been compared with ECG (Giles et al., 2016) | Validation results depend on the model and the setting, so it must be validated against ECG before it can serve as a reference |
| Wrist PPG | Pulse-wave fiducial points → PPI/BBI | The test method | Measures PRV, which is affected by pulse transit, movement, perfusion, and the manufacturer's algorithm (Bent et al., 2020; Schäfer & Vagedes, 2013) |

"Gold standard" is a statement **relative to the purpose**. If the goal is to compare RMSSD, the reference should be quality-controlled continuous-ECG RRI, not a 10-second 12-lead recording.

## Design

1. **Synchronous recording.** Start both devices together, use a shared event marker or a verifiable time alignment, and report the residual time offset.
2. **Stratify by condition.** Design and analyze rest, controlled breathing, movement, and recovery separately, and pre-specify limits for each condition.
3. **Unit of analysis.** The participant is the independent unit; many heartbeats or windows from one person are not independent samples.
4. **Independent QC on each side.** The reference and the test method each detect, flag, and handle abnormal beats; if one side's result is used to correct the other, agreement will be overestimated.
5. **Missing data are an outcome.** Report the proportion of data missing or excluded from the test method in each condition, rather than analyzing only the data that survived.
6. **Beat-by-beat matching.** Pre-specify the matching window first, then compare BBI; count unmatched beats (missed and extra beats) separately.

## Agreement analysis

- **Bias and limits of agreement**: describe the mean bias and the range of individual differences (Bland & Altman, 1986); repeated-measures data need to account for within-participant variation (Bland & Altman, 1999).
- **Proportional bias**: check whether the difference changes with the size of the measure; skewed indices such as RMSSD and SDNN often need a transformation before analysis.
- **ICC and CCC**: state the ICC type and model explicitly (Koo & Li, 2016); the CCC reflects both correlation and departure from the line of identity (Lin, 1989).
- **Error magnitude**: MAE, RMSE, and MAPE, compared with the pre-specified limits.
- **Correlation coefficients**: only supporting information; a high correlation does not mean the methods are interchangeable.

## Sources of error specific to PPG

Movement, perfusion, skin tone, how tightly the device is worn, manufacturer filtering and interpolation, the choice of pulse fiducial point, and changes in pulse transit time can all make PPI differ from RRI (Bent et al., 2020; Schäfer & Vagedes, 2013). A test report should therefore include the device model, firmware, algorithm version, sampling rate, whether manufacturer summary values or raw intervals were used, and the quality flag for each beat.

## Minimum reporting items

- The device, firmware, algorithm, and sampling rate; for ECG, the lead and electrode positions, filtering, and R-peak detection method;
- Participant characteristics, measurement conditions, duration, and posture;
- The synchronization method and matching rules;
- The QC rules on each side, and the proportion excluded or missing;
- The pre-specified limits and the reason they were chosen;
- Bias, limits of agreement (with confidence intervals), the ICC/CCC type, MAE, and how repeated measurements were handled;
- The populations, conditions, and indices to which the results cannot be generalized.

Please also check for omissions against recent HRV reporting guidelines (Quigley et al., 2024; Carter et al., 2026).

## Evidence boundary

This article is a framework for learning and design, not a validation conclusion. The usability of any specific model and index must be checked item by item against the population, conditions, and sample size of the corresponding study.

## References

- Bent, B., Goldstein, B. A., Kibbe, W. A., &amp; Dunn, J. P. (2020). Investigating sources of inaccuracy in wearable optical heart rate sensors. *npj Digital Medicine, 3*, Article 18. https://doi.org/10.1038/s41746-020-0226-6
- Bland, J. M., &amp; Altman, D. G. (1986). Statistical methods for assessing agreement between two methods of clinical measurement. *The Lancet, 327*(8476), 307–310. https://doi.org/10.1016/S0140-6736(86)90837-8
- Bland, J. M., &amp; Altman, D. G. (1999). Measuring agreement in method comparison studies. *Statistical Methods in Medical Research, 8*(2), 135–160. https://doi.org/10.1177/096228029900800204
- Carter, J. R., Jenkins, N. D. M., Bigalke, J. A., Robinson, A. T., Keller-Ross, M. L., Greaney, J. L., Fonkoue, I. T., Fadel, P. J., Macefield, V. G., Charkoudian, N., Levine, B. D., &amp; Joyner, M. J. (2026). Guidelines for rigor and reproducibility of heart rate variability within human cardiovascular research. *American Journal of Physiology-Heart and Circulatory Physiology, 331*(3), H918–H943. https://doi.org/10.1152/ajpheart.00041.2026
- Giles, D., Draper, N., &amp; Neil, W. (2016). Validity of the Polar V800 heart rate monitor to measure RR intervals at rest. *European Journal of Applied Physiology, 116*(3), 563–571. https://doi.org/10.1007/s00421-015-3303-9
- Kligfield, P., Gettes, L. S., Bailey, J. J., Childers, R., Deal, B. J., Hancock, E. W., van Herpen, G., Kors, J. A., Macfarlane, P., Mirvis, D. M., Pahlm, O., Rautaharju, P., &amp; Wagner, G. S. (2007). Recommendations for the standardization and interpretation of the electrocardiogram: Part I: The electrocardiogram and its technology. *Circulation, 115*(10), 1306–1324. https://doi.org/10.1161/CIRCULATIONAHA.106.180200
- Koo, T. K., &amp; Li, M. Y. (2016). A guideline of selecting and reporting intraclass correlation coefficients for reliability research. *Journal of Chiropractic Medicine, 15*(2), 155–163. https://doi.org/10.1016/j.jcm.2016.02.012
- Lin, L. I.-K. (1989). A concordance correlation coefficient to evaluate reproducibility. *Biometrics, 45*(1), 255–268. https://doi.org/10.2307/2532051
- Quigley, K. S., Gianaros, P. J., Norman, G. J., Jennings, J. R., Berntson, G. G., &amp; de Geus, E. J. C. (2024). Publication guidelines for human heart rate and heart rate variability studies in psychophysiology—Part 1: Physiological underpinnings and foundations of measurement. *Psychophysiology, 61*(9), Article e14604. https://doi.org/10.1111/psyp.14604
- Schäfer, A., &amp; Vagedes, J. (2013). How accurate is pulse rate variability as an estimate of heart rate variability? *International Journal of Cardiology, 166*(1), 15–29. https://doi.org/10.1016/j.ijcard.2012.03.119
- Task Force of the European Society of Cardiology and the North American Society of Pacing and Electrophysiology. (1996). Heart rate variability: Standards of measurement, physiological interpretation, and clinical use. *European Heart Journal, 17*(3), 354–381.

> This page is a study guide. It is not medical advice and not a validation conclusion for any specific device.
