import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Settings } from '../../models/Settings';

@Component({
  selector: 'app-edit-birthdayby-dialog',
  templateUrl: './edit-birthdayby-dialog.component.html',
  styleUrls: ['./edit-birthdayby-dialog.component.css']
})
export class EditBirthdaybyDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EditBirthdaybyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Settings
  ) { console.log(data); }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
