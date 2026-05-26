import { _decorator } from 'cc';
import { Clock } from 'db://assets/doge/framework/common/Clock';
import { NetworkResult, NetworkSystem } from './NetworkSystem';
import { Toast } from 'db://assets/doge/framework/init';
import { RedDotSystem } from 'db://assets/main/script/system/RedDotSystem';
const { ccclass, property } = _decorator;

type WithdrawTaskCallback = (reward: number, condition: number, completeCount: number, receiveState: number, rate: number, taskId: number) => void;

@ccclass('WithdrawTaskSystem')
export class WithdrawTaskSystem {
    private static _instance = null;
    public static get I(): WithdrawTaskSystem {
        if (!WithdrawTaskSystem._instance) {
            WithdrawTaskSystem._instance = new WithdrawTaskSystem();
        }
        return WithdrawTaskSystem._instance;
    }

    private vo: WithdrawTaskSystemVO = new WithdrawTaskSystemVO();

    // 同步每日任务数据
    public sync(callback?: WithdrawTaskCallback) {
    }

    public init(reward: number, condition: number, complete: number, receiveState: number, rate: number, taskId: number) {
        this.vo.reward = reward;
        this.vo.condition = condition;
        this.vo.completeCount = complete;
        this.vo.rate = rate;
        this.vo.receiveState = receiveState;
        this.vo.taskId = taskId;
        RedDotSystem.I.update("Withdraw_Task", !this.isReceive());
    }

    // 任务是否完成
    public isComplete() {
        return this.vo.condition == this.vo.completeCount;
    }

    // 今日奖励是否已经领取
    public isReceive() {
        return this.vo.receiveState == 3;
    }

    // 领取状态
    public getReceiveState() {
        return this.vo.receiveState
    }

    public setCompleteCount(v: number) {
        this.vo.completeCount = v;
    }

    public setCondition(v: number) {
        this.vo.condition = v;
    }

    public getReward() {
        return this.vo.reward;
    }

    public getCondition() {
        return this.vo.condition;
    }

    public getCompleteCount() {
        return this.vo.completeCount;
    }

    public getRefreshTime() {
        let currDate = new Date();
        let tomorrow = Clock.tomorrowZero(new Date());
        return Math.floor((tomorrow.getTime() - currDate.getTime()) / 1000);
    }

    public getTaskId() {
        return this.vo.taskId;
    }

    public getRate() {
        return this.vo.rate;
    }
}

export class WithdrawTaskSystemVO {
    // 奖励值
    private _reward: number = 0;
    public get reward(): number {
        return this._reward;
    }
    public set reward(value: number) {
        this._reward = value;
    }
    // 任务条件
    private _condition: number = 10;
    public get condition(): number {
        return this._condition;
    }
    public set condition(value: number) {
        this._condition = value;
    }
    // 完成次数
    private _completeCount: number = 0;
    public get completeCount(): number {
        return this._completeCount;
    }
    public set completeCount(value: number) {
        this._completeCount = value;
    }
    // 兑换比率
    private _rate: number = 0;
    public get rate(): number {
        return this._rate;
    }
    public set rate(value: number) {
        this._rate = value;
    }
    // 领取状态
    private _receiveState: number = 1;
    public get receiveState(): number {
        return this._receiveState;
    }
    public set receiveState(value: number) {
        this._receiveState = value;
    }
    // 任务ID
    private _taskId: number = 0;
    public get taskId(): number {
        return this._taskId;
    }
    public set taskId(value: number) {
        this._taskId = value;
    }


}


