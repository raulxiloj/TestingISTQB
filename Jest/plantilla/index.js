const app = require('./src/app');

const mongoose = require('mongoose');

const start = async () => {

    try {
        await mongoose.connect('mongodb+srv://sa-user:sa1234@cluster0.l395j.mongodb.net/tesis?retryWrites=true&w=majority');
        console.log('Connected to MongoDB');
    }catch(err) {
        console.log('ERROR: '+err)
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000')
    });
}

start();