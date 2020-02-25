'use strict';

const run = require('./run');

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
let readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('line', function (line) {
    run(new meta(line));
});
rl.on('close', function () {
    process.exit();
});

