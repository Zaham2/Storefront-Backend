import client from "../database";

export type Product = {
    id: Number,
    name: string,
    price: number,
    category: string
}

export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const sql = 'SELECT * FROM products;'
            const conn = await client.connect()
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Cannot get Products: ${err}`)
        }
    }

    async show(id: number): Promise<Product> {
        try {
            const sql = `SELECT * FROM products WHERE id=${id};`
            const conn = await client.connect()
            const result = await conn.query(sql,)
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot get Product ${id}: ${err}`)
        }
    }

    async create(product: Product): Promise<Product> {
        try {
            const sql = `INSERT INTO products (id,name,price,category) VALUES(${product.id},'${product.name}',${product.price},'${product.category}') RETURNING *;`
            const conn = await client.connect()
            const result = await conn.query(sql)
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot create Product ${product.id}:  ${err}`)
        }
    }

    async delete(id: number): Promise<Product> {
        try {
            const sql = `DELETE FROM products WHERE id=${id} RETURNING *;`
            const conn = await client.connect()
            const result = await conn.query(sql)
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot delete Product ${id}`)
        }
    }

    async selectByCategory(category: string): Promise<Product[]> {
        try {
            const sql = `SELECT * FROM products WHERE category='${category}';`
            const conn = await client.connect();
            const result = await conn.query(sql)
            return result.rows
        } catch (err) {
            throw new Error(`Could not get products of category ${category}:  ${err}`)
        }
    }
}

