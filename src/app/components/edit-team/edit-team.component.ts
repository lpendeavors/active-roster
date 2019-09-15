import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';

import { AddEditPlayerDialogComponent } from '../add-edit-player-dialog/add-edit-player-dialog.component';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

import { Team } from '../../models/Team';
import { Player } from '../../models/Player';

import { TeamService } from '../../shared/team.service';
import { PrintService } from '../../shared/print.service';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.css']
})
export class EditTeamComponent implements OnInit {

  team: Team;
  flagPlayers: Player[] = [];
  flagCoaches: Player[] = [];
  freshmanPlayers: Player[] = [];
  freshmanCoaches: Player[] = [];
  jvPlayers: Player[] = [];
  jvCoaches: Player[] = [];
  varsityPlayers: Player[] = [];
  varsityCoaches: Player[] = [];
  cheerPlayers: Player[] = [];
  cheerCoaches: Player[] = [];
  teamMoms: Player[] = [];

  playerColumns: string[] = ['image', 'first', 'last', 'age', 'delete'];
  
  private tabIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog, 
    public snackBar: MatSnackBar, 
    private printService: PrintService,
    private teamService: TeamService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getTeam(params['id']);
    });
  }

  tabChanged(event: any): void {
    this.tabIndex = event.index;
  }

  openNewPlayerDialog(): void {
    const newPlayer: Player = {
      id: '',
      playerId: '',
      first: '',
      last: '',
      dateOfBirth: null,
      image: '',
      isCoach: false,
    };
    const dialogRef = this.dialog.open(AddEditPlayerDialogComponent, {
      width: '450px',
      data: { player: newPlayer, team: this.team, teamLevel: this.tabIndex }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const player = result.player as Player;
        this.addPlayerToTeamLevel(player, result.teamLevel);
      }
    });
  }

  openConfirmDeleteDialog(player: Player): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '450px',
      data: { message: `${player.first} ${player.last} will be deleted forever!`, confirm: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm) {
        this.removePlayerFromTeamLevel(player, this.tabIndex);
      }
    });
  }

  openPrintDialog(): void {
    if (this.flagPlayers.length === 0
      && this.flagCoaches.length === 0
      && this.freshmanPlayers.length === 0 
      && this.freshmanCoaches.length === 0
      && this.jvPlayers.length === 0 
      && this.jvCoaches.length === 0
      && this.varsityPlayers.length === 0
      && this.varsityCoaches.length === 0
      && this.cheerPlayers.length === 0
      && this.cheerCoaches.length === 0
      && this.teamMoms.length === 0) {
      this.snackBar.open("You do not have any players to print", null, { duration: 5000 });
    } else {
      this.printService.print(this.team);
      this.snackBar.open("File saved!", null, { duration: 5000 });
    }
  }

  private getTeam(id: string): void {
    this.teamService.getTeamById(id)
      .then(team => {
        this.team = team;
        this.sortTeamLevels();
      })
      .catch(err => alert(err));
  }

  private addPlayerToTeamLevel(player: Player, teamLevel: number) {
    if (teamLevel === 0) {
      this.team.flagPlayers.push(player);
    } else if (teamLevel === 1) {
      this.team.freshmanPlayers.push(player);
    } else if (teamLevel === 2) {
      this.team.jvPlayers.push(player);
    } else if (teamLevel === 3) {
      this.team.varsityPlayers.push(player);
    } else if (teamLevel === 4) {
      this.team.cheerPlayers.push(player);
    } else if (teamLevel === 5) {
      this.team.moms.push(player);
    }
    this.updateTeam();
  }
  private removePlayerFromTeamLevel(player: Player, teamLevel: number) {
    if (teamLevel === 0) {
      const playerIndex = this.team.flagPlayers.indexOf(player);
      this.team.flagPlayers.splice(playerIndex, 1);
    } else if (teamLevel === 1) {
      const playerIndex = this.team.freshmanPlayers.indexOf(player);
      this.team.freshmanPlayers.splice(playerIndex, 1);
    } else if (teamLevel === 2) {
      const playerIndex = this.team.jvPlayers.indexOf(player);
      this.team.jvPlayers.splice(playerIndex, 1);
    } else if (teamLevel === 3) {
      const playerIndex = this.team.varsityPlayers.indexOf(player);
      this.team.varsityPlayers.splice(playerIndex, 1);
    } else if (teamLevel === 4) {
      const playerIndex = this.team.cheerPlayers.indexOf(player);
      this.team.cheerPlayers.splice(playerIndex, 1);
    } else if (teamLevel === 5) {
      const playerIndex = this.team.moms.indexOf(player);
      this.team.moms.splice(playerIndex);
    }
    this.updateTeam();
  }

  private updateTeam(): void {
    this.teamService.updateTeam(this.team)
      .then(() => {
        this.getTeam(this.team._id);
        this.sortTeamLevels();
      })
      .catch(err => alert(err));
  }

  private sortTeamLevels(): void {
    this.flagPlayers = this.team.flagPlayers.filter(p => p.isCoach === false);
    if (this.flagPlayers.length > 0) this.flagPlayers.sort(this.teamService.sortByLastName);
    this.flagCoaches = this.team.flagPlayers.filter(p => p.isCoach === true);
    if (this.flagCoaches.length > 0) this.flagCoaches.sort(this.teamService.sortByLastName);

    this.freshmanPlayers = this.team.freshmanPlayers.filter(p => p.isCoach === false);
    if (this.freshmanPlayers.length > 0) this.freshmanPlayers.sort(this.teamService.sortByLastName);
    this.freshmanCoaches = this.team.freshmanPlayers.filter(p => p.isCoach === true);
    if (this.freshmanCoaches.length > 0) this.freshmanCoaches.sort(this.teamService.sortByLastName);

    this.jvPlayers = this.team.jvPlayers.filter(p => p.isCoach === false);
    if (this.jvPlayers.length > 0) this.jvPlayers.sort(this.teamService.sortByLastName);
    this.jvCoaches = this.team.jvPlayers.filter(p => p.isCoach === true);
    if (this.jvCoaches.length > 0) this.jvPlayers.sort(this.teamService.sortByLastName);

    this.varsityPlayers = this.team.varsityPlayers.filter(p => p.isCoach === false);
    if (this.varsityPlayers.length > 0) this.varsityPlayers.sort(this.teamService.sortByLastName);
    this.varsityCoaches = this.team.varsityPlayers.filter(p => p.isCoach === true);
    if (this.varsityCoaches.length > 0) this.varsityCoaches.sort(this.teamService.sortByLastName);

    this.cheerPlayers = this.team.cheerPlayers.filter(p => p.isCoach === false);
    if (this.cheerPlayers.length > 0) this.cheerPlayers.sort(this.teamService.sortByLastName);
    this.cheerCoaches = this.team.cheerPlayers.filter(p => p.isCoach === true);
    if (this.cheerCoaches.length > 0) this.cheerCoaches.sort(this.teamService.sortByLastName);

    this.teamMoms = this.team.moms;
    if (this.teamMoms.length > 0) this.teamMoms.sort(this.teamService.sortByLastName);
  }

}