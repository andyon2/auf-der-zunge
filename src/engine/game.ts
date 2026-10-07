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

export interface Scene {
  who: 'brandt' | 'jule';
  frame?: 'chat';     // day 2 is a chat; day 1 has no frame field
  lage: string;
  opening: { line: string; face: FaceName };
  turns: string[][];
  options: Record<string, Outcome[]>;
  review: { inner: string; cost: Record<string, string> };
}

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
}

export interface Review {
  face: FaceParams;
  log: LogEntry[];
  inner: string;
  cost: string;
  echo?: string;
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

export function review(scene: Scene, state: GameState): Review {
  if (!state.end) throw new Error('conversation not over');
  return {
    face: FACES[state.face],
    log: [{ who: 'her', text: scene.opening.line }, ...state.log], // her opening demand comes first
    inner: scene.review.inner,
    cost: scene.review.cost[state.end],
    echo: state.echo,
  };
}
