
import { Utils } from "db://assets/doge/framework/common/Utils";
import { Clock } from "db://assets/doge/framework/common/Clock";
import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { Language } from "db://assets/doge/framework/language/Language";
import { CHALLENGE_PASS, ENDLESS_PASS, SUBGAME } from "../../constant/Constant";
import { getEventEmiter } from "db://assets/doge/framework/common/EventEmitter";
import { PlayerSystem } from "db://assets/main/script/system/PlayerSystem";
import { UploadSystem } from "./UploadSystem";
import { ADInfoSystem } from "./ADInfoSystem";

const STORAGE_KEY = {
    LEVEL_INFO: "LEVEL_INFO",
    CHALLENGE_PASSED_TIME: "CHALLENGE_PASSED_TIME",
    ENDLESS_ROUND: "ENDLESS_ROUND",
    ENDLESS_TIME: "ENDLESS_TIME",
};

export type LevelInfo = {
    level: number, // 关卡等级
    star: number, // 关卡星级
}

export enum GameMode {
    PASS = 0, // 关卡模式
    ENDLESS = 1, // 无尽模式
    CHALLENGE = 2, // 无尽模式
}

export class LevelSystem {

    private static _instance = null;
    public static get I(): LevelSystem {
        if (!LevelSystem._instance) {
            LevelSystem._instance = new LevelSystem();
        }
        return LevelSystem._instance;
    }

    private vo: LevelSystemVO = new LevelSystemVO();

    init(level: number) {
        // this.vo.levelInfo = JSON.parse(StorageBox.load(STORAGE_KEY.LEVEL_INFO, `[{"level":0,"star":0}]`));
        // 关卡全部开启LevelInfo
        let initInfo = [];
        for (let i = 0; i < level + 1; i++) {
            initInfo.push({ level: i, star: 0, lock: false });
        }
        this.vo.levelInfo = initInfo;
        // ---------------------
        this.vo.currLv = this.initCurrLevel();
        this.vo.runningLv = 0;
        this.vo.runningMode = GameMode.PASS;
        this.vo.challengePassedTime = parseInt(StorageBox.load(STORAGE_KEY.CHALLENGE_PASSED_TIME, "0"));
        this.vo.endLessTime = parseInt(StorageBox.load(STORAGE_KEY.ENDLESS_TIME, "0"));
        this.vo.endLessRound = parseInt(StorageBox.load(STORAGE_KEY.ENDLESS_ROUND, "0"));
    }

    private initCurrLevel() {
        return this.vo.levelInfo.length - 1;
    }

    // 关卡模式
    public runLevel(level: number) {
        if (this.isCanRunLevel()) {
            this.enterLevel(level, GameMode.PASS);
            return true;
        } else {
            return false;
        }
    }

    // 挑战模式
    public runChallenge(): boolean {
        if (this.isCanRunChallenge()) {
            this.enterLevel(CHALLENGE_PASS + Utils.randomInt(0, 4), GameMode.CHALLENGE);
            return true;
        } else {
            return false;
        }
    }

    // 无尽模式
    public runEndless(): boolean {
        this.enterLevel(ENDLESS_PASS, GameMode.ENDLESS);
        getEventEmiter().emit(SUBGAME.SCENE.GAME);
        return true;
    }

    public enterLevel(level: number, mode: GameMode) {
        let preLv = this.vo.runningLv;
        this.setRunningLv(level, mode);
        getEventEmiter().emit(SUBGAME.SCENE.GAME, level, preLv);
        return true;
    }

    public setRunningLv(level: number, mode: GameMode) {
        this.vo.runningLv = level;
        this.vo.runningMode = mode;
    }

    // 下一关
    public nextLevel() {
        if (this.vo.runningMode == GameMode.PASS) {
            PlayerSystem.I.addDailyGameData(1, 0);
            ADInfoSystem.I.passedTimesUp();
            return this.runLevel(this.vo.runningLv + 1);
        }
    }

    // 重玩关卡
    public replay() {
        switch (this.vo.runningMode) {
            case GameMode.PASS:
                this.runLevel(this.vo.runningLv);
                break;
            case GameMode.CHALLENGE:
                this.runChallenge();
                break;
            case GameMode.ENDLESS:
                this.runEndless();
                break;
        }
    }

    // 通关
    public passed(star?: number) {
        UploadSystem.I.level();
        switch (this.vo.runningMode) {
            case GameMode.PASS:
                this.updateLevelInfo(this.vo.runningLv, star);
                if (this.vo.runningLv == this.vo.currLv) {
                    this.addLevelInfo(0);
                }
                break;
            case GameMode.CHALLENGE:
                this.vo.challengePassedTime = Clock.zero(new Date()).getTime();
                break;
            case GameMode.ENDLESS:
                this.vo.endLessRound += 1;
                console.log(this.vo.endLessRound);
                break;
        }

    }

    public isCanRunLevel() {
        return true;
    }

    public isCanRunChallenge() {
        return PlayerSystem.I.getLoginTime() > this.vo.challengePassedTime;
    }

    public getRunningLevel() {
        return this.vo.runningLv;
    }

    public getRunningMode() {
        return this.vo.runningMode;
    }

    // 获取最大关卡数
    public getMaxLevel() {
        return this.vo.totalLevel;
    }

    // 获取所有3星关卡
    public get3StarsLevelInfo(): LevelInfo[] {
        let result: LevelInfo[] = [];
        for (let i = 0; i < this.vo.levelInfo.length; i++) {
            const info = this.vo.levelInfo[i];
            if (info.star >= 3) {
                result.push(info);
            }
        }
        return result;
    }

    // 获取所有未达3星关卡
    public getNo3StarsLevelInfo(): LevelInfo[] {
        let result: LevelInfo[] = [];
        for (let i = 0; i < this.vo.levelInfo.length; i++) {
            const info = this.vo.levelInfo[i];
            if (info.star < 3) {
                result.push(info);
            }
        }
        return result;
    }

    // 更新关卡信息
    public updateLevelInfo(level: number, starNum: number) {
        let info = this.getLevelInfo(level);
        if (starNum <= info.star) {
            return;
        }
        if (info) {
            info.level = level;
            info.star = starNum;
        }
        // StorageBox.save(STORAGE_KEY.LEVEL_INFO, JSON.stringify(this.vo.levelInfo));
    }

    // 增加关卡信息
    public addLevelInfo(starNum: number) {
        let len = this.vo.levelInfo.push({
            level: this.vo.currLv + 1, // 关卡等级
            star: starNum, // 关卡星级
        });
        this.vo.currLv = len - 1;
        // StorageBox.save(STORAGE_KEY.LEVEL_INFO, JSON.stringify(this.vo.levelInfo));
    }

    // 获取关卡信息
    public getLevelInfo(level: number) {
        return this.vo.levelInfo[level];
    }

    // 获取当前关卡信息
    public getCurrLevelInfo() {
        return this.getLevelInfo(this.vo.currLv);
    }

    // 获取当前关卡
    public getCurrLevel() {
        return this.vo.currLv;
    }

    // 获取关卡奖励 体力
    public getRewardACoins() {
        return this.vo.rewardACoins;
    }

    // 获取关卡奖励 钻石
    public getRewardBCoins() {
        return this.vo.rewardBCoins;
    }

    // 获取星级档位
    public getStarLvBase() {
        return this.vo.starLvBase;
    }

    // 关卡时间
    public getLevelTime() {
        return this.vo.levelTime;
    }

    // 获取复活补充时间
    public getReviveTime() {
        return this.vo.reviveTime;
    }

    // 获取增加时间
    public getRewardTime() {
        return this.vo.rewardTime;
    }

    // 获取无尽模式回合数
    public getEndlessRound() {
        return this.vo.endLessRound;
    }

    // 获取无尽模式关卡数
    public getEndlessLevel() {
        let round = this.getEndlessRound();
        if (round >= this.vo.endLessLevelCount) {
            round = Utils.randomInt(0, this.vo.endLessLevelCount - 1);
        }
        return round;
    }
}

class LevelSystemVO {
    // 关卡奖励钻石数值
    public readonly rewardACoins: number = 50;
    // 关卡奖励体力数值
    public readonly rewardBCoins: number = 1;
    // 关卡复活时间
    public readonly reviveTime: number = 120;
    // 消除奖励时间
    public readonly rewardTime: number = 0;
    // 关卡星级档位
    public readonly starLvBase: number[] = [10 / 60, 30 / 60, 50 / 60];
    // 总关卡数
    public readonly totalLevel: number = 2;
    // 关卡时间
    public readonly levelTime: number = 480;
    // 无尽关卡数量
    public readonly endLessLevelCount: number = 50;

    // 当前关卡
    private _currLv: number = 0;
    // 关卡数据
    private _levelInfo: LevelInfo[] = null;
    // 关卡数
    private _levelId: number = null;
    // 运行中关卡
    private _runningLv: number = 0;
    // 运行中关卡模式
    private _runningMode: number = 0;
    // 挑战模式通关时间
    private _challengePassedTime: number = 0;
    // 无尽模式回合数
    private _endLessRound: number = 0;
    // 无尽模式开始时间
    private _endLessTime: number = 0;


    public get currLv(): number {
        return this._currLv;
    }
    public set currLv(value: number) {
        this._currLv = value;
        Language.updVariable("currLv", (this._currLv + 1).toString());
    }

    public get levelInfo(): LevelInfo[] {
        return this._levelInfo;
    }
    public set levelInfo(value: LevelInfo[]) {
        this._levelInfo = value;
        // StorageBox.save(STORAGE_KEY.LEVEL_INFO, JSON.stringify(this._levelInfo));
    }

    public get runningLv(): number {
        return this._runningLv;
    }
    public set runningLv(value: number) {
        this._runningLv = value;
        Language.updVariable("runningLv", (this._runningLv + 1).toString());
    }

    public get runningMode(): number {
        return this._runningMode;
    }
    public set runningMode(value: number) {
        this._runningMode = value;
    }

    public get challengePassedTime(): number {
        return this._challengePassedTime;
    }
    public set challengePassedTime(value: number) {
        this._challengePassedTime = value;
        StorageBox.save(STORAGE_KEY.CHALLENGE_PASSED_TIME, this._challengePassedTime.toString());
    }

    public get endLessRound(): number {
        return this._endLessRound;
    }
    public set endLessRound(value: number) {
        let time = Clock.zero(new Date()).getTime();
        if (time > this._endLessTime) {
            this._endLessRound = 0;
            this.endLessTime = time;
        } else {
            this._endLessRound = value;
        }
        Language.updVariable("endlessRound", (this._endLessRound + 1).toString())
        StorageBox.save(STORAGE_KEY.ENDLESS_ROUND, this._endLessRound.toString());
    }

    public get endLessTime(): number {
        return this._endLessTime;
    }
    public set endLessTime(value: number) {
        this._endLessTime = value;
        StorageBox.save(STORAGE_KEY.ENDLESS_TIME, this._endLessTime.toString());
    }
}




