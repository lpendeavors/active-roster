import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Database } from './database.service';
import { LegacyColumnMappings } from '../models/LegacyColumnMappings';

import { ElectronService } from 'ngx-electron';
import * as xlsx from 'xlsx';
import { Team } from '../models/Team';
import { TeamService } from '../shared/team.service';
import { Player } from '../models/Player';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  constructor(
    private db: Database, 
    private electron: ElectronService,
    private teamService: TeamService,
    private snackBar: MatSnackBar) {
      this.electron.ipcRenderer.on("import-complete", (event, arg) => {
        if (arg) {
          const newTeam = this.processSpreadsheet(arg.workbook, arg.team);
          this.teamService.saveLegacyTeam(newTeam)
            .then(() => this.teamService.shouldRefresh.next());
        }
      });
      this.electron.ipcRenderer.on("export-complete", (event, arg) => {
        if (arg) {
          this.snackBar.open("Team export successful");
        }
      });
      this.electron.ipcRenderer.on("import-content", (event, arg) => {
        if (arg) {
          this.teamService.saveLegacyTeam(arg)
            .then(() => this.teamService.shouldRefresh.next());
        }
      });
  }

  importImages() {
    const options: Electron.OpenDialogOptions = {
      title: "Active Roster Images",
      buttonLabel: "Open",
      properties: ['openDirectory']
    };

    this.teamService.getAllTeams().then(teams => {
      if (teams.length === 0) {
        this.snackBar.open("No teams for image import", null, { duration: 3000 });
        return;
      }
      this.electron.remote.dialog.showOpenDialog(options, (filename) => {
        if (filename) {
          const imgLocation = filename[0];
          this.electron.ipcRenderer.send("attach-images", {
            teams,
            imgLocation
          });
        }
      });
    });
  }

  importJson() {
    const options = {
      title: "Active Roster Import",
      buttonLabel: "Open",
      
    };

    this.electron.remote.dialog.showOpenDialog(options, (filename) => {
      if (filename) {
        const location = filename[0];
        this.electron.ipcRenderer.send("import-json", location);
      }
    });
  }

  exportJson() {
    this.db.findAll().then(teams => {
      const appendDate = new Date().toISOString().split('T')[0];

      const options = {
        title: "Active Roster Export",
        defaultPath: `roster_export_${appendDate}`,
        buttonLabel: "Save",
        filters: [
          { name: 'json', extensions: ['json'] }
        ]
      };
      
      this.electron.remote.dialog.showSaveDialog(options, (filename) => {
        if (filename) {
          this.electron.ipcRenderer.send('export-json', {
            filename: filename,
            content: teams
          });
        }
      });
    });
  }

  importLegacySpreadsheet() {
    const options = {
      title: "Active Roster Export",
      buttonLabel: "Open",
      filters: [
        { name: 'xlsx', extensions: ['xlsx'] }
      ]
    };
    
    this.electron.remote.dialog.showOpenDialog(options, (filename) => {
      if (filename) {
        const location = filename[0];
        this.electron.ipcRenderer.send("legacy-import", location);
      }
    });
  }

  private processSpreadsheet(workbook: xlsx.WorkBook, teamName: string): Team {
    const teamSheetName = workbook.SheetNames[0];
    const worksheet: xlsx.WorkSheet = workbook.Sheets[teamSheetName];

    const team: Team = {
      name: teamName,
      flagPlayers: [],
      freshmanPlayers: [],
      jvPlayers: [],
      varsityPlayers: [],
      cheerPlayers: [],
      moms: [],
    };

    for (let i = 2; i < 211; i++) {
      const firstName = worksheet[`${LegacyColumnMappings.FIRST_NAME}${i}`];
      if (typeof firstName !== 'undefined') {
        if (firstName.v === "TYSA") continue;
        
        const idTeam = worksheet[`${LegacyColumnMappings.TEAM}${i}`].v;
        const idLevel = worksheet[`${LegacyColumnMappings.LEVEL_SHORT}${i}`].v;
        const idNum = worksheet[`${LegacyColumnMappings.ID}${i}`].v;

        const excelBirthdate = worksheet[`${LegacyColumnMappings.BIRTH_DATE}${i}`].v;
        
        const player: Player = {
          id: `${idTeam}-${idLevel}-${idNum}`,
          first: firstName.v,
          last: worksheet[`${LegacyColumnMappings.LAST_NAME}${i}`].v,
          playerId: `${idTeam}-${idLevel}-${idNum}`,
          dateOfBirth: new Date((excelBirthdate - (25567 + 1))*86400*1000),
          isCoach: false,
          image: ''
        };

        const teamLevel = worksheet[`${LegacyColumnMappings.LEVEL}${i}`].v.toLowerCase();
        switch (teamLevel) {
          case 'flag':
            team.flagPlayers.push(player);
            break;
          case 'fresh':
            team.freshmanPlayers.push(player);
            break;
          case 'jv':
            team.jvPlayers.push(player);
            break;
          case 'var':
            team.varsityPlayers.push(player);
            break;
          case 'cheer':
            team.cheerPlayers.push(player);
            break;
        }
      }
    }

    return team;
  }
}
