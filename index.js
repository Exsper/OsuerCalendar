'use strict';

const run = require('./run');
const fs = require('fs');
const path = require('path');
const eventsJson = require('./eventsJson');
const thisPath = __dirname;

// Koishi插件名
module.exports.name = 'OsuerCalendar';
// 插件处理和输出
module.exports.apply = (ctx, dirName, users) => {
    let eventPath = "";
    let needPath = path.join(dirName, "./osuercalendar-events.json");
    let sameplePath = path.join(thisPath, "./osuercalendar-events-sample.json");
    fs.exists(needPath, function (exists) {
        if (exists) eventPath = needPath;
        else {
            fs.copyFile(sameplePath, needPath, (err) => {
                if (err) throw err;
                eventPath = needPath;
            });
        }
    });
    ctx.command('今日运势')
        .action(({ meta }) => {
            return run(meta, eventPath);
        });
    ctx.command('增加活动 <arg1> <arg2> <arg3>')
        .action(({ meta }, arg1, arg2, arg3) => {
            if (users.indexOf(meta.userId) < 0) return meta.$send("抱歉，您没有权限修改活动");
            else return eventsJson.addEvent(meta, eventPath, arg1, arg2, arg3);
        });
    ctx.command('删除活动 <arg1>')
        .action(({ meta }, arg1) => {
            if (users.indexOf(meta.userId) < 0) return meta.$send("抱歉，您没有权限修改活动");
            else return eventsJson.delEvent(meta, eventPath, arg1);
        });
};
