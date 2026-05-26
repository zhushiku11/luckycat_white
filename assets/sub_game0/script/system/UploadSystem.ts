import { NetworkSystem } from "./NetworkSystem";

export class UploadSystem {
    private static _instance = null;
    public static get I(): UploadSystem {
        if (!UploadSystem._instance) {
            UploadSystem._instance = new UploadSystem();
        }
        return UploadSystem._instance;
    }

    private vo: UploadSystemVO = new UploadSystemVO();

    async level() {
        NetworkSystem.uploadLevel();
    }
}

export class UploadSystemVO {

}


