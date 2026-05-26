import { Component, Director, director } from "cc";

class DogeSceneLoader extends Component {
    public progressTable: Map<string, number> = new Map<string, number>();

    constructor() {
        super();
    }

    public init(): void {
    }

    public preloadScene(sceneName: string) {
        // 预加载场景
        this.progressTable.set(sceneName, 0);
        director.preloadScene(sceneName, (c: number, t: number) => {
            this.progressTable.set(sceneName, c / t);
        }, () => { });
    }

    public changeScene(nextSceneName: string, callback: Director.OnSceneLaunched, delay: boolean = true): void {
        if (delay) {
            this.scheduleOnce(() => {
                director.loadScene(nextSceneName, callback);
            }, 0.5);
        } else {
            director.loadScene(nextSceneName, callback);
        }
    }

    public progress(sceneName: string) {
        return this.progressTable.get(sceneName);
    }

    public isComplete(sceneName: string) {
        return this.progressTable.get(sceneName) == 1;
    }
}

export default new DogeSceneLoader();