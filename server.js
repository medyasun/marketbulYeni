//#region requires
var fs = require('fs');
const session = require ('express-session');
const cheerio = require("cheerio");
const request = require("request-promise");
const urlify = require("urlify").create({
  addEToUmlauts: false,
  szToSs: false,
  spaces: "+",
  nonPrintable: "",
  trim: true
});
const urlify3 = require ("urlify").create({
  addEToUmlauts:false,
  szToSs :false,
  spaces:"%26",
  nonPrintable:"",
  trim:true
});
const express = require("express");
var app = express();
const path = require("path");
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: false }));

//#endregion

app.use(session({
  secret: 'sepet-anahtar',
  resave: false,
  saveUninitialized: true
}));

//#region Pages-Search
app.use("/search", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
//#endregion

//#region Pages-Sonuclar
app.use('/sonuclar', (req, res) => {
 
  (async () => {
    //#region tanimlar
/*     const capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1)
    } */
    var arama = req.body.kelime.toLocaleLowerCase('tr-TR');
    var aramaSplit=[];
    aramaSplit=arama.split(' ');
    var aramaLength=aramaSplit.length;
    var urlarama = urlify(arama);
    const url = "https://www.migros.com.tr/arama?q="+urlarama;
    const url2 ="https://www.carrefoursa.com/tr/search/?sort=relevance&sortingOption=relevance&q="+urlarama+"%3Aprice-asc%3AinStockFlag%3Atrue#";
    const url3 ="https://www.a101.com.tr/list/?search_text="+urlarama+"#/";
    const url4 ="https://www.bim.com.tr/Categories/100/aktuel-urunler.aspx";
    const url5 = "https://www.happycenter.com.tr/Product/Search/?ara="+urlarama;
    const response = await request(url);
    const response2 = await request(url2);
    const response3 = await request(url3);
    const response4 = await request(url4);
    const response5 = await request(url5);
    const $ = cheerio.load(response);
    const $2 = cheerio.load(response2);
    const $3 = cheerio.load(response3);
    const $4 = cheerio.load(response4);
    const $5 = cheerio.load(response5);
    let sonuclar = [];
    let sonuclartest = [];
    let enucuzSonuclar=[];
    let sonuclartmp=[];
    var jsonSonuclar = {},jsonSonuclar2 = {},jsonSonuclar3 = {}, jsonSonuclar4 = {},jsonSonuclar5 = {};
    let fiyat,fiyat2,fiyat3,fiyat4,fiyat5;
    let search,search2,search3,search4,search5;
   
    //#endregion
    //---------------------------------------------------------------------------------------------------------------
    //#region migros 1
    const urlElems = $(
      "#page-area > div > div > div.col-md-10.category-right > div.sub-category-product-list > div"
    );
    var urlEL=10;    //urlElems.length;
    for (let i = 1; i <= urlEL; i++) {
      search = $(
        "#page-area > div > div > div.col-md-10.category-right > div.sub-category-product-list > div.list.p" +
        [i] +
        " > div > form > div.center.product-card-center > h5 > a"
      ).text();

      fiyat = $(

        "#page-area > div > div > div.col-md-10.category-right > div.sub-category-product-list > div.list.p" +
        [i] +
        " > div > form > div.center.product-card-center > div > div > span"
      )
        .text()
        .trim()
        .replace("\n", "")
        .replace(" TL", "")
        .replace("                                  \n                ", "")
        .replace(" TL", "")
        .substr(-6);

      jsonSonuclar = {
        ID  : 1,
        logo:"https://sanalmarket-com-web-assets.global.ssl.fastly.net/images/m.df813fa8.png",
        site: "migros",
        name: search,
        Price: parseFloat(fiyat.replace(",", "."), 10)
      };

      var aramaBirlestir;
      for (let i = 0; i < aramaLength; i++) {
        if(i==0){ aramaBirlestir=jsonSonuclar.name.toLowerCase().includes(aramaSplit[i])+"&"}
        else if(aramaLength-1==i){  aramaBirlestir+=jsonSonuclar.name.toLowerCase().includes(aramaSplit[i])}
        else { aramaBirlestir+=jsonSonuclar.name.toLowerCase().includes(aramaSplit[i])+"&"}
      }
      if (
        !aramaBirlestir.includes('false')
        ) sonuclar.push(jsonSonuclar);
    
    }
    //#endregion migros
    //---------------------------------------------------------------------------------------------------------------
    //#region carefour 2
  const urlElems2 = $2(
    "body > main > div:nth-child(8) > div:nth-child(2) > div.col-xs-12.col-sm-12.col-md-9.col-lg-10 > div.pl-grid-cont.row > ul>li > div"
  );
var urlE2L=10;    //urlElems2.length;
  for (let i = 1; i <= urlE2L; i++) {
    search2 = $2(
      "body > main > div:nth-child(8) > div:nth-child(2) > div.col-xs-12.col-sm-12.col-md-9.col-lg-10 > div.pl-grid-cont.row > ul > li:nth-child(" +
        [i] +
        ") > div > div > div > div.product_click > a > span.item-name"
    )
      .text()
      .trim();

    fiyat2 = $2(
      "body > main > div:nth-child(8) > div:nth-child(2) > div.col-xs-12.col-sm-12.col-md-9.col-lg-10 > div.pl-grid-cont.row > ul > li:nth-child(" +
        [i] +
        ") > div > div > div > div.product_click > a > span.dis-price-cont.clearfix > span > span.item-price"
    )
      .text()
      .trim()
      .replace("\n", "")
      .replace(" TL", "")
      .replace("                                  \n                ", "")
      .replace(" TL", "")
      .substr(-6);

    jsonSonuclar2 = {
      ID  : 2,
      logo:"https://reimg-carrefour.mncdn.com/staticimage/favicon.ico",
      site: "carefour",
      name: search2,
      Price: parseFloat(fiyat2.replace(",", "."), 10)
    };

    var aramaBirlestir2;
    for (let i = 0; i < aramaLength; i++) {
      if(i==0){ aramaBirlestir2=jsonSonuclar2.name.toLowerCase().includes(aramaSplit[i])+"&"}
      else if(aramaLength-1==i){  aramaBirlestir2+=jsonSonuclar2.name.toLowerCase().includes(aramaSplit[i])}
      else { aramaBirlestir2+=jsonSonuclar2.name.toLowerCase().includes(aramaSplit[i])+"&"}
    }
    if (
      !aramaBirlestir2.includes('false')
      ) sonuclar.push(jsonSonuclar2);
  }
  //#endregion
    //---------------------------------------------------------------------------------------------------------------
    //#region A101 3

const urlElems3 = $3(
  "body > div.js-main-wrapper > div.page-list.js-container > div:nth-child(3) > div.content > div > div.col-md-10.col-sm-9 > div> div > div >div"
);
var urlE3L=10;   //urlElems3.length;
for (let i = 1; i <= urlE3L; i++) {
  search3 = $3(
    "body > div.js-main-wrapper > div.page-list.js-container > div:nth-child(3) > div.content > div > div.col-md-10.col-sm-9 > div > div > div > div:nth-child(" +
    [i] +
    ") > div > a > div > h3"
  )
    .text()
    .trim();

  fiyat3 = $3(
    "body > div.js-main-wrapper > div.page-list.js-container > div:nth-child(3) > div.content > div > div.col-md-10.col-sm-9 > div > div > div > div:nth-child(" +
    [i] +
    ") > div > div > div.add-basket.js-add-basket-area > div.price"
  )
    .text()
    .trim()
    .replace("\n", "")
    .replace(" TL", "")
    .replace("                                  \n                ", "")
    .replace(" TL", "")
    .substr(-6);

  jsonSonuclar3 = {
    ID  : 3,
    logo:"https://ayb.akinoncdn.com/static_omnishop/ayb288/assets/img/favicon.ico",
    site: "A101",
    name: search3,
    Price: parseFloat(fiyat3.replace(",", "."), 10)
  };

  if (isNaN(jsonSonuclar3.Price)) jsonSonuclar3.Price = 999 ;

  var aramaBirlestir3;
  for (let i = 0; i < aramaLength; i++) {
    if(i==0){ aramaBirlestir3=jsonSonuclar3.name.toLocaleLowerCase('tr-TR').includes(aramaSplit[i])+"&"}
    else if(aramaLength-1==i){  aramaBirlestir3+=jsonSonuclar3.name.toLocaleLowerCase('tr-TR').includes(aramaSplit[i])}
    else { aramaBirlestir3+=jsonSonuclar3.name.toLocaleLowerCase('tr-TR').includes(aramaSplit[i])+"&"}
  }
  if (
    !aramaBirlestir3.includes('false')
    ) sonuclar.push(jsonSonuclar3);

}
//#endregion
    //---------------------------------------------------------------------------------------------------------------
    //#region happy center 5
const urlElems5 = $5(
  "#product-grid-list > div.panel-body > div> div"
);
var urlE5L=10;   //urlElems5.length;
for (let i = 1; i <= urlE5L; i++) {
  search5 = $5(
    "#product-grid-list > div.panel-body > div > div:nth-child(" +
    [i] +
    ") > p:nth-child(2) > a"
  ) 
  .text()
  .trim()
  .replace("\n", "");

  fiyat5 = $5(
    "#product-grid-list > div.panel-body > div > div:nth-child(" +
    [i] +
    ") > p:nth-child(3) > span"
  )
    .text()
    .trim()
    .replace("\n", "")
    .replace(" TL", "")
    .replace("                                  \n                ", "")
    .replace(" TL", "")
    .substr(-6);

  jsonSonuclar5 = {
    ID  : 5,
    logo:"https://static.happycenter.com.tr/Uploads/favicon.PNG",
    site: "happycenter",
    name: search5,
    Price: parseFloat(fiyat5.replace(",", "."), 10)
  };

  var aramaBirlestir5;
  for (let i = 0; i < aramaLength; i++) {
    if(i==0){ aramaBirlestir5=jsonSonuclar5.name.toLocaleLowerCase('tr-TR').includes(aramaSplit[i])+"&"}
    else if(aramaLength-1==i){  aramaBirlestir5+=jsonSonuclar5.name.toLocaleLowerCase('tr-TR').includes(aramaSplit[i])}
    else { aramaBirlestir5+=jsonSonuclar5.name.toLocaleLowerCase('tr-TR').includes(aramaSplit[i])+"&"}
  }
  if (
    !aramaBirlestir5.includes('false')&& typeof jsonSonuclar5!="undefined"
    ) {sonuclar.push(jsonSonuclar5)
      sonuclartest.push(jsonSonuclar5)
    };
    
}
//#endregion
    //---------------------------------------------------------------------------------------------------------------
    //#region bim aktuel 4

 const urlElems4 = $4(
  "#form1 > div:nth-child(11) > div > div.container.content.white.no-pb > div>div"
);
var urlE4L=10;    //urlElems4.length;
for (let i = 1; i <= urlE4L; i++) {
  search4 = $4(
    "#form1 > div:nth-child(11) > div > div.container.content.white.no-pb > div > div:nth-child(" +
    [i] +
    ") > h4 > a"
  )
    .text()
    .trim();

  fiyat4 = $4(
    "#form1 > div:nth-child(11) > div > div.container.content.white.no-pb > div > div:nth-child(" +
    [i] +
    ") > button"
  )
    .text()
    .trim()
    .replace("\n", "")
    .replace(" TL", "")
    .replace("                                  \n                ", "")
    .replace(" TL", "")
    .substr(-6);

  jsonSonuclar4 = {
    ID  : 4,
    logo:"https://www.bim.com.tr/Uploads/logo.ico",
    site: "BİM Aktuel",
    name: search4,
    Price: parseFloat(fiyat4.replace(",", "."), 10)
  };

  if (isNaN(jsonSonuclar4.Price)) jsonSonuclar4.Price = 999 ;

  var aramaBirlestir4;
  for (let i = 0; i < aramaLength; i++) {
    if(i==0){ aramaBirlestir4=jsonSonuclar4.name.toLowerCase().includes(aramaSplit[i])+"&"}
    else if(aramaLength-1==i){  aramaBirlestir4+=jsonSonuclar4.name.toLowerCase().includes(aramaSplit[i])}
    else { aramaBirlestir4+=jsonSonuclar4.name.toLowerCase().includes(aramaSplit[i])+"&"}
  }
  if (
    !aramaBirlestir4.includes('false')
    ) sonuclar.push(jsonSonuclar4);

}
//#endregion

    //---------------------------------------------------------------------------------------------------------------
sonuclar.sort(function(a, b) {
  return a.Price - b.Price;
});

for (let i = 1; i <= 5; i++) {      // ---------- eger sistemi yorarsa bu alani site adedi ile degistir
 
  sonuclartmp=sonuclar.filter(function(sonuc) {return sonuc.ID == i;});
  enucuzSonuclar.push(sonuclartmp[0]);
  sonuclartest.push(sonuclartmp) ;
}

enucuzSonuclar=enucuzSonuclar.filter(function(sonuc) {return sonuc!=null;});


//res.sendFile(path.join(__dirname, "index.html"));
    var data = fs.readFileSync('index.html').toString();
    data = data.replace("---datagonder---",JSON.stringify(enucuzSonuclar) );
  
  
    res.send(data);
  })();                        //------------------async sonu
});
//#endregion Pages-Sonuclar

var PORT = process.env.PORT || 8080;
app.listen(PORT);

