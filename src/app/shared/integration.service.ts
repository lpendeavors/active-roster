import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Database } from './database.service';
import { LegacyColumnMappings } from '../models/LegacyColumnMappings';

import * as xlsx from 'xlsx';
import { Team } from '../models/Team';
import { TeamService } from '../shared/team.service';
import { Player } from '../models/Player';
import { ImageService } from '../shared/image.service';

import * as resizebase64 from 'resize-base64';

declare var electron: any;

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  constructor(
    private db: Database,
    private teamService: TeamService,
    private imageService: ImageService,
    private snackBar: MatSnackBar) {
      electron.ipcRenderer.on("import-complete", (event, arg) => {
        if (arg) {
          const newTeam = this.processSpreadsheet(arg.workbook, arg.team);
          this.teamService.saveLegacyTeam(newTeam)
            .then(() => this.teamService.shouldRefresh.next());
        }
      });
      electron.ipcRenderer.on("export-complete", (event, arg) => {
        if (arg) {
          this.snackBar.open("Team export successful");
        }
      });
      electron.ipcRenderer.on("import-content", (event, arg) => {
        if (arg) {
          const teams = arg as Team[];
          for (let t = 0; t < teams.length; t++) {
            this.teamService.saveLegacyTeam(this.processImages(teams[t]));
          }
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

      electron.remote.dialog.showOpenDialog(options, (filename) => {
        if (filename) {
          const imgLocation = filename[0];
          electron.ipcRenderer.send("attach-images", {
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
      buttonLabel: "Open"
    };

    electron.remote.dialog.showOpenDialog(options, (filename) => {
      if (filename) {
        const location = filename[0];
        electron.ipcRenderer.send("import-json", location);
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
      
      electron.remote.dialog.showSaveDialog(options, (filename) => {
        if (filename) {
          electron.ipcRenderer.send('export-json', {
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
        { name: 'xlsx', extensions: ['xlsx'] },
        { name: 'xls', extensions: ['xls'] }
      ]
    };
    
    electron.remote.dialog.showOpenDialog(options, (filename) => {
      if (filename) {
        const location = filename[0];
        electron.ipcRenderer.send("legacy-import", location);
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
        const weight = worksheet[`${LegacyColumnMappings.WEIGHT}${i}`]  ? worksheet[`${LegacyColumnMappings.WEIGHT}${i}`].v : null;
        
        const player: Player = {
          id: `${idTeam}-${idLevel}-${idNum}`,
          first: firstName.v,
          last: worksheet[`${LegacyColumnMappings.LAST_NAME}${i}`].v,
          playerId: `${idTeam}-${idLevel}-${idNum}`,
          dateOfBirth: new Date((excelBirthdate - (25567 + 1))*86400*1000),
          isCoach: false,
          image: '',
          weight: weight,
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

  private processImages(team: Team): Team {
    team.cheerPlayers.forEach(player => {
      if (player.image) {
        this.imageService.resizeBase64(player.image, 150, 150).then(image => {
          player.image = image;
        });
      }
    });
    team.flagPlayers.forEach(player => {
      if (player.image) {
        this.imageService.resizeBase64(player.image, 150, 150).then(image => player.image = image);
      }
    });
    team.freshmanPlayers.forEach(player => {
      if (player.image) {
        this.imageService.resizeBase64(player.image, 150, 150).then(image => player.image = image);
      }
    });
    team.jvPlayers.forEach(player => {
      if (player.image) {
        this.imageService.resizeBase64(player.image, 150, 150).then(image => player.image = image);
      }
    });
    team.varsityPlayers.forEach(player => {
      if (player.image) {
        this.imageService.resizeBase64(player.image, 150, 150).then(image => player.image = image);
      }
    });

    return team;
  }
}
