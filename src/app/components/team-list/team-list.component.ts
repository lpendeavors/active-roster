import { Component, OnInit, OnDestroy } from '@angular/core';
import { Database } from '../../shared/database.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

import { Team } from '../../models/Team';
import { TeamService } from '../../shared/team.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit, OnDestroy {

  teamColumns: string[] = ['name', 'delete'];
  teams: Team[] = [];

  private refreshTeamSubscription: Subscription;

  constructor(public db: Database, public dialog: MatDialog, private teamService: TeamService, private router: Router) { }

  ngOnInit() {
    this.getAllTeams();
    this.refreshTeamSubscription = this.teamService.refreshTeams()
      .subscribe(() => this.getAllTeams());
  }

  ngOnDestroy() {
    this.refreshTeamSubscription.unsubscribe();
  }

  showConfirmDeleteDialog(team: Team): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '450px',
      data: { message: `${team.name} will be deleted forever!`, confirm: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm) {
        this.teamService.deleteTeam(team)
          .then(() => this.teamService.shouldRefresh.next())
          .catch(err => alert(err));
      }
    });
  }

  goToTeam(team: Team): void {
    this.router.navigate([`/edit-team/${team._id}`]);
  }

  private getAllTeams(): void {
    this.teamService.getAllTeams()
      .then(teams => this.teams = teams)
      .catch(err => alert(err));
  }
}
