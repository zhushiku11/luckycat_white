import { _decorator, CCInteger, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('SpriteSwitcher')
@requireComponent(Sprite)
export class SpriteSwitcher extends Component {

    @property([SpriteFrame])
    private spf: SpriteFrame[] = [];

    @property(CCInteger)
    private _idx: number = 0;

    @property(CCInteger)
    public get idx(): number {
        return this._idx;
    }

    public set idx(value: number) {
        this._idx = value;
        if (this.spf[this._idx]) {
            this.getComponent(Sprite).spriteFrame = this.spf[this._idx];
        }
    }

    start() {
        this.index(this.idx);
    }

    index(idx: number) {
        this.idx = idx;
    }
}


