import { Router, Request, Response, response } from 'express';
import Rabbit from '../clases/rabbit';
import OrderService from '../controladoras/order';
import { IRespuesta } from '../interfaces/respuesta';
import { verifyToken } from '../middlewares/authentication';

const ordersRoutes = Router();
const orderService = new OrderService;

ordersRoutes.get('/', verifyToken, async( req: Request, res: Response ) => {
    await orderService.allOrders(async ( respuesta: IRespuesta ) => {
        return res.status( respuesta.codigo ).json( respuesta );
    });
});

ordersRoutes.post('/create', verifyToken, async( req: Request, res: Response ) => {
    const { items, user, customer_name } = req.body;

    if ( items.length < 1 ) {
        return res.status(400).json({ ok: false, mensaje: 'Debes elegir por lo menos un item para crear una orden', respuesta: null, codigo: 400 });
    }

    if ( !customer_name ) {
        return res.status(400).json({ ok: false, mensaje: 'No enviaste el nombre del cliente', respuesta: null, codigo: 400 });
    }
    
    await orderService.createOrder( items, user, customer_name,( respuesta: IRespuesta ) => {
        return res.status( respuesta.codigo ).json( respuesta );
    });
});

ordersRoutes.put('/update', verifyToken, async( req: Request, res: Response ) => {
    const { order } = req.body;

    await orderService.updateOrder( order, ( respuesta: IRespuesta ) => {
        return res.status( respuesta.codigo ).json( respuesta );
    });
});

ordersRoutes.put('/status', async(req: Request, res: Response ) => {
    const { idOrder, status } = req.body;

    await orderService.updateStatusOrder( idOrder, status, ( respuesta: IRespuesta ) => {
        return res.status( respuesta.codigo ).json( respuesta );
    });
});

ordersRoutes.get('/items', verifyToken, async( req: Request, res: Response ) => {
    await orderService.allItems(async( respuesta: IRespuesta ) => {
        return res.status( respuesta.codigo ).json( respuesta );
    });
});

ordersRoutes.post('/item/create', verifyToken, async( req: Request, res: Response ) => {
    const { item } = req.body;

    await orderService.createItem( item, async ( respuesta: IRespuesta ) => {
        return res.status( respuesta.codigo ).json( respuesta );
    });
});


export default ordersRoutes;