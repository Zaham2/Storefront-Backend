import client from "../database";

export class ProductServices {

    // this method gets the five products with the most sales (quantity from order_products table)
    async getTopFiveProducts(): Promise<{ name: string, quantity: number }[]> {

        try {
            const sql = `SELECT p.name,SUM(op.quantity) FROM products as p INNER JOIN order_products as op ON p.id = op.product_id GROUP BY name ORDER BY SUM(op.quantity) DESC LIMIT 5;`
            const conn = await client.connect()
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Could not get top five products: ${err}`)
        }
    }
}