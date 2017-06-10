var request = require('request');
var bodyParser = require('body-parser');
var gm = require('gm');
var busboy = require('connect-busboy');	
var csv = require('fast-csv');
var fs = require('fs');
var config = require('./config.js');
var base58 = require('./base58.js');
var Url = require('./models/url.js')

// ******************** UTILITY Functions ***********************************

//Compressing image passed as url in uri paramater
var resizing = function(uri, name, link,callback){
	console.log(name);
	gm(request(uri))
			.minify()
			.write(link, function (err) {
 			 if (!err) callback(false,link,name);
 			 else callback(true,link,name);
		});
};

//compressing images passed as urls in an array
var resizingMultiple = function(uri, callback){
	var output = [];
	for(var i=0;i<uri.length;i++){
			var x = uri[i].url.lastIndexOf("/");
			var y = uri[i].url.lastIndexOf(".");
			var name = uri[i].name;
			console.log(name);
			if(name == null)
				name='';
			var link = "img/" + uri[i].url.substring(x+1,y) + ".jpg" ;
			resizing(uri[i].url, name, link, function(err, out, key){
				if(err)
					callback(false,uri);
					// return res.json({ success: false, message: 'Invalid Parameters' });
				else{
					console.log(key);
					shortenUrl(config.webhost+out, key,function(data){
					output.push(data);
					console.log(output.length);
					if(output.length == uri.length)	
						callback(output,uri);
					})
										
						
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

var shortenUrl = function(longUrl, key, callback){
	// console.log(base58.encode(3));
	console.log(key);
	Url.findOne({long_url: longUrl}, function (err, doc){
    if (doc){
      // URL has already been shortened
      shortUrl = config.webhost + base58.encode(doc._id);

      // since the document exists, we return it without creating a new entry
      callback(shortUrl);
    } else {
      // The long URL was not found in the long_url field in our urls
      // collection, so we need to create a new entry
      var newUrl; 

      if(key!=''){
      	console.log('in empty key');
      	Url.findOne({key: key}, function (err, doc1){
      	if(doc){
      		callback("Already Exits");
      	}
      	else{
      		shortUrl = config.webhost + key;
      		newUrl = Url({
        		long_url: longUrl,
        		key: key
     		});
     		newUrl.save(function(err) {
		    if (err){
		        console.log(err);
		    }

		    // construct the short URL
		    
	        callback(shortUrl);
	    	});
      		
      	}

      })
      }
      else{
      	newUrl = Url({
        	long_url: longUrl
     	});
      		// save the new link
	    newUrl.save(function(err) {
		    if (err){
		        console.log(err);
		    }

		    // construct the short URL
		    shortUrl = config.webhost + base58.encode(newUrl._id);
	        callback(shortUrl);
	    });
  		}
  		if(err)
  			console.log(err);	
    }
  });

}

//*********************** Request handlers ***********************************

module.exports = {
	imageCompress : function (req, res, next) {
	
		var uri = req.body.imageUrl;
		var name = req.body.name;
		if(name == null)
			name='';
		if(!uri){
			return res.json({ success: false, message: 'Invalid Parameters' });
		}
		else{
			//getting the name of the image
			var a= new Date();
			// console.log(Url.getSeq());
			var link = "img/" + a + ".jpg" ;
			console.log(link);
			//compressing image utility called
			resizing(uri,name, link, function(err,data,name){
				if(err)
					return res.json({ success: false, message: 'Invalid Parameters' });
				else{
					shortenUrl(config.webhost+link, name, function(data){
						return res.json({ success: true, OutputUrl: data });
					})
					
				}
			});
			
		}
    
	},

	listImagesCompress : function (req, res, next) {
	
		var uri = req.body.imageUrls;
		if(!uri){
			return res.json({ success: false, message: 'Invalid Parameters' });
		}
		else{
			//compressing the images utility called
			resizingMultiple(uri, function(data,uri){
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
			var i = filename.lastIndexOf(".");
			var link = filename.substring(i+1,filename.length) ;
			console.log(link);
			if(link == "csv"){
				console.log("asad");
	        var csvStream = csv()
		    .on("data", function(data){
		    	//reading data from csv and storing it in an array
		        var nm = '';
		        if(data[1])
		        	nm=data[1]

		        var a={url:data[0], name: nm}
		        input.push(a);
		    })
		    .on("end", function(){
		    	//compressing the images utility called
		         resizingMultiple(input, function(data,uri){
					
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
							var a = [uri[i].url,data[i]];
							csvStream.write(a);
						}

						csvStream.end();
						return res.json({success: true, OutputUrl: config.webhost+filename});
					}
					else		// if resizing image failed
						return res.json({success: false, message: "sorry Some error occured. Please try again!"});
				})
		    });
		 
			file.pipe(csvStream);
		}
		else{
			return res.json({success: false, message: "Invalid Params!!"});
		}
	    });
  		
		req.busboy.on('finish', function() {
    		console.log("in finish");
    		if(flag)		//if no file parameter was passed
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
	        var i = filename.lastIndexOf(".");
			var link = filename.substring(i+1,filename.length);
			if(link == "jpeg" || link == "jpg" || link == "png"){
	        //resizing images
	        resizingImage(file, filename, function(err){
				if(err)
					return res.json({success: false, message: "sorry Some error occured. Please try again!"});
				else{
					shortenUrl(config.webhost+filename, '', function(data){
						return res.json({ success: true, OutputUrl: data });
					})
				}
			})
	    }
	    else{
	    	return res.json({success: false, message: "Invalid Params!!"});
	    }
		});

		req.busboy.on('finish', function() {
    		console.log("in finish");
    		if(flag)		//if no file parameter was passed
    			return res.json({success: false, message: "Invalid Params!!"});
		});
	    
	}



}