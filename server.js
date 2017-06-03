var express = require('express');
var bodyParser = require('body-parser');
var util = require('util');
var morgan = require('morgan');
var request = require('request');
var gm = require('gm');
var busboy = require('connect-busboy');	
var csv = require("fast-csv");
var app = express();


var apiRoutes = express.Router();

//for reading json formatted input
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({  extended: true  }));

//for reading multipart/form-data
app.use(busboy());
// For Logging
app.use(morgan('dev'));

app.use(express.static('img'));

//Api Routes

apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});



//Api for Compressing image passed as url
apiRoutes.post('/imageCompress', function (req, res) {
	
	var uri = req.body.imageUrl;
	if(!uri){
		return res.json({ success: false, message: 'Invalid Parameters' });
	}
	else{
		var i = uri.lastIndexOf("/");
		var j = uri.lastIndexOf(".");
		var link = "img/" + uri.substring(i+1,j) + ".jpg" ;

		//compressing image utility called
		resizing(uri, link, function(err){
			if(err)
				return res.json({ success: false, message: 'Invalid Parameters' });
			else
				return res.json({ success: true, OutputUrl: "localhost:8081/"+link });
		});
		
	}
    
	
})

//Api for Compressing images passed in a list of urls
apiRoutes.post('/listImagesCompress', function (req, res) {
	
	var uri = req.body.imageUrls;
	// var fileName = req.body.fileName;
	if(!uri){
		return res.json({ success: false, message: 'Invalid Parameters' });
	}
	else{
		//compressing the images utility called
		resizingMultiple(uri, function(data){
			if(data){
				return res.json({success: true, OutputUrls: data});
			}
			else	// in case an error occured while compressing or downloading image
				return res.json({success: false, message: "sorry Some error occured. Please try again!"});
		})

	}
    
	
})

//Api for compressing the images from urls in csv file
apiRoutes.post('/csvImagesCompress', function (req, res) {

    req.pipe(req.busboy);
    var input = [];
    //reading csv file
    req.busboy.on('file', function (fieldname, file, filename) {
        
        var csvStream = csv()
	    .on("data", function(data){
	    	//reading data from csv and storing it in an array
	         input.push(data[0]);
	    })
	    .on("end", function(){
	    	//compressing the images utility called
	         resizingMultiple(input, function(data){
				if(data){
					return res.json({success: true, OutputUrls: data});
				}
				else
					return res.json({success: false, message: "sorry Some error occured. Please try again!"});
			})
	    });
	 
		file.pipe(csvStream);
    });
    
	
})

//Api for compressing the image from file
apiRoutes.post('/imageDataCompress', function (req, res) {

    req.pipe(req.busboy);
    var input = [];
    //reading image
    req.busboy.on('file', function (fieldname, file, filename) {
        
        resizingImage(file, filename, function(err){
			if(err)
				return res.json({success: false, message: "sorry Some error occured. Please try again!"});
			else
				return res.json({success: true, OutputUrl: "localhost:8081/img/"+filename });
		})
	});
    
})



app.use('/api', apiRoutes);
app.use(express.static('./'))
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})


//**************** Utility *********************

//Compressing image passed as url in uri paramater
var resizing = function(uri, link,callback){
	gm(request(uri))
			.minify()
			.write(link, function (err) {
 			 if (!err) callback(false);
 			 else callback(true);
		});
};

//compressing images passed as urls in an array
var resizingMultiple = function(uri, callback){
	var output = [];
	for(var i=0;i<uri.length;i++){
			var x = uri[i].lastIndexOf("/");
			var y = uri[i].lastIndexOf(".");
			var link = "img/" + uri[i].substring(x+1,y) + ".jpg" ;
			resizing(uri[i], link, function(err, out){
				if(err)
					callback(false);
					// return res.json({ success: false, message: 'Invalid Parameters' });
				else{
					output.push("localhost:8081/"+out);
					console.log(output.length);
					if(output.length == uri.length)	
						callback(output);					
						// 
				}
			});
		}
}

//Compressing image passed as file
var resizingImage = function(file, filename, callback){
	gm(file, filename)
			.minify()
			.write('img/'+filename, function (err) {
 			 if (!err) callback(false);
 			 else callback(true);
		});
};