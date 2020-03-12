'use strict';

const run = require('./run');
const fs = require('fs');
const path = require('path');
const eventsJson = require('./eventsJson');
const thisPath = __dirname;

// Koishi插件名
module.exports.name = 'osuercalendar';
// 插件处理和输出
module.exports.apply = (ctx) => {
    const filePath = path.join(thisPath, "../../osuercalendar-events.json");
    const users = path.join(thisPath, "../../osuercalendar-users.json");
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
    ctx.middleware((meta, next) => {
        try {
            const command = meta.message.trim().split(" ").filter(item => item != '');
            if (command.length < 1) return next();
            if (command[0] === "今日运势") return run(meta, eventPath);
            if (command[0] === "添加活动") {
                if (command.length !== 4) return meta.$send("请输入正确参数：增加活动 活动名称 宜详情 忌详情");
                return eventsJson.addEvent(meta, eventPath, command[1], command[2], command[3]);
            }
            if (command[0] === "删除活动") {
                if (command.length !== 2) return meta.$send("请输入正确参数：删除活动 活动名称");
                return eventsJson.delEvent(meta, eventPath, command[1]);
            }
        }
        catch (ex) {
            console.log(ex);
            return next();
        }
    });
};
