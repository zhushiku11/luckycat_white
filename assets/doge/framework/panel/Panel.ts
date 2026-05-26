import { _decorator, Component, instantiate, Node, Prefab, tween, Tween, v3 } from 'cc';
import { getEventEmiter } from '../common/EventEmitter';
const { ccclass, property } = _decorator;

export interface IPanel {
    onInit: (...args: any[]) => void;
    onOpenEffect?: (target: Node, next: () => void) => void;
    afterOpenEffect?: (target: Node) => void;
    onCloseEffect?: (target: Node, next: () => void) => void;
    afterCloseEffect?: (target: Node) => void;
    onKill?: () => void;
    activate?: (isNew: boolean) => void;
    deactivate?: (isRemove: boolean) => void;
}

@ccclass('Panel')
export class Panel extends Component {

    @property(Node)
    private target: Node = null;

    /**
     * 创建面板
     *
     * @static
     * @template T 
     * @param {Prefab} prefab 面板预制体
     * @param {Node} parent 父节点
     * @param {typeof Component} cls 实现了IPanel接口的脚本
     * @param {...any[]} args 动态参数
     * @return {*}  {T}
     * @memberof Panel
     */
    public static create<T extends Component>(prefab: Prefab, parent: Node, cls: typeof Component, ...args: any[]): T {
        let node = instantiate(prefab);
        node.parent = parent;
        return Panel.init(node, cls, ...args);
    }

    /**
     * 初始化面板
     *
     * @static
     * @template T
     * @param {Node} node 节点
     * @param {typeof Component} cls 实现了IPanel接口的脚本
     * @param {...any[]} args 动态参数
     * @return {*}  {T}
     * @memberof Panel
     */
    public static init<T extends Component>(node: Node, cls: typeof Component, ...args: any[]): T {
        let panel = node.getComponent(cls);
        let basePanel = node.getComponent(Panel);
        let ipanel = panel as unknown as IPanel;
        if (!basePanel) {
            console.error("Panel: Failed to [Create] panel, isn't a panel!");
        } else if (!ipanel) {
            console.error("Panel: Failed to [Create] panel, unknow panel!");
        } else {
            basePanel.init(ipanel, ...args);
            basePanel.openEffect(ipanel);
        }
        return panel as T;
    }

    /**
     * 移除面板
     *
     * @static
     * @param {Node} node 当前面板节点
     * @param {typeof Component} cls 实现了IPanel接口的脚本
     * @memberof Panel
     */
    public static destroy(node: Node, cls: typeof Component) {
        let panel = node.getComponent(cls);
        let basePanel = node.getComponent(Panel);
        let ipanel = panel as unknown as IPanel;
        if (!basePanel) {
            console.error("Panel: Failed to [Destroy] panel, isn't a panel!");
        } else {
            basePanel.kill(ipanel);
            basePanel.closeEffect(ipanel, () => {
                node.destroy();
            });
        }
    }

    private init(panel: IPanel, ...args: any[]) {
        this.target = this.target || this.node;
        panel.onInit && panel.onInit(...args);
    }

    private openEffect(panel: IPanel) {
        if (panel.onOpenEffect) {
            // 打开面板特效(自定义)
            panel.onOpenEffect(this.target, () => {
                this.afterOpenEffect(panel);
            });
        } else {
            // 打开面板特效(默认) Q
            this.target.scales = 0.5;
            this.target.alpha = 0;
            this.target.fadeIn(0.15, 255, () => {
                this.afterOpenEffect(panel);
            });
            this.target.scaleTo(0.1, 1.0);
        }
    }

    private afterOpenEffect(panel: IPanel) {
        if (panel.afterOpenEffect) {
            panel.afterOpenEffect(this.target);
        }
    }

    private closeEffect(panel: IPanel, closeEnd: Function) {
        if (panel.onCloseEffect) {
            // 打开面板特效(自定义)
            panel.onCloseEffect(this.target, () => {
                this.afterCloseEffect(panel);
                closeEnd();
            });
        } else {
            // 打开面板特效(默认) Q
            this.target.scales = 1.0;
            this.target.alpha = 255;
            this.target.fadeOut(0.15, 0, () => {
                this.afterCloseEffect(panel);
                closeEnd();
            });
            this.target.scaleTo(0.1, 0.5);
        }
    }

    private afterCloseEffect(panel: IPanel) {
        if (panel.afterCloseEffect) {
            panel.afterCloseEffect(this.target);
        }
    }

    private kill(panel: IPanel) {
        if (panel.onKill) {
            // 打开面板特效(自定义)
            panel.onKill();
        }
    }

    public static getEventEmiter() {
        return getEventEmiter("PANEL");
    }

    public static on(event: string, callback: (...any: any[]) => void, thisArgs?: any) {
        Panel.getEventEmiter().on(event, callback, thisArgs);
    }

    public static off(event: string, callback: (...any: any[]) => void, thisArgs?: any) {
        Panel.getEventEmiter().off(event, callback, thisArgs);
    }

    public static open(event: string, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any) {
        Panel.getEventEmiter().emit(event, arg0, arg1, arg2, arg3, arg4);
    }
}


