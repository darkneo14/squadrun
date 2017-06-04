For setup-

use- 
npm install
to download all the nodes modules.

This works only for linux and OSx

You need to install one software-
GraphicsMagick

for Ubuntu use-
sudo apt-get install graphicsmagick

For OS X use-
brew install graphicsmagick

After this you are ready to go!!!!

API Endpoints-

1)
endpoint - /imageCompress

inputs - {"imageUrl": "URL of an image"}
output - 
{
  "success": true,
  "OutputUrl": "localhost:8081/img/Scarlett-Johansson-Red-Dress-PNG.jpg"
}

2)
endpoint - /listImagesCompress

inputs - 
{
	"imageUrls":[
		"https://s-media-cache-ak0.pinimg.com/736x/80/91/f9/8091f9dceb2ea55fa7b57bb7295e1824.jpg",
		"http://cdn.wonderfulengineering.com/wp-content/uploads/2014/07/Superman-S-Shield-space-phone-wallpaper-576x1024.jpg",
		"https://s-media-cache-ak0.pinimg.com/736x/ca/ea/57/caea57268e1dee696f3c20a5a0f895f2.jpg"
		]
}

output - 
{
  "success": true,
  "OutputUrls": [
    "localhost:8081/img/8091f9dceb2ea55fa7b57bb7295e1824.jpg",
    "localhost:8081/img/caea57268e1dee696f3c20a5a0f895f2.jpg",
    "localhost:8081/img/Superman-S-Shield-space-phone-wallpaper-576x1024.jpg"
  ]
}

3)
endpoint - /csvImagesCompress

input is in the form of multipart/form-data

input- csv file with urls of images in first column of seperate rows

output- 
{
  "success": true,
  "OutputUrl": "localhost:8081/data.csv"
}

4)
endpoint - /imageDataCompress

input is in the form of multipart/form-data

input- image file

output-
{
  "success": true,
  "OutputUrl": "localhost:8081/img/8091f9dceb2ea55fa7b57bb7295e1824.jpg"
}