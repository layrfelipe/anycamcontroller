const { createClient } = require('redis');

const client = createClient();
(async function () {
    await client.connect()
})();

async function saveFrame(snap) {
    await client.set("img", snap);
}

async function getFrame() {
    return await client.get("img");
}

module.exports = { saveFrame, getFrame }