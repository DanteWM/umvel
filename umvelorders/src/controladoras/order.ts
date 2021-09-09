import { getRepository } from "typeorm";
import { Item } from "../entity/item";
import { Order } from "../entity/order";
import { OrderItem } from "../entity/orderItem";
import IItem from "../interfaces/item";
import IOrder from "../interfaces/order";
import IUser from "../interfaces/user";

export default class OrderService {
    async createOrder( items: Array<number>, user: IUser, customer_name: string, callback: Function ) {
        await this.findItems( items ).then(async(itemsDB) => {
            const subtotal = await this.getTotalPrice(itemsDB);
            const total = subtotal * 1.16;
            const vat = total - subtotal;
        
            const order = new Order();
    
            order.customer_name = customer_name;
            order.total_items = itemsDB.length;
            order.subtotal = await this.getTotalPrice(itemsDB);
            order.vat = vat;
            order.total = total;
            order.status = 'COMMANDED';
            order.token = new Date( Date.now() ).toISOString();
    
            const orderDB = await this.prepareOrder(order);
            const orderItems = await this.createOrderItems(itemsDB, orderDB);
            orderDB.order_items = orderItems;
    
            orderDB.save().then((orderUp) => {
                return callback({ ok: true, mensaje: orderUp, orderItems: orderItems, respuesta: itemsDB, codigo: 200 });
            }).catch(( err ) => {
                return callback({ ok: false, mensaje: `Error al actualizar orden ${ orderDB.id }`, respuesta: err , codigo: 500 });
            });
        }).catch((err) => {
            return callback({ ok: false, mensaje: 'Ocurrio un error', respuesta: err, codigo: 400 });
        });
    }

    async updateOrder( order: IOrder, callback: Function ) {
        const orderDB = await getRepository(Order).findOne(order.id);
        if ( orderDB !== undefined ) {
            const result = await getRepository(Order).merge(orderDB, order);
            return callback({ ok: true, mensaje: 'Actualizado con exito', respuesta: result, codigo: 200 });
        }
    }

    async allOrders( callback: Function ) {
        await getRepository(Order).find().then(( orders ) => {
            if ( orders.length < 1 ) {
                return callback({ ok: false, mensaje: 'No hay ordenes en la base de datos', respuesta: null, codigo: 404 });
            }

            return callback({ ok: true, mensaje: 'Ordenes recuperadas correctamente', respuesta: orders, codigo: 200 });
        }).catch( (err) => {
            return callback({ ok: false, mensaje: 'Error en base de datos', respuesta: err, codigo: 500 });
        })
    }

    async allItems( callback: Function ) {
        await getRepository(Item).find().then(( items ) => {
            if ( items.length < 1 ) {
                return callback({ ok: false, mensaje: 'No hay items en la base de datos', respuesta: null, codigo: 404 });
            }

            return callback({ ok: true, mensaje: 'Ordenes recuperadas correctamente', respuesta: items, codigo: 200 });
        }).catch( (err) => {
            return callback({ ok: false, mensaje: 'Error en base de datos', respuesta: err, codigo: 500 });
        })
    }

    async createItem( item: IItem, callback: Function ) {
        item.price = Number(item.price);

        await getRepository(Item).create( item )
        .save().then(( itemDB ) => {
            return callback({ ok: true, mensaje: 'Item creado con exito', respuesta: itemDB, codigo: 200 });
        }).catch((err) => {
            return callback({ ok: false, mensaje: 'Error en base de datos', respuesta: err, codigo: 500 });
        });
    }

    private async createItemNC( item: IItem ) {
        await getRepository(Item).create( item )
        .save();
    }

    private async findItems( items: Array<number> ): Promise<Item[]> {
        let itemsDB: Item[] = [];
        return new Promise(async(resolve, reject) => {
            for ( let item of items ) {
                const itemDB = await getRepository(Item).findOne(item);
                if ( itemDB ) {
                    itemsDB.push(itemDB);
                } else {
                    reject(`No existen items con el id ${ item }`);
                }
            }

            resolve(itemsDB);
        });
    }

    private async prepareOrder(order: Order): Promise<Order> {
        return new Promise((resolve, reject) => {
            getRepository(Order).create(order)
            .save().then(( orderDB ) => {
                resolve(orderDB);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    private async createOrderItems( items: Item[], order: Order ): Promise<OrderItem[]> {
        let orderItems: OrderItem[] = [];
        return new Promise(async(resolve, reject) => {
            for( let item of items ) {
                let orderItem = new OrderItem;
                orderItem.item = item;
                orderItem.order = order;

                await this.createOrderItem(orderItem).then(( orderItemDB ) => {
                    orderItems.push(orderItemDB);
                }).catch((err) => {
                    reject(err);
                });
            }

            resolve(orderItems);
        });
    }

    private async createOrderItem( orderItem: OrderItem ): Promise<OrderItem> {
        return new Promise((resolve, reject) => {
            getRepository(OrderItem).create(orderItem).save()
            .then(( orderItemDB ) => {
                resolve(orderItemDB);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    private getTotalPrice( items: Item[] ): Promise<number> {
        return new Promise((resolve) => {
            let total = 0;
            for ( let item of items ) {
                total += item.price;
            }

            resolve(total);
        })
    }

    async updateStatusOrder( idOrder: number, status: string, callback: Function ) {
        getRepository(Order).findOne(idOrder).then((order) => {

            if ( order ) {
    
                switch( order.status ) {
                    case 'OPEN':
                        if ( status !== 'COMMANDED' ) {
                            if ( status !== 'CANCELLED' ) {
                                return callback({ ok: false, mensaje: 'Error al actualizar status, se esperaba COMMANDED o CANCELLED', respuesta: null, codigo: 400 });
                            }
                        }
                        break;
    
                    case 'COMMANDED':
                        if ( status !== 'SERVED' ) {
                            return callback({ ok: false, mensaje: 'Error al actualizar status se esperaba SERVED', respuesta: null, codigo: 400 });
                        }
                        break;
    
                    case 'SERVED':
                        if ( status !== 'PAID' ) {
                            return callback({ ok: false, mensaje: 'Error al actualizar status se esperaba PAID', respuesta: null, codigo: 400 });
                        }
                        break;
    
                    case 'PAID':
                        if ( status !== 'CLOSED' ) {
                            return callback({ ok: false, mensaje: 'Error al actualizar status se esperaba CLOSED', respuesta: null, codigo: 400 });
                        }
                        break;

                    case 'CANCELLED':
                        return callback({ ok: false, mensaje: 'Esta orden esta cancelada, no puedes hacer mas cambios', respuesta: null, codigo: 400 });
                        break;

                    case 'CLOSED':
                        return callback({ ok: false, mensaje: 'Esta orden ya esta cerrada y no se le pueden hacer cambios', respuesta: null, codigo: 400 });
                        break;
                }

                order.status = status;

                order.save().then((orderUp) => {
                    return callback({ ok: true, mensaje: 'Status de orden actualizada', respuesta: orderUp, codigo: 200 });
                }).catch((err) => {
                    return callback({ ok: false, mensaje: 'Error en base de datos', respuesta: err, codigo: 500 });
                })
                
            } else {
                return callback({ ok: false, mensaje: 'No existen ordenes con este id', respuesta: null, codigo: 400 })
            }
        })
        
    }

    async seedItems() {
        let items: IItem[] = [
            {
                name: 'Pastel de chocolate',
                price: 35.50
            },
            {
                name: 'Cafe americado',
                price: 22.00
            },
            {
                name: 'Huevos estrellados',
                price: 63.30
            },
            {
                name: 'Fruta picada',
                price: 45
            },
            {
                name: 'Enchiladas suizas',
                price: 110
            },
            {
                name: 'Crepas',
                price: 40
            }
        ];

        for ( let item of items ) {
            await this.createItemNC( item ).then(( itemDB ) => {
                console.info(`Item creado con exito ${ item.name }`);
            });
        }
    }
}