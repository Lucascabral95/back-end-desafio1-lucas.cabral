import EErrors from "../../services/errors/enums.js";

export default (error, req, res, next) => {
  console.log(error.cause);
  switch (error.code) {
    case EErrors.INVALID_TYPES:
      res.status(400).send({ status: "error", error: error.name });
      break;
    case EErrors.INCOMPLETE_FIELDS:
      res.status(400).send({ status: "error", error: error.name });
      break;
    case EErrors.TICKET_ERROR:
      res.status(400).send({ status: "error", error: error.name });
      break;
    case EErrors.ADDTOCART_ERROR:
      res.status(400).send({ status: "error", error: error.name });
      break;
    case EErrors.GENERATECART_ERROR:
      res.status(400).send({ status: "error", error: error.name });
      break;
    default:
      res.status(500).send({ status: "error", error: "Unhandled error" });
  }
};