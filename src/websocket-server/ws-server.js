const Websocket = require('ws');
const dotenv = require('dotenv');
dotenv.config();

const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 8765;
const wss = new Websocket.Server({port: WEBSOCKET_PORT});
console.log(`Websocket Server started and listening on port ${WEBSOCKET_PORT}...`);
wss.on('connection', function connection(ws) {
    console.log('New Websocket connection...');

    ws.on('open', function open() {
        console.log('WebSocket connection opened');
        console.log('New Websocket connection from IP:', ws.upgradeReq.connection.remoteAddress);
    });
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === Websocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

});
