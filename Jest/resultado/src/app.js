const express = require('express');

const { registroRouter } = require('../src/routes/registro') 

const app = express();

app.use(express.json());

//Rutas
app.use(registroRouter)

module.exports = app;