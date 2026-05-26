import { Asset } from "cc";
import { AssetsDB } from "../common/AssetsDB";
import { CurrencyType, Language, LanguageType } from "../language/Language";

export type AssetsPack = { COMMON?: {} }
export type LoadCallback = (finished: number, total: number) => void;

export class DogeAssetsLoader {

    private loadCb: LoadCallback = null;
    private bundleName: string = undefined;

    public static finished: number = 0;
    public static total: number = 0;

    public static init(callback?: LoadCallback) {
        DogeAssetsLoader.reset();
        return new DogeAssetsLoader(callback);
    }

    public static reset() {
        DogeAssetsLoader.finished = 0;
        DogeAssetsLoader.total = 0;
    }

    public static get percent() {
        return (DogeAssetsLoader.finished / DogeAssetsLoader.total) || 0;
    }

    public static isComplete() {
        return DogeAssetsLoader.finished == DogeAssetsLoader.total && DogeAssetsLoader.total != 0;
    }

    constructor(callback?: LoadCallback) {
        this.loadCb = callback;
    }

    public bundle(name: string) {
        this.bundleName = name;
        return this;
    }

    public preLoad(assets: AssetsPack) {
        let currencyName = CurrencyType[Language.currency];
        let languageName = LanguageType[Language.language];

        let common = Object.values(assets.COMMON || {});
        let currency = Object.values(assets[currencyName] || {});
        let language = Object.values(assets[languageName] || {});

        let assetsList = [].concat(common).concat(currency).concat(language);

        if (assetsList.length > 0) {
            AssetsDB.load(assetsList, Asset, (finished: number, total: number) => { this.preLoadFinsh(finished, total); }, this.bundleName);
        } else {
            this.preLoadFinsh(1, 1);
        }
    }

    private preLoadFinsh(finished: number, total: number) {
        DogeAssetsLoader.finished = finished;
        DogeAssetsLoader.total = total;
        this.loadCb && this.loadCb(finished, total);
    }
}


