const pool = require('../db-config');

/**
 * recupération user par adresse email (login)
 */
const findOneByEmail = (email) => {
  return pool
    .query('SELECT * FROM users WHERE email = $1', [email])
    .then((result) => result.rows[0]);
};

/**
 * création d'un nouveau user (signin)
 */
const create = ({ email, hashedPassword, uuidusers }) => {
  return pool
    .query(
      'INSERT INTO users (email, hashedPassword, uuidusers) VALUES($1,$2,$3) RETURNING *',
      [email, hashedPassword, uuidusers]
    )
    .then(() => {
      return { email, uuidusers };
    });
};
/**
 * update user (changement mot de passe)
 */
const updateUser = (body, uuidusers) => {
  return pool
    .query('UPDATE users SET hashedpassword = $1 WHERE uuidusers = $2', [body.hashedPassword, uuidusers])
    .then(() => {
      return console.log('updated');
    })
    .catch((err) => console.log(err));
};

/**
 * suppression d'un user (desinscription du user de l'application)
 */
const deleteUser = (id) => {
  return pool
    .query('DELETE FROM users WHERE id = $1', [id])
    .then(() => 'user deleter successfully');
};

/**
 * vérification que l'utilisateur existe
 */

const isExistingUuiduser = (uuiduser) => {
  return pool
    .query('SELECT * FROM users WHERE uuidusers = $1', [uuiduser])
    .then((result) => result.rows.length > 0);
};

/**
 * recupération safearea par l'uuid
 */
const getSafeAreaUser = (uuid) => {
  return pool
    .query('SELECT safearea FROM users WHERE uuidusers = $1', [uuid])
    .then((results) => results);
};

/**
 * mise à jour de safeArea pour un utilisateur
 */
const updateSafeArea = (newArea, uuiduser) => {
  return pool
    .query('UPDATE users SET safearea = $1 WHERE uuidusers = $2', [
      newArea,
      uuiduser,
    ])
    .then(() => 'safeArea updated successfully')
    .catch(() => 'Error update safeArea');
};

/**
 * Mise à jour du booleen tutorialdone pour un utilisateur
 */
const tutorialdone = (uuid) => {
  return pool
    .query('UPDATE users SET tutorialdone = true WHERE uuidusers = $1', [uuid])
    .then((result) => result);
};

module.exports = {
  getSafeAreaUser,
  findOneByEmail,
  create,
  updateUser,
  deleteUser,
  updateSafeArea,
  isExistingUuiduser,
  tutorialdone,
};
