import { Player } from './Player';

export interface Team {
    _id?: string,
    name: string,
    flagPlayers?: Player[],
    freshmanPlayers?: Player[],
    jvPlayers?: Player[],
    varsityPlayers?: Player[],
    cheerPlayers?: Player[],
    moms?: Player[],
};