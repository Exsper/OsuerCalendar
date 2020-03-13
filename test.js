'use strict';

const run = require('./run');
const fs = require('fs');
const path = require('path');
const EventsJson = require('./eventsJson');
const thisPath = __dirname;
// 模拟meta
console.log("请输入'QQ号,指令'");
class Meta {
    constructor(message) {
        this.userId = parseInt(message.split(",")[0]);
        this.message = message.split(",")[1];
    }
    $send(s) {
        console.log("向" + this.userId + "发送消息：" + s);
    }
}

const eventsJson = new EventsJson();

const eventPath = path.join(thisPath, "./osuercalendar-events.json");
const userPath = path.join(thisPath, "./osuercalendar-users.json");
const samepleEventPath = path.join(thisPath, "./eventsSample.json");
const samepleUserPath = path.join(thisPath, "./usersSample.json");

fs.exists(eventPath, function (exists) {
    if (!exists) {
        fs.copyFile(samepleEventPath, eventPath, (err) => {
            if (err) throw err;
        });
    }
});
fs.exists(userPath, function (exists) {
    if (!exists) {
        fs.copyFile(samepleUserPath, userPath, (err) => {
            if (err) throw err;
        });
    }
});

function next() {
    console.log("不作处理，转入下个插件")
}

let readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('line', function (line) {
    try {
        let meta = new Meta(line);
        const command = meta.message.trim().split(" ").filter(item => item != '');
        if (command.length < 1) return next();
        if (command[0] === "今日运势") return run(meta, eventPath);
        if (command[0].substring(0, 1) !== "!" && command[0].substring(0, 1) !== "！") return next();
        if (command[0].length < 2) return next();
        let act = command[0].substring(1);
        if (act === "添加活动") {
            if (command.length !== 4) return meta.$send("请输入正确指令：添加活动 活动名称 宜详情 忌详情");
            return eventsJson.runAdd(meta, eventPath, userPath, command[1], command[2], command[3]);
        }
        if (act === "删除活动") {
            if (command.length !== 2) return meta.$send("请输入正确指令：删除活动 活动名称");
            return eventsJson.runDel(meta, eventPath, userPath, command[1]);
        }
        if (act === "确认") {
            if (command.length !== 2) return meta.$send("请输入正确指令：确认 待审核活动名称");
            return eventsJson.confirmPendingEvent(meta, eventPath, userPath, command[1]);
        }
        if (act === "取消") {
            if (command.length !== 2) return meta.$send("请输入正确指令：取消 待审核活动名称");
            return eventsJson.refusePendingEvent(meta, eventPath, userPath, command[1]);
        }
        if (act === "待审核") {
            return eventsJson.showPendingEvent(meta, eventPath);
        }
        if (act === "查看活动") {
            if (command.length !== 2) return meta.$send("请输入正确指令：查看活动 活动名称");
            return eventsJson.showEvent(meta, eventPath, command[1]);
        }
        return next();
    }
    catch (ex) {
        console.log(ex);
        return next();
    }
});
rl.on('close', function () {
    process.exit();
});

