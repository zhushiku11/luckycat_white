import { _decorator, Component, Node, Sprite } from 'cc';
import { IPanel } from 'db://assets/doge/framework/panel/Panel';
const { ccclass, property } = _decorator;

@ccclass('LoadingPanel')
export class LoadingPanel extends Component implements IPanel {

    onInit() {

    };

    private show() {
        this.getComponentInChildren(Sprite).node.active = true;
    }

    public showLoading() {
        this.node.active = true;
        this.getComponentInChildren(Sprite).node.active = false;
        this.scheduleOnce(this.show.bind(this), 0.1);
    }

    public hideLoading() {
        this.node.active = false;
        this.getComponentInChildren(Sprite).node.active = false;
        this.unschedule(this.show.bind(this));
    }

    onOpenEffect(target: Node, next: () => void) {
        next();
    }

    onCloseEffect(target: Node, next: () => void) {
        next();
    }
}