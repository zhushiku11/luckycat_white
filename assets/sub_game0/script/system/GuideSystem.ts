import { getEventEmiter } from "db://assets/doge/framework/common/EventEmitter";
import { PlayerSystem } from "db://assets/main/script/system/PlayerSystem";

export class GuideSystem {

    private static _instance = null;
    public static get I(): GuideSystem {
        if (!GuideSystem._instance) {
            GuideSystem._instance = new GuideSystem();
        }
        return GuideSystem._instance;
    }

    private vo: GuideSystemVO = new GuideSystemVO();

    init() {
        if (PlayerSystem.I.isNewUser()) {
            this.vo.step = 0;
        } else {
            this.vo.step = 7;
        }
        console.log("Game Guide step", this.vo.step);
    }

    isRun() {
        return this.vo.step < 7;
    }

    isEnd() {
        return this.vo.step >= 7;
    }

    getStep() {
        return this.vo.step;
    }

    nextStep() {
        this.vo.step += 1;
    }

    show() {
        getEventEmiter().emit("GuideShow");
    }

    hide() {
        getEventEmiter().emit("GuideHide");
    }

    nextShow() {
        this.nextStep();
        this.show();
    }
}

export class GuideSystemVO {
    private _step: number = 0;
    public get step(): number {
        return this._step;
    }
    public set step(value: number) {
        this._step = value;
    }
}

