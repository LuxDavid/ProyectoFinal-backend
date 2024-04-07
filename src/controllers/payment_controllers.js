import PaymentService from '../services/payment-services.js'
import { CartRepository } from '../services/index.js';

export const cartToPay= async (req, res) => {

  const {user}= req.user;
  const cartFound = await CartRepository.getCartById(user._id);
  let totalAmount=0;

  for (const iterator of cartFound.products) {
    totalAmount += iterator.product.price * iterator.quantity
  }

const stripe = new PaymentService()

  try {
    const charge = {
      amount: totalAmount * 100,
      currency: 'mxn',
      description: 'Descripción del producto o servicio',
      payment_method_types: ['card'],
    };

    const result = await stripe.createPaymentIntent(charge);

    res.status(200).json(result)
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    res.status(500).send('Error al procesar el pago');
  }

}

