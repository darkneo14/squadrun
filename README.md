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

Base api- localhost:8081/api

1)
endpoint - /imageCompress

inputs - {"imageUrl": "URL of an image",name:"asdsa"}
name here is the key used for url shortening

output - 
{
  "success": true,
  "OutputUrl": "localhost:8081/asdsa"
}

2)
endpoint - /listImagesCompress

inputs - 
{
  "imageUrls":[
    {"url":"https://s-media-cache-ak0.pinimg.com/736x/80/91/f9/8091f9dceb2ea55fa7b57bb7295e1824.jpg",
    "name":"abcd"},
    {"url":"http://cdn.wonderfulengineering.com/wp-content/uploads/2014/07/Superman-S-Shield-space-phone-wallpaper-576x1024.jpg",
    "name":"bcd"},
    {"url":"https://s-media-cache-ak0.pinimg.com/736x/ca/ea/57/caea57268e1dee696f3c20a5a0f895f2.jpg"}
    ]
}

output - 
{
  "success": true,
  "OutputUrls": [
    "localhost:8081/abcd",
    "localhost:8081/bcd",
    "localhost:8081/iw"
  ]
}

3)
endpoint - /csvImagesCompress

input is in the form of multipart/form-data

input- csv file with urls of images in first column of seperate rows. Second column can have names for url shortening

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
  "OutputUrl": "localhost:8081/iwj"
}