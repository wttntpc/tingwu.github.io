<!-- SIMPLE -->
# EEG Learning Map: From Neurophysiology and Equipment to Reproducible Analysis

EEG measures how the electrical potential on the scalp changes over time. Its temporal resolution is high, but the signal is weak and is affected by eye movements, muscle activity, electrode contact, the choice of reference, and environmental noise. To really understand EEG, you have to learn the physiological sources, the equipment, experimental design, preprocessing, and statistical analysis together.

## A suggested five-level path

1. **100 Physiology**: membrane potentials, postsynaptic potentials, population neural activity, volume conduction, and scalp potentials.
2. **200 Equipment**: electrodes, the conductive interface, impedance, the reference electrode, amplifiers, the ADC, sampling rate, and triggers.
3. **300 Acquisition**: the 10–20 system, experimental timing, event markers, participant preparation, and backup of the raw data.
4. **400 Analysis**: inspecting raw waveforms, filtering, bad channels, re-referencing, ICA, epoching, baselines, ERPs, spectra, and time–frequency analysis.
5. **500 Inference**: quality control, statistical models, multiple comparisons, reproducible code, and transparent reporting.

## Review checklist

For every processing step, answer: "What does it change? What is the basis for it? Could it remove real signal? How do I report it with before-and-after plots and counts?" If you only remember where the buttons are, you do not yet understand the analysis.

<!-- PROFESSIONAL -->
# EEG Learning Map: From Neurophysiology and Equipment to Reproducible Analysis

## From a generative model to a statistical model

EEG analysis can be divided into five dependent layers: neural current sources, volume conduction in the head, measurement by electrodes and amplifiers, digital signal processing, and statistical inference. A later layer cannot repair information that an earlier layer failed to record or that was lost through a design error, so study planning has to come before preprocessing.

| Level | Essential questions | QC output |
|---|---|---|
| Physiology/physics | How is the signal generated and conducted to the scalp? | A statement of the limits on sources and localization |
| Hardware | Are the dynamic range, noise, common-mode rejection, and synchronization adequate? | Records of the equipment, positions, impedances, and events |
| Acquisition | Can the task, trials, and comparison conditions identify the target effect? | A read-only backup of the raw data and metadata |
| Processing | What are the assumptions, parameters, and side effects of each step? | Exclusion counts, before-and-after plots, parameters, and versions |
| Inference | What are the unit of analysis, the search space, and the uncertainty? | Effect estimates, multiple-comparison handling, and sensitivity analyses |

## A suggested order for going deeper

First master the structure of continuous and event data, then learn ERPs; after that move on to Welch PSD, FFT, time–frequency analysis, and wavelets, and only last deal with source localization, connectivity, cross-frequency coupling, and HHSA. Every advanced method should first be validated on simulated signals, and then checked on real data for edge effects, artifacts, and parameter sensitivity.

## Starting sources (APA 7th)

- Pernet, C. R., Garrido, M. I., Gramfort, A., et al. (2020). Issues and recommendations from the OHBM COBIDAS MEEG committee for reproducible EEG and MEG research. *Nature Neuroscience, 23*(12), 1473–1483. https://doi.org/10.1038/s41593-020-00709-0
- Keil, A., Debener, S., Gratton, G., et al. (2014). Committee report: Publication guidelines and recommendations for studies using electroencephalography and magnetoencephalography. *Psychophysiology, 51*(1), 1–21. https://doi.org/10.1111/psyp.12147
