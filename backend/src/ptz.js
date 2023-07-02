var Cam = require('onvif').Cam;
const setPTZ = require("./redis").setPTZ

require('dotenv').config();
const OPTIONS = {
    hostname: process.env.CAMERA_IP,
    username: process.env.CAMERA_USER,
    password: process.env.CAMERA_PASSWORD,
    port: process.env.CAMERA_PORT,
    timeout: parseInt(process.env.CAMERA_TIMEOUT),
    preserveAddress: true 
}

new Cam(OPTIONS, async function CamFunc(err) {
    if (err) {
        console.log("Connection to camera...", err)
        return;
    }

    var cameraInstance = this;
    
    setInterval(() => {
        cameraInstance.getStatus({}, (a, b) => {
            setPTZ({
                "pan": b.position.x,
                "tilt": b.position.y,
                "zoom": b.position.zoom
            })
        });
    }, process.env.REQUEST_DATA_TO_CAMERA_INTERVAL);
});