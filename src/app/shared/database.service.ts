import { Injectable } from '@angular/core';
import { Team } from '../models/Team';

declare var require: any;
let Datastore = require('nedb');

const dataB = "database.db";

@Injectable({
  providedIn: 'root'
})
export class Database {

  public db: any;

  constructor() {
    this.db = new Datastore({
      filename: dataB,
      autoload: true
    });
  }

  insertTeam(team: Team): Promise<Team> {
    team.flagPlayers = [];
    team.freshmanPlayers = [];
    team.jvPlayers = [];
    team.varsityPlayers = [];
    team.cheerPlayers = [];
    team.moms = [];

    console.log(`Inserting team: ${JSON.stringify(team)}`);
    
    return new Promise((resolve, reject) => {
      return this.db.insert(team, ((err: any, newTeam: Team) => {
        if (err) {
          reject(err);
        } else {
          resolve(newTeam);
        }
      }));
    });
  }

  findAll(): Promise<Team[]> {
    console.log(`Finding all teams`);
    return new Promise((resolve, reject) => {
      return this.db.find({}, ((err, teams: Team[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(teams);
        }
      }));
    });
  }

  findTeamById(id: string): Promise<Team> {
    console.log(`Finding team with id ${id}`);
    return new Promise((resolve, reject) => {
      return this.db.find({ _id: id }, ((err, teams: Team) => {
        if (err) {
          reject(err);
        } else {
          resolve(teams[0]);
        }
      }));
    });
  }

  update(team: Team): Promise<Team> {
    console.log(`Updating team: ${JSON.stringify(team)}`);
    return new Promise((resolve, reject) => {
      return this.db.update({ _id: team._id }, team, ((err: any, numUpdated: Team) => {
        if (err) {
          reject(err);
        } else {
          resolve(numUpdated);
        }
      }));
    });
  }

  remove(team: Team): Promise<void> {
    console.log(`Removing team: ${JSON.stringify(team)}`);
    return new Promise((resolve, reject) => {
      return this.db.remove({ _id: team._id }, {}, ((err: any, numRemoved: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(numRemoved);
        }
      }));
    });
  }
}