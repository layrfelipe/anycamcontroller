import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-controls-page',
  templateUrl: './controls-page.component.html',
  styleUrls: ['./controls-page.component.scss']
})
export class ControlsPageComponent implements OnInit {
  
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

  moveLeft() {
    this.socket.cameraCommand("moveLeft")
  }

  moveRight() {
    this.socket.cameraCommand("moveRight")
  }

  moveTop() {
    this.socket.cameraCommand("moveTop")
  }

  moveBottom() {
    this.socket.cameraCommand("moveBottom")
  }
}
