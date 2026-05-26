import { Asset, AssetManager, assetManager, error, resources } from "cc";

const defaultBundle = "resources"

export class AssetsDB {
    // bundleTools缓存
    private static assetsBundleCache: Map<string, BundleTools> = new Map<string, BundleTools>();

    /**
     * 从bundle中加载资源
     * 默认从resources中加载资源
     *
     * @static
     * @param {string[]} paths 资源路径列表
     * @param {typeof Asset} type 资源类型
     * @param {string} [bundlePath=defaultBundle] bundle路径 默认为resources
     * @memberof AssetsDB 
     */
    public static async load(paths: string[], type: typeof Asset, onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void, bundlePath: string = defaultBundle) {
        let bundleTools: BundleTools = this.assetsBundleCache.get(bundlePath);
        if (!bundleTools) {
            this.assetsBundleCache.set(bundlePath, bundleTools = new BundleTools(bundlePath));
            await bundleTools.initialization();
        } else {
            if (bundleTools.hasPromise()) {
                await bundleTools.promise();
            }
        }
        await bundleTools.loadAsset(paths, type, onProgress);
    }

    /**
     * 获取资源 
     * 此方法需要先加载资源 才能获取到
     *
     * @static
     * @template T
     * @param {string} path 资源路径
     * @param {string} [bundlePath=defaultBundle] bundle路径 默认为resources
     * @return {*}  {(T | null)}
     * @memberof AssetsDB
     */
    public static get<T extends Asset>(path: string, bundlePath: string = defaultBundle): T | null {
        let bundle: BundleTools = this.getBundle(bundlePath);
        if (!bundle) {
            return null;
        }
        return bundle.getAsset<T>(path);
    }

    /**
     * 是否已加载
     *
     * @static
     * @template T
     * @param {string} path
     * @param {string} [bundlePath=defaultBundle]
     * @return {*}  {boolean}
     * @memberof AssetsDB
     */
    public static has<T extends Asset>(path: string, bundlePath: string = defaultBundle): boolean {
        return !!AssetsDB.get<T>(path, bundlePath);
    }


    public static getBundle(bundlePath: string) {
        return this.assetsBundleCache.get(bundlePath);
    }

    public static logCache() {
        console.log(this.assetsBundleCache);
    }
}

class BundleTools {
    // 资源包路径
    private bundlePath: string = null;
    // Bundle实例
    private bundleInstance: AssetManager.Bundle = null;
    // 包中资源缓存
    private assetsCache: Map<string, Asset> = new Map<string, Asset>();

    private _Promise: Promise<BundleTools> = null;

    constructor(path: string) {
        this.bundlePath = path;
    }

    public hasPromise(): boolean {
        return !!this._Promise;
    }

    public async promise(): Promise<BundleTools> {
        return await this._Promise;
    }

    public async initialization(options: { [k: string]: any; version?: string; } | null = null) {
        this._Promise = this.init(options);
        await this._Promise;
        this._Promise = null;
    }

    /**
     * 初始化
     *
     * @param {({ [k: string]: any; version?: string; } | null)} [options=null]
     * @return {*}  {Promise<BundleTools>}
     * @memberof BundleTools
     */
    private async init(options: { [k: string]: any; version?: string; } | null = null): Promise<BundleTools> {
        switch (this.bundlePath) {
            case "resources":
                this.bundleInstance = resources;
                break;
            default:
                this.bundleInstance = await this.loadBundle(options);
                break;
        }
        return this;
    }

    /**
     * 加载bundle
     *
     * @private
     * @param {({ [k: string]: any; version?: string; } | null)} options
     * @return {*}  {Promise<AssetManager.Bundle>}
     * @memberof BundleTools
     */
    private async loadBundle(options: { [k: string]: any; version?: string; } | null): Promise<AssetManager.Bundle> {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(this.bundlePath, options, (err: Error, bundle: AssetManager.Bundle) => {
                if (err) {
                    error(`加载bundle失败, url: ${this.bundlePath}, err:${err}`);
                    resolve(null);
                } else {
                    resolve(bundle);
                }
            });
        });
    }

    /**
     * 加载资源
     *
     * @param {string[]} paths 资源路径列表
     * @param {typeof Asset} type 资源类型
     * @memberof BundleTools
     */
    public async loadAsset(paths: string[] | string, type: typeof Asset, onProgress?: (finished: number, total: number, item: AssetManager.RequestItem) => void) {
        // 加载资源
        let assets: Asset[] = await new Promise((resolve, reject) => {
            this.bundleInstance.load(paths as any, type, onProgress, (err, assets: Asset[]) => {
                if (err) {
                    error(`加载asset失败, err: ${err}`);
                    resolve(null);
                } else {
                    this.addRef(assets);
                    resolve(assets);
                }
            });
        });
        // 缓存资源
        for (let i = 0; i < assets.length; i++) {
            this.assetsCache.set(paths[i], assets[i]);
        }
    }

    /**
     * 获取资源
     *
     * @template T
     * @param {string} path 资源路径
     * @return {*}  {(T | null)}
     * @memberof BundleTools
     */
    public getAsset<T extends Asset>(path: string): T | null {
        let asset: Asset = this.assetsCache.get(path);
        if (!asset) {
            return null;
        }
        return asset as T;
    }

    /** 增加引用计数 */
    private addRef(assets: Asset | Asset[]) {
        if (assets instanceof Array) {
            for (const a of assets) {
                a.addRef();
            }
        } else {
            assets.addRef();
        }
    }
    /** 减少引用计数, 当引用计数减少到0时,会自动销毁 */
    private decRef(assets: Asset | Asset[]) {
        if (assets instanceof Array) {
            for (const a of assets) {
                a.decRef();
            }
        } else {
            assets.decRef();
        }
    }
}

