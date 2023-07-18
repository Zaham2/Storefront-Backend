import client from '../database'

export type Order = {
    id: number
    user_id: number,
    ordercomplete: boolean
}

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const sql = 'SELECT * FROM orders;'
            const conn = await client.connect()
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Cannot get orders ${err}`)
        }
    }

    async create(order: Order): Promise<Order> {
        try {
            const sql = `INSERT INTO orders (id,user_id,ordercomplete) VALUES (${order.id},${order.user_id},${order.ordercomplete}) RETURNING *;`
            const conn = await client.connect()
            const result = await conn.query(sql)
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot create order: ${err}`)
        }
    }

    async delete(id: number): Promise<Order> {

        try {
            const sql = `DELETE FROM orders WHERE id=${id} RETURNING *;`
            const conn = await client.connect()
            const result = await conn.query(sql)
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not delete Order: ${id}`)
        }
    }

    // Adding a product to an order
    async addProduct(id: number, order_id: number, product_id: number, quantity: number): Promise<Order> {
        try {
            const sql = `INSERT INTO order_products (id,product_id,order_id,quantity) VALUES (${id},${product_id},${order_id},${quantity}) RETURNING *`
            const conn = await client.connect()
            const result = await conn.query(sql)
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Unable to add product ${product_id} to Order ${order_id}: ${err}`)
        }
    }

    async currentOrders(user_id: number) {

        try {
            const sql = `SELECT id,ordercomplete FROM orders WHERE user_id=${user_id} AND ordercomplete=false;`
            const conn = await client.connect()
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Cannot get user ${user_id}'s current orders`)
        }
    }

    async completedOrders(user_id: number) {
        try {
            const sql = `SELECT id,ordercomplete FROM orders WHERE user_id=${user_id} AND ordercomplete=true;`
            const conn = await client.connect()
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Could not show completed orders: ${err}`)
        }
    }
}