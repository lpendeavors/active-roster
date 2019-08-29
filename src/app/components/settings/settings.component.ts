import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { EditBirthdaybyDialogComponent } from '../edit-birthdayby-dialog/edit-birthdayby-dialog.component';

import { Settings } from '../../models/Settings';
import { SettingsService } from '../../shared/settings.service';
import { IntegrationService } from 'src/app/shared/integration.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  private settings: Settings;
  public birthdayBy: Date;

  constructor(
    public dialog: MatDialog, 
    private settingsService: SettingsService,
    private integrationService: IntegrationService) { }

  ngOnInit() {
    this.getSettings();
  }

  openEditBirthdaybyDialog(): void {
    const dialogRef = this.dialog.open(EditBirthdaybyDialogComponent, {
      width: '350px',
      data: { birthdayBy: this.birthdayBy }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.settings.birthdayBy = result;
        this.settingsService.saveSettings(this.settings).then(settings => {
          this.settings = settings;
          this.setYear();
        });
      }
    });
  }

  importTeams(): void {
    this.integrationService.importJson();
  }

  exportTeams(): void {
    this.integrationService.exportJson();
  }

  legacyImport(): void {
    this.integrationService.importLegacySpreadsheet();
  }

  uploadImages(): void {
    this.integrationService.importImages();
  }

  private getSettings(): void {
    this.settingsService.getSettings().then(settings => {
      this.settings = settings;
      this.setYear();
    });
  }

  private setYear(): void {
    const currentYear = new Date().getFullYear();
    this.birthdayBy = new Date(`${this.settings.birthdayBy}/${currentYear}`);
  }

}
