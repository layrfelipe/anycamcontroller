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
      this.socket.onStream().subscribe((stream) => {
        if (stream) {
          this.image = 'data:image/png;base64,' + JSON.parse(stream).frame
          this.imageLoaded = true;
        }
      });
    }
  
    getImageUrl(): string {
      return this.image ? String(this.image) : '';
    }
}