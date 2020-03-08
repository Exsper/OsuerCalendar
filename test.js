'use strict';

const run = require('./run');
const fs = require('fs');
const path = require('path');
const dirName = __dirname;
// 模拟meta
console.log("请输入qq号");
class meta {
    constructor(qqId) {
        this.userId = qqId; // 发送者id
    }
    $send(s) {
        console.log("向" + this.userId + "发送消息：" + s);
    }
}
let eventPath = "";
let needPath = path.join(dirName, "./osuercalendar-events.json");
let sameplePath = "./osuercalendar-events-sample.json";
fs.exists(needPath, async function (exists) {
    if(exists) eventPath = path.join(dirName, sameplePath);
    else {
        fs.copyFile(sameplePath, needPath, () => {
            eventPath = needPath;
        });
    }
});


let readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('line', function (line) {
    let m = new meta(line);
    run(m, eventPath);
});
rl.on('close', function () {
    process.exit();
});

