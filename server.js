var express = require('express');
var bodyParser = require('body-parser');
var util = require('util');
var morgan = require('morgan');
var busboy = require('connect-busboy');	
var Utility = require('./Utility.js')
var mongoose = require('mongoose');
var config = require('./config');
var base58 = require('./base58.js');
var Url = require('./models/url');
var app = express();


var apiRoutes = express.Router();

//for reading json formatted input
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({  extended: true  }));

//for reading multipart/form-data
app.use(busboy());

// For Logging
app.use(morgan('dev'));

mongoose.connect(config.db.url,function(err){
    if(err)
        console.log(err);
    else {
        console.log('database connected');
    }
});
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


app.get('/:encoded_id', function(req, res){
  var base58Id = req.params.encoded_id;
  var id = base58.decode(base58Id);

  // check if url already exists in database
  Url.findOne({$or: [ { _id: id } , { key: base58Id } ]}, function (err, doc){
    if (doc) {
      // found an entry in the DB, redirect the user to their destination
      res.redirect(doc.long_url);
    } else {
      // nothing found, take 'em home
      res.redirect(config.webhost);
    }
  });

});


app.use('/api', apiRoutes);
app.use(express.static('./'));
var server = app.listen(config.port, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
