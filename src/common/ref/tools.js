'use strict';

import crypto from 'crypto';
import sha1 from 'sha1';
import xml2js from 'xml2js';
import wxConfig from '../config/wx.js';

let KEY = wxConfig.key;

export function roundStr () {
    return sha1(Math.random()).slice(0, 31);
}

export function produceSign (json, ignore) {

    let str = "",
        arr = [];

    const IGNORE = ignore || 'sign';

    for (let key in json) {

        if (key != IGNORE && json[key]) {

            arr.push(key);

        } else if (!json[key]) {

            delete json[key];

        }

    }

    arr.sort();
    arr.forEach((item, index) => {
        str += item + '=' + json[item] + '&';
    });

    str += 'key=' + KEY;

    console.log(str);

    str = hash(str, 'md5').toUpperCase();

    return str;

}

export function produceOutTradeNo () {
    let timestamp = new Date().getTime();

    return timestamp + '|' + roundStr().slice(0, 10);
}

export function produceDate () {
    let time = new Date();
    let str = "";
    
    let year = time.getFullYear(),
        month = (time.getMonth() + 1).toString(),
        date = (time.getDate()).toString(),
        hour = (time.getHours()).toString(),
        min = (time.getMinutes()).toString(),
        sec = (time.getSeconds()).toString();

    if (month.length < 2) {
        month = '0' + month;
    }

    if (date.length < 2) {
        date = '0' + date;
    }

    if (hour.length < 2) {
        hour = '0' + hour;
    }

    if (min.length < 2) {
        min = '0' + min;
    }

    if (sec.length < 2) {
        sec = '0' + sec;
    }

    return year + month + date + hour + min + sec;
}

export function hash (str, type) {
    let hashObj = crypto.createHash(type);
    hashObj.update(str);
    return hashObj.digest('hex');
}


function str2asc(str){
  return str.charCodeAt(0).toString(16);
}

function asc2str(str){
  return String.fromCharCode(str);
}

export function UrlEncode(str){ 
    var ret = ""; 
    var strSpecial = "!\"#$%&'()*+,/:;<=>?[]^`{|}~%"; 
    var tt = ""; 

    for (var i = 0, len = str.length; i < len; i++) { 
        var chr = str.charAt(i); 
        var c = str2asc(chr); 
        tt += chr + ":" + c + "n"; 
        if (parseInt("0x" + c) > 0x7f) { 
            ret += "%" + c.slice(0,2) + "%" + c.slice(-2); 
        } else { 
            if (chr == " ")  ret += "+"; 
            else if (strSpecial.indexOf(chr) != -1) ret += "%" + c.toString(16); 
            else  ret += chr; 
        } 
    } 

    return ret; 
} 

export function mkXml (conf) {
    let builder = new xml2js.Builder({
        rootName: conf.rootName,
        headless: conf.headless,
        cdata: conf.cdata
    });

    if (conf.cdataName) {
        let data = conf.json[conf.cdataName]
        conf.json[conf.cdataName] = '<$' + JSON.stringify(data);
    }

    let xml = builder.buildObject(conf.json);

    return xml.replace('<$', '');
}

export function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

