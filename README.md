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

#### osuercalendar-users.json
```javascript
    // 所有人：可以查看今日运势、查看指定活动内容、查看待审核内容
    "admin" : [12345678],       // 可以直接添加、删除活动，可以审核待添加活动
    "whiteList" : [123456788],  // 可以直接添加、删除活动
    "blackList" : [123456789]   // 不可以提交活动
    // 其他人：可以提交活动等候审核
```


### 指令
"今日运势"   
"添加活动 活动名称 宜详情 忌详情"   
"删除活动 活动名称"   
"查看活动 活动名称"   
"待审核"   
"确认 待审核活动名称"   
"取消 待审核活动名称"   