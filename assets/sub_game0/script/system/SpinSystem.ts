import { director, macro, Scheduler } from "cc";
import { Clock } from "db://assets/doge/framework/common/Clock";
import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { Language } from "db://assets/doge/framework/language/Language";
import { UploadSystem } from "./UploadSystem";

export const STORAGE = {
    SPIN_TIMES: "SPIN_TIMES",
    TREASURE_TIMES: "TREASURE_TIMES",
    JACKPOT_TIMES: "JACKPOT_TIMES",
    CLAIM_TIMES: "CLAIM_TIMES",
    CLAIM_DATE: "CLAIM_DATE",
    SPIN_REPLENISH_DATE: "SPIN_REPLENISH_DATE",
}

export class SpinSystem {

    private static _instance = null;
    public static get I(): SpinSystem {
        if (!SpinSystem._instance) {
            SpinSystem._instance = new SpinSystem();
        }
        return SpinSystem._instance;
    }

    private vo: SpinSystemVO = new SpinSystemVO();

    // 初始化
    public init(successCount: number) {
        this.vo.spinSuccessCount = successCount;
        this.vo.times = parseInt(StorageBox.load(STORAGE.SPIN_TIMES, this.vo.spinReplenishLimit.toString()));
        this.vo.treasure = parseInt(StorageBox.load(STORAGE.TREASURE_TIMES, "0"));
        this.vo.jackpot = parseInt(StorageBox.load(STORAGE.JACKPOT_TIMES, "0"));

        this.vo.claimTimes = parseInt(StorageBox.load(STORAGE.CLAIM_TIMES, "0"));
        this.vo.claimDate = parseInt(StorageBox.load(STORAGE.CLAIM_DATE, "0"));
        let currDate = Clock.zero(new Date()).getTime();
        if (currDate > this.vo.claimDate) {
            this.vo.claimTimes = 0;
            this.vo.claimDate = currDate;
        }

        this.vo.spinReplenishDate = parseInt(StorageBox.load(STORAGE.SPIN_REPLENISH_DATE, "0"));
        if (this.vo.spinReplenishDate != 0) {
            let time = new Date().getTime() - this.vo.spinReplenishDate;
            let count = Math.floor(time / this.vo.spinReplenishDateLimit);
            this.addTimes(count);
            if (this.vo.times >= this.vo.spinReplenishLimit) {
                // 离线时补充足够
                this.vo.spinReplenishDate = 0;
            } else {
                // 离线时未补充足够
                this.vo.spinReplenishDate += count * this.vo.spinReplenishDateLimit;
            }
        }

        let sch: Scheduler = director.getScheduler();
        sch.schedule(() => {
            this.onUpdate();
        }, sch, 0, macro.REPEAT_FOREVER, 0, false);

        this.refTimes();
        this.refTreasure();
    }

    onUpdate() {
        if (this.vo.times < this.vo.spinReplenishLimit) {
            let currDate = new Date().getTime();
            // spin开始计时补充
            if (this.vo.spinReplenishDate == 0) {
                this.vo.spinReplenishDate = currDate;
            }
            let diff = currDate - this.vo.spinReplenishDate;
            diff = diff <= this.vo.spinReplenishDateLimit ? diff : this.vo.spinReplenishDateLimit;
            this.vo.spinReplenishTime = Math.ceil((this.vo.spinReplenishDateLimit - diff) / 1000);
            if (diff >= this.vo.spinReplenishDateLimit) {
                // 补充一次
                this.vo.spinReplenishDate = currDate;
                this.addTimes();
            }
        } else {
            // spin停止计时补充
            if (this.vo.spinReplenishDate != 0) {
                this.vo.spinReplenishDate = 0
            }
            this.vo.spinReplenishTime = -1;
        }
    }

    addTimes(num: number = 1) {
        let times = this.vo.times;
        times += num;
        if (times <= 0) {
            times = 0
        }
        if (times > this.vo.spinReplenishLimit) {
            times = this.vo.spinReplenishLimit;
        }
        this.vo.times = times;
        this.refTimes();
    }

    refTimes() {
        Language.updVariable("spinTimes", this.vo.times.toString());
    }

    hasTimes() {
        return this.vo.times > 0;
    }

    addTreasure(num: number = 1) {
        let treasure = this.vo.treasure;
        treasure += num;
        if (treasure < 0) {
            treasure = 0
        } else if (treasure > this.vo.treasureLimit) {
            treasure = this.vo.treasureLimit;
        }
        this.vo.treasure = treasure;
    }

    refTreasure() {
        Language.updVariable("treasure", this.vo.treasure.toString());
    }

    isTreasure() {
        return this.vo.treasure >= this.vo.treasureLimit;
    }

    addJackpotTimes(num: number = 1) {
        let jackpot = this.vo.jackpot;
        jackpot += num;
        if (jackpot < 0) {
            jackpot = 0
        } else if (jackpot > this.vo.jackpotLimit) {
            jackpot = this.vo.jackpotLimit;
        }
        this.vo.jackpot = jackpot;
    }

    refJackpot() {
        Language.updVariable("jackpot", this.vo.jackpot.toString());
    }

    isDrawCard() {
        return this.vo.jackpot >= this.vo.jackpotLimit;
    }

    addClaimTimes(num: number = 1) {
        this.vo.claimTimes += num;
    }

    public setTimes(times: number) {
        this.vo.times = times;
    }

    public getTimes() {
        return this.vo.times;
    }

    public setTreasure(times: number) {
        this.vo.treasure = times;
    }

    public getTreasure() {
        return this.vo.treasure;
    }

    public setJackpotTimes(times: number) {
        this.vo.jackpot = times;
    }

    public getJackpotTimes() {
        return this.vo.jackpot;
    }

    public getTreasureLimit() {
        return this.vo.treasureLimit;
    }

    public getClaimTimes() {
        return this.vo.claimTimes;
    }

    public getClaimLimit() {
        return this.vo.claimLimit;
    }

    public getReplenishTimes() {
        return this.vo.replenishTimes;
    }

    public getTreasureSpinTimes() {
        return this.vo.treasureSpinTimes
    }

    public getSpinReplenishTime() {
        return this.vo.spinReplenishTime;
    }

    public spinSuccess() {
        this.vo.spinSuccessCount += 1;
        UploadSystem.I.level();
    }

    public getSpinSuccessCount() {
        return this.vo.spinSuccessCount;
    }
}

export class SpinSystemVO {

    public readonly treasureLimit: number = 12;
    public readonly jackpotLimit: number = 6;
    public readonly treasureSpinTimes: number = 3;
    public readonly replenishTimes: number = 10;
    public readonly claimLimit: number = 2;
    public readonly spinReplenishLimit: number = 30;
    public readonly spinReplenishDateLimit: number = 60000;

    private _times: number = 0;
    public get times(): number {
        return this._times;
    }
    public set times(value: number) {
        this._times = value;
        StorageBox.save(STORAGE.SPIN_TIMES, this._times.toString());
    }

    private _treasure: number = 0;
    public get treasure(): number {
        return this._treasure;
    }
    public set treasure(value: number) {
        this._treasure = value;
        StorageBox.save(STORAGE.TREASURE_TIMES, this._treasure.toString());
    }

    private _jackpot: number = 0;
    public get jackpot(): number {
        return this._jackpot;
    }
    public set jackpot(value: number) {
        this._jackpot = value;
        StorageBox.save(STORAGE.JACKPOT_TIMES, this._jackpot.toString());
    }

    private _claimTimes: number = 0;
    public get claimTimes(): number {
        return this._claimTimes;
    }
    public set claimTimes(value: number) {
        this._claimTimes = value;
        StorageBox.save(STORAGE.CLAIM_TIMES, this._claimTimes.toString());
    }

    private _claimDate: number = 0;
    public get claimDate(): number {
        return this._claimDate;
    }
    public set claimDate(value: number) {
        this._claimDate = value;
        StorageBox.save(STORAGE.CLAIM_DATE, this._claimDate.toString());
    }

    private _spinReplenishDate: number = 0;
    public get spinReplenishDate(): number {
        return this._spinReplenishDate;
    }
    public set spinReplenishDate(value: number) {
        this._spinReplenishDate = value;
        StorageBox.save(STORAGE.SPIN_REPLENISH_DATE, this._spinReplenishDate.toString());
    }

    private _spinReplenishTime: number = -1;
    public get spinReplenishTime(): number {
        return this._spinReplenishTime;
    }
    public set spinReplenishTime(value: number) {
        this._spinReplenishTime = value;
    }

    private _spinSuccessCount: number = 0;
    public get spinSuccessCount(): number {
        return this._spinSuccessCount;
    }
    public set spinSuccessCount(value: number) {
        this._spinSuccessCount = value;
    }
}


