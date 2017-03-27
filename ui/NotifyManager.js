'use strict'

var redis = require("redis");
var rclient = redis.createClient();
var sclient = redis.createClient();
sclient.setMaxListeners(0);
let instance = null;


module.exports = class NotifyManager {
 
    constructor() {
        if (instance == null) {
            this.config = {
                'state':true
            };
            this.loadConfig();
            setInterval(()=>{
                this.loadConfig();
            }, 1000*60*60*1);

            this._obj2msg={};
            this._obj2msg['en'] = require('./obj2msg_en.js');
        }
        instance = this;
    }

    loadConfig() {
            rclient.hgetall("policy:system",(err,result)=>{
                if (result && result.notify != null) {
                    this.config = JSON.parse(result.notify);
                }
                console.log("DEBUGNM:", result, this.config);
            });
    }
    
    canNotify() {
       console.log("DEBUGNM2:", this.config);
       return this.config.state;
    }

    saveConfig(callback) {
        if (this.config == null) {
            return;
        }
        rclient.hset("sys:notify", this.config, callback);
    }
     

    // NotifyState:
    //  Intel: <severity>
    //  Porn: <severity>
    //  Gaming: <severity>
    //  Video: <severity> 

    notifyState(notifyId,severity,callback) {
    }

    obj2msg(host, msgtype, obj) {
        return this._obj2msg['en'].obj2msg(host,msgtype,obj); 
    }

}    
    
