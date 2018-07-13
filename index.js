"use strict";
const request = require('request');

const SPECIAL_CHARS = ['+', '&', '#', '%', '@', '/', ';', '=', '?', '^', '|'];

class MSG91{
  /**
  * Creates a new MSG91 instance
  * @param {string} authKey Authentication key
  */
  constructor(authKey) {
    if(!authKey){
      throw new Error('Without auth key we are unable to do anything dude.')
    }
    this.authKey = authKey;
    this.opts = null;
  }

  /**
   * Returns the base URL for MSG91 api call
   * @returns {string} Base URL for MSG91 api call
   */
  static getBaseURL() {
    return "https://control.msg91.com/api/";
  }

  static validateKeys(opts) {
    // check for sender id
    if (!opts['sender']) {
      return new Error("MSG91 Sender Id is not provided.");
    }
    // check for route
    if (!opts['route']) {
      return new Error("MSG91 route Id is not provided.");
    }
    // check for sms object
    if (opts['sms']){
      new Error("MSG91 SMS object will be needed");
    }
    if (!(opts['sms'] instanceof Array)) {
      return new Error("MSG91 SMS object will be an array");
    }
    if (opts['sms'] instanceof Array && opts['sms'].length === 0) {
      return new Error("MSG91 No data provided");
    }    
    return null;
  }

  static isUnicodeString(str) {
    for (var i = 0, n = str.length; i < n; i++) {
      if (str.charCodeAt( i ) > 255) { 
        return true; 
      }
    }
    return false;
  }

  static enocodeMsgString(str) {
    return SPECIAL_CHARS.some( (v) => {
      return str.indexOf(v) >= 0;
    })
  }

  static writeErrMsg(o) {
    return {
      status: "error",
      message: (typeof o === 'string') ? o : o.msg
    }
  }

  /**
   * 
   * @param {*} args will be an object which contains all params
   */
  send(opts) {
    this.opts = opts;
    return new Promise( (resolve, reject) => {
      let validation = this.constructor.validateKeys(this.opts);
      // fails in validation then goes inside
      if (validation) {
        reject(validation);
      }

      // cross check if message contains unicode string
      let isUnicode = false;
      this.opts.sms.forEach(item => {
        // check for unicode
        try {
          isUnicode = this.constructor.isUnicodeString(item.message);
        } catch (error) {}

        // check for message contains special character
        try {
          if (this.constructor.enocodeMsgString(item.message)) {
            message = encodeURIComponent(encodeURIComponent(message));
          }
        }catch (error) {}
      });

      // after unicode toll lets append value
      if(isUnicode){
        this.opts.unicode = 1;
      }

      let options = {
        method: 'POST',
        url: `${this.constructor.getBaseURL()}v2/sendsms`,
        headers : {
          authkey: this.authKey,
          'content-type': 'application/json'
        },
        json: this.opts
      };

      // prepare msg and hit request
      request(options, (error, response, data) => {
        if (error) {
          reject(error)
        }
        if (data && data.type === "success") {
          resolve(data);
        } else {
          reject(data)
        }
      });
    });
  }

  /**
   * check balance
   */
  checkBalance(route) {
    return new Promise( (resolve, reject) => {
      if (typeof route === "number" && !isNaN(route)) {

        let options = {
          method: 'GET',
          url: `${this.constructor.getBaseURL()}balance.php?type=${route}&authkey=${this.authKey}`
        };
  
        // prepare msg and hit request
        request(options, (error, response, data) => {
          if (error) {
            reject(error)
          }
          // purify data due to not getting json response.
          data = JSON.parse(data)
          if (typeof data === 'number') {
            resolve({
              status: "success",
              message: `your balance for route ${route} is ${data}`
            });
          } else {
            reject(this.constructor.writeErrMsg(data))
          }
        });

      } else {
        reject(this.constructor.writeErrMsg('Route number will be numeric.'))
      }
    })
  }

}

module.exports = MSG91;