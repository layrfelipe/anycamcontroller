const { createClient } = require('redis');

const client = createClient();
(async function () {
    await client.connect();
})();

async function saveFrame(snap) {
    await client.set("img", snap);
}

async function getFrame() {
    return await client.get("img");
}

async function setPTZ(ptz) {
    return await client.hSet("ptz", {
        pan: ptz.pan,
        tilt: ptz.tilt,
        zoom: ptz.zoom
    });
}

async function getPTZ() {
    return await client.hGetAll("ptz");
}

module.exports = { saveFrame, getFrame, setPTZ, getPTZ }