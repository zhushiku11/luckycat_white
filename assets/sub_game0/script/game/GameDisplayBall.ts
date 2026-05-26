import { Component, Vec3, _decorator, Node, v3, Graphics, tween, RaycastResult2D, director, PhysicsSystem2D, v2, ERaycast2DType, UITransform, Vec2, Sprite, Prefab, CircleCollider2D, SpriteFrame, Collider2D, Contact2DType, IPhysics2DContact, instantiate, Tween } from "cc";
import { AssetsDB } from "db://assets/doge/framework/common/AssetsDB";
import {  PRELOAD, RES_NAME } from "../../constant/Constant";

const { ccclass, property } = _decorator;

enum COLLIDER_TAG {
    FLOOR = 1,
    BALL = 2,
    GAME_OVER = 3,
    REMOVE = 4,
}

@ccclass("GameDisplayBall")
export default class GameDisplayBall extends Component {

    @property(Sprite)
    private img: Sprite = null;
    public type: number = 0;

    init(ballType: number) {
        this.setType(ballType);
    }

    private setType(ballType: number) {
        console.log("init BallType", ballType);
        this.type = ballType;
        // 设置球的spriteFrame
        this.img.spriteFrame = AssetsDB.get<SpriteFrame>(PRELOAD.SPFRAME_FRAMES.COMMON[`item${ballType}`], RES_NAME);
        // 设置球的大小
        let imgTrans = this.img.getComponent(UITransform);
        this.getComponent(UITransform).width = imgTrans.width;
        this.getComponent(UITransform).height = imgTrans.height;
    }
}
