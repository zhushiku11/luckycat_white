import { _decorator, Component, Label, tween, Node, easing, math, v3, Vec3, Prefab, Sprite, Tween, Button, AudioSource } from 'cc';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { Utils, Wait } from 'db://assets/doge/framework/common/Utils';
import { SlotRewardPanel } from './SlotRewardPanel';
import { UserSystem } from '../../system/UserSystem';
import { Language } from 'db://assets/doge/framework/language/Language';
import { Toast } from 'db://assets/doge/framework/init';
import AudioTools from 'db://assets/doge/framework/common/AudioTools';
import { AMoney } from 'db://assets/doge/framework/common/Currency';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { AD_TYPE, REWARD_TYPE } from 'db://assets/native_interface/NI';
import { SUBGAME, SLOT_CONDITION, AUDIOS } from '../../../constant/Constant';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { PanelCreator } from '../creator/PanelCreator';
import { SlotGameSystem } from '../../system/SlotGameSystem';
const { ccclass, property } = _decorator;

const SPEED = 20000;

@ccclass('SlotGamePanel')
export class SlotGamePanel extends Component implements IPanel {

    @property(AudioSource)
    private bgm: AudioSource = null;
    @property(AudioSource)
    private rewardSound: AudioSource = null;

    @property(Node)
    private descLayer: Node = null;
    @property(Node)
    private gameLayer: Node = null;
    @property([Node])
    private region: Node[] = [];
    @property([Node])
    private frames: Node[] = [];
    @property(Node)
    private playBtn: Node = null;
    @property(Node)
    private tips: Node = null;

    private point: Vec3[] = [v3(0, 0, 0), v3(0, 0, 0), v3(0, 0, 0)];
    private rewardType: number = 0;

    onOpenEffect(target: Node, next: () => void) {
        next();
    };

    onCloseEffect(target: Node, next: () => void) {
        next();
    };

    onInit() {
        this.gameLayer.active = true;
        this.descLayer.active = false;
        this.onRefresh();
    };

    activate(isNew: boolean) {
        if (isNew) {
            console.log("SlotGame activate new");
        } else {
            console.log("SlotGame deactivate unObscured");
        }
    };

    deactivate(isRemove: boolean) {
        if (isRemove) {
            console.log("SlotGame deactivate remove");
        } else {
            console.log("SlotGame deactivate obscured");
        }
    };

    onRefresh() {
        if (SlotGameSystem.I.getSlotGameTimes() >= SLOT_CONDITION) {
            this.playBtn.getComponentInChildren(Sprite).node.active = false;
            this.playBtn.getComponentInChildren(Label).node.active = true;
            this.tips.getComponent(Label).string = Language.getWord("l_slotGameTips1");
        } else {
            this.playBtn.getComponentInChildren(Sprite).node.active = true;
            this.playBtn.getComponentInChildren(Label).node.active = false;
            this.tips.getComponent(Label).string = Language.getWord("l_slotGameTips0");
        }
    }

    async startup(rewards: number[], rewardA: number, rewardB: number) {
        this.bgm.play();

        let runningTimes = this.region.length;
        for (let i = 0; i < this.region.length; i++) {
            const region = this.region[i];
            const point = this.point[i];
            const frame = this.frames[i];
            region.y = 0;
            point.y = 0;
            const reward = rewards[i] || 5;
            let distance = 710 * 150 + (reward - 1) * 142;
            let time = distance / SPEED;
            console.log(time, " time ");
            tween(point)
                .by(time, { y: -distance }, {
                    easing: easing.quintInOut, onUpdate: (target: Vec3, ratio: number) => {
                        let y = (target.y) % 710;
                        region.y = y;
                    }
                })
                .call(() => {
                    // tween(frame)
                    //     .call(() => { frame.active = false })
                    //     .delay(0.1)
                    //     .call(() => { frame.active = true })
                    //     .delay(0.1)
                    //     .union()
                    //     .repeat(4)
                    //     .start();
                })
                // .delay(0.8)
                .call(() => {
                    runningTimes -= 1;
                    if (runningTimes == 0) {
                        this.bgm.stop();
                        this.rewardSound.play();
                        for (let i = 0; i < this.frames.length; i++) {
                            const f = this.frames[i];
                            tween(f)
                                .to(0.1, { alpha: 0 })
                                .to(0.1, { alpha: 255 })
                                .union()
                                .repeat(4)
                                .start();
                        }
                        this.scheduleOnce(() => {
                            this.onGameEnd(rewardA, rewardB);
                        }, 1.0)
                    }
                })
                .start()
            await new Wait().second(0.1);
        }
    }

    afterOpenEffect(target: Node) {
        // AudioTools.playBgm(AUDIOS.slot_bgm);
        AudioTools.setVolume(0.5);
    };

    afterCloseEffect(target: Node) {
        AudioTools.playBgm(AUDIOS.bgm);
        AudioTools.setVolume(1);
        for (let i = 0; i < this.region.length; i++) {
            Tween.stopAllByTarget(this.point[i]);
        }
    };

    onGameEnd(rewardA: number, rewardB: number) {
        for (let i = 0; i < this.region.length; i++) {
            const region = this.region[i];
            this.frames[i].alpha = 0;
            region.y = 0;
        }
        this.enablePlayBtn();
        this.showRewardPopup(rewardA, rewardB);
    }

    onBackBtnClick() {
        this.node && PanelFactory.close(SlotGamePanel);
    }

    onAboutBtnClick() {
        this.gameLayer.active = false;
        this.descLayer.active = true;
    }

    playByFree() {
        let rewards = [1, 3, 4];
        let rewardType = rewards[Utils.randomInt(0, rewards.length - 1)];
        let rewardA = UserSystem.I.getCashReward1();
        AMoney.add(rewardA);
        this.playGame(rewardType, rewardA, 0);
    }

    async playByAD() {
        let rewards = [0, 2, 5];
        let rewardType = rewards[Utils.randomInt(0, rewards.length - 1)];
        let rewardA = UserSystem.I.getCashReward1();
        if (rewardType == 0) {
            rewardA *= 1;
        }
        UserSystem.I.getAdReward(AD_TYPE.VIDEO, REWARD_TYPE.DELAY_REWARD, rewardA, (isErr: boolean, rewardA: number, rewardB: number) => {
            if (isErr) {
                return;
            }
            Toast.show(Language.getWord("l_slotGameTips2"));
            this.playGame(rewardType, rewardA, rewardB);
        })
    }

    playGame(rewardType: number, rewardA: number, rewardB: number) {
        this.disablePlayBtn();

        this.rewardType = rewardType;
        console.log("reward idx", this.rewardType);
        if (this.rewardType == 5) {
            let reward0 = 0;
            let reward1 = 0;
            let reward2 = 0;
            do {
                reward0 = Utils.randomInt(0, 4);
                reward1 = Utils.randomInt(0, 4);
                reward2 = Utils.randomInt(0, 4);
            } while ((reward0 == reward1 && reward1 == reward2) || (reward0 == reward1 || reward1 == reward2 || reward2 == reward0));
            console.log("reward []", reward0, reward1, reward2);
            this.startup([reward0, reward1, reward2], rewardA, rewardB);
        } else {
            this.startup([this.rewardType, this.rewardType, this.rewardType], rewardA, rewardB);
        }
    }

    onPlayBtnClick() {
        if (SlotGameSystem.I.getSlotGameTimes() >= SLOT_CONDITION) {
            this.playByFree();
            SlotGameSystem.I.clearSlotGameTimes();
            this.onRefresh();
        } else {
            this.playByAD();
        }
    }

    onOKEBtnClick() {
        this.gameLayer.active = true;
        this.descLayer.active = false;
    }

    showRewardPopup(rewardA: number, rewardB: number) {
        PanelCreator.slotReward(this.node, this.rewardType, rewardA, rewardB);
    }

    disablePlayBtn() {
        this.playBtn.setGray(true);
        this.playBtn.getComponent(Button).interactable = false;
    }

    enablePlayBtn() {
        this.playBtn.setGray(false);
        this.playBtn.getComponent(Button).interactable = true;
    }
}


