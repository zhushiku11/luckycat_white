import { _decorator, CCInteger, Component, find, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AnimationSwicth')
export class AnimationSwicth extends Component {

    @property(CCInteger)
    private index: number = 0;

    start() {
        switch (this.index) {
            case 0:
                this.playAnimation0();
                break;
            case 1:
                this.playAnimation1();
                break;
            case 2:
                this.playAnimation2();
                break;
            case 3:
                this.playAnimation3();
                break;
        }
    }

    update(deltaTime: number) {

    }

    playAnimation0() {
        let ball = find("Img", this.node);
        let star0 = find("star0", this.node);
        let star1 = find("star1", this.node);
        let star2 = find("star2", this.node);
        tween(ball)
            .delay(3.5)
            .by(0.15, { angle: 20 })
            .by(0.3, { angle: -40 })
            .by(0.3, { angle: 40 })
            .by(0.3, { angle: -40 })
            .by(0.3, { angle: 40 })
            .by(0.3, { angle: -40 })
            .by(0.3, { angle: 40 })
            .by(0.15, { angle: -20 })
            .union()
            .repeatForever()
            .start();
        tween(star0)
            .delay(2.8)
            .to(0.3, { alpha: 0 })
            .to(0.3, { alpha: 255 })
            .union()
            .repeatForever()
            .start()
        tween(star1)
            .delay(3.1)
            .to(0.3, { alpha: 0 })
            .to(0.3, { alpha: 255 })
            .union()
            .repeatForever()
            .start()
        tween(star2)
            .delay(3.4)
            .to(0.3, { alpha: 0 })
            .to(0.3, { alpha: 255 })
            .union()
            .repeatForever()
            .start()
    }

    playAnimation1() {
        let box = find("Icon", this.node);

        tween(box)
            .delay(3.0)
            .by(0.075, { angle: 15 })
            .by(0.15, { angle: -30 })
            .by(0.15, { angle: 30 })
            .by(0.15, { angle: -30 })
            .by(0.15, { angle: 30 })
            .by(0.15, { angle: -30 })
            .by(0.15, { angle: 30 })
            .by(0.075, { angle: -15 })
            .union()
            .repeatForever()
            .start();
    }

    playAnimation2() {
        let speed = 200;

        let item0 = find("Item0", this.node);
        let light0 = find("light", item0);
        light0.active = true;
        let item1 = find("Item1", this.node);
        let light1 = find("light", item1);
        light1.active = true;
        let item2 = find("Item2", this.node);
        let light2 = find("light", item2);
        light2.active = true;

        light0.alpha = 0;
        light1.alpha = 0;
        light2.alpha = 0;

        // light1.x = -100;
        // tween(light1)
        //     .by(30 / speed, { x: 30, alpha: 255 })
        //     .by(140 / speed, { x: 140 })
        //     .by(30 / speed, { x: 30, alpha: -255 })
        //     .call(() => {
        //         light0.x = -120;
        //         tween(light0)
        //             .by(30 / speed, { x: 30, alpha: 255 })
        //             .by(180 / speed, { x: 180 })
        //             .by(30 / speed, { x: 30, alpha: -255 })
        //             .call(() => {
        //                 light2.x = -100;
        //                 tween(light2)
        //                     .by(30 / speed, { x: 30, alpha: 255 })
        //                     .by(140 / speed, { x: 140 })
        //                     .by(30 / speed, { x: 30, alpha: -255 })
        //                     .start();
        //             })
        //             .start();
        //     })
        //     .start();

        tween(this.node)
            .call(() => {
                light1.x = -110;
                tween(light1)
                    .by(30 / speed, { x: 40, alpha: 255 })
                    .by(140 / speed, { x: 140 })
                    .by(30 / speed, { x: 40, alpha: -255 })
                    .start();
            })
            .delay(200 / speed)
            .call(() => {
                light0.x = -110;
                tween(light0)
                    .by(50 / speed, { x: 50, alpha: 255 })
                    .by(140 / speed, { x: 140 })
                    .by(50 / speed, { x: 50, alpha: -255 })
                    .start();
            })
            .delay(240 / speed)
            .call(() => {
                light2.x = -110;
                tween(light2)
                    .by(30 / speed, { x: 40, alpha: 255 })
                    .by(140 / speed, { x: 140 })
                    .by(30 / speed, { x: 40, alpha: -255 })
                    .start();
            }).start()
            .delay(200 / speed + 5.2)
            .union()
            .repeatForever()
            .start();

        console.log("++++++++++++");
    }

    playAnimation3() {
        let light0 = find(`Light0/Img`, this.node);
        let light1 = find(`Light1/Img`, this.node);
        let light2 = find(`Light2/Img`, this.node);
        let light3 = find(`Light3/Img`, this.node);
        let light4 = find(`Light4/Img`, this.node);
        let light5 = find(`Light5/Img`, this.node);

        const time0 = 0.8;
        const time1 = 1.2;
        const time2 = 4.5;

        tween(this.node)
            .delay(time2)
            .call(() => {
                if (find(`Item0`, this.node).children.length > 0) {
                    light0.x = -60
                    tween(light0)
                        .by(time0, { x: 120 })
                        .start();
                }

                if (find(`Item1`, this.node).children.length > 0) {
                    light1.x = -60
                    tween(light1)
                        .by(time0, { x: 120 })
                        .start();
                }

                if (find(`Item2`, this.node).children.length > 0) {
                    light2.x = -60
                    tween(light2)
                        .by(time0, { x: 120 })
                        .start();
                }

                if (find(`Item3`, this.node).children.length > 0) {
                    light3.x = -60
                    tween(light3)
                        .by(time0, { x: 120 })
                        .start();
                }

                if (find(`Item4`, this.node).children.length > 0) {
                    light4.x = -60
                    tween(light4)
                        .by(time0, { x: 120 })
                        .start();
                }

                if (find(`Item5`, this.node).children.length > 0) {
                    light5.x = -60
                    tween(light5)
                        .by(time0, { x: 120 })
                        .start();
                }
            })
            .union()
            .repeatForever()
            .start();
    }
}


