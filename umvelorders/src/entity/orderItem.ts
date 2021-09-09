import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item";
import { Order } from "./order";

@Entity()
export class OrderItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number
    @ManyToOne( () => Order, order_id => order_id.id ) @JoinColumn()
    order!: Order
    @ManyToOne( () => Item ) @JoinColumn()
    item!: Item
}