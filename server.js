var express = require('express');
var bodyParser = require('body-parser');
var util = require('util');
var morgan = require('morgan');
var busboy = require('connect-busboy');	
var Utility = require('./Utility.js')
var app = express();


var apiRoutes = express.Router();

//for reading json formatted input
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({  extended: true  }));

//for reading multipart/form-data
app.use(busboy());

// For Logging
app.use(morgan('dev'));


//Api Routes

apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});



//Api for Compressing image passed as url
apiRoutes.post('/imageCompress', Utility.imageCompress )

//Api for Compressing images passed in a list of urls
apiRoutes.post('/listImagesCompress', Utility.listImagesCompress)

//Api for compressing the images from urls in csv file
apiRoutes.post('/csvImagesCompress', Utility.csvImagesCompress)

//Api for compressing the image from file
apiRoutes.post('/imageDataCompress', Utility.imageDataCompress)



app.use('/api', apiRoutes);
app.use(express.static('./'));
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
