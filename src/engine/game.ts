// One day's conversation as a pure state machine: no DOM, no text. Text lives in content/<lang>/.
import { FACES, type FaceName, type FaceParams } from './faces';
import { mulberry32, shuffle } from './rng';

export interface Outcome {
  after?: string;     // only if this option was chosen earlier
  reply: string;      // text id of her answer
  face: FaceName;
  next?: number;      // index of the next turn
  end?: string;       // ending id (key into review.cost)
  note?: string;      // stage direction shown before the end (text id)
  echo?: string;      // this sentence stays hanging in the room (text id of the echo)
  unecho?: boolean;   // takes the standing echo back
}

// One guess card of the last move (season 1): after the end, the player guesses what moves her.
export interface Guess {
  id: string;
  weight: number;     // how close the guess is; never shown
  text: string;       // text id of the card
  reply: string;      // text id of her answer (TREPPE 'stufe')
  face: FaceName;
  alt?: string;       // her answer for TREPPE 'eigene'
  short?: string;     // shorter card text after the ends in guessShortAfter
}

export interface Scene {
  who: 'brandt' | 'jule' | 'mira' | 'albers' | 'mutter';
  frame?: 'chat' | 'phone'; // day 2 is a chat, Gans a phone call (shown like face to face); day 1 has no frame field
  lage: string;
  opening: { line: string; face: FaceName };
  turns: string[][];
  options: Record<string, Outcome[]>;
  review: { inner?: string; cost: Record<string, string> }; // season 1 has no inner line, the last move replaces it
  guess?: Guess[];            // the last move after the end
  guessShortAfter?: string[]; // ends after which the cards show `short`
  observe?: Record<string, string>; // chosen option ids joined with '-' -> text id of the observing sentence
}

// Which answer of the guess ladder she gives (F4, open until Andi decides):
// 'stufe' = `reply` (she tells the next step up, interview 6), 'eigene' = `alt` where there is one (she confirms only her own).
export const TREPPE: 'stufe' | 'eigene' = 'stufe';

export interface LogEntry { who: 'you' | 'her'; text: string }

export interface GameState {
  hands: string[][];  // option ids per turn, shuffled once per game
  turn: number;       // current turn index
  chosen: string[];   // option ids in order
  log: LogEntry[];
  line: string;       // her current line (text id)
  face: FaceName;
  echo?: string;      // the one echo standing in the room, if any
  end?: string;
  note?: string;
  guesses: string[];  // guess ids of the last move, shuffled once per game (empty without guess)
  guessed?: string;   // the guess id taken in the last move
}

export interface Review {
  face: FaceParams;
  log: LogEntry[];
  inner?: string;
  cost: string;
  echo?: string;
  observe?: string;   // text id of the observing sentence for the played path, if the scene has one
}

export function newGame(scene: Scene, seed: number): GameState {
  const rand = mulberry32(seed);
  return {
    hands: scene.turns.map(turn => shuffle(turn, rand)),
    turn: 0,
    chosen: [],
    log: [],
    line: scene.opening.line,
    face: scene.opening.face,
    guesses: shuffle((scene.guess ?? []).map(g => g.id), rand), // after the hands, so their order stays as before
  };
}

export function hand(state: GameState): string[] {
  return state.end ? [] : state.hands[state.turn];
}

export function choose(scene: Scene, state: GameState, option: string): GameState {
  if (!hand(state).includes(option)) throw new Error(`option ${option} not in hand`);
  const outcome = scene.options[option].find(o => !o.after || state.chosen.includes(o.after));
  if (!outcome) throw new Error(`no outcome for ${option}`);
  return {
    ...state,
    turn: outcome.next ?? state.turn,
    chosen: [...state.chosen, option],
    log: [...state.log, { who: 'you', text: option }, { who: 'her', text: outcome.reply }],
    line: outcome.reply,
    face: outcome.face,
    // An echo stays until it is taken back or the conversation ends; a new one replaces it (never more than one).
    echo: outcome.unecho ? undefined : outcome.echo ?? state.echo,
    end: outcome.end,
    note: outcome.note,
  };
}

// The last move: once the conversation is over and nothing is guessed yet, the four guess cards as { id, text id }.
// After an end in guessShortAfter the cards show `short` where there is one.
export function guessHand(scene: Scene, state: GameState): { id: string; text: string }[] {
  if (!state.end || state.guessed) return [];
  const short = scene.guessShortAfter?.includes(state.end) ?? false;
  return state.guesses.map(id => {
    const g = scene.guess!.find(x => x.id === id)!;
    return { id, text: short ? g.short ?? g.text : g.text };
  });
}

// Take one guess: her answer and face change, end and cost stay. The guess is logged, but not part of `chosen`.
export function takeGuess(scene: Scene, state: GameState, id: string): GameState {
  const card = guessHand(scene, state).find(c => c.id === id);
  if (!card) throw new Error(`guess ${id} not in hand`);
  const g = scene.guess!.find(x => x.id === id)!;
  const reply = TREPPE === 'eigene' ? g.alt ?? g.reply : g.reply;
  return {
    ...state,
    guessed: id,
    log: [...state.log, { who: 'you', text: card.text }, { who: 'her', text: reply }],
    line: reply,
    face: g.face,
    note: undefined,
  };
}

export function review(scene: Scene, state: GameState): Review {
  if (!state.end) throw new Error('conversation not over');
  return {
    face: FACES[state.face],
    log: [{ who: 'her', text: scene.opening.line }, ...state.log], // her opening demand comes first
    inner: scene.review.inner,
    cost: scene.review.cost[state.end],
    echo: state.echo,
    observe: scene.observe?.[state.chosen.join('-')],
  };
}
