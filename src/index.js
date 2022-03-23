const express = require('express');
var bodyParser = require('body-parser');

const route = require('./routes/route.js');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://arnabbiswas_14:arnabbiswas@cluster0.b95gv.mongodb.net/group-9-Database?retryWrites=true&w=majority", {useNewUrlParser: true , useUnifiedTopology: true,useCreateIndex: true,useFindAndModify: false})
    .then(() => console.log('mongodb running on 27017'))
    .catch(err => console.log(err))

app.use('/functionup', route);

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});


 