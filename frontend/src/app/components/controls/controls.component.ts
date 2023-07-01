import { Component } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {
  constructor(
    private socket: SocketService
  ){}
  
  moveLeft() {
    this.socket.cameraCommand("moveLeft")
  }

  moveRight() {
    this.socket.cameraCommand("moveRight")
  }

  moveUp() {
    this.socket.cameraCommand("moveUp")
  }

  moveDown() {
    this.socket.cameraCommand("moveDown")
  }
}
