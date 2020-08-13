import { IMessageWrapper, MessageWrapper } from "protocol";
import EventEmitter from "events";
import { IConnection, ITransport } from "./ITransport";

export class LocalConnection extends EventEmitter.EventEmitter implements IConnection {
    public output?: LocalConnection;

    constructor() {
        super();
    }

    send(message: IMessageWrapper): void {
        this.output!.emit("message", message);
    }
}

export class LocalTransport extends EventEmitter.EventEmitter implements ITransport {
    connections: LocalConnection[] = [];
    static transports: LocalTransport[] = [];

    connect(): void {
        for (const transport of LocalTransport.transports) {
            const a = new LocalConnection();
            const b = new LocalConnection();

            a.output = b;
            b.output = a;

            transport.connections.push(a);
            transport.emit("connection", a);

            this.connections.push(b);
            this.emit("connection", b);
        }

        LocalTransport.transports.push(this);
    }

    send(message: IMessageWrapper): void {
        this.connections.forEach(x => x.send(message));
    }
}