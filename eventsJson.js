'use strict';
const fs = require('fs');

class eventsJsonUtils {
    readJson(file, callback) {
        fs.readFile(file, (err, data) => {
            if (err) {
                console.log(err);
                return callback(false);
            }
            return callback(JSON.parse(data.toString()));
        })
    };

    writeJson(file, eventsJson, callback) {
        let str = JSON.stringify(eventsJson, "", "\t")
        fs.writeFile(file, str, (err) => {
            if (err) {
                console.log(err);
                return callback(false);
            }
            return callback(true);

        })
    };

    /**
     * 添加待审核事件
     * @param {Object} meta 
     * @param {String} file 
     * @param {Function} callback 
     * @param {Object} pendingActivity 
     * @param {"add"|"del"} [pendingActivity.act] 添加/删除
     * @param {String} [pendingActivity.name] 活动事件名
     * @param {String} [pendingActivity.good] 宜详情
     * @param {String} [pendingActivity.bad] 忌详情
     */
    addPendingEvent(meta, file, callback, pendingActivity) {
        this.readJson(file, (events) => {
            if (!events) meta.$send("读取活动文件失败");
            if (!events.pending) events.pending = [];
            let pendingActivityIndex = events.pending.findIndex((item) => {
                return (item.name === pendingActivity.name);
            })
            if (pendingActivityIndex >= 0) {
                meta.$send("当前已有该事件待审核");
                return callback(false);
            }
            events.pending.push(pendingActivity);
            this.writeJson(file, events, (result) => {
                if (result) {
                    meta.$send("已提交审核");
                    return callback(pendingActivity);
                }
                meta.$send("写入活动文件失败");
                return callback(false);
            });
        });
    }

    addEvent(meta, file, name, good, bad, fromPending = false) {
        this.readJson(file, (events) => {
            if (!events) meta.$send("读取活动文件失败");
            let oldActivityIndex = events.activities.findIndex((item) => {
                return (item.name === name);
            })
            if (oldActivityIndex < 0) {
                events.activities.push({ name, good, bad });
                if (fromPending) {
                    events.pending = events.pending.filter(item => { item.name !== name });
                }
                this.writeJson(file, events, (result) => {
                    if (result) meta.$send("添加成功");
                    else meta.$send("添加失败");
                });
            } else {
                events.activities[oldActivityIndex].good = good;
                events.activities[oldActivityIndex].bad = bad;
                this.writeJson(file, events, (result) => {
                    if (result) meta.$send("修改成功");
                    else meta.$send("修改失败");
                });
            }
        });
    }

    delEvent(meta, file, name, fromPending = false) {
        this.readJson(file, (events) => {
            if (!events) meta.$send("读取活动文件失败");
            let oldActivityIndex = events.activities.findIndex((item) => {
                return (item.name === name);
            })
            if (oldActivityIndex < 0) {
                meta.$send("找不到该事件");
            } else {
                events.activities.splice(oldActivityIndex, 1);
                if (fromPending) {
                    events.pending = events.pending.filter(item => { item.name !== name });
                }
                this.writeJson(file, events, (result) => {
                    if (result) meta.$send("删除成功");
                    else meta.$send("删除成功");
                });
            }
        });
    }
}

module.exports = eventsJsonUtils;
