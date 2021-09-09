import express from 'express';
import cors from 'cors';
import ServerHttp from './clases/server';

const server = ServerHttp.instance;

server.app.enable('trusty proxy');

server.app.use(express.urlencoded({ extended: true }));
server.app.use(express.json());
server.app.use(cors({ origin: '*', credentials: true }));

// Importación de rutas
import orderRoutes from './rutas/orders';

// Seteo de rutas
server.app.use('/orders', orderRoutes);

server.iniciar();

const app = server.app;

export default app;
