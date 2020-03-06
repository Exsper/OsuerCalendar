'use strict';

class Activity {
	constructor(qqId) {
		this.qqId = qqId;
		this.today = new Date();
		this.iday = this.today.getFullYear() * 10000 + (this.today.getMonth() + 1) * 100 + this.today.getDate();
		this.seed = this.qqId * this.iday;

		this.luck = ["大吉", "中吉", "小吉", "末吉", "凶", "大凶"];
		this.mods = ["NoMod", "HR", "HD", "DT", "HDHR", "HRDT", "HDDT", "HDDTHR"];
		this.modsSpecial = ["EZDT", "NF", "SD", "PF", "FL", "EZHD", "Relax", "Auto", "ScoreV2"];
		this.activities = [{
			// 才疏学浅，欢迎修改/添加
			name: "日麻",
			good: "立直一发自摸！",
			bad: "碰喵吃喵杠喵荣喵！"
		}, {
			name: "MP",
			good: "所向披靡无人能及！",
			bad: "会被大佬打哭"
		}, {
			name: "刷PP",
			good: "拿pp就跟喝水一样",
			bad: "acc惨烈"
		}, {
			name: "打串图",
			good: "啪啦啪啦啪啦啪啦啪啦啪啦啪啦 SS！",
			bad: "300 100 100 50 50 x"
		}, {
			name: "打tech图",
			good: "1pc fc！",
			bad: "完全没读懂..."
		}, {
			name: "打elo",
			good: "暴打***",
			bad: "被吸了..."
		}, {
			name: "加好友",
			good: "和大佬成功双向",
			bad: "大佬为什么不回我..."
		}, {
			name: "挑战自己",
			good: "FDFD也不过如此",
			bad: "又双叒叕FAIL了..."
		}, {
			name: "肛榜",
			good: "#1轻松到手",
			bad: "233周目了..."
		}, {
			name: "向大佬请教",
			good: "太棒了，学到许多",
			bad: "太棒了，什么都没学到"
		}, {
			name: "换个模式玩玩",
			good: "全能大佬就是我",
			bad: "这咋玩嘛"

		}];
	}

	getStatList() {
		let statList = {};
		// 随机吉凶
		statList.luck = this.getRandomArray(this.luck);
		// 随机mod
		statList.mod = this.getRandomArray(this.mods);
		// 如果够幸运还有特殊mod
		if (this.random(this.seed/100, 100)<=10) statList.specialMod = this.getRandomArray(this.modsSpecial);
		// 随机事件
		const numGood = this.random(this.seed, 114) % 2 + 1;
		const numBad = this.random(this.seed, 514) % 2 + 1;
		const randomActivities = this.getRandomArray(this.activities, numGood + numBad);
		statList.goodList = randomActivities.slice(0, numGood);
		statList.badList = randomActivities.slice(numGood);

		return statList;
	}

	getRandomArray(array, size = 1) {
		const arrLength = array.length;
		let temp = new Array(arrLength);
		for (let i = 0; i < arrLength; ++i) {
			temp[i] = i;
		}

		let result = [];
		for (let i = size; i > 0; --i) {
			let index = this.random(this.seed, temp.length) - 1;
			result.push(array[temp[index]]);
			temp.splice(index, 1);
		}
		if (size === 1) return result[0];
		else return result;
	}

	random(seed, max) { //int [1,max]
		seed = (seed * 9301 + 49297) % 233280;
		return Math.ceil(seed / 233280.0 * max);
	}


}
module.exports = Activity;