import client from "../../database";
import { Product, ProductStore } from "../product";

const store = new ProductStore()

describe("Product Model", () => {

    it("testing index method", () => {
        expect(store.index).toBeDefined()
    });

    it("testing create method", () => {
        expect(store.create).toBeDefined()
    });

    it("testing show method", () => {
        expect(store.show).toBeDefined()
    });

    it("testing delete method", () => {
        expect(store.delete).toBeDefined()
    });

    it("testing Select by Category method", () => {
        expect(store.selectByCategory).toBeDefined()
    });
})

describe('testing Product functionality:', () => {
    const defaultProduct1: Product = {
        id: 1,
        name: 'product1',
        price: 10,
        category: 'food'
    }

    const defaultProduct2: Product = {
        id: 2,
        name: 'product2',
        price: 20,
        category: 'drink'
    }

    beforeAll(async ()=>{
        await store.create(defaultProduct1)
        await store.create(defaultProduct2)
    })

    afterAll(async () => {
        const sql = 'DELETE FROM products;'
        const conn = await client.connect()
        await conn.query(sql)
        conn.release()
    })

    it('create', async () => {
        const product: Product ={
            id: 3,
            name: 'product3',
            price: 30,
            category: 'food'
        }
        const createdProduct = await store.create(product)
        expect(createdProduct).toEqual({
            id:3,
            name: 'product3',
            price: 30,
            category: 'food'
        })
    })

    it('index',async ()=>{
        const products = await store.index()
        expect(products.length).toBe(3)
    })

    it('show',async ()=>{
        const product = await store.show(1)
        expect(product.id).toBe(1)
    })

    it('delete', async ()=> {
        const deleted = await store.delete(3)
        expect(deleted.id).toBe(3)
    })

    it('select by category',async ()=>{
        const categories = await store.selectByCategory('drink')
        expect(categories.length).toBe(1)
    })
})

