import express from 'express';
import { createServer } from 'http';
import { createConnection, getRepository } from 'typeorm';
import { puerto } from '../config/environment';
import OrderService from '../controladoras/order';
import { Item } from '../entity/item';

const orderService = new OrderService;

export default class ServerHttp {
    private static Instance: ServerHttp;
    public app: express.Application;
    public port: number;
    private httpServer: any;

    private constructor() {
        this.app = express();
        this.port = puerto;

        this.httpServer = createServer(this.app);
    }

    public static get instance() {
        return this.Instance || (this.Instance = new this());
    }

    async conectarDB() {
        await createConnection().then(async ( conn ) => {
            const items = await getRepository(Item).count();
            ;
            if (items < 1) {
                await orderService.seedItems();
            }
            console.log('Conectado a la base de datos');
        }).catch((err) => {
            console.log(err);
        })
    }

    async iniciar() {
        await this.conectarDB();
        this.httpServer.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}