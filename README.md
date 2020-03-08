# OsuerCalendar

## install
```sh
npm install Exsper/OsuerCalendar
```

## usage
```javascript
app.plugin(require('osuercalendar'), __dirname, [1234567, ...]);
```
or
```javascript
module.exports = {
    plugins: [
        ['osuercalendar', __dirname, [1234567, ...]],
    ],
}
```

### 参数
__dirname 运行后会在你的__dirname下生成"osuercalendar-events.json"文件，方便自行修改
[1234567, ...] 为有权限修改活动的QQ号列表，number格式

### 指令
koishi指令前缀 + "今日运势"
koishi指令前缀 + "增加活动 活动名称 宜详情 忌详情"
koishi指令前缀 + "删除活动 活动名称"
