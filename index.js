'use strict';

const run = require('./run');
const fs = require('fs');
const path = require('path');
const eventsJson = require('./eventsJson');
const thisPath = __dirname;

// Koishi插件名
module.exports.name = 'osuercalendar';
// 插件处理和输出
module.exports.apply = (ctx, options = {}) => {
    const filePath = options.filePath || path.join(thisPath, "../../events.json");
    const users = options.users;
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
    ctx.command('今日运势')
        .action(({ meta }) => {
            return run(meta, eventPath);
        });
    ctx.command('增加活动 <arg1> <arg2> <arg3>')
        .action(({ meta }, arg1, arg2, arg3) => {
            if (!(arg1 && arg2 && arg3)) return meta.$send("请输入正确参数：增加活动 活动名称 宜详情 忌详情");
            else if (!!users && users.indexOf(meta.userId) < 0) return meta.$send("抱歉，您没有权限修改活动");
            else return eventsJson.addEvent(meta, eventPath, arg1, arg2, arg3);
        });
    ctx.command('删除活动 <arg1>')
        .action(({ meta }, arg1) => {
            if (!arg1) return meta.$send("请输入正确参数：删除活动 活动名称");
            else if (!!users && users.indexOf(meta.userId) < 0) return meta.$send("抱歉，您没有权限修改活动");
            else return eventsJson.delEvent(meta, eventPath, arg1);
        });
};
