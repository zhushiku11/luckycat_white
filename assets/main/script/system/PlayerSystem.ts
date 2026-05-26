import { director, macro, Scheduler } from "cc";
import { Clock } from "db://assets/doge/framework/common/Clock";
import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { STORAGE } from "../../constant/Constant";

type DailyGameData = { time: number, ad: number, level: number };

export class PlayerSystem {

    private static _instance = null;
    public static get I(): PlayerSystem {
        if (!PlayerSystem._instance) {
            PlayerSystem._instance = new PlayerSystem();
        }
        return PlayerSystem._instance;
    }

    private vo: PlayerSystemVO = new PlayerSystemVO();

    init(info: UserInfoResult) {
        this.vo.userID = info.p0;
        // this.vo.userID = StorageBox.load(STORAGE.USER_ID, Utils.randomInt(100000, 999999).toString());
        this.vo.nickname = info.p1;
        this.vo.appID = info.p2;
        this.vo.isNewUser = info.p3;
        // this.vo.isNewUser = !!parseInt(StorageBox.load(STORAGE.NEW_FLAG, "1"));
        this.vo.language = info.p4;
        this.vo.currencyType = info.p5;
        this.vo.inReview = info.p6;
        this.vo.version = info.p7;
        this.vo.loginTime = new Date().getTime();
        // 每日游戏数据 {time: 每日零点, ad: 看视频次数, level: level通关次数|2048数量}
        // this.vo.dailyGameData = JSON.parse(StorageBox.load(STORAGE.DAILY_GAME_DATA, JSON.stringify({ time: Clock.zero().getTime(), ad: 0, level: 0 })));
        this.vo.dailyGameData = JSON.parse(StorageBox.load(STORAGE.DAILY_GAME_DATA, "[]"));
        this.addDailyGameData(0, 0);
    }

    public changeNickname(nickname: string) {
        this.vo.nickname = nickname;
    }

    public getAppID(): string {
        return this.vo.appID;
    }

    public getUserID(): string {
        return this.vo.userID;
    }

    public getNickname(): string {
        return this.vo.nickname;
    }

    public getVersion(): string {
        return this.vo.version;
    }

    public isNewUser(): boolean {
        return this.vo.isNewUser;
    }

    public notNewUser() {
        this.vo.isNewUser = false;
        StorageBox.save(STORAGE.NEW_FLAG, "0");
    }

    public getLanguage(): string {
        return this.vo.language;
    }

    public getCurrency(): number {
        return this.vo.currencyType;
    }

    public isReview(): boolean {
        return this.vo.inReview;
    }

    public getLoginTime(): number {
        return this.vo.loginTime;
    }

    public getLoginDay(level: number): DailyGameData[] {
        return this.vo.dailyGameData.filter((value: DailyGameData) => {
            return value.level >= level;
        })
    }

    public addDailyGameData(level: number, ad: number) {
        let time = Clock.zero().getTime();
        let data = this.vo.dailyGameData.find((value: DailyGameData) => {
            return value.time = time;
        });
        if (data) {
            data.level += level;
            data.ad += ad;
        } else {
            this.vo.dailyGameData.push({ time: time, level: level, ad: ad });
        }
        StorageBox.save(STORAGE.DAILY_GAME_DATA, JSON.stringify(this.vo.dailyGameData));
    }

    public goOnline() {
        // 启动在线日期刷新定时器
        let sch: Scheduler = director.getScheduler();
        sch.schedule(() => {
            StorageBox.save(STORAGE.ONLINE_DATE, new Date().getTime().toString());
        }, sch, 10, macro.REPEAT_FOREVER, 0, false);
        // 更新AMoney留存时间
        StorageBox.save(STORAGE.AMONEY_TIME, (new Date().getTime() + 86400000 * 30).toString());
    }

    public getOnlineTime(): number {
        return parseInt(StorageBox.loadGlobal(STORAGE.ONLINE_DATE, "0"));
    }

    public getOfflineTime(): number {
        return this.vo.offlineTime;
    }

    public updateOfflineTime(): number {
        this.vo.offlineTime = this.calcOfflineTime();
        return this.vo.offlineTime;
    }

    private calcOfflineTime(): number {
        let currTime = new Date().getTime();
        let lastOnlineDate = PlayerSystem.I.getOnlineTime() || currTime;
        return Math.floor((currTime - lastOnlineDate) / 1000);
    }
}

export class PlayerSystemVO {
    // AppID
    private _appID: string = null;
    // 用户ID
    private _userID: string = null;
    // 昵称
    private _nickname: string = null;
    // 版本
    private _version: string = null;
    // 是否新用户
    private _isNewUser: boolean = null;
    // 语言
    private _language: string = null;
    // 货币类型
    private _currencyType: number = null;
    // 是否审核模式
    private _inReview: boolean = null;

    // 登录时间
    private _loginTime: number = null;
    // 在线时间
    private _onlineTime: number = null;
    // 离线时长
    private _offlineTime: number = null;
    // 累计登录天数
    private _dailyGameData: DailyGameData[] = [];
    // 累计视频观看次数
    private _totalAdCount: number = 0;
    // 累计视频观看次数
    private _showAdCount: number = 0;


    public get appID(): string {
        return this._appID;
    }
    public set appID(value: string) {
        this._appID = value;
    }

    public get userID(): string {
        return this._userID;
    }
    public set userID(value: string) {
        this._userID = value;
        StorageBox.save(STORAGE.USER_ID, this._userID);
    }

    public get nickname(): string {
        return this._nickname;
    }
    public set nickname(value: string) {
        this._nickname = value;
    }

    public get version(): string {
        return this._version;
    }
    public set version(value: string) {
        this._version = value;
    }

    public get isNewUser(): boolean {
        return this._isNewUser;
    }
    public set isNewUser(value: boolean) {
        this._isNewUser = value;
    }

    public get language(): string {
        return this._language;
    }
    public set language(value: string) {
        this._language = value;
    }

    public get currencyType(): number {
        return this._currencyType;
    }
    public set currencyType(value: number) {
        this._currencyType = value;
    }

    public get inReview(): boolean {
        return this._inReview;
    }
    public set inReview(value: boolean) {
        this._inReview = value;
    }

    public get loginTime(): number {
        return this._loginTime;
    }
    public set loginTime(value: number) {
        this._loginTime = value;
    }
    public get onlineTime(): number {
        return this._onlineTime;
    }
    public set onlineTime(value: number) {
        this._onlineTime = value;
    }
    public get offlineTime(): number {
        return this._offlineTime;
    }
    public set offlineTime(value: number) {
        this._offlineTime = value;
    }

    public get dailyGameData(): DailyGameData[] {
        return this._dailyGameData;
    }
    public set dailyGameData(value: DailyGameData[]) {
        this._dailyGameData = value;
    }
}


