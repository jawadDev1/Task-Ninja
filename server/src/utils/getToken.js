import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const getToken = (_id) => {
  const payload = {
    _id,
  };

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '365d'});
};

export {getToken};
