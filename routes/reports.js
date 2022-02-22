const reportsRouter = require('express').Router();
const query = require('express/lib/middleware/query');
// const { checkAuth } = require('../middleware/users');
const Report = require('../models/reports');
const { checkAuth } = require('../middleware/users');

// Récupération de tous les reports
reportsRouter.get('/',  (req, res) => {
  const { y_bottom, y_top, x_left, x_right } = req.query;
  Report.findMany(y_bottom, y_top, x_left, x_right)
    .then((reports) => {
      res.status(200).json(reports.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Error retrieving reports from databases');
    });
});

reportsRouter.get('/categories', (req, res) => {
  Report.findCategories()
    .then((reports) => {
      res.json(reports.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Error retrieving reports from databases');
    });
});

// Récupération d'un seul report
reportsRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  Report.findOne(id)
    .then((reports) => {
      res.json(reports.rows);
    })
    .catch((err) => {
      res.status(401).send('Error retrieving report from databases');
    });
});

// Ajout d'un report
reportsRouter.post('/', (req, res) => {
  const { niveau, lat, lng, type_id, color, uuid } = req.body;
  Report.create(niveau, lat, lng, type_id, color, uuid)
    .then((reports) => {
      if (reports.rows[0])
        res.status(201).send({ success: 'msg', data: reports.insertId });
      else res.status(500).send('Error saving the report');
    })
    .catch((err) => {
      console.error(err.message);
      res.send('Error saving the report');
    });
});

// Suppression d'un report
reportsRouter.delete('/:id',(req, res) => {
  const { id } = req.params;
  Report.deleteOne(id)
    .then((reports) => {
      res.send({ success: 'report deleted successfully', data: reports.rows });
    })
    .catch((err) => {
      console.error(err.message);
      res.send('Error delete the report');
    });
});

// Desactivation d'un report
reportsRouter.put('/desactive/:id', (req, res) => {
  const { id } = req.params;
  Report.desactiveReport(id)
    .then((reports) => {
      res.send({ success: 'report updated successfully', data: reports.rows });
    })
    .catch((err) => {
      console.error(err.message);
      res.send('Error updating the report');
    });
});

// Desactivation d'un report par confirmation X2
reportsRouter.put('/clicked/:id', async (req, res) => {
  const { id } = req.params;
  // Recuperer le nombre de click en cour pour un report
  const nbClickReport = await Report.getClickForReport(id);

  // SI LE NOMBRE DE CLIK EST INFERIEUR A 1 INCREMENTER
  if (nbClickReport.rows[0].clicked < 1) {
    Report.updateClickReport(id, nbClickReport.rows[0].clicked + 1);
    return res.status(200).send(`update clicked ok for report ${id}`);
  }
  // SINON DESACTIVER LE REPORT PAR SON ID
  Report.updateClickReport(id, nbClickReport.rows[0].clicked + 1);
  Report.desactiveEverySelectedTime(id)
    .then((reports) => {
      res.send({
        success: 'report deleted successfully',
        data: reports.rows,
      });
    })
    .catch((err) => {
      console.error(err.message);
      res.send('Error updating the report');
    });
});

// Actualisation d'un report
reportsRouter.put('/update/:id', (req, res) => {
  const { id } = req.params;
  Report.updateReport(id)
    .then((reports) => {
      res.send({ success: 'report updated successfully', data: reports.rows });
    })
    .catch((err) => {
      console.error(err.message);
      res.send('Error updating the report');
    });
});

// Desactivation de tt les reports en fct du Timestamp
reportsRouter.put('/autodesactive', (req, res) => {
  Report.desactiveEverySelectedTime()
    .then((reports) => {
      res.send({ success: 'reports updated successfully' });
    })
    .catch((err) => {
      console.error(err);
      res.send('Error updating the report');
    });
});

// Suppression de tt les rapports
reportsRouter.delete('/deleteAllinactive', (req, res) => {
  Report.deleteDesactive()
    .then((reports) => {
      res.send({ success: 'report deleted successfully', data: reports.rows });
    })
    .catch((err) => {
      console.error(err.message);
      res.send('Error delete the report');
    });
});

module.exports = reportsRouter;
