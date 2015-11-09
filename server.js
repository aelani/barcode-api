var bwipjs = require('bwip-js');
var express = require('express');
var app = express();

// Optionally load some custom fonts.  Maximum 8.
// OpenType and TrueType are supported.
bwipjs.loadFont('Inconsolata', 108, require('fs').readFileSync('Inconsolata.otf', 'binary'));

app.get('/', function(req, res) {
  if (!req.query.value && !req.query.type) {
    res.writeHead(404, { 'Content-Type':'text/plain' });
    res.end('Unknown request format.', 'utf8');
  } else {
    bwipjs.toBuffer({
      bcid: req.query.type,
      text: req.query.value,
      height: 0.2,
      width: 6,
      includetext: false,
      textxalign: 'center',
      textfont: 'Inconsolata',
      textsize: 13
    }, function (err, img) {
      if (err) {
        // Decide how to handle the error
        // `err` may be a string or Error object
      } else {
        res.writeHead(200, {'Content-Type': 'image/png' });
        res.end(img, 'binary');
      }
    });
  }
}).listen(process.env.PORT || 8080);
