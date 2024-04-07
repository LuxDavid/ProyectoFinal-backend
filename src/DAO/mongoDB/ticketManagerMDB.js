import {userModel} from "./models/userModel.js"
import { cartModel } from "./models/cartModel.js";
import {ticketModel} from './models/ticketModel.js';
import CartManagerDB from "./cartManagerMDB.js";
import ProductManagerMDB from "./productManagerMDB.js";

function generarCode() {
  const caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let resultado = '';

  for (let i = 0; i < 10; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    resultado += caracteres.charAt(indiceAleatorio);
  }

  return resultado;
}

class TicketManager{

async createTicket(cid, user){

    try {

        const cartsDB= new CartManagerDB()
        const productsDB= new ProductManagerMDB()

        const cartSearch = await cartModel.findOne({ userCart: cid.userCart });
        const clientSearch = await userModel.findOne({ email: user.email });

        let totalPurchase=0;
        let purchasedProducts=[];
        let rejectedProducts=[];

        for(let product of cartSearch.products){

            let quantity= product.quantity;
            let productInCart= product.product

            let productMDB= await productsDB.getProductById(productInCart._id.toString())

            let stock= productMDB.stock
            let price= productMDB.price

            if(quantity <= stock){
                let newStock= stock - quantity
                let updatedStock= {stock: newStock}
                const stockDB= await productsDB.updateProduct(productInCart._id.toString(), updatedStock)

                totalPurchase+= quantity*price
                purchasedProducts.push(product);
            } else{
                rejectedProducts.push(product)
            }
}

const miString = generarCode();

if(totalPurchase > 0 ){

    let ticket= {
        code:miString,
        purchase_dateTime: new Date(),
        amount: totalPurchase,
        purchaserEmail:clientSearch.email,
        purchaser:clientSearch.name
    }

    const result= await cartsDB.overwriteCart(cid.userCart, rejectedProducts);
    const FinalTicket= await ticketModel.create(ticket);

    return FinalTicket
}
    } catch (error) {

        return error;
    }

}

}

export default TicketManager