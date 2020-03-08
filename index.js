'use strict';

const run = require('./run');
const fs = require('fs');
const path = require('path');

// Koishi插件名
module.exports.name = 'OsuerCalendar';
// 插件处理和输出
module.exports.apply = (ctx, dirName) => {
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
    ctx.command('今日运势')
        .action(({ meta }) => {
            return run(meta, eventPath);
        });
};
