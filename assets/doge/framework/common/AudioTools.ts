import { AssetManager, AudioClip, AudioSource, Node, assetManager, director, resources } from "cc";

const MUSIC_SWITCH = "MUSIC_SWITCH";
const SOUND_SWITCH = "SOUND_SWITCH";

class AudioTools {
    private musicOpenFlag: boolean = true;
    private soundOpenFlag: boolean = true;

    public audios: { [index: string]: AudioClip } = {};

    private _audioSource: AudioSource;

    public init() {
        this.musicOpenFlag = parseInt(localStorage.getItem(MUSIC_SWITCH) || "1") == 1;
        this.soundOpenFlag = parseInt(localStorage.getItem(SOUND_SWITCH) || "1") == 1;
        this.initAudioSource();
        return this;
    }

    private initAudioSource() {
        let audioMgr = new Node();
        audioMgr.name = '__AudioMgr__';
        director.getScene().addChild(audioMgr);
        director.addPersistRootNode(audioMgr);
        this._audioSource = audioMgr.addComponent(AudioSource);
    }

    public async loadAudioRes(paths: string[], bundle?: string) {
        let bundleAudios: AssetManager.Bundle = null;
        if (bundle) {
            bundleAudios = await new Promise((resolve: Function, reject: Function) => {
                assetManager.loadBundle(bundle, (err: Error, bundle: AssetManager.Bundle) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(bundle);
                    }
                });
            });
        } else {
            bundleAudios = resources;
        }

        for (let audioPath of paths) {
            console.log("loadAudioRes", audioPath);
            this.audios[audioPath] = await new Promise((resolve: Function, reject: Function) => {
                bundleAudios.load(audioPath, AudioClip, (err: Error, res: AudioClip) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
        }
    }

    public sound(path: string): void {
        if (this.isSoundOpen() && path in this.audios) {
            this._audioSource.playOneShot(this.audios[path], 1);
        }
    }

    public music(path: string, loop: boolean = true) {
        if (this.isOpen() && path in this.audios) {
            console.log("AudioTools play music ", path);
            this._audioSource.clip = this.audios[path];
            this._audioSource.loop = loop;
            this._audioSource.play();
        }
    }

    public closeVolume() {
        this._audioSource.volume = 0;
    }

    public openVolume() {
        this._audioSource.volume = 1;
    }

    public isOpenVolume() {
        return !!this._audioSource.volume;
    }

    public setVolume(num: number) {
        this._audioSource.volume = num;
    }

    public getVolume() {
        return this._audioSource.volume;
    }

    public stop(): void {
        this._audioSource.stop();
        this._audioSource.clip = null;
    }

    public playBgm(path: string): void {
        console.log("playBgm");
        this.stop();
        this.music(path);
    }

    public openMusic(path: string) {
        this.musicOpenFlag = true;
        this.playBgm(path);
        localStorage.setItem(MUSIC_SWITCH, "1");
    }

    public openSound() {
        this.soundOpenFlag = true;
        localStorage.setItem(SOUND_SWITCH, "1");
    }

    public closeMusic() {
        this.musicOpenFlag = false;
        this.stop();
        localStorage.setItem(MUSIC_SWITCH, "0");
    }

    public closeSound() {
        this.soundOpenFlag = false;
        localStorage.setItem(SOUND_SWITCH, "0");
    }

    public pause() {
        if (this.isOpen()) {
            this._audioSource.pause();
        }
    }

    public resume() {
        if (this.isOpen()) {
            this._audioSource.play();
        }
    }

    public isPlaying() {
        if (this.isOpen()) {
            return this._audioSource.playing;
        }
        return false;
    }

    public isOpen() {
        return this.musicOpenFlag;
    }

    public isSoundOpen() {
        return this.soundOpenFlag;
    }
}

export default new AudioTools();