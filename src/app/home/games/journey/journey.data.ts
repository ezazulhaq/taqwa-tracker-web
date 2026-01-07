import { Journey } from './journey.model';
import { PROPHETS_PHASE_1 } from './data/prophets_phase1';
import { PROPHETS_PHASE_2 } from './data/prophets_phase2';
import { PROPHETS_PHASE_3 } from './data/prophets_phase3';
import { PROPHETS_PHASE_4 } from './data/prophets_phase4';
import { MUHAMMAD_JOURNEY } from './data/muhammad';

// Combine all phases into a single chronological timeline
export const PROPHET_JOURNEYS: Journey[] = [
    ...PROPHETS_PHASE_1, // Adam, Idris, Nuh
    ...PROPHETS_PHASE_2, // Hud, Salih, Ibrahim
    ...PROPHETS_PHASE_3, // Lut, Ismail, Ishaq, Yusuf...
    ...PROPHETS_PHASE_4, // Musa, Sulayman, Isa...
    MUHAMMAD_JOURNEY     // The Seal of the Prophets
];
