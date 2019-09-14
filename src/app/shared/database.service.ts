import { Injectable } from '@angular/core';
import { Team } from '../models/Team';
import { Settings } from '../models/Settings';

declare var require: any;
let Datastore = require('nedb');

const teamDataB = "teamDatabase.db";
const settingsDataB = "settingsDatabase.db";

@Injectable({
  providedIn: 'root'
})
export class Database {

  private teamDb: any;
  private settingsDb: any;

  constructor() {
    this.teamDb = new Datastore({
      filename: `/data/${teamDataB}`,
      autoload: true
    });
    this.settingsDb = new Datastore({
      filename: `/data/${settingsDataB}`,
      autoload: true
    });
  }

  insertTeam(team: Team): Promise<Team> {
    console.log(`Inserting team: ${JSON.stringify(team)}`);
    return new Promise((resolve, reject) => {
      return this.teamDb.insert(team, ((err: any, newTeam: Team) => {
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
      return this.teamDb.find({}, ((err, teams: Team[]) => {
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
      return this.teamDb.find({ _id: id }, ((err, teams: Team) => {
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
      return this.teamDb.update({ _id: team._id }, team, ((err: any, numUpdated: Team) => {
        if (err) {
          reject(err);
        } else {
          resolve(numUpdated);
        }
      }));
    });
  }

  remove(team: Team): Promise<void> {
    console.log(`Removing team: ${team._id}`);
    return new Promise((resolve, reject) => {
      return this.teamDb.remove({ _id: team._id }, {}, ((err: any, numRemoved: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(numRemoved);
        }
      }));
    });
  }

  getSettings(): Promise<Settings> {
    console.log(`Getting settings`);
    return new Promise((resolve, reject) => {
      return this.settingsDb.find({}, ((err, settings: Settings[]) => {
        if (err) {
          reject(err);
        }
        
        if (settings.length == 0) {
          const settings = { birthdayBy: '8/27' };
          return this.settingsDb.insert(settings, (err, newSettings: Settings) => {
            resolve(newSettings);
          });
        } else {
          resolve(settings[0]);
        }
      }));
    });
  }

  saveSettings(settings: Settings): Promise<Settings> {
    console.log(`Updating team: ${JSON.stringify(settings)}`);
    return new Promise((resolve, reject) => {
      return this.teamDb.update({ _id: settings._id }, settings, ((err: any, numUpdated: Settings) => {
        if (err) {
          reject(err);
        } else {
          resolve(numUpdated);
        }
      }));
    });
  }

  saveLegacyTeam(team: Team): Promise<void> {
    console.log(`Saving legacy team`);
    return new Promise((resolve, reject) => {
      return this.teamDb.find({ name: team.name }, (err: any, existingTeam: Team) => {
        if (typeof existingTeam[0] !== 'undefined') {
          const overwrite = confirm(`The ${existingTeam[0].name} already exists. Would you like to overwrite?`);
          if (overwrite) {
            console.log(`Overwriting existing team: ${team._id}`);
            return this.remove(existingTeam).then(() => {
              this.insertTeam(team).then(() => resolve());
            });
          } else {
            return this.update(team).then(() => resolve());
          }
        } else {
          return this.insertTeam(team).then(() => resolve());
        }
      });
    });
  }
}