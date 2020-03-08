'use strict';
const fs = require('fs');


function readJson(file, callback) {
    fs.readFile(file, (err, data) => {
        if (err) {
            console.log(err);
            callback(false);
        }
        else callback(JSON.parse(data.toString()));
    })
};

function writeJson(file, eventsJson, callback) {
    let str = JSON.stringify(eventsJson, "", "\t")
    fs.writeFile(file, str, (err) => {
        if (err) {
            console.log(err);
            callback(false);
        }
        else callback(true);

    })
};

function addEvent(meta, file, name, good, bad) {
    readJson(file, (events) => {
        if (!events) meta.$send("读取活动文件失败");
        let oldActivityIndex = events.activities.findIndex((item) => {
            return (item.name === name);
        })
        if (oldActivityIndex < 0) {
            events.activities.push({ name, good, bad });
            writeJson(file, events, (result) => {
                if (result) meta.$send("添加成功");
                else meta.$send("添加失败");
            });
        } else {
            events.activities[oldActivityIndex].good = good;
            events.activities[oldActivityIndex].bad = bad;
            writeJson(file, events, (result) => {
                if (result) meta.$send("修改成功");
                else meta.$send("修改失败");
            });
        }
    });
}

function delEvent(meta, file, name) {
    readJson(file, (events) => {
        if (!events) meta.$send("读取活动文件失败");
        let oldActivityIndex = events.activities.findIndex((item) => {
            return (item.name === name);
        })
        if (oldActivityIndex < 0) {
            meta.$send("找不到该事件");
        } else {
            events.activities.splice(oldActivityIndex, 1);
            writeJson(file, events, (result) => {
                if (result) meta.$send("删除成功");
                else meta.$send("删除成功");
            });
        }
    });
}


module.exports.addEvent = addEvent;
module.exports.delEvent = delEvent;
