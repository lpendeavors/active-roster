import { Injectable } from '@angular/core';
import { Database } from './database.service';

import { Settings } from '../models/Settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private db: Database) { }

  getSettings(): Promise<Settings> {
    return this.db.getSettings();
  }

  saveSettings(settings: Settings): Promise<Settings> {
    return this.db.saveSettings(settings);
  }
}
