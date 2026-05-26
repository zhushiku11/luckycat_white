
import { CurrencyType, Language } from "db://assets/doge/framework/language/Language";
import { NetworkSystem } from "./NetworkSystem";
import { Toast } from "db://assets/doge/framework/init";
import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { LevelSystem } from "./LevelSystem";
import { ScoreSystem } from "./ScoreSystem";
import { CashWithdrawInfo, ConfigSystem, LevelWithdrawRewardInfo } from "./ConfigSystem";
import { director, macro, Scheduler } from "cc";
import { getEventEmiter } from "db://assets/doge/framework/common/EventEmitter";

export type LevelWithdrawState = {
    isClaim: number,
}

export class WithdrawSystem {

    private static _instance = null;
    public static get I(): WithdrawSystem {
        if (!WithdrawSystem._instance) {
            WithdrawSystem._instance = new WithdrawSystem();
        }
        return WithdrawSystem._instance;
    }

    private vo: WithdrawSystemVO = new WithdrawSystemVO();
    private isRecordSpin: boolean = false;

    public async init() {
        this.vo.spinTime = parseInt(StorageBox.load("SPIN_TIME", "0"));
        this.vo.jackpotTime = parseInt(StorageBox.load("JACKPOT_TIME", "0"));
        this.vo.spinCount = parseInt(StorageBox.load("SPIN_COUNT", "0"));
        this.vo.jackpotCount = parseInt(StorageBox.load("JACKPOT_COUNT", "0"));

        this.levelWithdrawState();
        // 加载数据
        await Promise.all([this.rewardRate(), this.platformInfo()]);

        let sch: Scheduler = director.getScheduler();
        sch.schedule(() => {
            if (this.vo.spinTime != 0) {
                let currTime = new Date().getTime();
                if (currTime > this.vo.spinTime) {
                    this.vo.spinCount = 0;
                    this.addSpinTime1Day();
                }
            } else if (this.vo.jackpotTime != 0) {
                let currTime = new Date().getTime();
                if (currTime > this.vo.jackpotTime) {
                    this.vo.jackpotCount = 0;
                    this.addJackpotTime1Day();
                }
            }
        }, sch, 0, macro.REPEAT_FOREVER, 0, false);

        getEventEmiter().on("AddAMoney", (oldValue: number, newValue: number) => {
            if (oldValue < 1000 && newValue >= 1000) {
                this.addSpinTime1Day();
            }
        }, this);
    }

    /**
     * 平台信息
     *
     * @memberof WithdrawSystem
     */
    public async platformInfo() {
        let result = await NetworkSystem.withdrawPlatform();
        if (result.error) {
            Toast.show(result.data);
        } else {
            this.vo.rateInfo = result.data.SbmWr;
            this.vo.platformData = result.data.SbmWwf;
            this.vo.canWithdrawCash = result.data.SbmUso.SbmEwl;
            this.vo.adCount = result.data.SbmUso.SbmLgd;
            this.vo.msgState = !!result.data.SbmUso.SbmImg;
        }
        this.vo.userInfo = result.data.SbmUso;
    }

    /**
     * 提现比例
     *
     * @memberof WithdrawSystem
     */
    public async rewardRate() {
        let result = await NetworkSystem.withdrawInfo();
        if (result.error) {
            Toast.show(result.data);
        } else {
            this.vo.rewardRateInfo = result.data;
        }
    }

    /**
     * 段位提现状态
     *
     * @memberof WithdrawSystem
     */
    public levelWithdrawState() {
        this.vo.levelWithdrawState = JSON.parse(StorageBox.load("LEVEL_WITHDRAW_STATE", `[{"isClaim":0},{"isClaim":0},{"isClaim":0},{"isClaim":0},{"isClaim":0},{"isClaim":0},{"isClaim":0}]`));
    }

    public getLevelWithdrawInfo() {
        switch (Language.currency) {
            case CurrencyType.ID:
                return ConfigSystem.I.LevelWithdrawRewardInfo_id;
            case CurrencyType.BR:
                return ConfigSystem.I.LevelWithdrawRewardInfo_br;
            case CurrencyType.US:
                return ConfigSystem.I.LevelWithdrawRewardInfo_us;
        }
    }

    public getLevelWithdrawState() {
        return this.vo.levelWithdrawState;
    }

    public getMaxLevelWithdrawInfo() {
        let index = this.getLevelWithdrawInfo().findIndex((value: LevelWithdrawRewardInfo) => {
            // return LevelSystem.I.getCurrLevel() < value.condition;
            return ScoreSystem.I.getGame2048() < value.condition;
        })
        if (index == -1) {
            index = this.getLevelWithdrawInfo().length;
        }
        index = index ? index - 1 : index;
        return this.getLevelWithdrawInfo()[index];
    }

    public claimLevelWithdraw(index: number) {
        this.vo.levelWithdrawState[index].isClaim = 1;
        StorageBox.save("LEVEL_WITHDRAW_STATE", JSON.stringify(this.vo.levelWithdrawState));
    }

    public getWithdrawInfo() {
        switch (Language.currency) {
            case CurrencyType.ID:
                return ConfigSystem.I.WithdrawInfo_id;
            case CurrencyType.BR:
                return ConfigSystem.I.WithdrawInfo_br;
            case CurrencyType.US:
                return ConfigSystem.I.WithdrawInfo_us;
        }
    }

    public getRateInfo() {
        return this.vo.rateInfo || [];
    }

    public getPlatformData() {
        return this.vo.platformData || [];
    }

    public getRewardRateInfo() {
        return this.vo.rewardRateInfo || {};
    }

    public getUserInfo() {
        return this.vo.userInfo;
    }

    public isShowWithdrawRate(level: number) {
        if (level == 0) {
            return false;
        }
        let item = this.vo.rateInfo.find((value: any) => {
            return level == value.SbmBen;
        })
        if (item) {
            return true
        }
        return false;
    }

    public getCanWithdrawCash() {
        return this.vo.canWithdrawCash;
    }

    public getAdCount() {
        return this.vo.adCount;
    }

    public addAdCount() {
        this.vo.adCount += 1;
    }

    public getRecord(): any[] {
        return this.vo.record;
    }

    public hasFeedbackMsg() {
        return this.vo.msgState;
    }

    getSpinTime() {
        return this.vo.spinTime;
    }

    getSpinCount() {
        return this.vo.spinCount;
    }

    getJackpotTime() {
        return this.vo.jackpotTime;
    }

    getJackpotCount() {
        return this.vo.jackpotCount;
    }

    setSpinTime(time: number) {
        this.vo.spinTime = time;
    }

    setJackpotTime(time: number) {
        this.vo.jackpotTime = time;
    }

    addSpinTime1Day() {
        let currTime = new Date().getTime();
        this.vo.spinTime = currTime + 86400000;
    }

    addJackpotTime1Day() {
        let currTime = new Date().getTime();
        this.vo.jackpotTime = currTime + 86400000;
    }

    recordSpin() {
        let currTime = new Date().getTime();
        if (this.vo.spinTime == 0 || currTime > this.vo.spinTime) {
            this.isRecordSpin = false;
            return;
        }

        this.vo.spinCount += 1;
        console.log("recordSpin", this.vo.spinCount);
        if (this.vo.spinCount >= 40) {
            this.vo.spinTime = 0;
            // 条件完成 转换到jackpot条件
            this.addJackpotTime1Day();
        }
        this.isRecordSpin = true;
    }

    recordJackpot() {
        if (this.isRecordSpin) {
            return;
        }

        let currTime = new Date().getTime();
        if (this.vo.jackpotTime == 0 || currTime > this.vo.jackpotTime) {
            return;
        }
        this.vo.jackpotCount += 1;
        if (this.vo.jackpotCount >= 10) {
            // 条件完成 转换到jackpot条件
            this.vo.jackpotTime = 0;
        }
    }
}

export class WithdrawSystemVO {

    private _goodsData: CashWithdrawInfo[] = null;
    public get goodsData(): CashWithdrawInfo[] {
        return this._goodsData;
    }
    public set goodsData(value: CashWithdrawInfo[]) {
        this._goodsData = value;
    }

    private _rateInfo: any[] = [];
    public get rateInfo(): any[] {
        return this._rateInfo;
    }
    public set rateInfo(value: any[]) {
        this._rateInfo = value;
    }

    private _platformData: any[] = [];
    public get platformData(): any[] {
        return this._platformData;
    }
    public set platformData(value: any[]) {
        this._platformData = value;
    }

    private _record: any[] = [];
    public get record(): any[] {
        return this._record;
    }
    public set record(value: any[]) {
        this._record = value;
    }

    private _levelWithdrawState: LevelWithdrawState[] = null;
    public get levelWithdrawState(): LevelWithdrawState[] {
        return this._levelWithdrawState;
    }
    public set levelWithdrawState(value: LevelWithdrawState[]) {
        this._levelWithdrawState = value;
    }

    private _rewardRateInfo: any = null;
    public get rewardRateInfo(): any {
        return this._rewardRateInfo;
    }
    public set rewardRateInfo(value: any) {
        this._rewardRateInfo = value;
    }

    private _canWithdrawCash = 0;
    public get canWithdrawCash() {
        return this._canWithdrawCash;
    }
    public set canWithdrawCash(value) {
        this._canWithdrawCash = value;
    }

    private _adCount: number = 0;
    public get adCount(): number {
        return this._adCount;
    }
    public set adCount(value: number) {
        this._adCount = value;
    }

    private _userInfo: any = null;
    public get userInfo(): any {
        return this._userInfo;
    }
    public set userInfo(value: any) {
        this._userInfo = value;
    }

    // feedback Msg 是否未读
    private _msgState: boolean = false;
    public get msgState(): boolean {
        return this._msgState;
    }
    public set msgState(value: boolean) {
        this._msgState = value;
    }

    // spin时间条件
    private _spinTime: number = 0;
    public get spinTime(): number {
        return this._spinTime;
    }
    public set spinTime(value: number) {
        this._spinTime = value;
        StorageBox.save("SPIN_TIME", this._spinTime.toString());
    }
    // spin次数条件
    private _spinCount: number = 0;
    public get spinCount(): number {
        return this._spinCount;
    }
    public set spinCount(value: number) {
        this._spinCount = value;
        StorageBox.save("SPIN_COUNT", this._spinCount.toString());
    }
    // Jackpot时间条件
    private _jackpotTime: number = 0;
    public get jackpotTime(): number {
        return this._jackpotTime;
    }
    public set jackpotTime(value: number) {
        this._jackpotTime = value;
        StorageBox.save("JACKPOT_TIME", this._jackpotTime.toString());
    }
    // Jackpot次数条件
    private _jackpotCount: number = 0;
    public get jackpotCount(): number {
        return this._jackpotCount;
    }
    public set jackpotCount(value: number) {
        this._jackpotCount = value;
        StorageBox.save("JACKPOT_COUNT", this._jackpotCount.toString());
    }
}

