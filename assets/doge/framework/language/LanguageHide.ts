import { CCString, Component, Label, _decorator, Node } from 'cc';
import { EVENT_RESET_LANGUAGE, Language } from './Language';
import { EDITOR } from 'cc/env';
const { ccclass, property, requireComponent, } = _decorator;

@ccclass("LanguageHide")
export class LanguageHide extends Component {

    @property(Node)
    private target: Node = null;
    @property([CCString])
    private charTabel: string[] = [];
    @property([CCString])
    private variable: string[] = [];

    start() {
        this.target = this.target || this.node;
        if (!EDITOR) {
            this.init(this.variable);
        }
    }

    private init(replaceValue: string[]) {
        this.addVarListener(replaceValue);
        this.hide();
    }

    private addVarListener(values: string[]) {
        Language.getEventEmiter().on(EVENT_RESET_LANGUAGE, this.onVarChange, this);
        for (let i = 0; i < values.length; i++) {
            this.listenVar(values[i]);
        }
    }

    private removeVarListener(values: string[]) {
        Language.getEventEmiter().off(EVENT_RESET_LANGUAGE, this.onVarChange, this);
        for (let i = 0; i < values.length; i++) {
            this.unListenVar(values[i]);
        }
    }

    private listenVar(val: string) {
        if (Language.isVariable(val)) {
            Language.on(val, this.onVarChange, this);
        }
    }

    private unListenVar(val: string) {
        if (Language.isVariable(val)) {
            Language.off(val, this.onVarChange, this);
        }
    }

    private onVarChange() {
        this.hide();
    }


    private hide() {
        for (const value of this.variable) {
            const varValue = Language.getVariable(value);
            if (this.charTabel.includes(varValue)) {
                this.target.active = false;
                return;
            }
        }
        this.target.active = true;
    }

    onDestroy(): void {
        this.removeVarListener(this.variable);
    }
}
