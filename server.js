var bwipjs = require('bwip-js');
var express = require('express');
var app = express();

app.get('/', function(req, res) {
  if (!(req.query.value || req.query.number) && !req.query.type) {
    res.writeHead(400, { 'Content-Type':'text/plain' });
    res.end('Unknown request format.', 'utf8');
  } else {
    
    var type;
    var number = req.query.number || req.query.value;

    if (number === '') {
      res.writeHead(400, { 'Content-Type':'text/plain' });
      res.end('Invalid barcode number.', 'utf8');
    } else {

      switch (req.query.type) {
        case 'azteccode':
        case 'aztecrunes':
        case 'datamatrix':
        case 'micropdf417':
        case 'pdf417':
        case 'qrcode':
          type = '2d';
          break;
        case 'ean8':
        case 'ean13':
        case 'upca':
        case 'upce':
        case 'isbn':
        case 'ismn':
        case 'issn':
        case 'code128':
        case 'code39':
        case 'code93':
        case 'interleaved2of5':
          type = '1d';
          break;
      }

      if (type === undefined) {
        res.writeHead(400, { 'Content-Type':'text/plain' });
        res.end('Unsupported barcode type.', 'utf8');
      } else {
        bwipjs.toBuffer({
          bcid: req.query.type,
          text: req.query.value || req.query.number,
          width: type === '1d' ? 3.470 : 3.475,
          height: type === '1d' ? 0.200 : 88.400,
          includetext: false
        }, function (err, img) {
          if (err) {
            res.writeHead(400, { 'Content-Type':'text/plain' });
            res.end('Invalid request.', 'utf8');
          } else {
            res.writeHead(200, {'Content-Type': 'image/png' });
            res.end(img, 'binary');
          }
        });
      }

    }
  }
}).listen(process.env.PORT || 8080);
