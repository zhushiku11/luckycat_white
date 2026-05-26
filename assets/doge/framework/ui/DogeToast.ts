import { _decorator, CCFloat, Component, find, instantiate, Label, Node, Overflow, Prefab, Size, Sprite, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { AssetsDB } from '../common/AssetsDB';
import { PRE_PREFABS } from '../constant/Constant';
const { ccclass, property } = _decorator;

@ccclass('DogeToast')
export class DogeToast extends Component {

    @property(Sprite)
    private bg: Sprite = null;
    @property(Label)
    private text: Label = null;
    @property(CCFloat)
    private maxWidth: number = 0;
    @property(CCFloat)
    private minWidth: number = 0;
    @property(CCFloat)
    private marginTopBottom: number = 0;
    @property(CCFloat)
    private marginLeftRight: number = 0;

    private textUItrans: UITransform = null;

    public static async show(text: string, parent?: Node) {
        let toast = AssetsDB.get<Prefab>(PRE_PREFABS.Toast);
        if (!toast) {
            await AssetsDB.load([PRE_PREFABS.Toast], Prefab);
            toast = AssetsDB.get<Prefab>(PRE_PREFABS.Toast);
        }
        let node = instantiate(toast);
        node.parent = parent || find("Canvas/Toast");
        node.getComponent(DogeToast).show(text);
    }

    protected onLoad(): void {
        this.text.node.position = new Vec3(9999, 0, 0);
        this.textUItrans = this.text.getComponent(UITransform);
    }

    start() {
        this.bg.node.active = false;
        this.scheduleOnce(() => { this.onShow() }, 0);
    }

    public show(text: string) {
        this.text.string = text;
    }

    onShow() {
        let size = this.textUItrans.contentSize;
        if (this.marginLeftRight * 2 + size.width > this.maxWidth) {
            this.textUItrans.contentSize = new Size(this.maxWidth, 0);
            this.text.overflow = Overflow.RESIZE_HEIGHT;
            this.scheduleOnce(() => {
                this.bg.node.active = true;
                this.showText();
            }, 0);
        } else if (this.marginLeftRight * 2 + size.width < this.minWidth) {
            this.bg.node.active = true;
            this.showText(this.minWidth);
        } else {
            this.bg.node.active = true;
            this.showText();
        }
    }

    private showText(w?: number) {
        this.text.node.position = new Vec3(0, 2, 0);
        this.bg.getComponent(UITransform).contentSize = new Size(w ? w : (this.textUItrans.width + this.marginLeftRight), this.textUItrans.height + this.marginTopBottom);
        this.anim();
    }

    private anim() {
        let uiOpacity = this.getComponent(UIOpacity);
        uiOpacity.opacity = 255;
        let opacityAnim = tween(uiOpacity)
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.node.destroy();
            });
        tween(this.node)
            .delay(0.8)
            .by(0.5, { position: new Vec3(0, 100, 0) })
            .call(() => {
                opacityAnim.start();
            }).start();
    }
}


