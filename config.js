var config = {};

config.db = {};
// the URL shortening host - shortened URLs will be this + base58 ID
// i.e.: http://localhost:3000/3Ys
config.webhost = 'http://localhost:8081/';
config.port = 8081;
// your MongoDB host and database name
config.db.host = 'localhost';
config.db.name = 'url_shortener';
config.db.url = 'mongodb://127.0.0.1:27017/squadrun'

module.exports = config;