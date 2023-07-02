var Cam = require('onvif').Cam;
const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {origin : "*"}
});
const getFrame = require("./redis").getFrame
const getPTZ = require("./redis").getPTZ

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

io.on("connection", async (socket) => {
  console.log("new socket connection");

  async function fakeStream() {
    try {
      let frame = await getFrame()
      let ptz = await getPTZ()
      let data = {
        frame,
        ptz
      }
      socket.emit("stream", data);

      setTimeout(() => {
        fakeStream();        
      }, 2000);
    }
    catch (err) {
      console.log("error on fakeStream socket event");
      setTimeout(() => {
        fakeStream();        
      }, 2000);
    }
  }

  fakeStream();

  socket.on("disconnect", () => {
    console.log("socket disconnection");
  });

  new Cam(OPTIONS, async function CamFunc(err) {
    if (err) {
      console.log("Connection to camera failed...", err)
      return;
    }

    var cameraInstance = this;

    socket.on("moveLeft", () => {
      cameraInstance.relativeMove({ x: -0.1, y: 0 });
    });

    socket.on("moveRight", () => {
      cameraInstance.relativeMove({ x: 0.1, y: 0 });
    });

    socket.on("moveUp", () => {
      cameraInstance.relativeMove({ x: 0, y: 0.1 });
    });

    socket.on("moveDown", () => {
      cameraInstance.relativeMove({ x: 0, y: -0.1 });
    });

    socket.on("continuousMoveLeft", () => {
      cameraInstance.continuousMove({ x: -0.3 });
    });

    socket.on("continuousMoveRight", () => {
      cameraInstance.continuousMove({ x: 0.3 });
    });

    socket.on("stop", () => {
      cameraInstance.stop();
    });
  });
});

httpServer.listen(SERVER_PORT, () => console.log(`listening on ${SERVER_PORT}`));