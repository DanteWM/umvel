import express from 'express';
import { createServer } from 'http';
import { createConnection, getRepository } from 'typeorm';
import { puerto } from '../config/environment';
import UserService from '../controladoras/user';
import { User } from '../entity/user';
import { IResponse } from '../interfaces/response';
import IUser from '../interfaces/user';

const userService = new UserService;

export default class ServerHttp {
    private static Instance: ServerHttp;
    public app: express.Application;
    public port: number;
    private httpServer: any;

    private constructor() {
        this.app = express();
        this.port = puerto;

        this.httpServer = createServer( this.app );
    }

    public static get instance() {
        return this.Instance || ( this.Instance = new this() );
    }

    async conectarDB() {
        await createConnection().then(async () => {
            const usersDB = await getRepository(User).count()
            if ( usersDB < 1 ) {
                let users: IUser[] = [
                    {
                        name: 'admin',
                        email: 'admin@umvel.com',
                        password: 'admin'
                    },
                    {
                        name: 'guest',
                        email: 'guest@umvel.com',
                        password: 'guest'
                    }
                ]

                for ( let user of users ) {
                    await userService.createUser(user, (response: IResponse) => {
                        console.log(response.mensaje);
                    });
                }
            } 
            console.log('Conectado a la base de datos');
        }).catch(( err ) => {
            console.log(err);
        })
    }

    async iniciar() {
        await this.conectarDB();
        this.httpServer.listen( this.port, () => {
            console.log(`Servidor corriendo en el puerto ${ this.port }`);
        });
    }
}