import app from "../../src/app";
import request from 'supertest';
import * as helpers from './helpers';
import { createConnection, getConnection } from "typeorm";

const api = request(app);

beforeAll(async() => {
    await createConnection({
        name: 'default',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'lobo48tft8030',
        database: 'orders',
        entities: [ "src/entity/*.ts"]
    });
})

describe('Test peticiones a endpoint de ordenes', () => {
    test('Se trata de listar ordenes sin token', async () => {
        await api
        .get('/orders')
        .expect(401)
    });

    test('Se trata de listar ordenes sin un token valido', async () => {
        await api
        .get('/orders')
        .set('Authorization', '12345')
        .expect(401)
    });

    test('Prueba de creación de item', async () => {
        await api
        .post('/orders/item/create')
        .set('Authorization', helpers.token)
        .send({
            item: helpers.item
        })
        .expect(200)
    });

    test('Se trata de crear una orden sin items', async () => {
        await api
        .post('/orders/create')
        .set('Authorization', helpers.token)
        .send({
            items: []
        })
        .expect(400)
    });

    test('Creación de ordenes correcto', async () => {
        await api
        .post('/orders/create')
        .set('Authorization', helpers.token)
        .send({
            items: [1,2],
            customer_name: 'Prueba Unitaria'
        })
        .expect(200)
    });

    test('Listado de items correcto', async() => {
        await api
        .get('/orders/items')
        .set('Authorization', helpers.token)
        .expect(200)
    });
});

afterAll(async () => {
    await app.listen().close();
    await getConnection().close();
})
