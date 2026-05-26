import { _decorator, Component, Node, Prefab } from 'cc';
import { IPanel, Panel } from './Panel';
const { ccclass, property } = _decorator;

type PanelEntity = {
    ins: Component,
    cls: typeof Component
}

@ccclass('PanelFactory')
export class PanelFactory {

    private static _instance = null;
    public static get I(): PanelFactory {
        if (!PanelFactory._instance) {
            PanelFactory._instance = new PanelFactory();
        }
        return PanelFactory._instance;
    }

    private panelStack: PanelEntity[] = [];
    private panelMap: Map<typeof Component, Prefab> = new Map<typeof Component, Prefab>();
    private root: Node = null;

    public add(item: any[]) {
        PanelFactory.I.panelMap.set(item[0], item[1]);
    }

    public setRoot(root: Node) {
        PanelFactory.I.root = root;
    }

    public getRoot() {
        return PanelFactory.I.root;
    }

    public createPanel<T extends Component>(cls: typeof Component, parent: Node, ...args: any[]): T {
        let prefab = this.panelMap.get(cls);
        if (prefab) {
            return Panel.create<T>(prefab, parent, cls, ...args);
        } else {
            console.error("PanelFactory: Not hava Prefab to instantiate!", cls.name);
        }
        return null;
    }

    public removePanel(node: Node, cls: typeof Component) {
        Panel.destroy(node, cls);
    }

    public static init(config: any[][], root: Node) {
        PanelFactory.I.panelMap = new Map();
        for (let i = 0; i < config.length; i++) {
            const item = config[i];
            PanelFactory.I.add(item);
        }
        PanelFactory.I.setRoot(root);
    }

    /**
     * 打开Panel
     *
     * @static
     * @template T
     * @param {typeof Component} cls
     * @param {...any[]} args
     * @return {*}  {T}
     * @memberof PanelFactory
     */
    public static open<T extends Component>(cls: typeof Component, ...args: any[]): T {
        console.log("open", cls.name, "in ", PanelFactory.I.getRoot().getPath());
        let panelInstance = PanelFactory.I.createPanel<T>(cls, PanelFactory.I.getRoot(), ...args);
        PanelFactory.openWithInstance<T>(panelInstance, cls);
        return panelInstance;
    }

    /**
     * 关闭Panel
     *
     * @static
     * @memberof PanelFactory
     */
    public static close(cls?: typeof Component) {
        console.log("close", cls.name, "top", PanelFactory.top()?.cls.name);
        if (PanelFactory.I.panelStack.length <= 0) {
            return;
        }
        if (!cls || PanelFactory.top().cls == cls) {
            let del: PanelEntity = PanelFactory.I.panelStack.pop();
            let top: PanelEntity = PanelFactory.top();
            PanelFactory.I.removePanel(del.ins.node, del.cls);
            let delPanel = del.ins as unknown as IPanel;
            delPanel?.deactivate && delPanel.deactivate(true);
            if (top) {
                let topPanel = top.ins as unknown as IPanel;
                topPanel?.activate && topPanel.activate(false);
            }
        } else {
            let delIndex = PanelFactory.I.panelStack.findIndex((value: PanelEntity) => {
                return value.cls == cls;
            })
            if (delIndex != -1) {
                let del: PanelEntity = PanelFactory.I.panelStack[delIndex];
                PanelFactory.I.panelStack.splice(delIndex, 1);
                PanelFactory.I.removePanel(del.ins.node, del.cls);
                let delPanel = del.ins as unknown as IPanel;
                delPanel?.deactivate && delPanel.deactivate(true);
            }
        }
    }

    public static openWithInstance<T extends Component>(instance: T, cls: typeof Component): T {
        let oldTopPanel = PanelFactory.top()?.ins;
        PanelFactory.I.panelStack.push({ ins: instance, cls: cls });
        let ipanel = instance as unknown as IPanel;
        let oldIPanel = oldTopPanel as unknown as IPanel;
        oldIPanel?.deactivate && oldIPanel.deactivate(false);
        ipanel?.activate && ipanel.activate(true);
        return instance;
    }

    public static top() {
        let len = PanelFactory.I.panelStack.length;
        if (len <= 0) {
            return null;
        } else {
            return PanelFactory.I.panelStack[len - 1];
        }
    }

    public static isTop(panel: Component) {
        return PanelFactory.top().ins == panel;
    }
}