# OsuerCalendar

## install
```sh
npm install Exsper/OsuerCalendar
```

## usage
```javascript
app.plugin(require('osuercalendar'), __dirname);
```
or
```javascript
module.exports = {
    plugins: [
        ['osuercalendar', __dirname],
    ],
}
```

运行后会在你的__dirname下生成"osuercalendar-events.json"文件，方便自行修改
