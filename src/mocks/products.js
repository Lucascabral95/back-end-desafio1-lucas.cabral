import { faker } from "@faker-js/faker"

export const generatorProduct = () => {
    return {
        product: faker.commerce.product(),
        price: faker.commerce.price({max: 500}),
        color: faker.vehicle.color()
    }
}

export const generatorProducts = (number) => {
    const products = []

    for (let i = 1; i <= number; i++) {
         products.push(generatorProduct())
    }
    return products
} 