import { Component, macro } from "cc";

export class CountdownTimer {

    private static timer: Map<string, CountdownTimer> = new Map<string, CountdownTimer>();

    private fullTime: number = 0;

    private tag: string = "";
    private time: number = 0;
    private second: number = 0;
    private component: Component = null;
    private callback: Function = null;
    private progressCb: Function = null;
    private countDownCb: Function = null;

    private pauseTimes: number = 0;

    public static build(tag: string, time: number, component: Component, callback: Function) {
        let timer = new CountdownTimer(tag, time, component, callback);
        CountdownTimer.timer.set(tag, timer);
        return timer;
    }

    public static stop(tag: string) {
        let timer = CountdownTimer.timer.get(tag);
        console.log("timer stop", tag);
        timer.unschedule(timer.countDownCb);
    }

    public static get(tag: string): CountdownTimer {
        return this.timer.get(tag);
    }

    public static has(tag: string) {
        return this.timer.has(tag);
    }

    constructor(tag: string, time: number, component: Component, callback: Function) {
        this.tag = tag;
        this.component = component;
        this.callback = callback;
        this.reset(time);
    }

    public reset(time: number) {
        this.fullTime = time;
        this.time = this.fullTime;
        this.second = this.fullTime;
        this.unschedule(this.countDownCb);
        return this;
    }

    public start() {
        this.callback && this.callback(this.second, this);
        this.progressCb && this.progressCb(1, this);

        this.countDownCb = (dt: number) => {
            if (this.pauseTimes) {
                return;
            }
            this.time -= dt;
            let sec = Math.ceil(this.time);
            if (sec < this.second) {
                this.second -= 1;
                // 一秒钟已过
                this.callback && this.callback(this.second, this);
            }
            if (this.time <= 0) {
                this.time = 0;
            }
            this.progressCb && this.progressCb(this.time / this.fullTime, this);
            if (this.time == 0) {
                this.stop();
            }
        }
        this.component.schedule(this.countDownCb, 0, macro.REPEAT_FOREVER, 0);
        return this;
    }

    public progress(callback: Function) {
        this.progressCb = callback;
        return this;
    }

    public stop() {
        this.pauseTimes = 0;
        CountdownTimer.stop(this.tag);
    }

    public isStop() {
        return this.countDownCb == null;
    }

    public pause() {
        this.pauseTimes += 1;
    }

    public resume() {
        this.pauseTimes -= 1;
    }

    public addTime(num: number) {
        this.time += num;
        this.second += num;
        if (this.time > this.fullTime) {
            this.time = this.fullTime;
        }
        if (this.second > this.fullTime) {
            this.second = this.fullTime;
        }
    }

    private unschedule(countDown: Function) {
        this.component.unschedule(countDown);
        this.countDownCb = null;
    }

}


