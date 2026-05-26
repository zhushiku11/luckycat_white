

declare module 'cc' {

    interface Node {
        /**
         * 节点的x轴坐标
         * (通过setPosition实现)
         * (如果是同时给x,y,z?赋值，建议使用setPosition)
         */
        get x(): number;
        set x(v: number);

        /**
         * 节点的y轴坐标
         * (通过setPosition实现)
         * (如果是同时给x,y,z?赋值，建议使用setPosition)
         */
        get y(): number;
        set y(v: number);

        /**
         * 节点的z轴坐标
         * (通过setPosition实现)
         * (如果是同时给x,y,z?赋值，建议使用setPosition)
         */
        get z(): number;
        set z(v: number);

        /**
         * 节点的宽度
         * (通过UITransform.width实现)
         * (如果没有UITransform会自动添加)
         */
        get widths(): number;
        set widths(v: number);
        //为什么不直接写width，因为width无法被重写，写了直接报错，我也不知道为什么。

        /**
         * 节点的高度[height无法被重写]
         * (通过UITransform.height实现)
         * (如果没有UITransform会自动添加)
         */
        get heights(): number;
        set heights(v: number);
        //为什么不直接写height，因为height无法被重写，写了直接报错，我也不知道为什么。

        /**
         * 节点的UITransform组件
         * (如果没有UITransform会自动添加)
         * 只能获取transform组件
         */
        get transform(): UITransform;

        /**
         * 节点的缩放(简化scale的使用)
         * (通过setScale(v,v,v)实现)
         * (返回的是scale.x)
         */
        get scales(): number;
        set scales(v: number);

        /**
         * 节点的透明度
         * (通过UIOpacity.opacity实现)
         * (如果没有UIOpacity会自动添加)
         */
        get alpha(): number;
        set alpha(v: number);

        /**
         * 节点的UIOpacity组件
         * (如果没有UIOpacity会自动添加)
         * 只能获取UIOpacity组件
         */
        get opacity(): UIOpacity;

        /**
         * 渐显节点动画
         * @param time 渐显时间 def 0.2s
         * @param cb 渐显完成回调
         */
        fadeIn(time?: number, alpha?: number, cb?: Function): void;
        /**
         * 渐隐节点动画
         * @param time 渐隐时间 def 0.2s
         * @param cb 渐隐完成回调
         */
        fadeOut(time?: number, alpha?: number, cb?: Function): void;

        /**
         * 缩放节点动画
         * @param scale 缩放比例 def 1
         * @param time 缩放时间 def 0.2s
         * @param cb 缩放完成回调
         */
        scaleTo(time?: number, scale?: number, cb?: Function): void;

        /**
         * 获取节点的路径
         */
        getPath(): string;

        /**
         * 获取节点的屏幕坐标
         */
        getPoint(): Vec3;

        /**
         * 节点置灰/恢复(包含子节点)
         * @param isGray true置灰/false恢复
         */
        setGray(isGray?: boolean): void;

    }

    // namespace math {
    //     interface Vec3 {
    //         /**将Vec3向量转换为Vec2 */
    //         toVec2(): Vec2;
    //         /**将Vec3向量转换为角度 */
    //         toAngle(): number;
    //     }
    //     interface Vec2 {
    //         /**将Vec2向量转换为Vec3 */
    //         toVec3(): Vec3;
    //         /**将Vec2向量转换为角度 */
    //         toAngle(): number;
    //     }
    // }

    // interface EventTouch {
    //     /**将EventTouch转换为屏幕坐标Vec2 */
    //     toVec2(): Vec2;
    // }
}