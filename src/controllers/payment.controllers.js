import Stripe from "stripe";
import config from "../config/config.js";
import {
    getByEmail,
} from "../services/views.router.services.js";
import { cartsModelFindByIdPopulate } from "../services/cart.services.js";
import axios from "axios";
const keyStripe = config.key_stripe;
const stripe = new Stripe(keyStripe);
import TicketServices from "../DAO/TicketsDAO.js";
const ticketDao = new TicketServices()
const PORT = config.port

export const createSession = async (req, res) => {
    const email = req.session.emailUser && typeof req.session.emailUser === 'object' ? req.session.emailUser.email : req.session.emailUser;
    const findEmail = await getByEmail(email);
    const cartId = findEmail.cart;
    const carrito = await cartsModelFindByIdPopulate(cartId);
    const datos = carrito.products.map(item => ({
        quantity: item.quantity,
        title: item.product.title,
        precio: item.product.price
    }));
    let cart = [];
    for (const datitos of datos) {
        cart.push(datitos);
    }
    const cartID = findEmail.cart

    try {
        const line_items = cart.map(item => {
            return {
                price_data: {
                    product_data: {
                        name: item.title
                    },
                    currency: "usd",
                    unit_amount: item.precio * 100,
                },
                quantity: item.quantity
            };
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            // success_url: `http://localhost:${PORT}/success`,
            // cancel_url: `http://localhost:${PORT}/error`
            success_url: `http://back-end-desafio1-lucascabral-production.up.railway.app/success`,
            cancel_url: `http://back-end-desafio1-lucascabral-production.up.railway.app/error`
        });


        req.session.compraHecha = true
        res.redirect(session.url)
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export const cancel = async (req, res) => {
    res.render("cancel")
}

export const successfulPurchase = async (req, res) => {
    try {
        const purchaser = req.session.emailUser && typeof req.session.emailUser === 'object' ? req.session.emailUser.email : req.session.emailUser;
        const findUser = await getByEmail(purchaser);
        const idCart = findUser.cart;
        const amount = req.session.sessionDataPurchase[8];

        if (!purchaser || !amount) {
            res.send("Todos los campos son obligatorios");
            console.log("Todos los campos son obligatorios");
        } else {
            const generatedTicket = await ticketDao.addTickets(amount, purchaser);
            req.session.generatedTicket = generatedTicket;
        }

        await axios.post(`http://localhost:8080/cart/${idCart}/buy`);

        const response = await fetch(`/cart/${idCart}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ purchaser, amount }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            res.send("Hola, millonario");
        } else {
            console.error(`Error en la solicitud POST: ${response.status}`);
            res.redirect("/completed/purchase");
        }
    } catch (error) {
        console.error(error);
        res.redirect("/completed/purchase");
    }
};
