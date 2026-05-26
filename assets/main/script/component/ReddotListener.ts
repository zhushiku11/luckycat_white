import { _decorator, CCString, Component, Node } from 'cc';
import { RedDotSystem } from '../system/RedDotSystem';
const { ccclass, property } = _decorator;

@ccclass('ReddotListener')
export class ReddotListener extends Component {

    @property(CCString)
    private flag: string = "";

    private flagGroup: string[] = null;

    protected onLoad(): void {
        this.flagGroup = this.flag.split("|");
        this.listen(this.flagGroup);
        // 初始化红点状态
        this.onRedPointStateChange();
    }

    private listen(flags: string[]) {
        // 监听所有标识
        for (let i = 0; i < flags.length; i++) {
            RedDotSystem.I.on(flags[i], this.onRedPointStateChange, this);
        }
    }

    private unlisten(flags: string[]) {
        // 取消监听所有标识
        for (let i = 0; i < flags.length; i++) {
            RedDotSystem.I.off(flags[i], this.onRedPointStateChange, this);
        }
    }

    protected onDestroy(): void {
        // 取消监听多个红点标识
        this.unlisten(this.flagGroup);
    }

    onRedPointStateChange() {
        for (let i = 0; i < this.flagGroup.length; i++) {
            const state = RedDotSystem.I.getState(this.flagGroup[i]);
            if (state) {
                this.node.active = true;
                return;
            }
        }
        this.node.active = false;
    }
}


