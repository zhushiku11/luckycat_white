import { getEventEmiter } from "db://assets/doge/framework/common/EventEmitter";
import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { Language } from "db://assets/doge/framework/language/Language";
import { PlayerSystem } from "db://assets/main/script/system/PlayerSystem";
import { RedDotSystem } from "db://assets/main/script/system/RedDotSystem";

export const TASK_EVENT = {
    RECEIVE_REWARD: "RECEIVE_REWARD",
}

export enum TaskType {
    PASSED = 0,
    START_3 = 1,
    PASSED_1ST = 2,
    START_3_1ST = 3,
    USE_PROP = 4,
    REMOVE = 5,
    CHALLENGE = 6,
    AD_TIMES = 7,
    SIGN_TIMES = 8,
}

const STORAGE_KEY = {
    DAILY_TASK: "DAILY_TASK",
    MAIN_TASK: "MAIN_TASK",
    TODAY_COUNT_TIME: "TODAY_COUNT_TIME",
    PASSED: "PASSED",
    START_3: "START_3",
    PASSED_1ST: "PASSED_1ST",
    START_3_1ST: "START_3_1ST",
    USE_PROP: "USE_PROP",
    REMOVE: "REMOVE",
    CHALLENGE: "CHALLENGE",
    AD_TIMES: "AD_TIMES",
    CHECKIN_COUNT: "CHECKIN_COUNT",
}

export type TaskInfo = {
    id: number; // 任务ID
    type: TaskType; // 任务类型
    complete: number; // 完成次数
    condition: number; // 条件
    reward: number; // 奖励
    isToday: boolean; // 是否是当日任务
}

export type TaskData = {
    id: number; // 任务ID
    receivedNum: number; // 是否已领取奖励
}

export class TaskSystem {

    private static _instance = null;
    public static get I(): TaskSystem {
        if (!TaskSystem._instance) {
            TaskSystem._instance = new TaskSystem();
        }
        return TaskSystem._instance;
    }

    private vo: TaskSystemVO = new TaskSystemVO();

    public init() {
        this.vo.dailyTaskInfo = [
            // 通关
            { id: 0, type: TaskType.PASSED, complete: 1, condition: 1, reward: 200, isToday: true },
            // { id: 1, type: TaskType.START_3, complete: 1, condition: 1, reward: 200, isToday: true },
            { id: 2, type: TaskType.USE_PROP, complete: 1, condition: 5, reward: 200, isToday: true },
            { id: 3, type: TaskType.REMOVE, complete: 1, condition: 50, reward: 200, isToday: true },
            // { id: 4, type: TaskType.CHALLENGE, complete: 1, condition: 1, reward: 200, isToday: true },
            { id: 5, type: TaskType.SIGN_TIMES, complete: 1, condition: 1, reward: 200, isToday: false },
            { id: 6, type: TaskType.AD_TIMES, complete: 5, condition: 1, reward: 500, isToday: true },
        ];

        this.vo.mainTaskInfo = [
            { id: 10000, type: TaskType.PASSED_1ST, complete: 5, condition: 5, reward: 500, isToday: false },
            { id: 10001, type: TaskType.SIGN_TIMES, complete: 100, condition: 50, reward: 500, isToday: false },
            { id: 10002, type: TaskType.USE_PROP, complete: 100, condition: 50, reward: 500, isToday: false },
            { id: 10003, type: TaskType.REMOVE, complete: 100, condition: 50, reward: 500, isToday: false },
            // { id: 10004, type: TaskType.CHALLENGE, complete: 100, condition: 5, reward: 500, isToday: false },
            { id: 10005, type: TaskType.AD_TIMES, complete: 100, condition: 50, reward: 500, isToday: false },
        ];

        // 初始化任务数据
        this.vo.dailyTaskData = JSON.parse(StorageBox.load(STORAGE_KEY.DAILY_TASK, "{}"));
        this.vo.mainTaskData = JSON.parse(StorageBox.load(STORAGE_KEY.MAIN_TASK, "{}"));

        // 初始化重置时间
        this.vo.timestamp = parseInt(StorageBox.load(STORAGE_KEY.TODAY_COUNT_TIME, "0"));

        // 初始化完成数
        this.vo.passedCount = parseInt(StorageBox.load(STORAGE_KEY.PASSED, "0"));
        this.vo.star3Count = parseInt(StorageBox.load(STORAGE_KEY.START_3, "0"));
        this.vo.passed1stCount = parseInt(StorageBox.load(STORAGE_KEY.PASSED, "0"));
        this.vo.star31stCount = parseInt(StorageBox.load(STORAGE_KEY.START_3, "0"));
        this.vo.usePropCount = parseInt(StorageBox.load(STORAGE_KEY.USE_PROP, "0"));
        this.vo.removeCount = parseInt(StorageBox.load(STORAGE_KEY.REMOVE, "0"));
        this.vo.challengeCount = parseInt(StorageBox.load(STORAGE_KEY.CHALLENGE, "0"));
        this.vo.adCount = parseInt(StorageBox.load(STORAGE_KEY.AD_TIMES, "0"));
        this.vo.signCount = parseInt(StorageBox.load(STORAGE_KEY.CHECKIN_COUNT, "0"));

        // 初始化当日完成数
        this.vo.toDayPassedCount = parseInt(StorageBox.load(STORAGE_KEY.PASSED + "_TODAY", "0"));
        this.vo.toDayStar3Count = parseInt(StorageBox.load(STORAGE_KEY.START_3 + "_TODAY", "0"));
        this.vo.toDayFirstPassedCount = parseInt(StorageBox.load(STORAGE_KEY.PASSED + "_TODAY", "0"));
        this.vo.toDayFirstStar3Count = parseInt(StorageBox.load(STORAGE_KEY.START_3 + "_TODAY", "0"));
        this.vo.toDayUsePropCount = parseInt(StorageBox.load(STORAGE_KEY.USE_PROP + "_TODAY", "0"));
        this.vo.toDayRemoveCount = parseInt(StorageBox.load(STORAGE_KEY.REMOVE + "_TODAY", "0"));
        this.vo.toDayChallengeCount = parseInt(StorageBox.load(STORAGE_KEY.CHALLENGE + "_TODAY", "0"));
        this.vo.toDayAdCount = parseInt(StorageBox.load(STORAGE_KEY.AD_TIMES + "_TODAY", "0"));
        this.vo.toDaySignCount = parseInt(StorageBox.load(STORAGE_KEY.CHECKIN_COUNT + "_TODAY", "0"));

        // 重置时间
        if (this.isResetTodayCount()) {
            this.resetTodayCount();
            this.resetDailyTaskData();
        }

        RedDotSystem.I.update("Task_Daily", this.hasDailyReceive());
        RedDotSystem.I.update("Task_Main", this.hasMainReceive());
    }

    // 领取奖励
    public receiveReward(taskId: number) {
        let num = this.getTaskReceiveNumById(taskId);
        this.updateTaskDataById(taskId, num + 1);
        // 持久化数据
        if (taskId < 10000) {
            // 日常任务
            StorageBox.save(STORAGE_KEY.DAILY_TASK, JSON.stringify(this.vo.dailyTaskData));
            RedDotSystem.I.update("Task_Daily", this.hasDailyReceive());
        } else {
            // 主线任务
            StorageBox.save(STORAGE_KEY.MAIN_TASK, JSON.stringify(this.vo.mainTaskData));
            RedDotSystem.I.update("Task_Main", this.hasMainReceive());
        }

        getEventEmiter().emit(TASK_EVENT.RECEIVE_REWARD, taskId);
    }
    // 获取日常任务配置
    public getDailyTaskInfo(): TaskInfo[] {
        return this.vo.dailyTaskInfo;
    }

    // 获取主线任务配置
    public getMainTaskInfo(): TaskInfo[] {
        return this.vo.mainTaskInfo;
    }

    // 根据ID获取任务配置
    public getTaskInfoById(taskId: number) {
        if (taskId < 10000) {
            // 日常任务
            return this.vo.dailyTaskInfo.find((value: { id: number; type: TaskType; condition: number; }) => {
                if (value.id == taskId) {
                    return value;
                }
            })
        } else {
            // 主线任务
            return this.vo.mainTaskInfo.find((value: { id: number; type: TaskType; condition: number; }) => {
                if (value.id == taskId) {
                    return value;
                }
            })
        }
    }

    // 根据ID获取任务数据
    public getTaskDataById(taskId: number) {
        if (taskId < 10000) {
            // 日常任务
            return this.vo.dailyTaskData[taskId];
        } else {
            // 主线任务
            return this.vo.mainTaskData[taskId];
        }
    }

    // 根据ID获取任务领取次数
    public getTaskReceiveNumById(taskId: number) {
        let data = this.getTaskDataById(taskId);
        return data ? data.receivedNum : 0;
    }

    // 更新任务数据
    public updateTaskDataById(taskId: number, receivedNum: number) {
        if (taskId < 10000) {
            // 日常任务
            let data = this.getTaskDataById(taskId);
            if (data) {
                data.receivedNum = receivedNum;
            } else {
                this.vo.dailyTaskData[taskId] = { id: taskId, receivedNum: receivedNum };
            }
        } else {
            // 主线任务
            let data = this.getTaskDataById(taskId);
            if (data) {
                data.receivedNum = receivedNum;
            } else {
                this.vo.mainTaskData[taskId] = { id: taskId, receivedNum: receivedNum };
            }
        }
    }

    // 根据ID判断任务奖励是否已全部领取
    public isReceivedById(taskId: number) {
        let info = this.getTaskInfoById(taskId);
        return this.isReceived(info);
    }

    // 任务奖励是否已全部领取
    public isReceived(info: TaskInfo) {
        let data = this.getTaskDataById(info.id);
        let receiveNum = data ? data.receivedNum : 0;
        return receiveNum >= info.complete;
    }

    // 根据ID判断任务是否完成
    public isCanReceiveById(taskId: number) {
        let info = this.getTaskInfoById(taskId);
        return this.isCanReceive(info);
    }

    // 任务是否完成
    public isCanReceive(info: TaskInfo) {
        let completeCount = this.getCompleteCountByType(info.type, info.isToday);

        let taskData = this.getTaskDataById(info.id);
        let receiveNum = taskData ? taskData.receivedNum : 0;
        if (receiveNum >= info.complete) {
            // 领取任务超出 任务已完成
            return true;
        }
        return completeCount >= (receiveNum + 1) * info.condition;
    }

    // 获取当前类型的完成数
    private getCompleteCountByType(type: TaskType, isToday: boolean): number {
        if (isToday) {
            switch (type) {
                case TaskType.PASSED:
                    return this.vo.toDayPassedCount;
                case TaskType.START_3:
                    return this.vo.toDayStar3Count;
                case TaskType.PASSED_1ST:
                    return this.vo.toDayFirstPassedCount;
                case TaskType.START_3_1ST:
                    return this.vo.toDayFirstStar3Count;
                case TaskType.USE_PROP:
                    return this.vo.toDayUsePropCount;
                case TaskType.REMOVE:
                    return this.vo.toDayRemoveCount;
                case TaskType.CHALLENGE:
                    return this.vo.toDayChallengeCount;
                case TaskType.AD_TIMES:
                    return this.vo.toDayAdCount;
                case TaskType.SIGN_TIMES:
                    return this.vo.toDaySignCount;
            }
        } else {
            switch (type) {
                case TaskType.PASSED:
                    return this.vo.passedCount;
                case TaskType.START_3:
                    return this.vo.star3Count;
                case TaskType.PASSED_1ST:
                    return this.vo.passed1stCount;
                case TaskType.START_3_1ST:
                    return this.vo.star31stCount;
                case TaskType.USE_PROP:
                    return this.vo.usePropCount;
                case TaskType.REMOVE:
                    return this.vo.removeCount;
                case TaskType.CHALLENGE:
                    return this.vo.challengeCount;
                case TaskType.AD_TIMES:
                    return this.vo.adCount;
                case TaskType.SIGN_TIMES:
                    return this.vo.signCount;
            }
        }

    }

    // 设置当前类型的完成数
    private setCompleteCountByType(type: TaskType, num: number, isToday: boolean) {
        if (isToday) {
            switch (type) {
                case TaskType.PASSED:
                    this.vo.toDayPassedCount = num;
                    break;
                case TaskType.START_3:
                    this.vo.toDayStar3Count = num;
                    break;
                case TaskType.PASSED_1ST:
                    this.vo.toDayFirstPassedCount = num;
                    break;
                case TaskType.START_3_1ST:
                    this.vo.toDayFirstStar3Count = num;
                    break;
                case TaskType.USE_PROP:
                    this.vo.toDayUsePropCount = num;
                    break;
                case TaskType.REMOVE:
                    this.vo.toDayRemoveCount = num;
                    break;
                case TaskType.CHALLENGE:
                    this.vo.toDayChallengeCount = num;
                    break;
                case TaskType.AD_TIMES:
                    this.vo.toDayAdCount = num;
                    break;
                case TaskType.SIGN_TIMES:
                    this.vo.toDaySignCount = num;
                    break;
            }
        } else {
            switch (type) {
                case TaskType.PASSED:
                    this.vo.passedCount = num;
                    break;
                case TaskType.START_3:
                    this.vo.star3Count = num;
                    break;
                case TaskType.PASSED_1ST:
                    this.vo.passed1stCount = num;
                    break;
                case TaskType.START_3_1ST:
                    this.vo.star31stCount = num;
                    break;
                case TaskType.USE_PROP:
                    this.vo.usePropCount = num;
                    break;
                case TaskType.REMOVE:
                    this.vo.removeCount = num;
                    break;
                case TaskType.CHALLENGE:
                    this.vo.challengeCount = num;
                    break;
                case TaskType.AD_TIMES:
                    this.vo.adCount = num;
                    break;
                case TaskType.SIGN_TIMES:
                    this.vo.signCount = num;
                    break;
            }
        }
    }

    // 增加完成数
    public addCompleteCount(type: TaskType, num: number) {
        this.setCompleteCountByType(type, this.getCompleteCountByType(type, true) + num, true);
        this.setCompleteCountByType(type, this.getCompleteCountByType(type, false) + num, false);
        RedDotSystem.I.update("Task_Daily", this.hasDailyReceive());
        RedDotSystem.I.update("Task_Main", this.hasMainReceive());
    }

    // 是否有可领取的日常任务
    public hasDailyReceive(): boolean {
        for (let i = 0; i < this.vo.dailyTaskInfo.length; i++) {
            const info = this.vo.dailyTaskInfo[i];
            if (!this.isReceived(info) && this.isCanReceive(info)) {
                return true;
            }
        }
        return false;
    }

    // 是否有可领取的主线任务
    public hasMainReceive(): boolean {
        for (let i = 0; i < this.vo.mainTaskInfo.length; i++) {
            const info = this.vo.mainTaskInfo[i];
            if (!this.isReceived(info) && this.isCanReceive(info)) {
                return true;
            }
        }
        return false;
    }

    // 重置当日次数
    public resetTodayCount() {
        this.vo.timestamp = PlayerSystem.I.getLoginTime();
        this.vo.toDayPassedCount = 0;
        this.vo.toDayStar3Count = 0;
        this.vo.toDayFirstPassedCount = 0;
        this.vo.toDayFirstStar3Count = 0;
        this.vo.toDayUsePropCount = 0;
        this.vo.toDayRemoveCount = 0;
        this.vo.toDayChallengeCount = 0;
        this.vo.toDayAdCount = 0;
        this.vo.toDaySignCount = 0;
    }

    // 重置日常任务数据
    public resetDailyTaskData() {
        this.vo.dailyTaskData = {};
    }

    // 重置主线任务数据
    public resetMainTaskData() {
        this.vo.mainTaskData = {};
    }

    // 是否重置当日次数
    public isResetTodayCount() {
        return PlayerSystem.I.getLoginTime() > this.vo.timestamp;
    }
}

export class TaskSystemVO {
    // 日常任务配置
    private _dailyTaskInfo: TaskInfo[] = null;
    // 主线任务配置
    private _mainTaskInfo: TaskInfo[] = null;
    // 日常任务数据
    private _dailyTaskData: { [key: string]: TaskData; } = null;
    // 主线任务数据
    private _mainTaskData: { [key: string]: TaskData; } = null;

    // 当日次数重置时间
    private _timestamp: number = 0;

    // 通关次数
    private _passedCount: number = 0;
    // 3星通关次数
    private _star3Count: number = 0;
    // 首次通关次数
    private _passed1stCount: number = 0;
    // 首次3星通关次数
    private _star31stCount: number = 0;
    // 使用道具次数
    private _usePropCount: number = 0;
    // 消除tile次数
    private _removeCount: number = 0;
    // 挑战模式通关次数
    private _challengeCount: number = 0;
    // 观看广告次数
    private _adCount: number = 0;
    // 签到次数
    private _signCount: number = 0;

    // 当日通关次数
    private _toDayPassedCount: number = 0;
    // 当日3星通关次数
    private _toDayStar3Count: number = 0;
    // 当日首次通关次数
    private _toDayPassed1stCount: number = 0;
    // 当日首次3星通关次数
    private _toDayStar31stCount: number = 0;
    // 当日使用道具次数
    private _toDayUsePropCount: number = 0;
    // 当日消除tile次数
    private _toDayRemoveCount: number = 0;
    // 当日挑战模式通关次数
    private _toDayChallengeCount: number = 0;
    // 当日观看广告次数
    private _toDayAdCount: number = 0;
    // 当日签到次数
    private _toDaySignCount: number = 0;

    public get dailyTaskInfo(): TaskInfo[] {
        return this._dailyTaskInfo;
    }
    public set dailyTaskInfo(value: TaskInfo[]) {
        this._dailyTaskInfo = value;
    }

    public get dailyTaskData(): { [key: string]: TaskData; } {
        return this._dailyTaskData;
    }
    public set dailyTaskData(value: { [key: string]: TaskData; }) {
        this._dailyTaskData = value;
        console.log("_dailyTaskData", this._dailyTaskData);
        StorageBox.save(STORAGE_KEY.DAILY_TASK, JSON.stringify(this._dailyTaskData));
    }

    public get mainTaskInfo(): TaskInfo[] {
        return this._mainTaskInfo;
    }
    public set mainTaskInfo(value: TaskInfo[]) {
        this._mainTaskInfo = value;
    }

    public get mainTaskData(): { [key: string]: TaskData; } {
        return this._mainTaskData;
    }
    public set mainTaskData(value: { [key: string]: TaskData; }) {
        this._mainTaskData = value;
        StorageBox.save(STORAGE_KEY.MAIN_TASK, JSON.stringify(this._mainTaskData));
    }

    public get timestamp(): number {
        return this._timestamp;
    }
    public set timestamp(value: number) {
        this._timestamp = value;
        StorageBox.save(STORAGE_KEY.TODAY_COUNT_TIME, this._timestamp.toString());
    }

    public get passedCount(): number {
        return this._passedCount;
    }
    public set passedCount(value: number) {
        this._passedCount = value;
        StorageBox.save(STORAGE_KEY.PASSED, this._passedCount.toString());
        Language.updVariable("passedCount", this._passedCount.toString());
    }

    public get star3Count(): number {
        return this._star3Count;
    }
    public set star3Count(value: number) {
        this._star3Count = value;
        StorageBox.save(STORAGE_KEY.START_3, this._star3Count.toString());
        Language.updVariable("star3Count", this._star3Count.toString());
    }

    public get passed1stCount(): number {
        return this._passed1stCount;
    }
    public set passed1stCount(value: number) {
        this._passed1stCount = value;
        StorageBox.save(STORAGE_KEY.PASSED_1ST, this._passed1stCount.toString());
        Language.updVariable("passed1stCount", this._passed1stCount.toString());
    }
    public get star31stCount(): number {
        return this._star31stCount;
    }
    public set star31stCount(value: number) {
        this._star31stCount = value;
        StorageBox.save(STORAGE_KEY.START_3_1ST, this._star31stCount.toString());
        Language.updVariable("star31stCount", this._star31stCount.toString());
    }

    public get usePropCount(): number {
        return this._usePropCount;
    }
    public set usePropCount(value: number) {
        this._usePropCount = value;
        StorageBox.save(STORAGE_KEY.USE_PROP, this._usePropCount.toString());
        Language.updVariable("usePropCount", this._usePropCount.toString());
    }

    public get removeCount(): number {
        return this._removeCount;
    }
    public set removeCount(value: number) {
        this._removeCount = value;
        StorageBox.save(STORAGE_KEY.REMOVE, this._removeCount.toString());
        Language.updVariable("removeCount", this._removeCount.toString());
    }

    public get challengeCount(): number {
        return this._challengeCount;
    }
    public set challengeCount(value: number) {
        this._challengeCount = value;
        StorageBox.save(STORAGE_KEY.CHALLENGE, this._challengeCount.toString());
        Language.updVariable("challengeCount", this._challengeCount.toString());
    }

    public get adCount(): number {
        return this._adCount;
    }
    public set adCount(value: number) {
        this._adCount = value;
        StorageBox.save(STORAGE_KEY.AD_TIMES, this._adCount.toString());
        Language.updVariable("adCount", this._adCount.toString());
    }

    public get signCount(): number {
        return this._signCount;
    }
    public set signCount(value: number) {
        this._signCount = value;
        StorageBox.save(STORAGE_KEY.CHECKIN_COUNT, this._signCount.toString());
        Language.updVariable("signCount", this._signCount.toString());
    }

    public get toDayPassedCount(): number {
        return this._toDayPassedCount;
    }
    public set toDayPassedCount(value: number) {
        this._toDayPassedCount = value;
        StorageBox.save(STORAGE_KEY.PASSED + "_TODAY", this._toDayPassedCount.toString());
        Language.updVariable("passedCountToday", this._toDayPassedCount.toString());
    }

    public get toDayStar3Count(): number {
        return this._toDayStar3Count;
    }
    public set toDayStar3Count(value: number) {
        this._toDayStar3Count = value;
        StorageBox.save(STORAGE_KEY.START_3 + "_TODAY", this._toDayStar3Count.toString());
        Language.updVariable("star3CountToday", this._toDayStar3Count.toString());
    }

    public get toDayFirstPassedCount(): number {
        return this._toDayPassed1stCount;
    }
    public set toDayFirstPassedCount(value: number) {
        this._toDayPassed1stCount = value;
        StorageBox.save(STORAGE_KEY.PASSED_1ST + "_TODAY", this._toDayPassed1stCount.toString());
        Language.updVariable("passed1stCountToday", this._toDayPassed1stCount.toString());
    }

    public get toDayFirstStar3Count(): number {
        return this._toDayStar31stCount;
    }
    public set toDayFirstStar3Count(value: number) {
        this._toDayStar31stCount = value;
        StorageBox.save(STORAGE_KEY.START_3_1ST + "_TODAY", this._toDayStar31stCount.toString());
        Language.updVariable("star31stCountToday", this._toDayStar31stCount.toString());
    }

    public get toDayUsePropCount(): number {
        return this._toDayUsePropCount;
    }
    public set toDayUsePropCount(value: number) {
        this._toDayUsePropCount = value;
        StorageBox.save(STORAGE_KEY.USE_PROP + "_TODAY", this._toDayUsePropCount.toString());
        Language.updVariable("usePropCountToday", this._toDayUsePropCount.toString());
    }

    public get toDayRemoveCount(): number {
        return this._toDayRemoveCount;
    }
    public set toDayRemoveCount(value: number) {
        this._toDayRemoveCount = value;
        StorageBox.save(STORAGE_KEY.REMOVE + "_TODAY", this._toDayRemoveCount.toString());
        Language.updVariable("removeCountToday", this._toDayRemoveCount.toString());
    }

    public get toDayChallengeCount(): number {
        return this._toDayChallengeCount;
    }
    public set toDayChallengeCount(value: number) {
        this._toDayChallengeCount = value;
        StorageBox.save(STORAGE_KEY.CHALLENGE + "_TODAY", this._toDayChallengeCount.toString());
        Language.updVariable("challengeCountToday", this._toDayChallengeCount.toString());
    }

    public get toDayAdCount(): number {
        return this._toDayAdCount;
    }
    public set toDayAdCount(value: number) {
        this._toDayAdCount = value;
        StorageBox.save(STORAGE_KEY.AD_TIMES + "_TODAY", this._toDayAdCount.toString());
        Language.updVariable("adCountToday", this._toDayAdCount.toString());
    }

    public get toDaySignCount(): number {
        return this._toDaySignCount;
    }
    public set toDaySignCount(value: number) {
        this._toDaySignCount = value;
        StorageBox.save(STORAGE_KEY.CHECKIN_COUNT + "_TODAY", this._toDaySignCount.toString());
        Language.updVariable("signCountToday", this._toDaySignCount.toString());
    }
}


