import { IMessageWrapper, MessageWrapper } from "protocol";
import WebSocket from "ws";
import EventEmitter from "events";
import { IConnection, ITransport } from "./ITransport";

export class WebSocketConnection extends EventEmitter.EventEmitter implements IConnection {
    ws: WebSocket;

    constructor(ws: WebSocket) {
        super();
        this.ws = ws;

        ws.on("message", (message) => {
            const wrapper = MessageWrapper.decode(Buffer.from(message));
            this.emit("message", wrapper);
        });
    }

    send(message: IMessageWrapper): void {
        this.ws.send(MessageWrapper.encode(message).finish());
    }
}

export class ClientWebSocketTransport extends EventEmitter.EventEmitter implements ITransport {
    public ws?: WebSocket;
    server?: WebSocketConnection;
    get connections(): WebSocketConnection[] { return this.server ? [this.server] : []; }

    connect(): void {
        this.ws = new WebSocket("ws://localhost:8080");
        this.ws.binaryType = "arraybuffer";

        this.ws.on("open", () => {
            this.server = new WebSocketConnection(this.ws!);
            this.connections.push(this.server);
            this.emit("connection", this.server);
        });

        this.ws.on("close", () => {
            this.ws = this.server = undefined;
        });
    }

    send(message: IMessageWrapper): void {
        this.connections.forEach(x => x.send(message));
    }
}

export class ServerWebSocketTransport extends EventEmitter.EventEmitter implements ITransport {
    public wss?: WebSocket.Server;
    connections: WebSocketConnection[] = [];

    connect(): void {
        this.wss = new WebSocket.Server({ port: 8080 });

        this.wss.on("connection", (ws) => {
            const connection = new WebSocketConnection(ws);
            this.connections.push(connection);
            this.emit("connection", connection);

            ws.on("close", () => {
                this.connections = this.connections.filter(x => x.ws !== ws);
            });
        });
    }

    send(message: IMessageWrapper): void {
        this.connections.forEach(x => x.send(message));
    }
}