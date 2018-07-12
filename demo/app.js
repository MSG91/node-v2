const express = require('express')
const MSG91 = require('../index.js');
const app = express();
const msg91 = new MSG91('64085AhoMeZih53183781');

app.get('/', (req, res) => {
  sendSMS(req, res);
})

function sendSMS(req, res) {
  let opts = {
    "sender": "SOCKET",
    "route": "4",
    "country": "91",
    "sms": [
      {
        "message": "Hey Dude Testing",
        "to": [ "9893459995", "9575559995" ]
      }
    ]
  };
  msg91.send(opts).then((success) => {
    create (req, res, 'success', success)
  }).catch((error) => {
    create (req, res, 'error', error)
  });
}

function create (req, res, status, data) {
  console.log (data)
  var html = `<h4>Status: ${status}</h4><pre>${data}</pre>`;
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': html.length,
    'Expires': new Date().toUTCString()
  });
  res.end(html);
}

app.listen(7000, () => {
  // console.log('Example app listening on port 7000!')
})