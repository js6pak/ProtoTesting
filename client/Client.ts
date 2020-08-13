import { HelloRequest } from 'protocol';
import { ITransport, wrap } from 'server/transport/ITransport';

export class Client {
    start(transport: ITransport): void {
        console.log("Starting client");
        transport.on("connection", (connection) => {
            connection.on("message", (message) => {
                switch (message.message) {
                    case "HelloReply":
                        console.log(message.HelloReply!.hello);
                        break;
                }
            });

            connection.send(wrap(HelloRequest.create({
                hello: "Hello server!"
            })));
        });

        transport.connect();
    }
}