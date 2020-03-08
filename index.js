'use strict';

const run = require('./run');
const fs = require('fs');
const path = require('path');
const thisPath = __dirname;

// Koishi插件名
module.exports.name = 'OsuerCalendar';
// 插件处理和输出
module.exports.apply = (ctx, dirName) => {
    let eventPath = "";
    let needPath = path.join(dirName, "./osuercalendar-events.json");
    let sameplePath = path.join(thisPath, "./osuercalendar-events-sample.json");
    fs.exists(needPath, function (exists) {
        if(exists) eventPath = needPath;
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
};
