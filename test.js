'use strict';

const run = require('./run');
const fs = require('fs');
const path = require('path');
const addEvent = require('./eventsJson').addEvent;
const delEvent = require('./eventsJson').delEvent;
const filePath = __dirname + "1.json";
const thisPath = __dirname;
// 模拟meta
console.log("请输入qq号或指令");
class meta {
    constructor(qqId) {
        this.userId = qqId; // 发送者id
    }
    $send(s) {
        console.log("向" + this.userId + "发送消息：" + s);
    }
}
let eventPath = "";
let sameplePath = path.join(thisPath, "./eventsSample.json");
fs.exists(filePath, function (exists) {
    if (exists) eventPath = filePath;
    else {
        fs.copyFile(sameplePath, filePath, (err) => {
            if (err) throw err;
            eventPath = filePath;
        });
    }
});


let readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('line', function (line) {

    if (line === "testadd") {
        addEvent(meta, eventPath, "13", "g13", "b13");
    } else if (line === "testadd2") {
        addEvent(meta, eventPath, "5", "g5", "b5");
    } else if (line === "testdel") {
        delEvent(meta, eventPath, "6");
    } else if (line === "testdel2") {
        delEvent(meta, eventPath, "15");
    } else {
        let m = new meta(line);
        run(m, eventPath);
    }
});
rl.on('close', function () {
    process.exit();
});

