
import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { PlayerSystem } from "db://assets/main/script/system/PlayerSystem";

export class LotterySystem {

    private static _instance = null;
    public static get I(): LotterySystem {
        if (!LotterySystem._instance) {
            LotterySystem._instance = new LotterySystem();
        }
        return LotterySystem._instance;
    }

    private vo: LotterySystemVO = new LotterySystemVO();

    init() {
        this.vo.spinCount = parseInt(StorageBox.load("LOTTERY_COUNT", "0"));
    }

    setSpin(num: number) {
        this.vo.spinCount = num;
    }

    addSpin(num: number = 1) {
        let count = this.vo.spinCount;
        count += num;
        if (count > this.vo.spinLimit) {
            count = this.vo.spinLimit;
        }
        this.setSpin(count);
    }

    getSpin() {
        return this.vo.spinCount;
    }

    isComplete() {
        return this.vo.spinCount >= this.vo.spinLimit;
    }

    getLimit() {
        return this.vo.spinLimit;
    }
}

export class LotterySystemVO {
    public readonly spinLimit = 10;

    private _spinCount: number = 0;
    public get spinCount(): number {
        return this._spinCount;
    }
    public set spinCount(value: number) {
        this._spinCount = value;
        StorageBox.save("LOTTERY_COUNT", this._spinCount.toString());
    }
}

