## MSG91 - Node.js SDK

This SDK allows you to send SMS via MSG91 V2 APIs or V1 APIs

### Set-up:

1. Download the NPM module
```
npm install msg91-node-v2 --save
```
2. Require the package in your code.
```
const MSG91 = require('msg91');
```
3. Initialize with your [MSG91](https://msg91.com) auth key
```
const msg91 = new MSG91('YOUR_AUTH_KEY');
```
That's all, your SDK is set up!

## Usage

### Send SMS
```javascript
function sendSMS(req, res) {
  let opts = {
    "sender": "YOUR_SENDER_ID",
    "route": "4",
    "country": "91",
    "sms": [
      {
        "message": "Message1",
        "to": [
          "98260XXXXX",
          "98261XXXXX"
        ]
      },
      {
        "message": "Message2",
        "to": [
          "98260XXXXX",
          "98261XXXXX"
        ]
      }
    ]
  };
  // promise function
  msg91.send(opts).then((data) => {
    // in success you'll get object
    // {"message":"REQUET_ID","type":"success"}
  }).catch((error) => {
    // refer Handle error section
  });
}
```

### Balance Check
```javascript
// route will be an number
let route = 1;
msg91.checkBalance(route).then((data) => {
  // in success you'll get object
  // {"status":"success","message":"your balance for route 4 is 7866"}
}).catch((error) => {
  // handle error
});
```

### handle error
you'll get error object like below:
```javascript
{
  status: 'error',
  message: 'ERROR_MSG'
}
```

### Response codes:
Please refer [response_codes](https://docs.msg91.com/collection/msg91-api-integration/5/send-sms-v2/TZ2IXQHS)

### Licence:

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
