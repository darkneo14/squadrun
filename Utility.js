var request = require('request');
var bodyParser = require('body-parser');
var gm = require('gm');
var busboy = require('connect-busboy');	
var csv = require('fast-csv');
var fs = require('fs');

// ******************** UTILITY Functions ***********************************

//Compressing image passed as url in uri paramater
var resizing = function(uri, link,callback){
	gm(request(uri))
			.minify()
			.write(link, function (err) {
 			 if (!err) callback(false,link);
 			 else callback(true,link);
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

//*********************** Request handlers ***********************************

module.exports = {
	imageCompress : function (req, res, next) {
	
		var uri = req.body.imageUrl;
		if(!uri){
			return res.json({ success: false, message: 'Invalid Parameters' });
		}
		else{
			var i = uri.lastIndexOf("/");
			var j = uri.lastIndexOf(".");
			var link = "img/" + uri.substring(i+1,j) + ".jpg" ;

			//compressing image utility called
			resizing(uri, link, function(err,data){
				if(err)
					return res.json({ success: false, message: 'Invalid Parameters' });
				else
					return res.json({ success: true, OutputUrl: "localhost:8081/"+link });
			});
			
		}
    
	},

	listImagesCompress : function (req, res, next) {
	
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
	    
		
	},

	csvImagesCompress : function (req, res, next) {

	    req.pipe(req.busboy);
	    var input = [];
	    var flag = 1;
	    //reading csv file
	    req.busboy.on('file', function (fieldname, file, filename) {
	        flag = 0;
	        var csvStream = csv()
		    .on("data", function(data){
		    	//reading data from csv and storing it in an array
		        input.push(data[0]);
		    })
		    .on("end", function(){
		    	//compressing the images utility called
		         resizingMultiple(input, function(data){
					
					if(data){		// if resizing the images was successful
						var out =[];

						var csvStream = csv.createWriteStream({headers: true}), // creating a csv write stream
    					writableStream = fs.createWriteStream(filename); // creating a new file to return
    					writableStream.on("finish", function(){
						  	console.log("DONE!");
						});
						writableStream.on('error', function(e) { console.error(e); });
						csvStream.pipe(writableStream);
						// pushing data into file
						for(var i=0;i<data.length;i++){
							var a = [data[i]];
							csvStream.write(a);
						}

						csvStream.end();
						return res.json({success: true, OutputUrls: "localhost:8081/"+filename});
					}
					else		// if resizing image failed
						return res.json({success: false, message: "sorry Some error occured. Please try again!"});
				})
		    });
		 
			file.pipe(csvStream);
	    });
  		
		req.busboy.on('finish', function() {
    		console.log("in finish");
    		if(flag)
    			return res.json({success: false, message: "Invalid Params!!"});
		});
	
		
	},

	imageDataCompress : function (req, res, next) {

	    req.pipe(req.busboy);
	    var input = [];
	    var flag = 1;
	    //reading image
	    req.busboy.on('file', function (fieldname, file, filename) {
	        flag = 0;
	        resizingImage(file, filename, function(err){
				if(err)
					return res.json({success: false, message: "sorry Some error occured. Please try again!"});
				else
					return res.json({success: true, OutputUrl: "localhost:8081/img/"+filename });
			})
		});

		req.busboy.on('finish', function() {
    		console.log("in finish");
    		if(flag)
    			return res.json({success: false, message: "Invalid Params!!"});
		});
	    
	}



}