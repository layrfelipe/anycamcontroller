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

  onStream(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('stream', (streamData) => {
        observer.next(JSON.stringify(streamData));
      });
    });
  }
}