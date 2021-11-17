const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.post('/api/users/registro', async (req, res) => {

    if (!req.body.nombre || !req.body.correo || !req.body.password) {
        return res.status(400).json({msg: 'No se reciben los parametros'})
    }

    if (req.body.password.length < 6) {
        return res.status(400).json({msg: 'La contrasena debe de ser de 6 caracteres minimo'})
    } 

    const { correo } = req.body;

    const existingUser = await User.findOne({ correo  })

    if (existingUser)
        return res.status(400).json({msg: 'Ya existe un usuario con ese correo'})
    

    const user = new User(req.body);

    await user.save();

    res.status(201).json({
        msg: 'Usuario registrado con exito'
    });

});

module.exports = { registroRouter: router };