<!-- SIMPLE -->
# The Stop-Signal Task in Context: From Delayed Signals to the Race Model

In everyday life, "stopping" often arrives suddenly: the car ahead brakes without warning, or you realize halfway through a sentence that you should not say it. Cognitive science asks: **once an action is already being prepared, can it still be cancelled, and how long does cancelling it take?** The stop-signal task was developed to answer exactly this.

Further reading: the [interactive lab](#/lab/stop-signal).

## "Stopping" is not the same as "not doing"

If the rule is "do not press when you see an X", you never prepare the movement in the first place, which is closer to choosing not to act. The stop-signal task is about something else: **the action is already being prepared, and only then does a signal tell you to stop.** The brain has to catch the action before it is sent out, which is why the task suits the study of inhibition.

## Where it came from

- **An early version in the 1960s:** Lappin and Eriksen (1966) had participants respond to a visual stimulus but occasionally gave a signal to stop a short moment after the stimulus. This "delayed signal" idea was the forerunner of the stop-signal task.
- **Theory in the 1980s:** Logan and Cowan (1984) proposed a theory that framed "whether you can stop" as a race and showed how to estimate "how long stopping takes" from data. In the same year, Logan, Cowan, and Davis (1984) turned the model and the estimation method into a usable procedure.
- **Later development:** the task became one of the most widely used methods for studying inhibitory control (Verbruggen & Logan, 2008). In 2019, a large group of researchers wrote a consensus guide on how to design, analyze, and report it (Verbruggen et al., 2019).

## The core idea: a race

Imagine two runners in the brain at the same time:

- **The "Go" runner**: prepares to press a key after the stimulus and starts running when the stimulus appears.
- **The "Stop" runner**: starts only after the stop signal appears.

Whoever reaches the finish line first decides the outcome. If Go arrives first, the action is sent out (a failed stop); if Stop arrives first, the action is held back (a successful stop).

The later the stop signal appears, the more the Stop runner is disadvantaged and the harder it is to stop. The earlier it appears, the easier it is.

## Why "stopping speed" has to be estimated

When a stop is successful, **there is no key press, so there is no reaction time to record.** You cannot measure "how long stopping took" directly in the usual way. Instead, researchers work backward from the distribution of Go reaction times, the time at which the stop signal appeared, and how often participants failed to stop, to infer roughly how long the Stop runner needed. This estimate is called the **stop-signal reaction time** (SSRT).

## What does a shorter SSRT mean?

A shorter value means the stopping process finishes faster. But it is a **model-based estimate**, not something measured directly, and it can be trusted only when certain assumptions hold. It is not a diagnostic tool, and it is not a fixed "ability score" for a person.

## Later extensions

Building on this basic structure, researchers have asked further questions:

- **Stopping only part of the action:** for example, preparing two actions at once and needing to stop only one of them (Aron & Verbruggen, 2008). This is the line of research on "selective stopping".
- **Adding a control condition to separate "stopping" from "noticing the signal":** some studies add a "continue" condition to the stop-signal task to separate attention being drawn to a new signal from motor inhibition itself (Nguyen et al., 2021).
- **Using emotional stimuli:** studying whether emotional stimuli affect inhibition (Verbruggen & De Houwer, 2007).

Each of these versions answers a different question, so their results should not be read together as if they were the same.

## Questions to ask when reading a stop-signal study

1. Did they measure global stopping or selective stopping?
2. Is there a control condition for the effect of the signal itself?
3. How many stop trials are there per condition? With too few trials, the estimate becomes unstable.
4. Were the assumptions behind SSRT checked?

<!-- PROFESSIONAL -->
# The Stop-Signal Task in Context: From Delayed Signals and the Race Model to SSRT Estimation

## Historical and theoretical background

The forerunner of the stop-signal paradigm was the procedure of Lappin and Eriksen (1966), who presented a delayed signal after the stimulus in a visual reaction-time task to request that the response be stopped. Logan and Cowan (1984) proposed a theory of an "act of control" that formalized response inhibition as a **race model** between a Go process and a Stop process and derived a method for estimating the duration of the Stop process; Logan et al. (1984) went on to describe the model and estimation procedure for simple and choice reaction-time tasks. Verbruggen and Logan (2008) reviewed applications of the paradigm in cognitive and neuroscience research, and Verbruggen et al. (2019) provided a consensus guide covering design, analysis, and reporting.

## The race model and its assumptions

On a stop trial, the Go process starts when the stimulus appears and the Stop process starts after the stop-signal delay (SSD). If the Go process finishes first, the response is executed (a failed stop); if the Stop process finishes first, the response is inhibited (a successful stop).

Estimation depends on an **independence assumption**: the Go and Stop processes are independent of each other. One testable implication is that reaction times on failed stop trials should be shorter than Go reaction times in the same condition, because only the faster Go processes can finish first (Verbruggen et al., 2019). When this implication is violated, the SSRT estimate should not be interpreted.

## Why SSRT has to be estimated

Successful stop trials have no observable response, so the finishing time of the Stop process cannot be measured directly. SSRT is a **model-derived quantity** inferred from the Go reaction-time distribution, the SSD, and *p*(respond | signal), the proportion of stop trials on which a response is still made. It is not a directly observed value.

## Tracking procedures and estimation methods

- **SSD tracking:** to keep *p*(respond | signal) near the middle, many studies use a trial-by-trial adjustment of SSD (a staircase): SSD is lengthened after a successful stop and shortened after a failed one.
- **Mean method:** subtract the mean SSD from the mean Go reaction time.
- **Integration method:** rank the Go reaction times, take the quantile corresponding to *p*(respond | signal), and subtract the mean SSD. The consensus guide recommends the integration method and replacing Go omissions with the maximum reaction time so that omissions do not bias the estimate (Verbruggen et al., 2019).

## When SSRT should not be reported

Following the recommendations of the consensus guide, SSRT should not be reported or interpreted in these situations (Verbruggen et al., 2019):

- *p*(respond | signal) is clearly away from the middle range, or equals 0 or 1;
- the reaction time on failed stops is not shorter than the Go reaction time, which means the independence assumption does not hold;
- there are too few stop trials in a condition, making the estimate unstable.

## Extended paradigms

| Direction | Question | Representative study |
|---|---|---|
| Selective stopping | Several actions are prepared and only some need to be stopped | Aron and Verbruggen (2008) |
| Added control condition | Separating attention drawn to the signal from motor inhibition itself | Nguyen et al. (2021) |
| Emotional stimuli | Whether emotional stimuli affect inhibition | Verbruggen and De Houwer (2007) |

The control conditions and estimation targets differ across these versions, so **results cannot be compared directly with one another**. When SSRT is estimated separately by stimulus category (for example, different emotions), each category has fewer stop trials and the estimates become less precise, so such analyses are usually appropriate only as exploratory work.

## Limits of interpretation

- SSRT is a model-based estimate and can be interpreted only when its assumptions hold;
- its value depends on the Go task, the tracking procedure, how salient the signal is, and participants' strategies;
- it is not a clinical diagnostic index and should not be used alone to judge an individual's inhibitory ability.

## References

Aron, A. R., &amp; Verbruggen, F. (2008). Stop the presses: Dissociating a selective from a global mechanism for stopping. *Psychological Science, 19*(11), 1146–1153. https://doi.org/10.1111/j.1467-9280.2008.02216.x

Lappin, J. S., &amp; Eriksen, C. W. (1966). Use of a delayed signal to stop a visual reaction-time response. *Journal of Experimental Psychology, 72*(6), 805–811. https://doi.org/10.1037/h0021266

Logan, G. D., &amp; Cowan, W. B. (1984). On the ability to inhibit thought and action: A theory of an act of control. *Psychological Review, 91*(3), 295–327. https://doi.org/10.1037/0033-295X.91.3.295

Logan, G. D., Cowan, W. B., &amp; Davis, K. A. (1984). On the ability to inhibit simple and choice reaction time responses: A model and a method. *Journal of Experimental Psychology: Human Perception and Performance, 10*(2), 276–291. https://doi.org/10.1037/0096-1523.10.2.276

Nguyen, T. V., Balachandran, P., Muggleton, N. G., Liang, W.-K., &amp; Juan, C.-H. (2021). Dynamical EEG indices of progressive motor inhibition and error-monitoring. *Brain Sciences, 11*(4), Article 478. https://doi.org/10.3390/brainsci11040478

Verbruggen, F., &amp; De Houwer, J. (2007). Do emotional stimuli interfere with response inhibition? Evidence from the stop signal paradigm. *Cognition and Emotion, 21*(2), 391–403. https://doi.org/10.1080/02699930600625081

Verbruggen, F., &amp; Logan, G. D. (2008). Response inhibition in the stop-signal paradigm. *Trends in Cognitive Sciences, 12*(11), 418–424. https://doi.org/10.1016/j.tics.2008.07.005

Verbruggen, F., Aron, A. R., Band, G. P., Beste, C., Bissett, P. G., Brockett, A. T., Brown, J. W., Chamberlain, S. R., Chambers, C. D., Colonius, H., Colzato, L. S., Corneil, B. D., Coxon, J. P., Dupuis, A., Eagle, D. M., Garavan, H., Greenhouse, I., Heathcote, A., Huster, R. J., … Boehler, C. N. (2019). A consensus guide to capturing the ability to inhibit actions and impulsive behaviors in the stop-signal task. *eLife, 8*, Article e46323. https://doi.org/10.7554/eLife.46323
