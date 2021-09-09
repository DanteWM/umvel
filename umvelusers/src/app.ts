import express from 'express';
import cors from 'cors';
import ServerHttp from './clases/server';

const server = ServerHttp.instance;

server.app.enable('trusty proxy');

server.app.use(express.urlencoded({ extended: true }));
server.app.use(express.json());
server.app.use(cors({ origin: '*', credentials: true }));

import userRoutes from './rutas/user';

server.app.use('/users', userRoutes);

server.iniciar();