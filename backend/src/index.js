var Cam = require('onvif').Cam;
const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {origin : "*"}
});
require('dotenv').config();
const SERVER_PORT = process.env.SERVER_PORT
const OPTIONS = {
  hostname: process.env.CAMERA_IP,
  username: process.env.CAMERA_USER,
  password: process.env.CAMERA_PASSWORD,
  port: process.env.CAMERA_PORT,
  timeout: parseInt(process.env.CAMERA_TIMEOUT),
  preserveAddress: true 
}

function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

io.on("connection", async (socket) => {
  console.log("new socket connection");

  new Cam(OPTIONS, async function CamFunc(err) {
    if (err) {
      console.log("Connection failed...", err)
      return;
    }

    var cameraInstance = this;

    setInterval(() => {
      cameraInstance.getSnapshotUri({ protocol: 'RTSP' }, async (err, stream) => {
        let ibar = getPosition(stream.uri, '/', 3);

        let digestRequest = require("request-digest")(OPTIONS.username, OPTIONS.password);
        digestRequest.request({
          host: 'http://' + OPTIONS.hostname,
          path: stream.uri.substring(ibar),
          port: OPTIONS.port,
          encoding: null,
          method: 'GET'
        }, (error, response, body) => {
            if (error) {
              console.log("error", error)
            }
            let b64Img = arrayBufferToBase64(body)
            socket.emit("frame", b64Img)
        });
      })
    }, 1500);
  })

  socket.on("disconnect", () => {
    console.log("socket disconnection");
  });

  socket.on("moveLeft", async () => {
    return new Promise((resolve, reject) => {
      new Cam(OPTIONS, async function camFunc(err) {
        if (err) {
          console.log("Connection failed...");
          reject(err);
          return;
        }
        resolve(this.relativeMove({ x: -0.1, y: 0 }));
      })
    });
  });

  socket.on("moveRight", () => {
    return new Promise((resolve, reject) => {
      new Cam(OPTIONS, async function camFunc(err) {
        if (err) {
          console.log("Connection failed...");
          reject(err);
          return;
        }
        resolve(this.relativeMove({ x: 0.1, y: 0 }));
      })
    });
  })

  socket.on("moveTop", () => {
    return new Promise((resolve, reject) => {
      new Cam(OPTIONS, async function camFunc(err) {
        if (err) {
          console.log("Connection failed...");
          reject(err);
          return;
        }
        resolve(this.relativeMove({ x: 0.1, y: 0.1 }));
      })
    });
  })

  socket.on("moveBottom", () => {
    return new Promise((resolve, reject) => {
      new Cam(OPTIONS, async function camFunc(err) {
        if (err) {
          console.log("Connection failed...");
          reject(err);
          return;
        }
        resolve(this.relativeMove({ x: 0, y: -0.1 }));
      })
    });
  })
});

httpServer.listen(SERVER_PORT, () => console.log(`listening on ${SERVER_PORT}`));