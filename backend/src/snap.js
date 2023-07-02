var Cam = require('onvif').Cam;
const saveFrame = require("./redis").saveFrame
var ProxyAgent = require('proxy-agent').ProxyAgent;

require('dotenv').config();
const OPTIONS = {
    hostname: process.env.CAMERA_IP,
    username: process.env.CAMERA_USER,
    password: process.env.CAMERA_PASSWORD,
    port: process.env.CAMERA_PORT,
    timeout: parseInt(process.env.CAMERA_TIMEOUT),
    preserveAddress: true ,
    agent: new ProxyAgent("socks5://localhost:3020")
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

(async function () {
    new Cam(OPTIONS, async function CamFunc(err) {
        if (err) {
            console.log("Connection to camera...", err)
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
                saveFrame(b64Img);
            })});
        }, process.env.REQUEST_DATA_TO_CAMERA_INTERVAL);
    });
})();