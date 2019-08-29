import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamListComponent } from './components/team-list/team-list.component';
import { EditTeamComponent } from './components/edit-team/edit-team.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'team-list', pathMatch: 'full' },
  { path: 'team-list', component: TeamListComponent },
  { path: 'edit-team/:id', component: EditTeamComponent },
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}