var supertest = require("supertest");
var should = require("should");
var s = require("../server.js")

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:8081/api");
var token='';

describe("Sample unit Test", function(){

	it("Base url Test", function(done){

		server.
		get("/")
		.expect(200)
		.end(function(err, res){
			res.status.should.equal(200);
			done();
		});
	});

	
});

describe("Single Image Url Testing", function(){

	it("imageCompress", function(done){

		server.
		post("/imageCompress")
		.send({"imageUrl":"https://s-media-cache-ak0.pinimg.com/736x/80/91/f9/8091f9dceb2ea55fa7b57bb7295e1824.jpg"})
		.expect(200)
		.end(function(err, res){
			res.body.should.have.property("OutputUrl");
			res.body.success.should.equal(true);
			res.status.should.equal(200);
			done();
		});
	});

	
});


describe("Single Url image testing Wrong Input", function(){

	it("imageCompress", function(done){

		server.
		post("/imageCompress")
		.send({})
		.expect(200)
		.end(function(err, res){
			// res.body.should.have.property("token");
			res.body.success.should.equal(false);
			res.status.should.equal(200);
			done();
		});
	});

	
});

describe("List Image Url", function(){

	it("ListimageCompress", function(done){

		server.
		post("/listImagesCompress")
		.send({	"imageUrls":[
		"https://s-media-cache-ak0.pinimg.com/736x/80/91/f9/8091f9dceb2ea55fa7b57bb7295e1824.jpg",
		"http://cdn.wonderfulengineering.com/wp-content/uploads/2014/07/Superman-S-Shield-space-phone-wallpaper-576x1024.jpg",
		"https://s-media-cache-ak0.pinimg.com/736x/ca/ea/57/caea57268e1dee696f3c20a5a0f895f2.jpg"
		]})
		.expect(200)
		.end(function(err, res){
			res.body.should.have.property("OutputUrls");
			res.body.success.should.equal(true);
			res.status.should.equal(200);
			done();
		});
	});


})

