import { getEventEmiter } from "db://assets/doge/framework/common/EventEmitter";

// 红点系统
export class RedDotSystem {

    private static _instance = null;
    public static get I(): RedDotSystem {
        if (!RedDotSystem._instance) {
            RedDotSystem._instance = new RedDotSystem();
        }
        return RedDotSystem._instance;
    }

    private vo: RedDotSystemVO = new RedDotSystemVO();

    public init() { }

    public update(tag: string, state: boolean) {
        if (!this.vo.states.has(tag)) {
            this.vo.states.set(tag, false);
        }
        if (this.vo.states.get(tag) != state) {
            this.vo.states.set(tag, state);
            // 更新红点脚本
            this.getEventEmiter().emit(tag, tag, state);
        }
    }

    public getState(tag: string): boolean {
        return this.vo.states.get(tag) || false;
    }

    private getEventEmiter() {
        return getEventEmiter("Red_dot");
    }

    on<TFunction extends (...any: any[]) => void>(type: string, callback: TFunction, thisArg?: any, once?: boolean) {
        this.getEventEmiter().on(type, callback, thisArg, once);
    }

    off<TFunction extends (...any: any[]) => void>(type: string, callback: TFunction, thisArg?: any) {
        this.getEventEmiter().off(type, callback, thisArg);
    }
}

export class RedDotSystemVO {
    // 红点状态
    private _states: Map<string, boolean> = new Map<string, boolean>();

    public get states(): Map<string, boolean> {
        return this._states;
    }
    public set states(value: Map<string, boolean>) {
        this._states = value;
    }
}


