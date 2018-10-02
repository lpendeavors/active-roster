import { Injectable } from '@angular/core';
import { Team } from '../models/Team';
import { TeamService } from '../shared/team.service';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private teamService: TeamService) { }

  print(team: Team): void { 
    // Setup initial document layout
    let documentDefinition = {
      pageOrientation: 'landscape',
      content: [
        { text: team.name, style: 'teamHeader' }
      ],
      styles: {
        teamHeader: {
          fontSize: 22,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 8]
        },
        teamLevelHeader: {
          fontSize: 14,
          alignment: 'center',
          bold: true,
          italics: true,
          margin: [0, 0, 0, 8]
        }
      }
    };

    // Add players by team level
    // Flag
    if (team.flagPlayers.length > 0) {
      documentDefinition.content.push({ text: 'Flag', style: 'teamLevelHeader' });
      const flagTable = {
        text: '',
        style: 'rosterTable',
        table: {
          headerRows: 0,
          body: [],
          widths: [120, 120, 120, 120, 120, 120]
        },
        layout: 'noBorders',
        pageBreak: 'after'
      };
      let playerRow = [];
      const sortedFlagPlayers = team.flagPlayers.sort(this.teamService.sortByLastName);
      sortedFlagPlayers.forEach(player => {
        const playerFullName = `${player.first} ${player.last}`;
        const playerImage = {
          image: player.image,
          fit: [120, 120]
        };
        const playerCell = [
          playerImage,
          { text: playerFullName, alignment: 'center', margin: [0, 7, 0, 10] }
        ];
        playerRow.push(playerCell);
        if (playerRow.length === 6) {
          flagTable.table.body.push(playerRow);
          playerRow = [];
        }
      });
      if (playerRow.length > 0) {
        let extraCells = 6 - playerRow.length;
        while (extraCells > 0) {
          playerRow.push('');
          extraCells--;
        }
        flagTable.table.body.push(playerRow);
      }
      documentDefinition.content.push(flagTable);
    }
    // Freshman
    if (team.freshmanPlayers.length > 0) {
      documentDefinition.content.push({ text: 'Freshman', style: 'teamLevelHeader' });
      const freshmanTable = {
        text: '',
        style: 'rosterTable',
        table: {
          headerRows: 0,
          body: [],
          widths: [120, 120, 120, 120, 120, 120]
        },
        layout: 'noBorders',
        pageBreak: 'after'
      };
      let playerRow = [];
      const sortedFreshmanPlayers = team.freshmanPlayers.sort(this.teamService.sortByLastName);
      sortedFreshmanPlayers.forEach(player => {
        const playerFullName = `${player.first} ${player.last}`;
        const playerImage = {
          image: player.image,
          fit: [120, 120]
        };
        const playerCell = [
          playerImage,
          { text: playerFullName, alignment: 'center', margin: [0, 7, 0, 10] }
        ];
        playerRow.push(playerCell);
        if (playerRow.length === 6) {
          freshmanTable.table.body.push(playerRow);
          playerRow = [];
        }
      });
      if (playerRow.length > 0) {
        let extraCells = 6 - playerRow.length;
        while (extraCells > 0) {
          playerRow.push('');
          extraCells--;
        }
        freshmanTable.table.body.push(playerRow);
      }
      documentDefinition.content.push(freshmanTable);
    }
    // JV
    if (team.jvPlayers.length > 0) {
      documentDefinition.content.push({ text: 'Junior Varsity', style: 'teamLevelHeader' });
      const jvTable = {
        text: '',
        style: 'rosterTable',
        table: {
          headerRows: 0,
          body: [],
          widths: [120, 120, 120, 120, 120, 120]
        },
        layout: 'noBorders',
        pageBreak: 'after'
      };
      let playerRow = [];
      const sortedJVPlayers = team.jvPlayers.sort(this.teamService.sortByLastName);
      sortedJVPlayers.forEach(player => {
        const playerFullName = `${player.first} ${player.last}`;
        const playerImage = {
          image: player.image,
          fit: [120, 120]
        };
        const playerCell = [
          playerImage,
          { text: playerFullName, alignment: 'center', margin: [0, 7, 0, 10] }
        ];
        playerRow.push(playerCell);
        if (playerRow.length === 6) {
          jvTable.table.body.push(playerRow);
          playerRow = [];
        }
      });
      if (playerRow.length > 0) {
        let extraCells = 6 - playerRow.length;
        while (extraCells > 0) {
          playerRow.push('');
          extraCells--;
        }
        jvTable.table.body.push(playerRow);
      }
      documentDefinition.content.push(jvTable);
    }
    // Varsity
    if (team.varsityPlayers.length > 0) {
      documentDefinition.content.push({ text: 'Varsity', style: 'teamLevelHeader' });
      const varsityTable = {
        text: '',
        style: 'rosterTable',
        table: {
          headerRows: 0,
          body: [],
          widths: [120, 120, 120, 120, 120, 120]
        },
        layout: 'noBorders',
        pageBreak: 'after'
      };
      let playerRow = [];
      const sortedVarsityPlayers = team.varsityPlayers.sort(this.teamService.sortByLastName);
      sortedVarsityPlayers.forEach(player => {
        const playerFullName = `${player.first} ${player.last}`;
        const playerImage = {
          image: player.image,
          fit: [120, 120]
        };
        const playerCell = [
          playerImage,
          { text: playerFullName, alignment: 'center', margin: [0, 7, 0, 10] }
        ];
        playerRow.push(playerCell);
        if (playerRow.length === 6) {
          varsityTable.table.body.push(playerRow);
          playerRow = [];
        }
      });
      if (playerRow.length > 0) {
        let extraCells = 6 - playerRow.length;
        while (extraCells > 0) {
          playerRow.push('');
          extraCells--;
        }
        varsityTable.table.body.push(playerRow);
      }
      documentDefinition.content.push(varsityTable);
    }
    // Cheer
    if (team.cheerPlayers.length > 0) {
      documentDefinition.content.push({ text: 'Cheer', style: 'teamLevelHeader' });
      const cheerTable = {
        text: '',
        style: 'rosterTable',
        table: {
          headerRows: 0,
          body: [],
          widths: [120, 120, 120, 120, 120, 120]
        },
        layout: 'noBorders'
      };
      let playerRow = [];
      const sortedCheerPlayers = team.cheerPlayers.sort(this.teamService.sortByLastName);
      sortedCheerPlayers.forEach(player => {
        const playerFullName = `${player.first} ${player.last}`;
        const playerImage = {
          image: player.image,
          fit: [120, 120]
        };
        const playerCell = [
          playerImage,
          { text: playerFullName, alignment: 'center', margin: [0, 7, 0, 10] }
        ];
        playerRow.push(playerCell);
        if (playerRow.length === 6) {
          cheerTable.table.body.push(playerRow);
          playerRow = [];
        }
      });
      if (playerRow.length > 0) {
        let extraCells = 6 - playerRow.length;
        while (extraCells > 0) {
          playerRow.push('');
          extraCells--;
        }
        cheerTable.table.body.push(playerRow);
      }
      documentDefinition.content.push(cheerTable);
    }
    pdfMake.createPdf(documentDefinition).download(team.name);
  }
}
