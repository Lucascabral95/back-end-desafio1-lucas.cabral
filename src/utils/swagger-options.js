export const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación del ecommerce del curso de Backend de Coderhouse",
            description: "API pensada para comprender las logicas, schemas y breakpoints de este ecommerce"
        }
    },
    apis: [`src/docs/**/*.yaml`]
}