import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from "socket.io-client"

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3020')
  }
  
  cameraCommand(command: string) {
    this.socket.emit(command)
  }

  onFrame(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('frame', (image) => {
        observer.next(image);
      });
    });
  }

  onPTZ(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('ptz', (ptz) => {
        observer.next(JSON.stringify(ptz));
      });
    });
  }
}