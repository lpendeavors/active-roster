import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Team } from '../../models/Team';

@Component({
  selector: 'app-add-edit-team-dialog',
  templateUrl: './add-edit-team-dialog.component.html',
  styleUrls: ['./add-edit-team-dialog.component.css']
})
export class AddEditTeamDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AddEditTeamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Team
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
