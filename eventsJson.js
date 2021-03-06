'use strict';
const fs = require('fs');

class eventsJsonUtils {
    readJson(file) {
        let data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data.toString());
    };

    writeJson(file, eventsJson) {
        let str = JSON.stringify(eventsJson, "", "\t")
        fs.writeFileSync(file, str, 'utf8');
    };

    /**
     * 添加待审核事件
     * @param {Object} meta 
     * @param {String} file 
     * @param {Object} pendingActivity 
     * @param {String} [pendingActivity.name] 活动事件名
     * @param {String} [pendingActivity.good] 宜详情
     * @param {String} [pendingActivity.bad] 忌详情
     * @returns {Boolean} 
     */
    addPendingEvent(meta, file, pendingActivity) {
        let events = this.readJson(file);
        if (!events) {
            meta.$send("读取活动文件失败");
            return false;
        }
        if (!events.pending) events.pending = [];
        let pendingActivityIndex = events.pending.findIndex((item) => {
            return (item.name === pendingActivity.name);
        })
        if (pendingActivityIndex >= 0) {
            meta.$send("当前已有该事件待审核");
            return false;
        }
        events.pending.push(pendingActivity);
        this.writeJson(file, events);
        meta.$send("已提交审核");
        return true;
    }

    delPendingEvent(meta, file, name) {
        let events = this.readJson(file);
        if (!events) return meta.$send("读取活动文件失败");
        if (!events.pending) return meta.$send("找不到任何待审核活动");
        let pendingActivityIndex = events.pending.findIndex((item) => {
            return (item.name === name);
        })
        if (pendingActivityIndex < 0) return meta.$send("找不到该待审核活动");
        events.pending = events.pending.filter(item => item.name !== name);
        this.writeJson(file, events);
        return meta.$send("已删除该待审核活动");
    }

    addEvent(meta, file, name, good, bad, fromPending = false) {
        let events = this.readJson(file);
        if (!events) return meta.$send("读取活动文件失败");
        if (fromPending) {
            let pendingActivityIndex = events.pending.findIndex((item) => {
                return (item.name === name);
            });
            if (pendingActivityIndex < 0) return meta.$send("待审核活动中找不到该活动");
            good = events.pending[pendingActivityIndex].good;
            bad = events.pending[pendingActivityIndex].bad;
        }
        let oldActivityIndex = events.activities.findIndex((item) => {
            return (item.name === name);
        })
        if (oldActivityIndex < 0) {
            events.activities.push({ name, good, bad });
            if (fromPending) {
                events.pending = events.pending.filter(item => item.name !== name);
            }
            this.writeJson(file, events);
            return meta.$send("添加成功");
        } else {
            events.activities[oldActivityIndex].good = good;
            events.activities[oldActivityIndex].bad = bad;
            this.writeJson(file, events);
            return meta.$send("修改成功");
        }
    }

    delEvent(meta, file, name, fromPending = false) {
        let events = this.readJson(file);
        if (!events) return meta.$send("读取活动文件失败");
        let oldActivityIndex = events.activities.findIndex((item) => {
            return (item.name === name);
        })
        if (oldActivityIndex < 0) {
            return meta.$send("找不到该事件");
        } else {
            events.activities.splice(oldActivityIndex, 1);
            if (fromPending) {
                events.pending = events.pending.filter(item => item.name !== name);
            }
            this.writeJson(file, events);
            return meta.$send("删除成功");
        }
    }

    runAdd(meta, eventPath, userPath, name, good, bad, app) {
        let users = this.readJson(userPath);
        let isAdmin = false;
        let atBlackList = false;
        let atWhiteList = false;
        if (!users) return meta.$send("读取配置文件失败");
        if (users.admin && users.admin.indexOf(meta.userId) >= 0) isAdmin = true;
        if (users.blackList && users.blackList.indexOf(meta.userId) >= 0) atBlackList = true;
        if (users.whiteList && users.whiteList.indexOf(meta.userId) >= 0) atWhiteList = true;
        if (isAdmin || atWhiteList) return this.addEvent(meta, eventPath, name, good, bad);
        else if (atBlackList) return meta.$send("抱歉，我讨厌你");
        else {
            let result = this.addPendingEvent(meta, eventPath, { act: "add", name, good, bad });
            if (result) {
                let output = "请审核活动：" + name + " 宜：" + good + " 忌：" + bad + "\n";
                output = output + '输入 "确认/取消 待审核活动名称" 以审核活动';
                users.admin.map((user) => {
                    app.sender.sendPrivateMsgAsync(user, output);
                });
                return;
            }
        }
    }

    runDel(meta, eventPath, userPath, name) {
        let users = this.readJson(userPath);
        let isAdmin = false;
        let atBlackList = false;
        let atWhiteList = false;
        if (!users) return meta.$send("读取配置文件失败");
        if (users.admin && users.admin.indexOf(meta.userId) >= 0) isAdmin = true;
        if (users.blackList && users.blackList.indexOf(meta.userId) >= 0) atBlackList = true;
        if (users.whiteList && users.whiteList.indexOf(meta.userId) >= 0) atWhiteList = true;
        if (isAdmin || atWhiteList) return this.delEvent(meta, eventPath, name);
        else return meta.$send("抱歉，您没有权限，无法删除活动");
    }

    confirmPendingEvent(meta, eventPath, userPath, name) {
        let users = this.readJson(userPath);
        if (!users) return meta.$send("读取配置文件失败");
        if (users.admin && users.admin.indexOf(meta.userId) >= 0) {
            return this.addEvent(meta, eventPath, name, "", "", true);
        }
        else return meta.$send("抱歉，您没有审核权限");
    }

    refusePendingEvent(meta, eventPath, userPath, name) {
        let users = this.readJson(userPath);
        if (!users) return meta.$send("读取配置文件失败");
        if (users.admin && users.admin.indexOf(meta.userId) >= 0) {
            return this.delPendingEvent(meta, eventPath, name);
        }
        else return meta.$send("抱歉，您没有审核权限");
    }

    showPendingEvent(meta, eventPath) {
        let events = this.readJson(eventPath);
        if (!events) return meta.$send("读取活动文件失败");
        let output = "";
        if (!events.pending) return meta.$send("当前没有待审核活动");
        let length = events.pending.length;
        if (length < 1) return meta.$send("当前没有待审核活动");
        if (length > 10) {
            length = 10;
            output = output + "待审核活动较多，只显示前10个";
        }
        for (let i = 0; i < length; i++) {
            output = output + "活动：" + events.pending[i].name + " 宜：" + events.pending[i].good + " 忌：" + events.pending[i].bad + "\n";
        }
        output = output + '管理员输入 "确认/取消 待审核活动名称" 以审核活动';
        return meta.$send(output);
    }

    showEvent(meta, eventPath, name) {
        let events = this.readJson(eventPath);
        if (!events) return meta.$send("读取活动文件失败");
        let activityIndex = events.activities.findIndex((item) => {
            return (item.name === name);
        })
        if (activityIndex < 0) return meta.$send("找不到该活动");
        let output = "宜详情：" + events.activities[activityIndex].good + " \t忌详情：" + events.activities[activityIndex].bad;
        return meta.$send(output);
    }
}

module.exports = eventsJsonUtils;
