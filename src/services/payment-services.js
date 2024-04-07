import Stripe from 'stripe'
import config from '../config/config.js'

const {SECRETKEY}=config

export default class PaymentService {
    constructor() {
        this.stripe = new Stripe(SECRETKEY)
    }

    createPaymentIntent = async(data) => {
        const paymentIntent = await this.stripe.paymentIntents.create(data)
        return paymentIntent
    }
}