const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');


const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));

//configurara las sesiones
app.use(
    session({
    secret:"Shancai",
    resave: false,
    saveUninitialized:false
    })
);

/**Crgar las rutas que se utilizaran en el proyecto**/

app.use('/',require('./routes/router'));



app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});


app.listen(PORT, ()=>{
    console.log('El servidor esta corriendo en http://localhost:'+ PORT)
})