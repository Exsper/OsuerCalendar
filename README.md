# OsuerCalendar

## install
```sh
npm install Exsper/OsuerCalendar
```

## usage
```javascript
app.plugin(require('osuercalendar'), options);
```
or
```javascript
module.exports = {
    plugins: [
        ['osuercalendar', options],
    ],
}
```

### options
```javascript
{
    dirpath : __dirname,    // 运行后会在你的dirpath下生成"osuercalendar-events.json"文件，方便自行修改，省略该项则为插件脚本所在目录
    users : [1234567, ...]    // 有权限修改活动的QQ号列表，QQ号为number格式，省略该项则任何人均可修改
}
```

### 指令
koishi指令前缀 + "今日运势"   
koishi指令前缀 + "增加活动 活动名称 宜详情 忌详情"   
koishi指令前缀 + "删除活动 活动名称"   
