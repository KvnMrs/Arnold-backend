const usersRouter = require('express').Router();
const User = require('../models/user');
const {
  checkAuth,
  checkUserFields,
  hashedPassword,
  createUuid,
  checkPassword,
} = require('../middleware/users');

/**
 * dev : route put pour modifier le mot de passe du user
 */
usersRouter.put('/updatePassword', checkAuth, hashedPassword, (req, res) => {
  User.updateUser(req.body, req.uuidusers)
    .then((user) => {
      res.status(201).send('Update password ok');
    })
    .catch((err) => {
      res.status(418).send('Error updating user password in database');
    });
});

/**
 * dev : route get pour recupération safeArea par uuid
 */
usersRouter.get('/safearea/:uuid', (req, res) => {
  const uuid = req.params.uuid;
  User.getSafeAreaUser(uuid)
    .then((user) => {
      res.json(user.rows[0]);
    })
    .catch((err) => {
      res.status(401).send('Error retrieving user from database');
    });
});

/**
 * route post : creation d'un nouveau user (signin)
 */
usersRouter.post(
  '/signin',
  checkUserFields,
  hashedPassword,
  createUuid,
  (req, res) => {
    User.create(req.body)
      .then((result) => {
        delete req.body.hashedPassword;
        res.status(201).json({ user: req.body });
      })
      .catch((err) => res.status(401).json({ msg: err }));
  }
);

usersRouter.put('/update/safearea', (req, res) => {
  const { safearea, uuiduser } = req.body;

  if (!safearea) {
    return res.status(400).send("The parameter 'safearea' needed");
  }
  if (!uuiduser) {
    return res.status(400).send("The parameter 'uuiduser' needed");
  }
  // Si l'utilisateur n'existe pas, retourner une erreur:
  const isValidUser = User.isExistingUuiduser(uuiduser);
  if (!isValidUser) {
    return res.status(403).send('User not found/exist');
  }
  // Appliquer le changement en base de données en utilisant le "models":
  // TODO: géré le cas ou l'update ne se fait pas
  User.updateSafeArea(safearea, uuiduser);
  // retourner un code 200 et un message de succès
  res.end();
});

// Passage du booleen a true pour sauter le tutorial apres la 1ere utilisation
usersRouter.put('/tutorialdone/:uuid', (req, res) => {
  const { uuid } = req.params;
  User.tutorialdone(uuid)
    .then((users) => {
      res.send({ success: 'user updated successfully', data: users.rows });
    })
    .catch((err) => {
      console.error(err.message);
      res.send('Error updating the user');
    });
});

module.exports = usersRouter;
