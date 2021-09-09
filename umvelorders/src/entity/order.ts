import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './orderItem';

@Entity()
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number
    @OneToMany( () => OrderItem, order_item => order_item.order )
    order_items!: OrderItem[]
    @Column({default: 0})
    subtotal!: number
    @Column({default: 0})
    vat!: number
    @Column({default: 0})
    total!: number
    @Column()
    token!: string
    @Column({default: 0})
    total_items!: number
    @Column()
    customer_name!: string
    @Column({default: 'OPEN'})
    status!: string
}