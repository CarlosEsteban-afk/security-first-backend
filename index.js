require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const cors = require('cors');

const authRoutes = require("./src/routes/authRoutes");

const app = express();

// Conectar a la base de datos
//  connectDB();

// Middlewares
app.use(express.json());

app.use(cors());


app.use('/auth', authRoutes);




// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\nServidor escuchando en el puerto ${PORT}`);
  module.exports = app;
});
