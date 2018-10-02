import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { AddEditTeamDialogComponent } from './components/add-edit-team-dialog/add-edit-team-dialog.component';

import { Team } from './models/Team';
import { TeamService } from './shared/team.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  teams: Team[] = [];
  
  private deleteTeamSubscription: Subscription;
  
  constructor(public dialog: MatDialog, private teamService: TeamService) {}

  openNewTeamDialog(): void {
    const dialogRef = this.dialog.open(AddEditTeamDialogComponent, {
      width: '350px',
      data: { name: '' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newTeam: Team = {
          name: result
        };
        this.addTeam(newTeam);
      }
    });
  }

  ngOnInit(): void {
    this.getAllTeams();
    this.deleteTeamSubscription = this.teamService.refreshTeams()
      .subscribe(() => this.getAllTeams());
  }

  ngOnDestroy(): void {
    this.deleteTeamSubscription.unsubscribe();
  }

  private getAllTeams(): void {
    this.teamService.getAllTeams()
      .then(teams => this.teams = teams)
      .catch(err => alert(err));
  }

  private addTeam(newTeam: Team): void {
    this.teamService.addTeam(newTeam)
      .then(() => {
        this.teamService.shouldRefresh.next();
      })
      .catch(err => alert(err));
  }

}
