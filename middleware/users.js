const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const Users = require('../models/user');
const saltRound = 10;
const userHelper = require('../helpers/users');

/**
 * pour le sign in : hash du mot de passe avec bcrypt
 */
const hashedPassword = (req, res, next) => {
  bcrypt
    .hash(req.body.password, saltRound)
    .then((hash) => {
      delete req.body.password;
      //spécificité pour update Mot de passe;
      if (req.body.oldPassword) {
        req.body.password = req.body.oldPassword;
      }
      req.body = { ...req.body, hashedPassword: hash };
      next();
    })
    .catch(() => {
      res.status(500).send('Error encoding the password');
    });
};

/**
 * créer un faux id
 */
const createUuid = (req, res, next) => {
  const uuidusers = uuidv4();
  req.body = { ...req.body, uuidusers };
  next();
};

/**
 * pour le login : vérifie le mot de passe
 */
const checkPassword = (req, res, next) => {
  Users.findOneByEmail(req.body.email)
    .then((user) => {
      bcrypt
        .compare(req.body.password, user.hashedpassword)
        .then((result) => {
          if (result) {
            req.body = user;
            //if (!req.body.oldPassword) delete req.body.hashedpassword; //spécificité update password
            delete req.body.id;
            next();
          } else {
            res.status(404).json({ msg: 'Invalid Credentials' });
          }
        })
        .catch((err) => res.status(404).json({ msg: 'error' }));
    })
    .catch((err) => res.status(404).json({ msg: 'Invalid Credentials' }));
};

/**
 * verifie les champs du formulaire (email et mot de passe)
 */
const checkUserFields = (req, res, next) => {
  const error = Joi.object({
    email: Joi.string().email().presence('required'),
    password: Joi.string()
      .max(255)
      .pattern(
        new RegExp(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^ws]|[_])).{8,}$'
        )
      )
      .presence('required'),
  }).validate(req.body, { abortEarly: false }).error;

  if (error) {
    res.status(401).json({ msg: 'Fields are not valids' });
  } else {
    next();
  }
};

/**
 * vérification cookie + role
 */
const checkAuth = (req, res, next) => {
  if (req.headers.user_token) {
    const auth = userHelper.checkJwtAuth(req.headers.user_token);
    if (auth) {
      Users.findOneByEmail(auth.email)
        .then((user) => {
          if (user.uuidusers === auth.uuid) {
            if (req.body.oldPassword) {
              req.body.email = auth.email;
              req.uuidusers = user.uuidusers;
            }
            next();
          } else res.status(401).json({ msg: 'Unauthorized Path 1' });
        })
        .catch((err) => res.status(500).json({ msg: 'Error retrieving data' }));
    } else {
      res.status(401).json({ msg: 'Unauthorized Path 2' });
    }
  } else {
    res.status(401).json({ msg: 'Unauthorized Path 3' });
  }
};

module.exports = {
  hashedPassword,
  checkAuth,
  createUuid,
  checkPassword,
  checkUserFields,
};
