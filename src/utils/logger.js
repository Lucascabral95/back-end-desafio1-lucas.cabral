import winston from "winston";
import config from "../config/config.js";

const customLevelsOption = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4,
    },
    colors: {
        fatal: "red",
        error: "orange",
        warning: "yellow",
        info: "blue",
        debug: "white"
    }
}

let logger;
let LOGGER_ENV = config.loggers;

// ESTO ES PARA DESARROLLO
const buildDevLogger = () => {
    const logger = winston.createLogger({
        levels: customLevelsOption.levels,
        transports: [
            new winston.transports.Console({
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelsOption.colors }),
                    winston.format.simple()
                )
            })
        ]
    });
    return logger
}

// ESTO ES PARA PRODUCCION
const buildProdLogger = () => {
    const logger = winston.createLogger({
        levels: customLevelsOption.levels,
        transports: [
            new winston.transports.Console({
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelsOption.colors }),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                filename: "./errors.log",
                level: "error",
                format: winston.format.simple()
            }),
        ]
    });
    return logger
}

// ESTE ES EL CONDICIONAL QUE DEFINE CUAL ENTORNO MANEJAR
if (LOGGER_ENV === "desarrollo") {
    logger = buildDevLogger()
} else {
    logger = buildProdLogger()
}

// EXPORTAMOS EL MIDDLEWARE
export const addLogger = (req, res, next) => {
    req.logger = logger;
    next();
};