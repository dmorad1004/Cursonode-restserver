




//===================================================
// puerto
//===================================================

process.env.PORT = process.env.PORT || 3000;

//===================================================
// entorno
//===================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================================================
// Vencimiento del toquen
//===================================================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30; // 60 SEGUNDOS 60 MINUTOS 24 HORAS 30 DÍAS 

//===================================================
// seed de autenticación
//===================================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarollo';

//===================================================
// base de datos
//===================================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}



process.env.URLDB = urlDB;

//===================================================
// Google Cliente ID
//===================================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '796535784606-ah6o801drnibt79ru9lsn6mnarkp59hi.apps.googleusercontent.com';