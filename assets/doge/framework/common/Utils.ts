import { Vec3, Node, UITransform, sp } from "cc";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export class Wait {

    private reject: () => void = null;

    public second(sec: number) {
        return new Promise<void>((resolve, reject) => {
            this.reject = reject;
            setTimeout(() => {
                resolve();
            }, sec * 1000);
        });
    }

    public abort() {
        this.reject && this.reject();
    }
}


export class Utils {
    /**
     * 将世界坐标转到转节点坐标
     *
     * @static
     * @param {Node} target 目标节点
     * @param {Vec3} worldPosition 世界坐标
     * @param {Vec3} [out] 返回
     * @return {*} 
     * @memberof Utils
     */
    public static convertToNodeSpaceAR(target: Node, worldPosition: Vec3, out?: Vec3): Vec3 {
        return target.getComponent(UITransform).convertToNodeSpaceAR(worldPosition, out);
    }

    /**
     * 改变父节点
     *
     * @static
     * @param {Node} child 子节点
     * @param {Node} parent 新的父节点
     * @param {boolean} [notChangePosInWorld=true] 是否改变世界坐标
     * @memberof Utils
     */
    public static changeParent(child: Node, parent: Node, changePosInWorld: boolean = false) {
        if (changePosInWorld) {
            child.parent = parent;
        } else {
            let pos = child.worldPosition;
            child.parent = parent;
            child.worldPosition = pos;
        }
    }

    /**
     * 替换节点
     * 被替换的节点会被释放
     * 
     * @static
     * @param {Node} oldNde 被替换的节点
     * @param {Node} newNode 新的节点
     * @return {*}  {Node} 新的节点
     * @memberof Utils
     */
    public static replaceNode(oldNde: Node, newNode: Node): Node {
        newNode.parent = oldNde.parent;
        newNode.setSiblingIndex(oldNde.getSiblingIndex());
        oldNde.destroy();
        return newNode;
    }

    /**
     * 随机的整数
     *
     * @static
     * @param {number} min
     * @param {number} max
     * @return {*}  {number}
     * @memberof Utils
     */
    public static randomInt(min: number, max: number): number {
        const random = Math.floor(Math.random() * (max - min + 1) + min);
        return random;
    }

    /**
     * 随机的浮点数
     *
     * @static
     * @param {number} min
     * @param {number} max
     * @return {*}  {number}
     * @memberof Utils
     */
    public static randomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min
    }

    /**
     * 保留小数
     *
     * @static
     * @param {number} num
     * @param {number} [bit=2] 保留位数
     * @return {*} 
     * @memberof Utils
     */
    public static decimal(num: number, bit: number = 2): number {
        let pow = Math.pow(10, bit)
        return Number((Math.floor(num * pow) / pow).toFixed(bit))
    }

    /**
     * 简易字符串
     *
     * @static
     * @param {string} str 需要处理的字符串
     * @param {number} subNum 截取字符位数
     * @return {*}  {number}
     * @memberof Utils
     */
    public static easyString(str: string, subNum: number = 8): string {
        if (str.length > subNum) {
            return str.substring(0, subNum) + "...";
        }
        return str;
    }

    /**
    * 邮箱校验
    *
    * @static
    * @param {string} email
    * @return {*}  {boolean}
    * @memberof Utils
    */
    public static checkEmail(email: string): boolean {
        return emailRegex.test(email);
    }

    public static resetSkeletonData(spine: sp.Skeleton, data: sp.SkeletonData) {
        spine.skeletonData = null;
        spine.skeletonData = data;
    }
}



