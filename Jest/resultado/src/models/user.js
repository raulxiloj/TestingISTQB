const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: String,
    correo: String,
    password: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;