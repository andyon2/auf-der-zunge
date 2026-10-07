// Face parameters per script state (kern-minimal.md, section 4).
// Ranges are wider than in the mockups so the change is visible (blindtest point 4).

export type Arms = 'down' | 'crossed';

export interface FaceParams {
  brow: number;      // -1..1, + lowered inside (tension), - raised (open)
  lid: number;       // 0..0.8, eyelid closure
  mouth: number;     // -1..1, mouth curve
  width: number;     // 11..20, mouth width (narrow = pressed)
  jaw: 0 | 1;        // clenched jaw strokes
  tilt: number;      // -8..8 degrees head tilt
  shoulders: number; // 0..1 raised
  arms: Arms;
  gazeX: number;     // -1.5..1.5, |gazeX| >= 1 looks away
  gazeY: number;
  lean: number;      // 0..1 leaning in
}

export type FaceName = 'tense' | 'closed' | 'opening' | 'open' | 'tenseAway' | 'hard';

export const FACES: Record<FaceName, FaceParams> = {
  // "angespannt"
  tense:     { brow: 0.7, lid: 0.3,  mouth: -0.3, width: 15, jaw: 1, tilt: 3,  shoulders: 0.5, arms: 'down',    gazeX: 0.3, gazeY: 0.2, lean: 0 },
  // "zu"
  closed:    { brow: 1,   lid: 0.55, mouth: -0.6, width: 12, jaw: 1, tilt: 8,  shoulders: 1,   arms: 'crossed', gazeX: 1.5, gazeY: 0.4, lean: 0 },
  // "offener"
  opening:   { brow: -0.6, lid: 0,   mouth: 0.15, width: 18, jaw: 0, tilt: -5, shoulders: 0,   arms: 'down',    gazeX: 0,   gazeY: 0,   lean: 0.6 },
  // "offen"
  open:      { brow: -0.7, lid: 0,   mouth: 0.5,  width: 20, jaw: 0, tilt: -7, shoulders: 0,   arms: 'down',    gazeX: 0,   gazeY: 0,   lean: 1 },
  // "angespannt, wendet sich ab"
  tenseAway: { brow: 0.7, lid: 0.45, mouth: -0.4, width: 14, jaw: 1, tilt: 8,  shoulders: 0.6, arms: 'down',    gazeX: -1.5, gazeY: 0.8, lean: 0 },
  // "Gesicht hart"
  hard:      { brow: 1,   lid: 0.5,  mouth: -0.9, width: 11, jaw: 1, tilt: 0,  shoulders: 0.8, arms: 'crossed', gazeX: 0,   gazeY: 0,   lean: 0 },
};
