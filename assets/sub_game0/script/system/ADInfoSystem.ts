import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { STORAGE } from "../../constant/Constant";


export class ADInfoSystem {
    private static _instance = null;
    public static get I(): ADInfoSystem {
        if (!ADInfoSystem._instance) {
            ADInfoSystem._instance = new ADInfoSystem();
        }
        return ADInfoSystem._instance;
    }

    private vo: ADSystemVO = new ADSystemVO();

    public init() {
        this.vo.totalAdCount = parseInt(StorageBox.load("TOTAL_AD_COUNT", "0"));
    }

    public getTotalAdCount(): number {
        return this.vo.totalAdCount;
    }

    public addTotalAdCount() {
        this.vo.totalAdCount += 1;
    }

    mergeCountUp(num: number = 1) {
        this.vo.mergeCount += num;
    }

    mergeTimesUp(num: number = 1) {
        this.vo.mergeTimes += num;
    }

    mergeTimesDown(num: number = 1) {
        this.vo.mergeTimes -= num;
    }

    mergeTimesClear() {
        this.vo.mergeTimes = 0;
    }

    passedTimesUp(num: number = 1) {
        this.vo.passedTimes += num;
    }

    passedTimesDown(num: number = 1) {
        this.vo.passedTimes -= num;
    }

    passedTimesClear() {
        this.vo.passedTimes = 0;
    }

    skipAdTimesUp(num: number = 1) {
        this.vo.skipAdTimes += num;
    }

    skipAdTimesDown(num: number = 1) {
        this.vo.skipAdTimes -= num;
    }

    skipAdTimesClear() {
        this.vo.skipAdTimes = 0;
    }

    isNormalAd() {
        console.log("mergeCount", this.vo.mergeCount);
        let condition = 0;
        let len = this.vo.normalADCondition.length;
        if (this.vo.mergeCount >= len) {
            condition = this.vo.normalADCondition[len - 1];
        } else {
            condition = this.vo.normalADCondition[this.vo.mergeCount];
        }
        console.log("mergeTimes", this.vo.mergeTimes, "Condition", condition);
        let result = this.vo.mergeTimes % condition;
        return result == 0;
    }

    isPassedAd() {
        let condition = this.vo.passedADCondition;
        console.log("passedTimes", this.vo.passedTimes, "Condition", condition);
        let result = this.vo.passedTimes % condition;
        return result == 0;
    }

    isNoneAd() {
        let condition = this.vo.noneADCondition;
        console.log("mergeTimes", this.vo.mergeTimes, "Condition", condition);
        let result = this.vo.mergeTimes % condition;
        return result == 0;
    }

    isCompulsoryAd() {
        let condition = this.vo.compulsoryADCondition;
        console.log("skipAdTimes", this.vo.skipAdTimes, "Condition", condition);
        let result = this.vo.skipAdTimes % condition;
        return result == 0;
    }
}

class ADSystemVO {

    // 普通广告弹出条件
    public readonly normalADCondition: number[] = [4];
    // 通关广告弹出条件
    public readonly passedADCondition: number = 3;
    // 强制广告弹出条件
    public readonly compulsoryADCondition: number = 3;
    // 无广告奖励弹出条件
    public readonly noneADCondition: number = 2;


    // 观看广告总次数
    private _totalAdCount: number = 0;
    // 合成个数（合成总个数 , 用于条件的分段）
    private _mergeCount: number = 0;
    // 合成次数（用于普通广告弹出和无广告奖励弹出）
    private _mergeTimes: number = 0;
    // 通关次数（用于通关广告弹出）
    private _passedTimes: number = 0;
    // 跳过广告次数（用于强制广告弹出）
    private _skipAdTimes: number = 0;

    public get totalAdCount(): number {
        return this._totalAdCount;
    }
    public set totalAdCount(value: number) {
        this._totalAdCount = value;
        StorageBox.save("TOTAL_AD_COUNT", this._totalAdCount.toString());
    }

    public get mergeCount(): number {
        return this._mergeCount;
    }
    public set mergeCount(value: number) {
        this._mergeCount = value;
    }

    public get mergeTimes(): number {
        return this._mergeTimes;
    }
    public set mergeTimes(value: number) {
        this._mergeTimes = value;
    }

    public get passedTimes(): number {
        return this._passedTimes;
    }
    public set passedTimes(value: number) {
        this._passedTimes = value;
    }

    public get skipAdTimes(): number {
        return this._skipAdTimes;
    }
    public set skipAdTimes(value: number) {
        this._skipAdTimes = value;
    }
}


