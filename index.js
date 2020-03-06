'use strict';

const run = require('./run');

// Koishi插件名
module.exports.name = 'OsuerCalendar';
// 插件处理和输出
module.exports.apply = (ctx) => {
    ctx.command('今日运势')
        .action(({ meta }) => {
            return run(meta);
        });
};
