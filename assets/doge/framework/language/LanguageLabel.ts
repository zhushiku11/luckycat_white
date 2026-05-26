import { CCString, Component, Enum, Label, _decorator } from 'cc';
import { LanguageType, CurrencyType, EVENT_RESET_LANGUAGE, Language, ReplaceModel } from './Language';
import { EDITOR } from 'cc/env';
const { ccclass, property, requireComponent, } = _decorator;

type RenderHook = (label: LanguageLabel, textKey: string, ...replaceValue: string[]) => void;

@ccclass
@requireComponent(Label)
export class LanguageLabel extends Component {

    @property({ type: Enum(LanguageType) })
    private _editorLanguage = LanguageType.NONE;
    @property({ type: Enum(CurrencyType) })
    private _editorCurrency = CurrencyType.NONE;

    @property(CCString)
    private textKey: string = "";

    @property([CCString])
    private replaceValue: string[] = [];

    @property({ type: Enum(ReplaceModel) })
    private replaceModel = ReplaceModel.LANGUAGE;

    @property({ type: Enum(LanguageType) })
    public get editorLanguage() {
        return this._editorLanguage;
    }
    public set editorLanguage(value: LanguageType) {
        this._editorLanguage = value;
        if (EDITOR) {
            this.refreshByLanguage(value);
        }
    }

    @property({ type: Enum(CurrencyType) })
    public get editorCurrency() {
        return this._editorCurrency;
    }
    public set editorCurrency(value: CurrencyType) {
        this._editorCurrency = value;
        if (EDITOR) {
            this.refreshByCurrency(value);
        }
    }

    private updateHook: RenderHook = null;

    build(key: string, ...args: string[]) {
        // 先清除旧监听
        this.removeVarListener(this.replaceValue);
        // 替换Key和value
        this.textKey = key;
        this.replaceValue = [...args];
        this.init(this.replaceValue);
    }

    private init(replaceValue: string[]) {
        this.addVarListener(replaceValue);
        this.updateText();
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

    hook(callback: RenderHook) {
        this.updateHook = callback;
    }

    private updateText() {
        if (this.updateHook) {
            this.updateHook(this, this.textKey, ...this.replaceValue);
        } else {
            this.renderText(this.textKey, ...this.replaceValue);
        }
    }

    public renderText(textKey: string, ...replaceValue: string[]) {
        let label = this.getComponent(Label);
        switch (this.replaceModel) {
            case ReplaceModel.LANGUAGE:
                label.string = Language.getWord(textKey || this.textKey, ...(replaceValue || this.replaceValue));
                break;
            case ReplaceModel.CURRENCY:
                label.string = Language.getWordByCurrency(textKey || this.textKey, ...(replaceValue || this.replaceValue));
                break;
        }
    }

    public forCurrency() {
        this.replaceModel = ReplaceModel.CURRENCY;
    }

    public forLanguage() {
        this.replaceModel = ReplaceModel.LANGUAGE;
    }

    private onVarChange() {
        this.updateText();
    }

    start() {
        if (!EDITOR) {
            this.init(this.replaceValue);
        }
    }

    onDestroy(): void {
        this.removeVarListener(this.replaceValue);
    }

    private refreshByLanguage(countryType: LanguageType) {
        if (this.replaceModel == ReplaceModel.LANGUAGE && countryType != LanguageType.NONE) {
            Language.language = countryType;
            let label = this.getComponent(Label);
            label.string = Language.getWord(this.textKey, ...this.replaceValue);
        }
    }

    private refreshByCurrency(currencyType: CurrencyType) {
        if (this.replaceModel == ReplaceModel.CURRENCY && currencyType != CurrencyType.NONE) {
            Language.currency = currencyType;
            let label = this.getComponent(Label);
            label.string = Language.getWordByCurrency(this.textKey, ...this.replaceValue);
        }
    }
}
