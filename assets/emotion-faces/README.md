# Synthetic emotion-face assets

These twelve portraits were generated with OpenAI image generation on 2026-10-18 for the site's educational emotion × action demonstration.

- The depicted people are fictional and are not intended to resemble real individuals.
- Four fictional identities each have neutral, happy, and angry variants. Internal file letters are never shown during trials.
- Generation and editing prompts held framing, gaze, lighting, background, clothing, and identity constant while changing the requested facial expression.
- The files were resized to 512 × 512 WebP for web delivery.
- These images have not undergone formal ratings of emotion recognition, valence, arousal, intensity, or demographic equivalence. They are not validated research stimuli and should not be used as such without an independent validation study.

The public-facing experiment labels these images as AI-generated and limits their role to science communication and interaction design.

## Sad variants and the sad-to-happy continuum (2026-11-14)

- `identity-{a,b,c,d}-sad.webp` were generated with the same OpenAI image-generation tool by editing each identity's neutral portrait (same instructions as before: identity, framing, gaze, lighting, background and clothing held constant; only the expression changed to a moderate, natural sadness with no tears).
- `continuum/identity-{a,b,c,d}-level-{0..8}.webp` (384 × 384) hold nine images per identity for the lab games. Levels 0, 4 and 8 are the generated sad, neutral and happy images. Levels 1–3 and 5–7 are optical-flow (OpenCV DIS) blends between the two nearest generated images.
- The levels are equal steps in image blending. They are **not** equal steps of rated emotional intensity, and no emotion-recognition, valence or arousal ratings have been collected for them.
- The same limits apply: fictional people, AI-generated, not validated research stimuli.

