const authRouter = require('express').Router();
const { calculateToken } = require('../helpers/users');
const { checkPassword } = require('../middleware/users');

authRouter.post('/login', checkPassword, (req, res) => {
  res.status(201)
    .json({ ...req.body, token: calculateToken(req.body.email, req.body.uuidusers) })
})

module.exports = authRouter;