import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgxElectronModule }from 'ngx-electron';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { TeamListComponent } from './components/team-list/team-list.component';
import { EditTeamComponent } from './components/edit-team/edit-team.component';
import { AddEditTeamDialogComponent } from './components/add-edit-team-dialog/add-edit-team-dialog.component';
import { AddEditPlayerDialogComponent } from './components/add-edit-player-dialog/add-edit-player-dialog.component';
import { DeleteConfirmDialogComponent } from './components/delete-confirm-dialog/delete-confirm-dialog.component';
import { SettingsComponent } from './components/settings/settings.component';
import { EditBirthdaybyDialogComponent } from './components/edit-birthdayby-dialog/edit-birthdayby-dialog.component';

import { Database } from './shared/database.service';
import { PrintService } from './shared/print.service';
import { ImageService } from './shared/image.service';
import { TeamService } from './shared/team.service';
import { IntegrationService } from './shared/integration.service';
import { OverwriteConfirmDialogComponent } from './components/overwrite-confirm-dialog/overwrite-confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    TeamListComponent,
    EditTeamComponent,
    AddEditTeamDialogComponent,
    AddEditPlayerDialogComponent,
    DeleteConfirmDialogComponent,
    SettingsComponent,
    EditBirthdaybyDialogComponent,
    OverwriteConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    NgxElectronModule
  ],
  entryComponents: [
    AddEditTeamDialogComponent,
    AddEditPlayerDialogComponent,
    DeleteConfirmDialogComponent,
    EditBirthdaybyDialogComponent
  ],
  providers: [
    Database,
    PrintService,
    ImageService,
    TeamService,
    IntegrationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
