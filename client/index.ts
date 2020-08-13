import { ClientWebSocketTransport } from 'server/transport/WebSocket';
import { LocalTransport } from '../server/transport/Local';
import { Server } from '../server/Server';
import { Client } from './Client';

const singleplayer = process.argv.includes("single");

if (singleplayer) {
    new Server().start(new LocalTransport());
}

new Client().start(singleplayer ? new LocalTransport() : new ClientWebSocketTransport());

setInterval(() => { }, 10000);