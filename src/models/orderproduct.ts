import client from "../database";

export type orderproduct = {
    id: number,
    order_id: number,
    product_id: number,
    quantity: number
}

/*This is only a helper class I used to test the addProducts feature. 

It does not and should not have its own handler file. 

The single show function here is implicitly tested in (OrderSpec.ts)'s addProduct Spec.
*/
export class orderproductStore {
    async show(id: number): Promise<orderproduct> {
        try{
            const sql = `SELECT * FROM order_products WHERE id=${id};`
            const conn = await client.connect()
            const result = await conn.query(sql)
            conn.release()
            return result.rows[0]
        }catch (err){
            throw new Error(`${err}`)
        }
    }
}
