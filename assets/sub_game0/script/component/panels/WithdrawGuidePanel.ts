import { _decorator, Button, Color, color, Component, EventTouch, find, Label, Node, Prefab, Sprite } from 'cc';
import { AMoney, BMoney } from 'db://assets/doge/framework/common/Currency';
import { CurrencyType, Language } from 'db://assets/doge/framework/language/Language';
import { SUBGAME } from '../../../constant/Constant';
import { SpriteSwitcher } from 'db://assets/main/script/component/SpriteSwitcher';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { PanelCreator } from '../creator/PanelCreator';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
const { ccclass, property } = _decorator;

@ccclass('WithdrawGuidePanel')
export class WithdrawGuidePanel extends Component implements IPanel {

    @property(Node)
    private icon: Node = null;
    @property(Node)
    private cash: Node = null;
    @property(Node)
    private cash1: Node = null;
    @property(Node)
    private coins: Node = null;

    onInit() {
        this.coins.getComponent(Label).string = Language.getWordByCurrency("l_money", BMoney.string(BMoney.value()), " ≈ ");
        this.cash.getComponent(Label).string = Language.getWordByCurrency("l_money", Language.getCurrSym(), AMoney.string(BMoney.value1()));
        this.cash1.getComponent(Label).string = Language.getWordByCurrency("l_money", Language.getCurrSym(), AMoney.string(BMoney.value1()));
        switch (Language.currency) {
            case CurrencyType.US:
                this.icon.getComponent(SpriteSwitcher).index(0);
                break;
            case CurrencyType.BR:
                this.icon.getComponent(SpriteSwitcher).index(1);
                break;
            case CurrencyType.ID:
                this.icon.getComponent(SpriteSwitcher).index(2);
                break;
        }
    };

    onWithdrawBtnClick() {
        this.node && PanelFactory.close(WithdrawGuidePanel);
        PanelCreator.WithdrawB();
    }

    onBackBtnClick() {
        this.node && PanelFactory.close(WithdrawGuidePanel);
    }
}


