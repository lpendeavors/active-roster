import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { TeamListComponent } from './components/team-list/team-list.component';
import { EditTeamComponent } from './components/edit-team/edit-team.component';
import { AddEditTeamDialogComponent } from './components/add-edit-team-dialog/add-edit-team-dialog.component';
import { AddEditPlayerDialogComponent } from './components/add-edit-player-dialog/add-edit-player-dialog.component';
import { DeleteConfirmDialogComponent } from './components/delete-confirm-dialog/delete-confirm-dialog.component';

import { Database } from './shared/database.service';
import { PrintService } from './shared/print.service';
import { ImageService } from './shared/image.service';
import { TeamService } from './shared/team.service';

@NgModule({
  declarations: [
    AppComponent,
    TeamListComponent,
    EditTeamComponent,
    AddEditTeamDialogComponent,
    AddEditPlayerDialogComponent,
    DeleteConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    AddEditTeamDialogComponent,
    AddEditPlayerDialogComponent,
    DeleteConfirmDialogComponent
  ],
  providers: [
    Database,
    PrintService,
    ImageService,
    TeamService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
