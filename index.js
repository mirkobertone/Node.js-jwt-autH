const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

//Import Routes Endpoints
const authRoute = require('./routes/auth');

//Connect to MongoDB Cluster
mongoose
  .connect(process.env.DB_CONNECTION_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB Connected!'))
  .catch(err => {
    console.log('DB Connection Error: ${err.message}');
  });

//Middleware ---- You must make sure that you define all configurations BEFORE defining routes
app.use(express.json());

//Route middleware
//Nella URL ogni endpoint di auth.js sarò preceduto da /api/user
app.use('/api/user', authRoute);

app.listen(3000, () => console.log('Server running...'));
