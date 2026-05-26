import { _decorator, color, Component, Label, Node, Sprite } from 'cc';
import { SUBGAME } from '../../constant/Constant';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { CountdownTimer } from 'db://assets/doge/framework/timer/CountdownTimer';
import { Clock } from 'db://assets/doge/framework/common/Clock';
import { Panel } from 'db://assets/doge/framework/panel/Panel';
import { PanelCreator } from '../component/creator/PanelCreator';
import { GameLogic } from './GameLogic';
const { ccclass, property } = _decorator;

@ccclass('GameTimer')
export class GameTimer extends Component {

    @property(Node)
    private gameLogic: Node = null;
    @property(Label)
    private passTime: Label = null;

    protected onEnable(): void {
        getEventEmiter().on(SUBGAME.FUNC.GAME_PAUSE, this.onPause, this);
        getEventEmiter().on(SUBGAME.FUNC.GAME_RESUME, this.onResume, this);
    }

    protected onDisable(): void {
        getEventEmiter().off(SUBGAME.FUNC.GAME_PAUSE, this.onPause, this);
        getEventEmiter().off(SUBGAME.FUNC.GAME_RESUME, this.onResume, this);
    }

    public startTime(time: number) {
        this.passTime.color = color(255, 255, 255, 255);
        CountdownTimer.build("pass", time, this, (countDown: number) => {
            if (countDown == 0) {
                console.log("time out , game fail");
                // 失败先弹出复活 再弹出失败
                PanelCreator.timeout(this.gameLogic.getComponent(GameLogic).getGamePercent());
            }
            this.passTime.string = `${Clock.getClock(countDown, "mm:ss")}`;
            if (countDown <= 30) {
                this.passTime.color = color(218, 45, 22, 255);
            }
        }).progress((percent: number) => {
        }).start();
    }

    public stopTime() {
        CountdownTimer.get("pass")?.stop();
    }

    public addTime(time: number) {
        let timer: CountdownTimer = null;
        timer = CountdownTimer.get("pass");
        timer.addTime(time);
        if (timer.isStop()) {
            // 重新启动
            timer.start();
        }
    }

    public pauseTime() {
        CountdownTimer.get("pass")?.pause();
    }

    public resumeTime() {
        CountdownTimer.get("pass")?.resume();
    }

    public pause() {
        this.pauseTime();
    }

    public resume() {
        this.resumeTime();
    }

    public stop() {
        this.stopTime();
    }

    onPause() {
        this.pause();
    }

    onResume() {
        this.resume();
    }
}


