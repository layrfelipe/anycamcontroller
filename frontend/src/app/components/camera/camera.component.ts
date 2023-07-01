import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {
    imageLoaded = false;
    image: string = "";
  
    constructor(
      private socket: SocketService
    ){}
  
    ngOnInit() {
      this.socket.onFrame().subscribe((image) => {
        if (image) {
          this.image = 'data:image/png;base64,' + image
          this.imageLoaded = true;
        }
      });
    }
  
    getImageUrl(): string {
      return this.image ? String(this.image) : '';
    }
}