const jwt = require('jsonwebtoken');
require('dotenv').config();
//TODO mettre private key dans heroku
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const calculateToken = (userEmail = "", uuidusers) => {
  return jwt.sign({ email: userEmail, uuid: uuidusers }, PRIVATE_KEY)
}
const checkJwtAuth = (token) => {
  return jwt.verify(token, PRIVATE_KEY)
}

module.exports = { calculateToken, checkJwtAuth };
