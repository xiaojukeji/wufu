var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var wufus = {
  '1' : '爱国福',
  '2' : '富强福',
  '3' : '和谐福',
  '4' : '友善福',
  '5' : '敬业福'
};

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var WufuExchange = new Schema({
    alipay  : String,
    have    : String,
    want    : String,
});

var WufuSale = new Schema({
  alipay : String,
  sale   : String,
  price  : Number,
  name   : String,
});

var WufuExchangeModel = mongoose.model('WufuExchange', WufuExchange);
var WufuSaleModel = mongoose.model('WufuSale', WufuSale);

router.get('/wufu/sale/:id', function(req, res, next) {
  var id = req.params.id;
  WufuSaleModel.find({sale: id}).sort('price').exec(function(err, docs) {
    if (err) return console.error(err);
    docs = docs || [];
    docs.forEach(function(v){
      v.name = wufus[v.sale];
    })
    res.json(docs);
  });
});

router.post('/wufu/sale', function(req, res, next) {
  var alipay = req.body.alipay;
  var price = req.body.price;
  var sale = req.body.sale;

  var query = {
    alipay : alipay,
    price: price,
    sale: sale
  };
  var update = {
  };
  var options = { upsert: true };
  WufuSaleModel.findOneAndUpdate(query, update, options, function(error, result) {
    if (error) return;
    res.json(result);
  });
});

router.post('/wufu/exchange', function(req, res, next) {
  var alipay = req.body.alipay;
  var have = req.body.have;
  var want = req.body.want;
  var query = {
    alipay : alipay,
    have: have,
    want: want
  };
  var update = {
  };
  var options = { upsert: true };
  WufuExchangeModel.findOneAndUpdate(query, update, options, function(error, result) {
    if (error) return;
  });

  WufuExchangeModel.find({have: want, want: have}).limit(10).exec(function(error, result) {
    if (error) return;
    res.json(result);
  });

});

router.get('/wufu/delete/:id', function(req, res, next) {
  var id = req.params.id;
  WufuExchangeModel.findOne({_id: id}, function(err, doc) {
    res.json(doc);
    if (doc) {
      doc.remove();
    }
  })
});

router.get('/wufu/sale/delete/:id', function(req, res, next) {
  var id = req.params.id;
  WufuSaleModel.findOne({_id: id}, function(err, doc) {
    res.json(doc);
    if (doc) {
      doc.remove();
    }
  })
});

module.exports = router;
