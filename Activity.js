'use strict';


class Activity {
	constructor(qqId, events) {
		this.qqId = qqId;
		this.today = new Date();
		this.iday = this.today.getFullYear() * 10000 + (this.today.getMonth() + 1) * 100 + this.today.getDate();
		this.seed = this.qqId * this.iday;

		this.luck = events.luck;
		this.mods = events.mods;
		this.modsSpecial = events.modsSpecial;
		this.activities = events.activities;
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
		const numGood = this.random(this.seed / 9, 114) % 2 + 1;
		const numBad = this.random(this.seed / 6, 514) % 2 + 1;
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
			let index = this.random(this.seed * i / arrLength, temp.length) - 1;
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