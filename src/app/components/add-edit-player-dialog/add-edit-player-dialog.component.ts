import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ImageService } from '../../shared/image.service';

@Component({
  selector: 'app-add-edit-player-dialog',
  templateUrl: './add-edit-player-dialog.component.html',
  styleUrls: ['./add-edit-player-dialog.component.css']
})
export class AddEditPlayerDialogComponent {

  selectedImage: string | ArrayBuffer;

  constructor(
    public imageService: ImageService,
    public dialogRef: MatDialogRef<AddEditPlayerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  pictureAdded(event: any): void {
    const files = event.srcElement.files;
    if (files[0]) {
      const reader = new FileReader();
      const scope = this;
      reader.onloadend = function() {
        scope.imageService.resizeImage(reader.result, 150, 150)
          .then(resizedImage => scope.data.player.image = resizedImage);
      }
      reader.readAsDataURL(files[0]);
    }
  }

}
