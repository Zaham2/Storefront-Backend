import supertest from "supertest";
import client from "../../database";
import { Order, OrderStore } from "../../models/order";
import { orderproduct } from "../../models/orderproduct";
import { Product, ProductStore } from "../../models/product";
import { User, UserStore } from "../../models/user";
import app from "../../server";

const request = supertest(app)

const userStore = new UserStore()
const productStore = new ProductStore()
const orderStore = new OrderStore()

describe('testing ProductServices handler',()=>{

    const defaultUser:User = {
        id:5,
        firstname: "mohamad5",
        lastname: 'elzahaby5',
        password: '123'
    }

    const defaultOrder:Order = {
        id:5,
        user_id:5,
        ordercomplete: true
    }

    const defaultProduct1: Product = {
        id:11,
        name: "product11",
        price: 110,
        category: "food"
    }
    const defaultProduct2: Product = {
        id:12,
        name: "product12",
        price: 120,
        category: "food"
    }
    const defaultProduct3: Product = {
        id:13,
        name: "product13",
        price: 130,
        category: "food"
    }
    const defaultProduct4: Product = {
        id:14,
        name: "product14",
        price: 140,
        category: "food"
    }
    const defaultProduct5: Product = {
        id:15,
        name: "product15",
        price: 150,
        category: "food"
    }
    const defaultProduct6: Product = {
        id:16,
        name: "product16",
        price: 160,
        category: "food"
    }

    const defaultOrderProduct1:orderproduct = {
        id:11,
        order_id:defaultOrder.id,
        product_id: defaultProduct1.id as number,
        quantity: 11
        
    }

    const defaultOrderProduct2:orderproduct = {
        id:12,
        order_id:defaultOrder.id,
        product_id: defaultProduct2.id as number,
        quantity: 12
    }

    const defaultOrderProduct3:orderproduct = {
        id:13,
        order_id:defaultOrder.id,
        product_id: defaultProduct3.id as number,
        quantity: 13
    }

    const defaultOrderProduct4:orderproduct = {
        id:14,
        order_id:defaultOrder.id,
        product_id: defaultProduct4.id as number,
        quantity: 14
    }

    const defaultOrderProduct5:orderproduct = {
        id:15,
        order_id:defaultOrder.id,
        product_id: defaultProduct5.id as number,
        quantity: 15
    }

    const defaultOrderProduct6:orderproduct = {
        id:16,
        order_id:defaultOrder.id,
        product_id: defaultProduct6.id as number,
        quantity: 16
    }

    beforeAll(async()=>{
        await userStore.create(defaultUser)

        await orderStore.create(defaultOrder)

        await productStore.create(defaultProduct1)
        await productStore.create(defaultProduct2)
        await productStore.create(defaultProduct3)
        await productStore.create(defaultProduct4)
        await productStore.create(defaultProduct5)
        await productStore.create(defaultProduct6)

        await orderStore.addProduct(defaultOrderProduct1.id,defaultOrderProduct1.order_id,defaultOrderProduct1.product_id,defaultOrderProduct1.quantity)
        await orderStore.addProduct(defaultOrderProduct2.id,defaultOrderProduct2.order_id,defaultOrderProduct2.product_id,defaultOrderProduct2.quantity)
        await orderStore.addProduct(defaultOrderProduct3.id,defaultOrderProduct3.order_id,defaultOrderProduct3.product_id,defaultOrderProduct3.quantity)
        await orderStore.addProduct(defaultOrderProduct4.id,defaultOrderProduct4.order_id,defaultOrderProduct4.product_id,defaultOrderProduct4.quantity)
        await orderStore.addProduct(defaultOrderProduct5.id,defaultOrderProduct5.order_id,defaultOrderProduct5.product_id,defaultOrderProduct5.quantity)
        await orderStore.addProduct(defaultOrderProduct6.id,defaultOrderProduct6.order_id,defaultOrderProduct6.product_id,defaultOrderProduct6.quantity)
    })

    afterAll(async () => {
        const sql = 'DELETE FROM order_products;DELETE FROM orders;DELETE FROM users;DELETE FROM products;'
        const conn = await client.connect()
        await conn.query(sql)
        conn.release()
    })


    it('Get top 5 Products',async()=>{
        const response = await request.get('/productsServices/top5')
        expect(response.status).toBe(200)
    })

})