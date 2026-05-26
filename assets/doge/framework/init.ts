import { Asset, EPhysics2DDrawFlags, PhysicsSystem2D, Vec2 } from "cc";
import { LoadCallback } from "./loader/DogeAssetsLoader";
import { PRE_PREFABS } from "./constant/Constant";
import { AssetsDB } from "./common/AssetsDB";

export { DogeToast as Toast } from "./ui/DogeToast";
export { DogeAssetsLoader as Loader } from "./loader/DogeAssetsLoader";
export { default as SceneLoader } from "./loader/DogeSceneLoader";

export class DogeFrawmwork {
    public static async init(callback?: LoadCallback) {
        PhysicsSystem2D.instance.gravity = new Vec2(0, -2200);
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        //     EPhysics2DDrawFlags.Pair |
        //     EPhysics2DDrawFlags.CenterOfMass |
        //     EPhysics2DDrawFlags.Joint |
        //     EPhysics2DDrawFlags.Shape;
        // 加载prefabs
        await AssetsDB.load(Object.values(PRE_PREFABS), Asset, callback);
    }
}


