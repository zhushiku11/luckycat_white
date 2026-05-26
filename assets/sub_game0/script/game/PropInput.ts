import { _decorator, Component, easing, misc, Node, Size, Sprite, SpriteFrame, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { SpriteSwitcher } from 'db://assets/main/script/component/SpriteSwitcher';
import { PropType } from '../system/PropSystem';
const { ccclass, property } = _decorator;

@ccclass('PropInput')
export class PropInput extends Component {

    @property(SpriteFrame)
    private line: SpriteFrame = null;
    @property(SpriteSwitcher)
    private icon: SpriteSwitcher = null;

    public type: PropType = 0;

    start() {

    }

    update(deltaTime: number) {

    }

    public resetIcon() {
        this.icon.node.active = true;
        this.icon.node.angle = 0;
        this.icon.node.position = v3(0, -50, 0);
    }

    public setIcon(type: PropType) {
        this.type = type;
        this.resetIcon();
        switch (type) {
            case PropType.PROP0:
                this.icon.index(0);
                break;
            case PropType.PROP1:
                this.icon.index(1);
                break;
        }
    }

    runSmashAnim(node: Node, endFunc: Function) {
        tween(this.icon.node)
            .to(0.3, { position: v3(node.position.x, node.position.y, node.position.z) }, { easing: easing.sineOut })
            .to(0.3, { angle: -90 }, { easing: easing.sineOut })
            .call(() => {
                this.resetIcon();
            })
            .call(endFunc)
            .start();
    }

    runMagicAnim(balls: Node[], endFunc: Function) {
        for (let i = 0; i < balls.length; i++) {
            const ball = balls[i];
            let line = this.createLine();
            line.setSiblingIndex(0)
            let posX = ball.position.x - line.position.x;
            let posY = ball.position.y - line.position.y;
            let radius = Vec3.angle(v3(1, 0, 0), v3(posX, posY, 0));
            let angle = misc.radiansToDegrees(radius);
            line.angle = posY < 0 ? -angle : angle;
            let t = tween(line.getComponent(UITransform))
                .by(0.1, { contentSize: new Size(Vec3.distance(line.position, ball.position), 0) })
                .hide()
                .delay(0.1)
                .show()
                .delay(0.1)
                // .hide()
                // .delay(0.07)
                // .show()
                // .delay(0.07)
                .call(() => {
                    line.destroy();
                    endFunc(ball, i);
                }).start();
        }
    }

    createLine() {
        let node = new Node();
        let trans = node.addComponent(UITransform);
        let sp = node.addComponent(Sprite);
        sp.spriteFrame = this.line;
        sp.sizeMode = Sprite.SizeMode.CUSTOM;
        sp.type = Sprite.Type.SLICED;
        console.log(200, sp.spriteFrame.height);
        trans.contentSize = new Size(0, 18);
        node.parent = this.node;
        trans.anchorPoint = v2(0, 0.5);
        node.position = v3(this.icon.node.position);
        return node;
    }
}


