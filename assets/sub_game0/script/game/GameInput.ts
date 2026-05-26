import { Component, _decorator, Node, Graphics, EventTouch, v3, UITransform, tween, RigidBody2D, ERigidBody2DType, v2 } from "cc";
import { GameLauncher } from "./GameLauncher";

const { ccclass, property } = _decorator;

@ccclass("GameInput")
export default class GameInput extends Component {

    @property(GameLauncher)
    private launcher: GameLauncher = null;

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
        
    onTouchStart(event: EventTouch) {
        let touchPos = this.getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y, 0));
        if (touchPos.x > 350) {
            touchPos.x = 350;
        }
        if (touchPos.x < -350) {
            touchPos.x = -350;
        }
        this.launcher.onTouchStart(event, touchPos);
    }

    onTouchMove(event: EventTouch) {
        let touchPos = this.getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y, 0));
        if (touchPos.x > 350) {
            touchPos.x = 350;
        }
        if (touchPos.x < -350) {
            touchPos.x = -350;
        }
        this.launcher.onTouchMove(event, touchPos);
    }

    onTouchEnd(event: EventTouch) {
        let touchPos = this.getComponent(UITransform).convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y, 0));
        if (touchPos.x > 350) {
            touchPos.x = 350;
        }
        if (touchPos.x < -350) {
            touchPos.x = -350;
        }
        this.launcher.onTouchEnd(event, touchPos);
    }
}
