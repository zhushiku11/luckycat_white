
import { CCString, Component, Enum, Sprite, _decorator } from 'cc';
import { CurrencyType, EVENT_RESET_LANGUAGE, Language, LanguageType, ReplaceModel } from './Language';
import { EDITOR } from 'cc/env';
const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent(Sprite)
export class LanguageSprite extends Component {

    @property({ type: Enum(LanguageType) })
    private _editorLanguage = LanguageType.NONE;
    @property({ type: Enum(CurrencyType) })
    private _editorCurrency = CurrencyType.NONE;

    @property(CCString)
    private bundle: string = "";

    @property(CCString)
    private key: string = "";

    @property({ type: Enum(ReplaceModel) })
    public replaceModel = ReplaceModel.LANGUAGE;

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

    public config(key: string, bundle: string = "") {
        Language.getEventEmiter().off(EVENT_RESET_LANGUAGE, this.setSpriteFrame, this);
        this.key = key;
        this.bundle = bundle;
    }

    public build(key: string, bundle: string = "") {
        this.config(key, bundle);
        this.init();
    }

    private init() {
        Language.getEventEmiter().on(EVENT_RESET_LANGUAGE, this.setSpriteFrame, this);
        this.setSpriteFrame();
    }

    public forCurrency() {
        this.replaceModel = ReplaceModel.CURRENCY;
    }

    public forLanguage() {
        this.replaceModel = ReplaceModel.LANGUAGE;
    }

    async setSpriteFrame() {
        let sprite = this.getComponent(Sprite);
        switch (this.replaceModel) {
            case ReplaceModel.LANGUAGE:
                sprite.spriteFrame = await Language.getImage(this.key, this.bundle ? this.bundle : undefined);
                break;
            case ReplaceModel.CURRENCY:
                sprite.spriteFrame = await Language.getImageByCurrency(this.key, this.bundle ? this.bundle : undefined);
                break;
        }
    }

    start() {
        if (!EDITOR) {
            this.init();
        }
    }

    onDestroy(): void {
        Language.getEventEmiter().off(EVENT_RESET_LANGUAGE, this.setSpriteFrame, this);
    }

    private async refreshByLanguage(countryType: LanguageType) {
        if (this.replaceModel == ReplaceModel.LANGUAGE && countryType != LanguageType.NONE) {
            Language.language = countryType;
            let sp = this.getComponent(Sprite);
            sp.spriteFrame = await Language.getImage(this.key, this.bundle);
        }
    }

    private async refreshByCurrency(currencyType: CurrencyType) {
        if (this.replaceModel == ReplaceModel.CURRENCY && currencyType != CurrencyType.NONE) {
            Language.currency = currencyType;
            let sp = this.getComponent(Sprite);
            sp.spriteFrame = await Language.getImageByCurrency(this.key, this.bundle);
        }
    }
}


