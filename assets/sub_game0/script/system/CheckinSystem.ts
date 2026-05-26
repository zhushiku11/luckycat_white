import { Clock } from "db://assets/doge/framework/common/Clock";
import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { CurrencyType, Language } from "db://assets/doge/framework/language/Language";
import { RedDotSystem } from "db://assets/main/script/system/RedDotSystem";

const STORAGE_KEY = {
    CHECKIN_DATA: "CHECKIN_DATA",
    CHECKIN_TIME: "CHECKIN_TIME",
    CHECKIN_POPUP_TIME: "CHECKIN_POPUP_TIME",
};

export class CheckinSystem {

    private static _instance = null;
    public static get I(): CheckinSystem {
        if (!CheckinSystem._instance) {
            CheckinSystem._instance = new CheckinSystem();
        }
        return CheckinSystem._instance;
    }

    private vo: CheckinSystemVO = new CheckinSystemVO();

    // 初始化签到配置
    public init() {
        switch (Language.currency) {
            case CurrencyType.US:
            case CurrencyType.BR:
                this.vo.signInfo = [
                    { type: "amoney", count: 5 },
                    { type: "bmoney", count: 1000 },
                    { type: "amoney", count: 8 },
                    { type: "bmoney", count: 1000 },
                    { type: "amoney", count: 10 },
                    { type: "amoney", count: 20 },
                    { type: "bmoney", count: 1000 },
                    { type: "amoney", count: 1000 },
                ];
                break;
            case CurrencyType.ID:
                this.vo.signInfo = [
                    { type: "amoney", count: 100 },
                    { type: "bmoney", count: 1000 },
                    { type: "amoney", count: 300 },
                    { type: "bmoney", count: 1000 },
                    { type: "amoney", count: 500 },
                    { type: "amoney", count: 600 },
                    { type: "bmoney", count: 1000 },
                    { type: "amoney", count: 100000 },
                ];
                break;
        }
        this.vo.checkinData = JSON.parse(StorageBox.load(STORAGE_KEY.CHECKIN_DATA, `{"checkDate":0,"checkDays":0}`));
        this.vo.timestamp = parseInt(StorageBox.load(STORAGE_KEY.CHECKIN_TIME, "0"));
        this.vo.popupTime = parseInt(StorageBox.load(STORAGE_KEY.CHECKIN_POPUP_TIME, "0"));
        // 重置签到
        let currTime = Clock.zero(new Date()).getTime();
        if (this.vo.checkinData.checkDate + 86400000 != currTime && this.vo.checkinData.checkDate != currTime) {
            this.vo.checkinData.checkDate = 0;
            this.vo.checkinData.checkDays = 0;
        }
        RedDotSystem.I.update("Checkin", this.todayCanCheckin());
    }

    // 获取签到配置
    public getInfoByDay(dayNum: number): { type: string; count: number; } {
        return this.vo.signInfo[dayNum];
    }

    // 获取签到数据
    public getCheckData(): { checkDate: number; checkDays: number } {
        return this.vo.checkinData;
    }

    // 获取当前签到天数
    public getCheckinDays() {
        return this.getCheckData().checkDays;
    }

    public getLastCheckedIndex() {
        return (this.getCheckinDays() - 1) % 7;
    }

    public getCurrCheckinIndex() {
        return (this.getCheckinDays()) % 7;
    }

    public getCurrInfo() {
        return this.getInfoByDay(this.getCurrCheckinIndex());
    }

    // 今日是否可以签到
    public todayCanCheckin() {
        return (this.vo.checkinData.checkDate == 0) || (this.vo.checkinData.checkDate + 86400000 == Clock.zero(new Date()).getTime());
    }

    // 更新签到数据
    public updateSignData() {
        let data = this.getCheckData();
        data.checkDate = Clock.zero(new Date()).getTime();
        data.checkDays += 1;
        // 持久化
        StorageBox.save(STORAGE_KEY.CHECKIN_DATA, JSON.stringify(this.vo.checkinData));
        RedDotSystem.I.update("Checkin", this.todayCanCheckin());
    }

    // 签到
    public checkIn() {
        // 更新签到状态
        this.updateSignData();
        // 保存签到时间戳
        this.vo.timestamp = Clock.zero(new Date()).getTime();
    }

    public setPopupTime(date: Date) {
        this.vo.popupTime = Clock.zero(date).getTime();
    }

    public canPopup(date: Date) {
        let time = Clock.zero(date).getTime();
        return time != this.vo.popupTime;
    }
}

export class CheckinSystemVO {
    // 签到配置数据
    private _signInfo: { type: string; count: number; }[] = null;
    // 签到数据
    private _checkinData: { checkDate: number; checkDays: number } = null;
    // 签到日期(归0时 时间戳)
    private _timestamp: number = 0;
    // 弹出时间
    private _popupTime: number = 0;

    public get signInfo(): { type: string; count: number; }[] {
        return this._signInfo;
    }
    public set signInfo(value: { type: string; count: number; }[]) {
        this._signInfo = value;
    }

    public get checkinData(): { checkDate: number; checkDays: number } {
        return this._checkinData;
    }
    public set checkinData(value: { checkDate: number; checkDays: number }) {
        this._checkinData = value;
        StorageBox.save(STORAGE_KEY.CHECKIN_DATA, JSON.stringify(this._checkinData));
    }

    public get timestamp(): number {
        return this._timestamp;
    }
    public set timestamp(value: number) {
        this._timestamp = value;
        StorageBox.save(STORAGE_KEY.CHECKIN_TIME, this._timestamp.toString());
    }

    public get popupTime(): number {
        return this._popupTime;
    }
    public set popupTime(value: number) {
        this._popupTime = value;
        StorageBox.save(STORAGE_KEY.CHECKIN_POPUP_TIME, this._popupTime.toString());
    }

}


