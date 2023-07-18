import client from "../../database";
import { ProductServices } from "../../services/productServices";
import { Order, OrderStore } from "../order";
import { Product, ProductStore } from "../product";
import { User, UserStore } from "../user";
import { orderproduct, orderproductStore } from '../orderproduct'

const orderStore = new OrderStore()
const userStore = new UserStore()
const productStore = new ProductStore()
const opStore= new orderproductStore()

describe("Product Model", () => {

    it("testing index method", () => {
        expect(orderStore.index).toBeDefined()
    });

    it("testing create method", () => {
        expect(orderStore.create).toBeDefined()
    });

    it("testing delete method", () => {
        expect(orderStore.delete).toBeDefined()
    });

    it("testing addProduct method", () => {
        expect(orderStore.addProduct).toBeDefined()
    });

    it("testing currentOrders method", () => {
        expect(orderStore.currentOrders).toBeDefined()
    });

    it("testing completedOrders method", () => {
        expect(orderStore.completedOrders).toBeDefined()
    });

})

describe(`orders functionality:`, () => {
    const defaultUser3: User = {
        id: 3,
        firstname: "mohamad3",
        lastname: 'elzahaby3',
        password: '123'
    }

    const defaultProduct4: Product = {
        id: 4,
        name: 'product4',
        price: 40,
        category: 'stuff'
    }

    const defaultProduct5: Product = {
        id: 5,
        name: 'product 5',
        price: 50,
        category: 'stuff'
    }

    const defaultOrder1: Order = {
        id: 1,
        user_id: 3,
        ordercomplete: true
    }

    const defaultOrder2: Order = {
        id: 2,
        user_id: 3,
        ordercomplete: false
    }

    beforeAll(async () => {
        await userStore.create(defaultUser3)
        await productStore.create(defaultProduct4)
        await productStore.create(defaultProduct5)
        await orderStore.create(defaultOrder1)
        await orderStore.create(defaultOrder2)
    })

    afterAll(async () => {
        const sql = 'DELETE FROM order_products;DELETE FROM orders;DELETE FROM users;DELETE FROM products;'
        const conn = await client.connect()
        await conn.query(sql)
        conn.release()
    })

    it('create', async () => {
        const order: Order = {
            id: 3,
            user_id: 3,
            ordercomplete: false
        }
        const createdOrder = await orderStore.create(order)
        expect(createdOrder).toEqual({
            id: 3,
            user_id: 3,
            ordercomplete: false
        })
    })

    it('current orders (cart)',async ()=>{
        const openOrders = await orderStore.currentOrders(defaultUser3.id as number)
        expect(openOrders.length).toBe(2)
    })

    it('completed orders',async ()=>{
        const openOrders = await orderStore.completedOrders(defaultUser3.id as number)
        expect(openOrders.length).toBe(1)
    })

    it('index', async () => {
        const orders = await orderStore.index()
        expect(orders.length).toBe(3)
    })

    it('delete', async () => {
        const deleted = await orderStore.delete(3)
        expect(deleted.id).toBe(3)
    })

    // this method uses two tables: Order and orderproducts. We use the show() helper function from orderproductStore
    it('add Product to Order', async () => {

        const orderproduct = {
            id:1,
            order_id:defaultOrder1.id,
            product_id:defaultProduct4.id,
            quantity: 5
        }

        await orderStore.addProduct(orderproduct.id,orderproduct.order_id, orderproduct.product_id as number,orderproduct.quantity)

        const op = await opStore.show(orderproduct.id)

        expect(op.id).toBe(orderproduct.id)
        expect(op.product_id).toBe(orderproduct.product_id as number)
        expect(op.order_id).toBe(orderproduct.order_id)
        expect(op.quantity).toBe(orderproduct.quantity)
    })

})

