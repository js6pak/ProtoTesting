import { Server } from './Server';
import { ServerWebSocketTransport } from './transport/WebSocket';

new Server().start(new ServerWebSocketTransport());
