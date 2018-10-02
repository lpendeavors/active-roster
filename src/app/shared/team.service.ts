import { Injectable } from '@angular/core';
import { Database } from './database.service';

import { Team } from '../models/Team';
import { Player } from '../models/Player';

import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  shouldRefresh: Subject<string> = new Subject<string>();

  constructor(private db: Database) { }

  refreshTeams(): Observable<string> {
    return this.shouldRefresh.asObservable();
  }

  getAllTeams(): Promise<Team[]> {
    return this.db.findAll();
  }

  getTeamById(id: string): Promise<Team> {
    return this.db.findTeamById(id);
  }

  addTeam(team: Team): Promise<Team> {
    return this.db.insertTeam(team);
  }

  updateTeam(team: Team): Promise<Team> {
    return this.db.update(team);
  }

  deleteTeam(team: Team): Promise<void> {
    return this.db.remove(team)
  }

  sortByLastName(a: Player, b: Player): number {
    const nameA = a.last.toLowerCase(), nameB = b.last.toLowerCase();
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  };
}
