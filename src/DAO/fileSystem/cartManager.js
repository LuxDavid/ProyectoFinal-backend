import fs from 'fs';
import ProductManager from './productManager.js'

class CartManager{

constructor(path='./carrito.json'){
    this.path=path
}

//-------------------------------------------------------------------------------------
async getCarts() {

    try {
        const carts = await fs.promises.readFile(this.path, 'utf-8');
        return JSON.parse(carts);

    } catch (error) {
        return [];
    }
}
//-------------------------------------------------------------------------------------
async createCart(){

    const carts = await this.getCarts();

    const cartsLength = carts.length;

    const newCart={
        
    id: cartsLength > 0 ? carts[cartsLength - 1].id + 1 : 1,
    products:[]
    }

    carts.push(newCart);

    try {
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    }
    catch (error) {
        return error
    }
}

//-------------------------------------------------------------------------------------
  async getCartById(id) {

    const cartList= await this.getCarts();

    const search = cartList.find(cart=> cart.id === parseInt(id))

    return search
}

//-------------------------------------------------------------------------------------

async addProductCart(cid,pid){

const products= new ProductManager('./products.json');

try{ 
    const cartList= await this.getCarts();
    const carrito = cartList.find(cart => cart.id === parseInt(cid))
    const prod = await products.getProductById(parseInt(pid));

    if(!prod) return 'Producto not found'
    if(!carrito) return 'Carrito not found'

    const product = carrito.products.find(p => p.pid === parseInt(pid) );

    if(!product) {
        carrito.products.push({pid: parseInt(pid), quantity: 1});
    } 
        
    if(product){
        product.quantity ++;
    }

    await fs.promises.writeFile(this.path, JSON.stringify(cartList, null, '\t'))
    return 'Se agrego el producto correctamente'
} catch (error) {
    return error
}

}

    //--------------------------------------------------------------------------
    async deletProductCart(cid, pid) {

        const products = new ProductManager('./products.json');

        try {

            const cartList= await this.getCarts();

            const carrito = cartList.find(cart => cart.id === parseInt(cid))

            const prod = await products.getProductById(parseInt(pid));

            if (!prod) return 'Producto not found'
            if (!carrito) return 'Carrito not found'

            const product = carrito.products.findIndex(p => p.pid === parseInt(pid) );

            if (product === -1) return 'Cart not found'

            carrito.products.splice(product, 1);

            await fs.promises.writeFile(this.path, JSON.stringify(cartList, null, '\t'))
            return 'Se Elimino el producto correctamente'

        } catch (error) {
            return error
        }
    }

     //--------------------------------------------------------------------------

     async overwriteCart(cid, newProds){

        try {

            const cartList= await this.getCarts();

            const carrito = cartList.find(cart => cart.id === parseInt(cid))

            const prods = newProds;

            carrito.products=prods

            await fs.promises.writeFile(this.path, JSON.stringify(cartList, null, '\t'))
            return 'Se sobrescribio el producto correctamente'

        } catch (error) {
            return error
        }

    }

      //--------------------------------------------------------------------------

      async uptadeQuantity(cid,pid,newQuantity){

        const products = new ProductManager('./products.json');

        try {

            
            const cartList= await this.getCarts();

            const carrito = cartList.find(cart => cart.id === parseInt(cid))

            const prod = await products.getProductById(parseInt(pid));

            if (!prod) return 'Producto not found'
            if (!carrito) return 'Carrito not found'

            const product = carrito.products.find(p => p.pid === parseInt(pid));

            if (!product) {
                return 'Product not found'
            }

            if (product) {
                product.quantity= newQuantity;
            }

            await fs.promises.writeFile(this.path, JSON.stringify(cartList, null, '\t'))
            return 'Quantity updated'
            
        } catch (error) {
            return error
        }
    }

    //--------------------------------------------------------------------------

    async deletCart(cid){

        try {
            const cartList= await this.getCarts();

            const carrito = cartList.find(cart => cart.id === parseInt(cid))

            if (!carrito) return 'Carrito not found'

            carrito.products=[];

            await fs.promises.writeFile(this.path, JSON.stringify(cartList, null, '\t'))
            return 'Cart Deleted'

        } catch (error) {
            return error
        }
     }

}

export default CartManager