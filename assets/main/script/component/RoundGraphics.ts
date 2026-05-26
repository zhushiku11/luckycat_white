import { _decorator, CCFloat, Component, Graphics, Mask, Node, UITransform } from 'cc';
const { ccclass, property, requireComponent, executeInEditMode, executionOrder } = _decorator;

@ccclass('RoundGraphics')
@requireComponent(Graphics)
@executeInEditMode(true)
@executionOrder(0)
export class RoundGraphics extends Component {

    private _radius: number = 30;

    @property(CCFloat)
    public get radius(): number {
        return this._radius;
    }
    public set radius(value: number) {
        this._radius = value;
        this.setMaskRect();
    }

    start() {
        this.setMaskRect();
    }

    setMaskRect() {
        let mask = this.getComponent(Mask);
        if (mask) {
            mask.type = Mask.Type.GRAPHICS_STENCIL;
        }
        const g = this.getComponent(Graphics);
        g.clear();
        g.lineWidth = 1;
        // g.fillColor.fromHEX('#ff0000');
        let w = -this.getComponent(UITransform).width;
        let h = -this.getComponent(UITransform).height;
        g.roundRect(-w / 2, -h / 2, w, h, this.radius)
        g.stroke();
        g.fill();
    }
}


