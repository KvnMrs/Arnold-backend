const pool = require('../db-config');

const findMany = (y_bottom, y_top, x_left, x_right) => {
  return pool
    .query(
      'SELECT reports.id,niveau,lat,lng,time,types,src,alt,clicked,uuid FROM reports INNER JOIN categories ON reports.type_id=categories.id WHERE active=true AND lat BETWEEN $1 - 0.012 AND $2 + 0.012 AND lng BETWEEN $3 - 0.016 AND $4 + 0.016',
      [y_bottom, y_top, x_left, x_right]
    )
    .then((results) => results);
};

/**
 * récupération de tous les catégories
 */
const findCategories = () => {
  return pool.query('SELECT * FROM categories ').then((results) => results);
};

const desactiveEverySelectedTime = () => {
  return pool
    .query('UPDATE reports SET active = false WHERE clicked > 1')
    .then((results) => results);
};

/**
 * récupération d'un seul report'
 */
const findOne = (id) => {
  return pool
    .query('SELECT * FROM reports WHERE id = $1', [id])
    .then((results) => results);
};

/**
 * Création d'un seul report'
 */
const create = (niveau, lat, lng, type_id, color, uuid) => {
  return pool
    .query(
      'INSERT INTO reports(niveau, lat, lng,color,type_id, uuid) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [niveau, lat, lng, color, type_id, uuid]
    )
    .then((result) => result);
};

const desactiveReport = (id, clicked) => {
  return pool
    .query('UPDATE reports SET active = false WHERE id = $1', [id, clicked])
    .then((result) => result);
};
/**
 * Réactualisation du time du report'
 */
const updateReport = (id) => {
  return pool
    .query('UPDATE reports SET time = now() WHERE id = $1', [id])
    .then((result) => result);
};

/**
 * Récupération de la colonne clicked d'un report'
 */
const getClickForReport = (id) => {
  return pool
    .query('SELECT clicked FROM reports WHERE id = $1', [id])
    .then((result) => result);
};

/**
 * Modification de la colonne clicked d'un report'
 */
const updateClickReport = (id, newValue) => {
  return pool
    .query('UPDATE reports SET clicked = $2 WHERE id = $1', [id, newValue])
    .then((result) => result);
};

/**
 *Suppression d'un report'
 */
const deleteOne = (id) => {
  return pool
    .query('DELETE FROM reports WHERE id = $1', [id])
    .then(() => 'Report deleter successfully');
};

module.exports = {
  findMany,
  findOne,
  create,
  deleteOne,
  desactiveReport,
  updateReport,
  desactiveEverySelectedTime,
  findCategories,
  getClickForReport,
  updateClickReport,
};
