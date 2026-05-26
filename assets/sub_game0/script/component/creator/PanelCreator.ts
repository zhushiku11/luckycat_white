

import { _decorator, Component, find, Prefab, Node } from 'cc';
import { CongratulationsPanel } from 'db://assets/main/script/component/panels/CongratulationsPanel';
import { NewUserRewaradPanel } from 'db://assets/sub_game0/script/component/panels/NewUserRewaradPanel';
import { NormalRewardPanel } from 'db://assets/sub_game0/script/component/panels/NormalRewardPanel';
import { PassRewardPanel } from 'db://assets/sub_game0/script/component/panels/PassRewardPanel';
import { FailedPanel } from 'db://assets/sub_game0/script/component/panels/FailedPanel';
import { TimeoutPanel } from 'db://assets/sub_game0/script/component/panels/TimeoutPanel';
import { WithdrawGuidePanel } from 'db://assets/sub_game0/script/component/panels/WithdrawGuidePanel';
import { SettingPanel } from 'db://assets/sub_game0/script/component/panels/SettingPanel';
import { WithdrawRatePanel } from 'db://assets/sub_game0/script/component/panels/WithdrawRatePanel';
import { WithdrawTaskPanel } from 'db://assets/sub_game0/script/component/panels/WithdrawTaskPanel';
import { SlotGamePanel } from 'db://assets/sub_game0/script/component/panels/SlotGamePanel';
import { PropBuyPanel } from 'db://assets/sub_game0/script/component/panels/PropBuyPanel';
import { WithdrawAPanel } from 'db://assets/sub_game0/script/component/panels/WithdrawAPanel';
import { WithdrawBPanel } from 'db://assets/sub_game0/script/component/panels/WithdrawBPanel';
import { LevelWithdrawPanel } from 'db://assets/sub_game0/script/component/panels/LevelWithdrawPanel';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { UserSystem } from '../../system/UserSystem';
import { PlayerSystem } from 'db://assets/main/script/system/PlayerSystem';
import { PropType } from '../../system/PropSystem';
import { GuideSystem } from '../../system/GuideSystem';
import { Panel } from 'db://assets/doge/framework/panel/Panel';
import { LevelSystem } from '../../system/LevelSystem';
import { WithdrawSystem } from '../../system/WithdrawSystem';
import { CheckinPanel } from '../panels/CheckinPanel';
import { NI } from 'db://assets/native_interface/NI';
import { SlotRewardPanel } from '../panels/SlotRewardPanel';
import { ScoreSystem } from '../../system/ScoreSystem';
import { MoreSpinPanel } from '../panels/MoreSpinPanel';
import { TreasurePanel } from '../panels/TreasurePanel';
import { TreasureWinPanel } from '../panels/TreasureWinPanel';
import { AboutPanel } from '../panels/AboutPanel';
import { DrawcardPanel } from '../panels/DrawcardPanel';
import { DrawcardRewardPanel } from '../panels/DrawcardRewardPanel';
import { LotteryPanel } from '../panels/LotteryPanel';
import { LotteryRewardPanel } from '../panels/LotteryRewardPanel';
import { SpinSystem } from '../../system/SpinSystem';
const { ccclass, property } = _decorator;

@ccclass('PanelCreator')
export class PanelCreator extends Component {

    @property(Prefab)
    private congratulationsPanel: Prefab = null;
    @property(Prefab)
    private withdrawAPanel: Prefab = null;
    @property(Prefab)
    private withdrawBPanel: Prefab = null;
    @property(Prefab)
    private newUserRewardPanel: Prefab = null;
    @property(Prefab)
    private normalRewardPanel: Prefab = null;
    @property(Prefab)
    private withdrawGuidePanel: Prefab = null;
    @property(Prefab)
    private withdrawRatePanel: Prefab = null;
    @property(Prefab)
    private moreSpinPanel: Prefab = null;
    @property(Prefab)
    private treasurePanel: Prefab = null;
    @property(Prefab)
    private treasureWinPanel: Prefab = null;
    @property(Prefab)
    private drawcardPanel: Prefab = null;
    @property(Prefab)
    private drawcardRewardPanel: Prefab = null;
    @property(Prefab)
    private lotteryPanel: Prefab = null;
    @property(Prefab)
    private lotteryRewardPanel: Prefab = null;
    @property(Prefab)
    private aboutPanel: Prefab = null;

    private static pusher: Function[] = [];
    private static pushing: Function = null;

    protected onLoad(): void {
        PanelFactory.init([
            [CongratulationsPanel, this.congratulationsPanel],
            [WithdrawAPanel, this.withdrawAPanel],
            [WithdrawBPanel, this.withdrawBPanel],
            [NewUserRewaradPanel, this.newUserRewardPanel],
            [NormalRewardPanel, this.normalRewardPanel],
            [WithdrawGuidePanel, this.withdrawGuidePanel],
            [WithdrawRatePanel, this.withdrawRatePanel],
            [MoreSpinPanel, this.moreSpinPanel],
            [TreasurePanel, this.treasurePanel],
            [TreasureWinPanel, this.treasureWinPanel],
            [DrawcardPanel, this.drawcardPanel],
            [DrawcardRewardPanel, this.drawcardRewardPanel],
            [LotteryPanel, this.lotteryPanel],
            [LotteryRewardPanel, this.lotteryRewardPanel],
            [AboutPanel, this.aboutPanel],
        ], this.node);
    }

    protected update(dt: number): void {
        PanelCreator.pollingPush();
    }

    public static congratulations(amoney: number, bmoney: number, cmoney: number, acoins: number) {
        PanelFactory.I.createPanel(CongratulationsPanel, find("Canvas/Popup"), amoney, bmoney, acoins);
    }

    public static propBuy(type: PropType) {
        PanelFactory.open(PropBuyPanel, type);
    }

    public static moreSpin() {
        PanelFactory.open(MoreSpinPanel);
    }

    public static failed() {
        PanelFactory.open(FailedPanel);
    }

    public static timeout(percent: number) {
        PanelFactory.open(TimeoutPanel, percent)
    }

    public static WithdrawA() {
        PanelFactory.open(WithdrawAPanel);
    }

    public static WithdrawB() {
        PanelFactory.open(WithdrawBPanel);
    }

    public static checkin() {
        // PanelFactory.open(CheckinPanel);
    }

    public static pushCheckin() {
        // PanelCreator.inPusher(CheckinPanel);
    }

    public static newUserRewarad(reward: number) {
        // 新手奖励
        PanelFactory.open(NewUserRewaradPanel, reward);
    }

    public static normalReward(reward: number) {
        // let rewardA = UserSystem.I.getCashReward1();
        PanelFactory.open(NormalRewardPanel, reward);
    }

    public static pushNormalReward(reward: number) {
        PanelCreator.inPusher(NormalRewardPanel, reward);
    }

    public static passReward() {
        // if (GuideSystem.I.isEnd()) {
        //     // 通关奖励
        //     let rewardA = UserSystem.I.getCashReward1();
        //     PanelFactory.open(PassRewardPanel, LevelSystem.I.getRunningLevel() + 1, rewardA);
        // }
    }

    public static withdrawGuide() {
        PanelFactory.open(WithdrawGuidePanel);
    }

    public static pushWithdrawGuide() {
        PanelCreator.inPusher(WithdrawGuidePanel);
    }

    public static withdrawRate() {
        let count = SpinSystem.I.getSpinSuccessCount()
        if (GuideSystem.I.isEnd() && WithdrawSystem.I.isShowWithdrawRate(count)) {
            PanelFactory.open(WithdrawRatePanel, count);
        }
    }

    public static pushWithdrawRate() {
        let count = SpinSystem.I.getSpinSuccessCount()
        if (GuideSystem.I.isEnd() && WithdrawSystem.I.isShowWithdrawRate(count)) {
            PanelCreator.inPusher(WithdrawRatePanel, count);
        }
    }

    public static levelWithdraw() {
        // PanelFactory.open(LevelWithdrawPanel);
    }

    public static withdrawTask() {
        PanelFactory.open(WithdrawTaskPanel);
    }

    public static withdrawRecord() {
        // PanelFactory.open(WithdrawRecord);
        NI.playWithdrawRecord();
    }

    public static withdrawFAQ() {
        // PanelFactory.open(WithdrawFAQPanel);
        NI.playWithdrawFAQ();
    }

    public static withdrawInfo(amount: number, endCb: Function) {
        // PanelFactory.open(InformationInputPanel, type, amount, endCb);
        NI.playWithdrawInfo((isWithdraw: number, amount: number) => {
            endCb && endCb(isWithdraw, amount);
        }, amount);
    }

    public static withdrawInfoTask(amount: number, taskId: number, endCb: Function) {
        // PanelFactory.open(InformationInputPanel, type, amount, endCb);
        NI.playWithdrawInfoTask((isWithdraw: number, amount: number) => {
            endCb && endCb(isWithdraw, amount);
        }, amount, taskId);
    }

    public static slotGamePanel() {
        // PanelFactory.open(SlotGamePanel);
    }

    public static slotReward(slotgameNode: Node, rewardType: number, rewardA: number, rewardB: number) {
        // PanelFactory.open(SlotRewardPanel, slotgameNode, rewardType, rewardA, rewardB);
    }

    public static drawcardReward(type: number, reward: number) {
        PanelFactory.open(DrawcardRewardPanel, type, reward);
    }

    public static settingPanel() {
    }

    public static treasurePanel(startedCallback: Function) {
        PanelFactory.open(TreasurePanel, startedCallback);
    }

    public static pushTreasurePanel(startedCallback: Function) {
        PanelCreator.inPusher(TreasurePanel, startedCallback);
    }

    public static treasureWinPanel(win: number, claimedCallback?: Function) {
        PanelFactory.open(TreasureWinPanel, win, claimedCallback);
    }

    public static pushTreasureWinPanel(win: number, claimedCallback?: Function) {
        PanelCreator.inPusher(TreasureWinPanel, win, claimedCallback);
    }

    public static drawcard() {
        PanelFactory.open(DrawcardPanel);
    }

    public static pushDrawcard() {
        PanelCreator.inPusher(DrawcardPanel);
    }

    public static aboutPanel() {
        PanelFactory.open(AboutPanel);
    }

    public static lottery() {
        PanelFactory.open(LotteryPanel);
    }

    public static lotteryReward(reward: number) {
        PanelFactory.open(LotteryRewardPanel, reward);
    }

    public static inPusher(cls: typeof Component, ...args: any[]) {
        this.pusher.push(() => {
            const panel: any = PanelFactory.open(cls, ...args);
            const func = panel.afterCloseEffect;
            panel.afterCloseEffect = (target: Node) => {
                panel.afterCloseEffect = func;
                func && func(target);
                this.pusher.shift();
            }
        });
    }

    private static pollingPush() {
        let head = this.pusher[0];
        if (head && head != this.pushing) {
            this.pushing = head;
            head();
        }
    }
}