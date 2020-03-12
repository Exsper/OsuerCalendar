# OsuerCalendar

## install
```sh
npm install Exsper/OsuerCalendar
```

## usage
```javascript
app.plugin(require('osuercalendar'));
```
or
```javascript
module.exports = {
    plugins: [
        ['osuercalendar'],
    ],
}
```

### 配置文件
第一次运行，会在插件所在目录的上上层（一般为node_modules文件夹上一层）创建配置文件：   
```sh
osuercalendar-events.json   // 所有黄历内容
osuercalendar-users.json    // 管理员名单和黑白名单
```


### 指令
koishi指令前缀 + "今日运势"   
koishi指令前缀 + "添加活动 活动名称 宜详情 忌详情"   
koishi指令前缀 + "删除活动 活动名称"   
koishi指令前缀 + "查看活动 活动名称"   
koishi指令前缀 + "待审核"   
koishi指令前缀 + "确认 待审核活动名称"   
koishi指令前缀 + "取消 待审核活动名称"   