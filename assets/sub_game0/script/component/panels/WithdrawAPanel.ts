import { _decorator, Button, color, Component, EventTouch, find, Label, Node, Sprite, tween } from 'cc';
import { WithdrawSystem } from '../../system/WithdrawSystem';
import { AMoney } from 'db://assets/doge/framework/common/Currency';
import { CurrencyType, Language } from 'db://assets/doge/framework/language/Language';
import { UserSystem } from '../../system/UserSystem';
import { IPanel } from 'db://assets/doge/framework/panel/Panel';
import { SpriteSwitcher } from 'db://assets/main/script/component/SpriteSwitcher';
import { NI } from 'db://assets/native_interface/NI';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { MAIN } from 'db://assets/main/constant/Constant';
import { GuideSystem } from '../../system/GuideSystem';
import { PanelCreator } from '../creator/PanelCreator';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { CashWithdrawInfo } from '../../system/ConfigSystem';
import { Clock } from 'db://assets/doge/framework/common/Clock';
import { Toast } from 'db://assets/doge/framework/init';
const { ccclass, property } = _decorator;

@ccclass('WithdrawAPanel')
export class WithdrawAPanel extends Component implements IPanel {

    @property([Node])
    private platforms: Node[] = [];
    @property([Node])
    private amountItemList: Node[] = [];
    @property(Node)
    private finger: Node = null;

    private goods: CashWithdrawInfo[] = null;
    private states: number[] = [];

    private platformId: number = 0;

    protected onEnable(): void {
        getEventEmiter().on(MAIN.FUNC.MOBILE_BACK, this.onSystemBack, this);
    }

    protected onDisable(): void {
        getEventEmiter().off(MAIN.FUNC.MOBILE_BACK, this.onSystemBack, this);
    }

    onSystemBack() {
        this.onBackBtnClick();
    }

    afterOpenEffect(target: Node) {
        if (GuideSystem.I.getStep() == 3) {
            GuideSystem.I.nextShow();
        }
    };

    afterCloseEffect(target: Node) {
        NI.currentPage(0);
        if (GuideSystem.I.getStep() == 4) {
            GuideSystem.I.nextShow();
        }
    };

    onInit() {
        NI.currentPage(1);
        this.goods = WithdrawSystem.I.getWithdrawInfo();
        switch (Language.currency) {
            case CurrencyType.US:
                this.platforms[1].active = false;
                this.platforms[2].active = false;
                this.onSelected(0);
                break;
            case CurrencyType.BR:
                this.platforms[0].active = false;
                this.onSelected(1);
                break;
        }
    };

    onOpenEffect(target: Node, next: () => void) {
        next();
    }

    onCloseEffect(target: Node, next: () => void) {
        next();
    }

    onItemClick(event: EventTouch, arg0: string) {
        this.onSelected(parseInt(arg0));
    }

    onSelected(index: number) {
        this.platformId = index;
        for (let i = 0; i < this.platforms.length; i++) {
            const element = this.platforms[i];
            if (this.platformId == i) {
                find("Check", element).active = true;
            } else {
                find("Check", element).active = false;
            }
        }
        this.initItem();
    }

    initItem() {
        this.states.length = 0;
        for (let i = 0; i < this.amountItemList.length; i++) {
            const item = this.amountItemList[i];
            let price = this.goods[i].price;
            item.getComponentInChildren(SpriteSwitcher).index(this.platformId);
            find("Txt", item).getComponent(Label).string = Language.getWordByCurrency("l_money", Language.getCurrSym(), AMoney.string(price));

            if (i == 0) {
                switch (this.platformId) {
                    case 0:
                    case 1:
                        if (UserSystem.I.isAMoneyWithdrawed()) {
                            item.active = false;
                        } else {
                            item.active = true;
                            find("Progress/Fg", item).getComponent(Sprite).fillRange = AMoney.value() / price;
                            find("Progress/Txt", item).getComponent(Label).string = `${AMoney.string()}/${AMoney.string(price)}`;
                            find("Money", item).active = true;
                            find("Tips", item).getComponent(Label).string = "";
                            find("Time", item).getComponent(Label).string = "";
                        }
                        break;
                    case 2:
                        item.active = false;
                        break;
                }
            } else {
                if (!AMoney.isEnough(price)) {
                    // 钱不够
                    find("Progress/Fg", item).getComponent(Sprite).fillRange = AMoney.value() / price;
                    find("Progress/Txt", item).getComponent(Label).string = `${AMoney.string()}/${AMoney.string(price)}`;
                    find("Money", item).active = true;
                    find("Tips", item).getComponent(Label).string = "";
                    find("Time", item).getComponent(Label).string = "";
                    this.states[i] = 1;
                } else if (WithdrawSystem.I.getSpinTime() != 0) {
                    // spin 不足
                    find("Progress/Fg", item).getComponent(Sprite).fillRange = WithdrawSystem.I.getSpinCount() / 40;
                    find("Progress/Txt", item).getComponent(Label).string = `${WithdrawSystem.I.getSpinCount()}/${40}`;
                    find("Money", item).active = false;
                    find("Tips", item).getComponent(Label).string = Language.getWord("l_spin40");
                    this.states[i] = 2;
                } else if (WithdrawSystem.I.getJackpotTime() != 0) {
                    find("Progress/Fg", item).getComponent(Sprite).fillRange = WithdrawSystem.I.getJackpotCount() / 10;
                    find("Progress/Txt", item).getComponent(Label).string = `${WithdrawSystem.I.getJackpotCount()}/${10}`;
                    find("Money", item).active = false;
                    find("Tips", item).getComponent(Label).string = Language.getWord("l_jackpot40");
                    this.states[i] = 3;
                } else {
                    find("Progress/Fg", item).getComponent(Sprite).fillRange = AMoney.value() / price;
                    find("Progress/Txt", item).getComponent(Label).string = `${AMoney.string()}/${AMoney.string(price)}`;
                    find("Money", item).active = true;
                    find("Tips", item).getComponent(Label).string = "";
                    find("Time", item).getComponent(Label).string = "";
                    this.states[i] = 0;
                }
            }
        }
    }

    protected update(dt: number): void {
        for (let i = 0; i < this.amountItemList.length; i++) {
            const item = this.amountItemList[i];
            let price = this.goods[i].price;
            if (i != 0 && AMoney.isEnough(price)) {
                if (WithdrawSystem.I.getSpinTime() != 0) {
                    find("Time", item).getComponent(Label).string = Clock.getClock(Math.ceil((WithdrawSystem.I.getSpinTime() - new Date().getTime()) / 1000));
                } else if (WithdrawSystem.I.getJackpotTime() != 0) {
                    find("Time", item).getComponent(Label).string = Clock.getClock(Math.ceil((WithdrawSystem.I.getJackpotTime() - new Date().getTime()) / 1000));
                }
            }
        }
    }

    onWithdrawBtnClick(event: EventTouch, arg0: string) {
        let index = parseInt(arg0);
        if (index == 0) {
            let goodsItem = this.goods[index];
            if (AMoney.isEnough(goodsItem.price)) {
                this.openWithdraInfo();
            }
        } else {
            let goodsItem = this.goods[index];
            if (!AMoney.isEnough(goodsItem.price)) {
                Toast.show(Language.getWord("l_amountCondition", Language.getCurrSym(), AMoney.string(goodsItem.price), Language.getCurrSym(), AMoney.string(goodsItem.price - AMoney.value())))
            } else {
                switch (this.states[index]) {
                    case 2:
                        Toast.show(Language.getWord("l_spin40Tips"));
                        break;
                    case 3:
                        Toast.show(Language.getWord("l_jackpot40"));
                        break;
                    case 0:
                        Toast.show(Language.getWord("l_completeWithdraw"));
                        break;
                }
            }
        }
    }

    openWithdraInfo() {
        let price = this.goods[0].price;
        PanelCreator.withdrawInfo(price, (isWithdraw: number, amount: number) => {
            if (!!isWithdraw) {
                AMoney.use(amount);
                UserSystem.I.amoneyWithdrawed();
                this.onSelected(this.platformId);
                // 提现记录引导
                this.finger.active = true;
                this.finger.angle = 0;
                tween(this.finger)
                    .delay(0.15)
                    .set({ angle: 30 })
                    .delay(0.15)
                    .set({ angle: 0 })
                    .delay(0.15)
                    .set({ angle: 30 })
                    .delay(0.15)
                    .set({ angle: 0 })
                    .delay(0.8)
                    .union()
                    .repeatForever()
                    .start();
            }
        })
    }

    onBackBtnClick() {
        this.node && PanelFactory.close(WithdrawAPanel);
    }

    onRecordBtnClick() {
        PanelCreator.withdrawRecord();
        this.finger.active = false;
    }

    onFAQBtnClick() {
        PanelCreator.withdrawFAQ();
    }

    getPlatformId() {

    }
}


