import './ui/style.css';
import { seedFromDate } from './engine/rng';
import { start } from './ui/app';

// ?seed=123 overrides the seed of the day.
const param = new URLSearchParams(location.search).get('seed');
const seed = param !== null && /^\d+$/.test(param) ? Number(param) : seedFromDate(new Date());

start(document.getElementById('app')!, seed);
