import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  ptz: any;
  
  constructor(
    private socket: SocketService
  ){}

  ngOnInit() {
    this.socket.onPTZ().subscribe((ptz) => {
      if (ptz) {
        this.ptz = JSON.parse(ptz)
      }
    });
  }
}