require('dotenv').config();
const express = require('express');
const app = express();


require('./scheduler');


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));


app.use('/', require('./routes/parcels'));


app.listen(3000, () => console.log('Server running :3000'));