export default interface IOrder {
    id: number,
    order_items: Array<any>,
    subtotal: number,
    vat: number,
    total: number,
    token: string,
    total_items: number,
    customer_name: string,
    status: string
}