const UsersRouter = require('./users');
const ReportsRouter = require('./reports');
const authRouter = require('./auth');


const setupRoutes = (app) => {
  app.use('/users', UsersRouter)
  app.use('/reports', ReportsRouter)
  app.use('/auth', authRouter)
}

module.exports = { setupRoutes }