import { atom } from 'nanostores';
import { shared } from '@it-astro:request-nanostores';

export const $counterStore = shared('counterStore', atom(1));
