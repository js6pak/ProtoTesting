import { HelloReply } from "protocol";
import { ITransport, wrap } from './transport/ITransport';

export class Server {
    start(transport: ITransport): void {
        console.log("Starting server");

        transport.on("connection", (connection) => {
            connection.on("message", (message) => {
                switch (message.message) {
                    case "HelloRequest":
                        console.log(message.HelloRequest!.hello);
                        connection.send(wrap(HelloReply.create({
                            hello: "Hello client!"
                        })));
                        break;
                }
            });
        });

        transport.connect();
    }
}