// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
const errorMiddleware = require('./middleware/errorMiddleware');


const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/simulation', require('./routes/simulationRoutes'));
app.use("/api/simulation", require("./routes/simulationRoutes"));


app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
