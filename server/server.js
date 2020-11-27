const express = require('express');
const mongoose = require('mongoose');

const path = require('path')

const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
require('./config/config');

app.use(bodyParser.json());

//configuración global de rutas
app.use(require('./routes/index'));

//habilitar la carpeta public

app.use(express.static(path.resolve(__dirname, '../public')));



mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) {
        throw err;

    }
    console.log('Base de Datos online');

});


app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto,${process.env.PORT}`);
})