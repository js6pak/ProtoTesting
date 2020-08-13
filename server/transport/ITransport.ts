import { IMessageWrapper, MessageWrapper } from "protocol";

export function wrap(message: any): MessageWrapper {
    return MessageWrapper.create({
        [Object.getPrototypeOf(message).constructor.name]: message
    });
};

export interface ITransport {
    connect(): void;

    on(event: "connection", listener: (this: ITransport, connection: IConnection) => void): this;

    connections: IConnection[];

    /**
     * Broadcasts message
     */
    send(message: IMessageWrapper): void;
}

export interface IConnection {
    send(message: IMessageWrapper): void;

    on(event: "message", listener: (this: ITransport, message: MessageWrapper) => void): this;
}