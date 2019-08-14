const express = require ("express");
var app = express();
const path = require ('path');
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended:false}));


app.use('/search',(req,res,next)=>{
  res.sendFile(path.join(__dirname, 'index.html'));

})

app.use('/sonuclar',(req,res,next)=>{
  res.send(req.body);
  var kelimeler=req.body.kelime;

  const url = "https://www.migros.com.tr/arama?q="+kelimeler;
  console.log(url);

})

app.listen(8080);