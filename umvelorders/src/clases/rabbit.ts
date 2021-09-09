import amqp, { Connection, Channel } from 'amqplib/callback_api';

export default class Rabbit {
    private createConnection(connectionString: string): Promise<Connection> {
        return new Promise(( resolve, reject ) => {
            amqp.connect(connectionString, ( err: any, connection: Connection ) => {
                if ( err ) reject(err);
                resolve(connection);
            });
        });
    }

    private createChannel(connection: Connection): Promise<Channel> {
        return new Promise((resolve, reject) => {
            connection.createChannel(( err: any, channel: amqp.Channel ) => {
                if ( err ) reject(err);
                resolve(channel);
            });
        });
    }

    async channel( queue: string ): Promise<Channel> {
        const server = await this.createConnection('amqp://localhost');
        const channel = await this.createChannel( server );

        channel.assertQueue( queue, {
            durable: true
        });

        return channel;
    }

    async send( channel: Channel, queue: string, msg: any ) {
        return channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
    }
}