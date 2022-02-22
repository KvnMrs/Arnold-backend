require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');

const cors = require('cors');

const CronJob = require('cron').CronJob;

const path = require('path');

const port = process.env.PORT || 5000;

const app = express();

const pool = require('./db-config');


const { setupRoutes } = require('./routes');

const corsOptions = {
  origin: ['https://arnold.herokuapp.com','http://localhost:3000'],
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
  preflightContinue: false,
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors(corsOptions),
);


setupRoutes(app);

const job = new CronJob('*/30 * * * *', function () {
  pool
    .query(
      "UPDATE reports SET active = false WHERE time <= (NOW() - INTERVAL '30 minutes')"
    )
    .then((results) => console.log(results));
});
job.start();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
