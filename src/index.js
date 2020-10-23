require('dotenv').config();
const express = require('express');
//Express è integrato con *.ejs*, quindi dopo l'install non c'è bisogno di richierdo ( require)
const path = require('path');
const multer = require('multer');
const uuid = require('uuid/v4');
const cors = require('cors');

//Start
const app = express();
require('./db');

//Settings
app.set('port', 4002);
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// Middlewares (Codice eseguito prima delle Routes)
app.use(cors());

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname)
        .toLowerCase());
    }
});

app.use(multer({
    storage,
    dest: path.join(__dirname, 'public/uploads'),
    limits: {fileSize: 1000000},
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Error: Archivo debe ser una imagen valida');
    }
}).single('image'));

//Routes
app.use(require('./routes/index.routes'));

//Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('*',  (req, res)=> {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
   });

//Start Server
app.listen(app.get('port'), () => {
    console.log(`Server on port: ${app.get('port')}`);
});