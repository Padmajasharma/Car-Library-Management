const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();

const dbConfig = require("./config/dbConfig");
dbConfig();

const userRoute = require('./routes/userRoute');
const carRoute = require('./routes/carRoute');
const docRoute = require('./routes/docRoute');

const app = express();

app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials: true, 
  optionsSuccessStatus: 200 
}));
// app.use(cors());


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use('/api/', 
    userRoute,
    carRoute,
    docRoute
);

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
module.exports = app;