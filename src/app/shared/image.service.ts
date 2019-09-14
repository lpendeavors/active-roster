import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  resizeImage(image: any, width: number, height: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      }
      img.src = image;
    });
  }

  resizeBase64(image: any, width: number, height: number): Promise<string> {
    return new Promise((resolve, reject) => {
      var img = document.createElement('img');
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      };
      img.onerror = function(err) {
        console.error(err);
      }
      img.src = `data:image/png;base64,${image}`;
    })
  }
}
