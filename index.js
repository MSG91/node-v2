"use strict";
const request = require('request');

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
    return "https://control.msg91.com/api/v2/sendsms";
  }

  static validateKeys() {
    // check for sender id
    if (!this.opts['sender']) {
      return new Error("MSG91 Sender Id is not provided.");
    }
    // check for route
    if (!this.opts['route']) {
      return new Error("MSG91 route Id is not provided.");
    }
    // check for sms object
    if (this.opts['sms']){
      new Error("MSG91 SMS object will be needed");
    }
    if (!(this.opts['sms'] instanceof Array)) {
      return new Error("MSG91 SMS object will be an array");
    }
    if (this.opts['sms'] instanceof Array && this.opts['sms'].length === 0) {
      return new Error("MSG91 No data provided");
    }    
    return null;
  }

  /**
   * 
   * @param {*} args will be an object which contains all params
   */
  send(opts) {
    this.constructor.opts = opts;
    return new Promise( (resolve, reject) => {
      let validation = this.constructor.validateKeys();
      // fails in validation then goes inside
      if (validation) {
        reject(validation);
      }

      let options = {
        method: 'POST',
        url: this.constructor.getBaseURL(),
        headers : {
          authkey: this.constructor.authkey,
          'content-type': 'application/json'
        },
        body: this.constructor.opts,
        json: this.constructor.opts
      };

      // prepare msg and hit request
      request(options, (error, response, data) => {
        if (error) {
          reject(error)
        }
        if (data) {
          resolve(data);
        }
      });
    });
  }

}

module.exports = MSG91;