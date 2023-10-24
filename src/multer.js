import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer"

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

// multer para fotos de perfil
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/public/documents/profiles`)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const uploader = multer({ storage })

// multer para fotos de productos
const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/public/documents/products`);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const productUploader = multer({ storage: productStorage });
